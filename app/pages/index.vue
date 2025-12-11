<template>
  <div class="py-12">
    <UContainer>
      <div class="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
        <!-- Left Column: Galleries -->
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Galleries
          </h2>

          <!-- Loading State -->
          <div
            v-if="pending"
            class="space-y-4"
          >
            <USkeleton
              v-for="i in 6"
              :key="i"
              class="h-8 w-48"
            />
          </div>

          <!-- Gallery Links -->
          <nav
            v-else-if="collections?.length"
            class="space-y-3"
          >
            <NuxtLink
              v-for="collection in collections"
              :key="collection.slug"
              :to="`/galleries/${collection.slug}`"
              class="block text-2xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              {{ collection.displayName }}
            </NuxtLink>
          </nav>
        </div>

        <!-- Right Column: Zine Announcement -->
        <div class="lg:max-w-md">
          <NuxtLink
            to="/shop"
            class="block group"
          >
            <NuxtImg
              src="https://pub-77d2c63f12a143a59270d491959246da.r2.dev/shop/sub-andy.webp"
              alt="Athens is a Subtropical Rainforest Zine"
              class="w-full rounded-lg mb-6 transition-transform duration-200 group-hover:scale-[1.02]"
              width="800"
              height="1000"
              loading="eager"
            />
          </NuxtLink>
          <div
            v-if="product"
            class="mb-4"
          >
            <UBadge
              color="success"
              variant="subtle"
              size="lg"
            >
              <UIcon
                name="i-heroicons-check-circle"
                class="w-4 h-4"
              />
              {{ product.stock_quantity }} of 100 remaining
            </UBadge>
          </div>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            <span class="italic">Athens is a Subtropical Rainforest</span> — My first zine documenting space in Athens,
            GA. Some people say it's pretty good.
          </p>

          <UButton
            to="/shop"
            color="primary"
          >
            View in Shop
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  inStock: boolean
  stock_quantity: number
}

interface ProductResponse {
  product: Product
}

// SEO
useSeoMeta({
  title: 'Fiftymillimeter',
  ogTitle: 'Fiftymillimeter',
  description: 'Photography by Ian Kennedy exploring the extraordinary within the ordinary. Contemporary scenes from the Southeast and beyond that challenge conventional notions of the picturesque.',
  ogDescription: 'Photography by Ian Kennedy exploring the extraordinary within the ordinary. Contemporary scenes from the Southeast and beyond that challenge conventional notions of the picturesque.',
  ogUrl: 'https://fiftymillimeter.com',
  ogImage: 'https://fiftymillimeter.com/cdn-cgi/image/f=jpeg,w=1200,h=630,fit=cover/https://pub-77d2c63f12a143a59270d491959246da.r2.dev/maine/maine-00003.webp',
  ogImageWidth: '1200',
  ogImageHeight: '630',
  ogImageType: 'image/jpeg',
  twitterCard: 'summary_large_image',
  twitterImage: 'https://fiftymillimeter.com/cdn-cgi/image/f=jpeg,w=1200,h=630,fit=cover/https://pub-77d2c63f12a143a59270d491959246da.r2.dev/maine/maine-00003.webp',
})

// Fetch collections and product data
const { data: collectionsData, pending } = await useFetch('/api/collections', {
  default: () => ({ collections: [], count: 0 })
})

const { data: productData } = await useFetch<ProductResponse>('/api/shop/product')

const collections = computed(() => collectionsData.value?.collections || [])
const product = computed(() => productData.value?.product)
</script>