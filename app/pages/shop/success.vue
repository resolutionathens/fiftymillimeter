<template>
  <div class="py-12">
    <UContainer>
      <div class="max-w-2xl mx-auto text-center">
        <div class="mb-8">
          <UIcon
            name="i-heroicons-check-circle"
            class="w-24 h-24 text-green-500 mx-auto"
          />
        </div>

        <h1 class="text-4xl font-bold mb-4">Thank You!</h1>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Your order has been received and is being processed. You'll receive a confirmation email shortly with your order details and shipping information.
        </p>

        <!-- Order Details (if available) -->
        <UCard v-if="order" class="mb-8 text-left">
          <template #header>
            <h2 class="font-semibold text-lg">Order Details</h2>
          </template>

          <div class="space-y-3">
            <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-800">
              <span class="text-gray-600 dark:text-gray-400">Order ID:</span>
              <span class="font-mono text-sm">{{ order.id.slice(0, 13) }}...</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-800">
              <span class="text-gray-600 dark:text-gray-400">Customer Email:</span>
              <span>{{ order.customer_email }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-800">
              <span class="text-gray-600 dark:text-gray-400">Amount:</span>
              <span class="font-semibold">${{ (order.amount / 100).toFixed(2) }}</span>
            </div>
            <div v-if="order.shipping_address" class="py-2">
              <span class="text-gray-600 dark:text-gray-400 block mb-2">Shipping Address:</span>
              <div class="text-sm bg-gray-50 dark:bg-gray-900 rounded p-3">
                <p class="font-medium">{{ order.shipping_address.name }}</p>
                <p v-if="order.shipping_address.address?.line1">
                  {{ order.shipping_address.address.line1 }}
                </p>
                <p v-if="order.shipping_address.address?.line2">
                  {{ order.shipping_address.address.line2 }}
                </p>
                <p>
                  {{ order.shipping_address.address?.city }},
                  {{ order.shipping_address.address?.state }}
                  {{ order.shipping_address.address?.postal_code }}
                </p>
                <p>{{ order.shipping_address.address?.country }}</p>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Loading State -->
        <UCard v-if="pending" class="mb-8">
          <div class="space-y-4">
            <USkeleton class="h-4 w-full" />
            <USkeleton class="h-4 w-3/4" />
            <USkeleton class="h-4 w-full" />
          </div>
        </UCard>

        <!-- Navigation Options -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            to="/galleries"
            size="lg"
            color="primary"
          >
            <UIcon name="i-heroicons-photo" class="w-5 h-5" />
            Browse Galleries
          </UButton>

          <UButton
            to="/"
            size="lg"
            variant="soft"
          >
            <UIcon name="i-heroicons-home" class="w-5 h-5" />
            Return Home
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const paymentIntentId = route.query.payment_intent as string

const { data: orderData, pending } = await useFetch(
  `/api/shop/order/${paymentIntentId}`,
  {
    lazy: true,
    // Only fetch if payment_intent is provided
    immediate: !!paymentIntentId
  }
)

const order = computed(() => orderData.value?.order)

useSeoMeta({
  title: 'Order Complete - Fiftymillimeter',
  robots: 'noindex'
})
</script>
