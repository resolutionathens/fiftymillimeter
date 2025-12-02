<template>
  <div>
    <UCard class="shadow-lg">
      <template #header>
        <h3 class="font-semibold text-xl">Checkout</h3>
      </template>

      <!-- Customer Info Form -->
      <form v-if="!showPayment" @submit.prevent="initializePayment" class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">Full Name <span class="text-red-500">*</span></label>
          <UInput
            v-model="name"
            placeholder="John Doe"
            required
            size="xl"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">Email <span class="text-red-500">*</span></label>
          <UInput
            v-model="email"
            type="email"
            placeholder="your@email.com"
            required
            size="xl"
          />
        </div>

        <div class="pt-2">
          <UButton
            type="submit"
            block
            size="xl"
            :loading="loading"
            color="primary"
          >
            Continue to Payment
          </UButton>
        </div>
      </form>

      <!-- Stripe Payment Element -->
      <div v-if="showPayment" class="space-y-6">
        <div class="space-y-4">
          <div ref="addressElement"></div>
          <div ref="paymentElement"></div>
        </div>

        <div class="pt-2">
          <UButton
            @click="handleSubmit"
            block
            size="xl"
            :loading="processing"
            :disabled="!elementsReady"
            color="primary"
          >
            Pay ${{ (product.price / 100).toFixed(2) }}
          </UButton>
        </div>

        <UAlert
          v-if="error"
          color="error"
          variant="soft"
          :title="error"
        />

        <div class="text-center">
          <button
            v-if="!processing"
            type="button"
            @click="resetForm"
            class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 underline"
          >
            Change customer information
          </button>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { loadStripe, type Stripe, type StripeElements } from '@stripe/stripe-js'

interface Props {
  product: {
    id: string
    name: string
    price: number
  }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  success: [paymentIntentId: string]
}>()

const config = useRuntimeConfig()
const stripePromise = loadStripe(config.public.stripePublishableKey)

const email = ref('')
const name = ref('')
const showPayment = ref(false)
const loading = ref(false)
const processing = ref(false)
const error = ref('')

const addressElement = ref<HTMLElement>()
const paymentElement = ref<HTMLElement>()
let stripe: Stripe | null = null
let elements: StripeElements | null = null
let clientSecret = ''
const elementsReady = ref(false)

const initializePayment = async () => {
  if (!email.value || !name.value) return

  loading.value = true
  error.value = ''

  try {
    // Get client secret from backend
    const response = await $fetch('/api/shop/checkout', {
      method: 'POST',
      body: {
        email: email.value,
        name: name.value
      }
    })

    if (response?.clientSecret) {
      clientSecret = response.clientSecret
      showPayment.value = true

      // Initialize Stripe Elements
      await nextTick()
      await setupStripeElements()
    }
  } catch (err: any) {
    error.value = err.data?.message || err.message || 'Failed to initialize checkout'
  } finally {
    loading.value = false
  }
}

const setupStripeElements = async () => {
  stripe = await stripePromise
  if (!stripe) {
    error.value = 'Failed to load Stripe'
    return
  }

  elements = stripe.elements({
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0ea5e9', // sky-500
        borderRadius: '0.5rem'
      }
    }
  })

  const addressElementInstance = elements.create('address', {
    mode: 'shipping',
    defaultValues: {
      name: name.value
    }
  })

  const paymentElementInstance = elements.create('payment', {
    layout: 'tabs'
  })

  // Listen for ready events
  let addressReady = false
  let paymentReady = false

  const checkReady = () => {
    if (addressReady && paymentReady) {
      elementsReady.value = true
    }
  }

  addressElementInstance.on('ready', () => {
    addressReady = true
    checkReady()
  })

  paymentElementInstance.on('ready', () => {
    paymentReady = true
    checkReady()
  })

  if (addressElement.value) {
    addressElementInstance.mount(addressElement.value)
  }

  if (paymentElement.value) {
    paymentElementInstance.mount(paymentElement.value)
  }
}

const handleSubmit = async () => {
  if (!stripe || !elements) return

  processing.value = true
  error.value = ''

  // Stripe will either redirect or complete inline
  // If redirect is needed, user will be sent to return_url
  // If payment completes inline, we manually navigate
  const { error: submitError } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      receipt_email: email.value,
      return_url: `${window.location.origin}/shop/success`
    }
  })

  // If we get here, payment failed (successful payments redirect automatically)
  if (submitError) {
    error.value = submitError.message || 'Payment failed'
    processing.value = false
  }
}

const resetForm = () => {
  showPayment.value = false
  error.value = ''
  stripe = null
  elements = null
  clientSecret = ''
  elementsReady.value = false
}
</script>
