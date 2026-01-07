<template>
  <div class="py-12">
    <UContainer>
      <!-- Product Display -->
      <div v-if="product">
        <!-- Two-column layout: Product Info + Checkout Form -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          <!-- Left Column: Product Details -->
          <div>
            <h1 class="text-4xl font-bold mb-4">{{ product.name }}</h1>
            <p class="text-3xl text-primary font-semibold mb-6">
              ${{ (product.price / 100).toFixed(2) }}
            </p>

            <div class="prose dark:prose-invert mb-8 max-w-none">
              <p class="text-lg">{{ product.description }}</p>
            </div>

            <!-- Product Details -->
            <div class="mb-8 space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <div class="flex items-start gap-2">
                <UIcon
                  name="i-heroicons-book-open"
                  class="w-5 h-5 shrink-0 mt-0.5"
                />
                <span>Landscape Golden Age format (7.38" × 10.25")</span>
              </div>
              <div class="flex items-start gap-2">
                <UIcon
                  name="i-heroicons-document-text"
                  class="w-5 h-5 shrink-0 mt-0.5"
                />
                <span>48 pages, full-color printing on 100lb satin paper</span>
              </div>
              <div class="flex items-start gap-2">
                <UIcon
                  name="i-heroicons-scissors"
                  class="w-5 h-5 shrink-0 mt-0.5"
                />
                <span>Perfect bound, edition of 100, hand-numbered</span>
              </div>
              <div class="flex items-start gap-2">
                <UIcon name="i-heroicons-truck" class="w-5 h-5 shrink-0 mt-0.5" />
                <span>Free shipping included</span>
              </div>
              <div class="flex items-start gap-2">
                <UIcon
                  name="i-heroicons-shield-check"
                  class="w-5 h-5 shrink-0 mt-0.5"
                />
                <span>Secure payment powered by Stripe</span>
              </div>
            </div>

            <!-- Stock Status -->
            <div v-if="product.inStock">
              <UBadge color="success" variant="subtle" size="lg">
                <UIcon name="i-heroicons-check-circle" class="w-4 h-4" />
                In Stock ({{ product.stock_quantity }} of 100 available)
              </UBadge>
            </div>
            <div v-else>
              <UBadge color="error" variant="subtle" size="lg">
                <UIcon name="i-heroicons-x-circle" class="w-4 h-4" />
                Out of Stock
              </UBadge>
            </div>
          </div>

          <!-- Right Column: Checkout Form -->
          <div>
            <ShopCheckoutForm
              v-if="product.inStock"
              :product="product"
              @success="handleCheckoutSuccess"
            />
            <UAlert
              v-else
              color="warning"
              variant="subtle"
              title="Out of Stock"
              description="This item is currently unavailable."
            />
          </div>
        </div>

        <!-- Carousel below both columns -->
        <UCarousel
          v-slot="{ item }"
          :items="previewImages"
          :ui="{ item: 'basis-1/3' }"
          arrows
          class="w-full"
        >
          <NuxtImg
            :src="item"
            alt="Zine preview"
            class="w-full"
            width="800"
            height="800"
            loading="lazy"
          />
        </UCarousel>
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
        color="error"
        variant="subtle"
        title="Failed to load product"
        :description="error.message"
        class="max-w-2xl mx-auto"
      />
    </UContainer>
  </div>
</template>

<script setup lang="ts">
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  inStock: boolean;
  stock_quantity: number;
}

interface ProductResponse {
  product: Product;
}

const {
  data: productData,
  pending,
  error,
} = await useFetch<ProductResponse>("/api/shop/product");
const product = computed(() => productData.value?.product);

const previewImages = [
  "https://pub-77d2c63f12a143a59270d491959246da.r2.dev/shop/01.webp",
  "https://pub-77d2c63f12a143a59270d491959246da.r2.dev/shop/02.webp",
  "https://pub-77d2c63f12a143a59270d491959246da.r2.dev/shop/03.webp",
  "https://pub-77d2c63f12a143a59270d491959246da.r2.dev/shop/04.webp",
  "https://pub-77d2c63f12a143a59270d491959246da.r2.dev/shop/05.webp",
  "https://pub-77d2c63f12a143a59270d491959246da.r2.dev/shop/06.webp",
];

useSeoMeta({
  title: "Shop - Athens is a Subtropical Rainforest Zine",
  ogTitle: "Shop - Athens is a Subtropical Rainforest Zine",
  description:
    'Purchase the limited edition photography zine "Athens is a Subtropical Rainforest" by Ian Kennedy',
  ogDescription:
    'Purchase the limited edition photography zine "Athens is a Subtropical Rainforest" by Ian Kennedy',
  ogImage:
    "https://fiftymillimeter.com/cdn-cgi/image/f=auto,w=1600,h=2000/https://pub-77d2c63f12a143a59270d491959246da.r2.dev/shop/athens-rainforest-cover.jpg",
  ogImageWidth: "1200",
  ogImageHeight: "1500",
  ogImageType: "image/jpeg",
  twitterCard: "summary_large_image",
  twitterImage:
    "https://fiftymillimeter.com/cdn-cgi/image/f=auto,w=1600,h=2000/https://pub-77d2c63f12a143a59270d491959246da.r2.dev/shop/athens-rainforest-cover.jpg",
});

const handleCheckoutSuccess = (paymentIntentId: string) => {
  navigateTo(`/shop/success?payment_intent=${paymentIntentId}`);
};
</script>
