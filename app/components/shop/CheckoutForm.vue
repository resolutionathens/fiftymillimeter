<template>
  <div>
    <UCard>
      <template #header>
        <h3 class="font-semibold text-lg">Checkout</h3>
      </template>

      <!-- Customer Info Form -->
      <form v-if="!showPayment" @submit.prevent="initializePayment" class="space-y-4">
        <UFormGroup label="Email" required>
          <UInput
            v-model="email"
            type="email"
            placeholder="your@email.com"
            required
            size="lg"
          />
        </UFormGroup>

        <UFormGroup label="Full Name" required>
          <UInput
            v-model="name"
            placeholder="John Doe"
            required
            size="lg"
          />
        </UFormGroup>

        <UButton
          type="submit"
          block
          size="lg"
          :loading="loading"
          color="primary"
        >
          Continue to Payment
        </UButton>
      </form>

      <!-- Stripe Payment Element -->
      <div v-if="showPayment">
        <div ref="paymentElement" class="mb-6"></div>

        <UButton
          @click="handleSubmit"
          block
          size="lg"
          :loading="processing"
          :disabled="!stripe || !elements"
          color="primary"
        >
          Pay ${{ (product.price / 100).toFixed(2) }}
        </UButton>

        <UAlert
          v-if="error"
          color="red"
          variant="soft"
          :title="error"
          class="mt-4"
        />

        <button
          v-if="!processing"
          type="button"
          @click="resetForm"
          class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mt-4 underline"
        >
          Change customer information
        </button>
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

const paymentElement = ref<HTMLElement>()
let stripe: Stripe | null = null
let elements: StripeElements | null = null
let clientSecret = ''

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

  const paymentElementInstance = elements.create('payment', {
    layout: 'tabs'
  })

  const addressElementInstance = elements.create('address', {
    mode: 'shipping',
    defaultValues: {
      name: name.value
    }
  })

  if (paymentElement.value) {
    addressElementInstance.mount(paymentElement.value)
    paymentElementInstance.mount(paymentElement.value)
  }
}

const handleSubmit = async () => {
  if (!stripe || !elements) return

  processing.value = true
  error.value = ''

  const { error: submitError, paymentIntent } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      receipt_email: email.value,
      return_url: `${window.location.origin}/shop/success`
    },
    redirect: 'if_required'
  })

  if (submitError) {
    error.value = submitError.message || 'Payment failed'
    processing.value = false
  } else if (paymentIntent && paymentIntent.status === 'succeeded') {
    emit('success', paymentIntent.id)
  }
}

const resetForm = () => {
  showPayment.value = false
  error.value = ''
  stripe = null
  elements = null
  clientSecret = ''
}
</script>
