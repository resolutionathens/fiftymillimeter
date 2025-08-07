<template>
  <div class="py-12">
    <UContainer>
      <!-- Header -->
      <div class="mb-12">
        <!-- Breadcrumb -->
        <nav class="mb-6">
          <ol class="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <NuxtLink to="/" class="hover:text-gray-700 dark:hover:text-gray-300">
                Home
              </NuxtLink>
            </li>
            <li>/</li>
            <li>
              <NuxtLink to="/galleries" class="hover:text-gray-700 dark:hover:text-gray-300">
                Galleries
              </NuxtLink>
            </li>
            <li>/</li>
            <li class="text-gray-900 dark:text-white font-medium">
              {{ collectionDisplayName }}
            </li>
          </ol>
        </nav>

        <!-- Collection Title -->
        <h1 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
          {{ collectionDisplayName }}
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          {{ imageCount }} {{ imageCount === 1 ? 'image' : 'images' }}
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <USkeleton 
          v-for="i in 12" 
          :key="i"
          class="aspect-square rounded-lg"
        />
      </div>

      <!-- Image Gallery -->
      <div v-else-if="images?.length">
        <ImageGallery 
          :images="images"
          :columns="1"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <UIcon name="i-heroicons-photo" class="w-20 h-20 text-gray-400 mx-auto mb-6" />
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          No Images Found
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-8">
          This collection doesn't contain any images yet, or they're still being processed.
        </p>
        <UButton 
          to="/galleries"
          variant="outline"
        >
          Back to Galleries
        </UButton>
      </div>

      <!-- Error State -->
      <div v-if="error" class="text-center py-20">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-20 h-20 text-red-400 mx-auto mb-6" />
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Collection Not Found
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-8">
          The requested collection could not be loaded. Please try again later.
        </p>
        <UButton 
          to="/galleries"
          variant="outline"
        >
          Back to Galleries
        </UButton>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const collectionSlug = route.params.collection as string;

// Convert slug back to collection name (reverse of the slug creation process)
const collectionName = collectionSlug.replace(/-/g, ' ')
const collectionDisplayName = collectionName.charAt(0).toUpperCase() + collectionName.slice(1)

// SEO
useSeoMeta({
  title: `${collectionDisplayName} - Fifty Millimeter`,
  ogTitle: `${collectionDisplayName} - Fifty Millimeter`,
  description: `View the ${collectionDisplayName} photography collection featuring stunning images and artistic vision.`,
  ogDescription: `View the ${collectionDisplayName} photography collection featuring stunning images and artistic vision.`,
})

// Fetch collection images
const { data: collectionData, pending, error } = await useFetch(`/api/images/${collectionName}`, {
  default: () => ({ images: [], count: 0, collection: collectionName })
})

const images = computed(() => collectionData.value?.images || [])
const imageCount = computed(() => collectionData.value?.count || 0)

// Handle 404 for non-existent collections
if (error.value && error.value.statusCode === 500) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Collection not found'
  })
}
</script>