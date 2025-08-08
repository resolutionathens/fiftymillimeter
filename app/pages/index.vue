<template>
  <div class="py-12">
    <UContainer>
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
          to="/galleries"
          variant="outline"
        >
          View Galleries
        </UButton>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
// SEO
useSeoMeta({
  title: 'Fiftymillimeter',
  ogTitle: 'Fiftymillimeter',
  description: 'Photography by Ian Kennedy exploring the extraordinary within the ordinary. Contemporary scenes from the Southeast and beyond that challenge conventional notions of the picturesque.',
  ogDescription: 'Photography by Ian Kennedy exploring the extraordinary within the ordinary. Contemporary scenes from the Southeast and beyond that challenge conventional notions of the picturesque.',
  ogImage: 'https://fiftymillimeter.com/cdn-cgi/image/f=auto,w=1200,h=630/https://pub-77d2c63f12a143a59270d491959246da.r2.dev/maine/maine-00003.webp',
  twitterCard: 'summary_large_image',
})

// Fetch featured collections
const { data: collectionsData, pending } = await useFetch('/api/collections', {
  default: () => ({ collections: [], count: 0 })
})

const collections = computed(() => collectionsData.value?.collections || [])
</script>