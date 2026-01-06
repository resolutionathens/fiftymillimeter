<template>
  <div class="py-16 lg:py-24">
    <UContainer>
      <!-- Header -->
      <!-- <div class="text-center mb-12">
        <h1 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
          Galleries
        </h1>
      </div> -->

      <!-- Loading State -->
      <div
        v-if="pending"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <USkeleton
          v-for="i in 9"
          :key="i"
          class="h-64"
        />
      </div>

      <!-- Collections Grid -->
      <div
        v-else-if="collections?.length"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <CollectionCard
          v-for="collection in collections"
          :key="collection.slug"
          :collection="collection"
        />
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="text-center py-20"
      >
        <h2 class="text-2xl text-gray-900 dark:text-white mb-4">
          No Collections Available
        </h2>
        <p class="text-gray-400 mb-8">
          Collections are being prepared and will be available soon.
        </p>
        <NuxtLink
          to="/"
          class="text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          Return Home
        </NuxtLink>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
// SEO
useSeoMeta({
  title: 'Galleries - Fiftymillimeter',
  ogTitle: 'Galleries - Fiftymillimeter',
  description: 'Photo collections from my travels and explorations around the Southeast and beyond.',
  ogDescription: 'Photo collections from my travels and explorations around the Southeast and beyond.',
})

// Fetch all collections
const { data: collectionsData, pending, error } = await useFetch('/api/collections', {
  default: () => ({ collections: [], count: 0 })
})

const collections = computed(() => collectionsData.value?.collections || [])

// Handle errors
if (error.value) {
  console.error('Error fetching collections:', error.value)
}
</script>