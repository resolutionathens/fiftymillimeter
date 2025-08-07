<template>
  <div class="min-h-screen">
    <!-- Minimal Header with Collections -->
    <section class="pt-8 pb-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Simple centered title -->
        <div class="text-center mb-12">
          <h1 class="text-2xl md:text-3xl font-light text-gray-900 dark:text-white tracking-wide">
            Fifty Millimeter
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2 font-light">
            Photography Portfolio
          </p>
        </div>

        <!-- Photo Grid -->
        <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 md:gap-2">
          <div 
            v-for="i in 12" 
            :key="i"
            class="aspect-square bg-gray-100 dark:bg-gray-800 animate-pulse"
          />
        </div>

        <div v-else-if="collections?.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 md:gap-2">
          <NuxtLink 
            v-for="collection in collections"
            :key="collection.slug"
            :to="`/galleries/${collection.slug}`"
            class="group relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800 hover:scale-[0.98] transition-transform duration-300"
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
              <UIcon name="i-heroicons-photo" class="w-8 h-8 text-gray-400" />
            </div>
            
            <!-- Minimal overlay on hover -->
            <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            
            <!-- Collection title on hover -->
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="text-center text-white">
                <h3 class="text-lg font-light">{{ collection.displayName }}</h3>
              </div>
            </div>
          </NuxtLink>
        </div>

        <div v-else class="text-center py-24">
          <UIcon name="i-heroicons-photo" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
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
  title: 'Fifty Millimeter - Photography Portfolio',
  ogTitle: 'Fifty Millimeter - Photography Portfolio',
  description: 'Professional photography portfolio showcasing stunning visuals and artistic vision',
  ogDescription: 'Professional photography portfolio showcasing stunning visuals and artistic vision',
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image',
})

// Fetch featured collections
const { data: collectionsData, pending } = await useFetch('/api/collections', {
  default: () => ({ collections: [], count: 0 })
})

const collections = computed(() => collectionsData.value?.collections || [])
</script>