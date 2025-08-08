<template>
  <div class="min-h-screen">
    <!-- Minimal Header with Collections -->
    <section class="pt-8 pb-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          v-if="pending"
          class="grid grid-cols-2 gap-6"
        >
          <div
            v-for="i in 6"
            :key="i"
            class="aspect-[4/5] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"
          />
        </div>

        <div
          v-else-if="collections?.length"
          class="grid grid-cols-2 gap-6"
        >
          <NuxtLink
            v-for="collection in collections"
            :key="collection.slug"
            :to="`/galleries/${collection.slug}`"
            class="group relative aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-lg hover:scale-[0.98] transition-transform duration-300"
          >
            <NuxtImg
              v-if="collection.coverImage"
              :src="collection.coverImage"
              :alt="collection.displayName"
              class="w-full h-full object-cover group-hover:brightness-75 transition-all duration-300"
              loading="lazy"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700"
            >
              <UIcon
                name="i-heroicons-photo"
                class="w-8 h-8 text-gray-400"
              />
            </div>

            <!-- Hover overlay with gallery name -->
            <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300 flex items-center justify-center">
              <div class="text-center text-white">
                <h3 class="text-2xl font-light tracking-wide drop-shadow-lg">{{ collection.displayName }}</h3>
              </div>
            </div>
          </NuxtLink>
        </div>

        <div
          v-else
          class="text-center py-24"
        >
          <UIcon
            name="i-heroicons-photo"
            class="w-12 h-12 text-gray-300 mx-auto mb-4"
          />
          <p class="text-gray-500 dark:text-gray-400 text-sm font-light">
            Collections loading...
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// SEO
useSeoMeta({
  title: 'Fiftymillimeter',
  ogTitle: 'Fiftymillimeter',
  description: 'Fiftymillimeter is the photography portfolio of Ian Kennedy',
  ogDescription: 'Fiftymillimeter is the photography portfolio of Ian Kennedy',
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image',
})

// Fetch featured collections
const { data: collectionsData, pending } = await useFetch('/api/collections', {
  default: () => ({ collections: [], count: 0 })
})

const collections = computed(() => collectionsData.value?.collections || [])
</script>