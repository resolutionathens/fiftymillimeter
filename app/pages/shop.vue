<template>
  <div class="py-12">
    <UContainer>
      <!-- Product Display -->
      <div v-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Product Image -->
        <div>
          <NuxtImg
            :src="product.image_url"
            :alt="product.name"
            class="w-full rounded-lg shadow-xl"
            :width="800"
            :height="1000"
            loading="eager"
          />
        </div>

        <!-- Product Details & Checkout -->
        <div>
          <h1 class="text-4xl font-bold mb-4">{{ product.name }}</h1>
          <p class="text-3xl text-primary font-semibold mb-6">
            ${{ (product.price / 100).toFixed(2) }}
          </p>

          <div class="prose dark:prose-invert mb-8 max-w-none">
            <p class="text-lg">{{ product.description }}</p>
          </div>

          <!-- Stock Status -->
          <div v-if="product.inStock" class="mb-6">
            <UBadge color="green" variant="subtle" size="lg">
              <UIcon name="i-heroicons-check-circle" class="w-4 h-4" />
              In Stock ({{ product.stock_quantity }} available)
            </UBadge>
          </div>
          <div v-else class="mb-6">
            <UBadge color="red" variant="subtle" size="lg">
              <UIcon name="i-heroicons-x-circle" class="w-4 h-4" />
              Out of Stock
            </UBadge>
          </div>

          <!-- Product Details -->
          <div class="mb-8 space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <div class="flex items-start gap-2">
              <UIcon name="i-heroicons-book-open" class="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>Limited edition photography zine</span>
            </div>
            <div class="flex items-start gap-2">
              <UIcon name="i-heroicons-truck" class="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>Shipping calculated at checkout</span>
            </div>
            <div class="flex items-start gap-2">
              <UIcon name="i-heroicons-shield-check" class="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>Secure payment powered by Stripe</span>
            </div>
          </div>

          <!-- Checkout Form -->
          <ShopCheckoutForm
            v-if="product.inStock && !orderComplete"
            :product="product"
            @success="handleCheckoutSuccess"
          />

          <!-- Success Message -->
          <UAlert
            v-if="orderComplete"
            color="green"
            variant="subtle"
            title="Order Complete!"
            description="Thank you for your purchase. You'll receive a confirmation email shortly with tracking information."
            class="mb-4"
          >
            <template #icon>
              <UIcon name="i-heroicons-check-circle" class="w-6 h-6" />
            </template>
          </UAlert>

          <UButton
            v-if="orderComplete"
            to="/galleries"
            variant="soft"
            size="lg"
          >
            <UIcon name="i-heroicons-photo" class="w-5 h-5" />
            Browse Galleries
          </UButton>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <USkeleton class="h-[600px] rounded-lg" />
        <div class="space-y-6">
          <USkeleton class="h-12 w-3/4" />
          <USkeleton class="h-10 w-1/4" />
          <USkeleton class="h-32 w-full" />
          <USkeleton class="h-64 w-full rounded-lg" />
        </div>
      </div>

      <!-- Error State -->
      <UAlert
        v-if="error"
        color="red"
        variant="subtle"
        title="Failed to load product"
        :description="error.message"
        class="max-w-2xl mx-auto"
      />
    </UContainer>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Shop - Athens is a Subtropical Rainforest Zine',
  ogTitle: 'Shop - Athens is a Subtropical Rainforest Zine',
  description: 'Purchase the limited edition photography zine "Athens is a Subtropical Rainforest" by Ian Kennedy',
  ogDescription: 'Purchase the limited edition photography zine "Athens is a Subtropical Rainforest" by Ian Kennedy'
})

const { data: productData, pending, error } = await useFetch('/api/shop/product')
const product = computed(() => productData.value?.product)
const orderComplete = ref(false)

const handleCheckoutSuccess = (paymentIntentId: string) => {
  orderComplete.value = true

  // Scroll to top to show success message
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>
