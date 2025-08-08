<template>
  <div class="py-12">
    <UContainer>
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
          Galleries
        </h1>
      </div>

      <!-- Loading State -->
      <div
        v-if="pending"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <USkeleton
          v-for="i in 9"
          :key="i"
          class="h-64 rounded-lg"
        />
      </div>

      <!-- Collections Grid -->
      <div
        v-else-if="collections?.length"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
        <UIcon
          name="i-heroicons-photo"
          class="w-20 h-20 text-gray-400 mx-auto mb-6"
        />
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          No Collections Available
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-8">
          Collections are being prepared and will be available soon. Please check back later.
        </p>
        <UButton
          to="/"
          variant="outline"
        >
          Return Home
        </UButton>
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