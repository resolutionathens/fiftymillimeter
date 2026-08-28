<template>
  <div class="px-6 sm:px-10 lg:px-14 pt-6 md:pt-8 pb-4">
    <!-- Breadcrumb / section header -->
    <div class="flex items-baseline gap-6 mb-6 md:mb-8">
      <nav>
        <ol class="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-muted-warm">
          <li>
            <NuxtLink
              to="/galleries"
              class="hover:text-ink"
            >
              collections
            </NuxtLink>
          </li>
          <li aria-hidden="true">/</li>
          <li class="text-ink">
            {{ collectionDisplayName }}
          </li>
        </ol>
      </nav>
      <div class="flex-1 h-px bg-rule" />
    </div>

      <!-- Loading State -->
    <div
      v-if="pending"
      class="grid grid-cols-2 md:grid-cols-3 gap-4"
    >
      <USkeleton
        v-for="i in 9"
        :key="i"
        class="aspect-square"
      />
    </div>

    <!-- Image Gallery -->
    <div v-else-if="images?.length">
      <ImageGallery
        :images="images"
        default-view="single"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="text-center py-20"
    >
      <h2 class="text-lg text-ink mb-3">
        No images found
      </h2>
      <p class="text-muted-warm text-sm mb-6">
        This collection doesn&rsquo;t contain any images yet, or they&rsquo;re still being processed.
      </p>
      <NuxtLink
        to="/galleries"
        class="text-[11px] uppercase tracking-[0.14em] text-muted-warm hover:text-ink"
      >
        ← back to collections
      </NuxtLink>
    </div>

    <!-- Error State -->
    <div
      v-if="error"
      class="text-center py-20"
    >
      <h2 class="text-lg text-ink mb-3">
        Collection not found
      </h2>
      <p class="text-muted-warm text-sm mb-6">
        The requested collection could not be loaded.
      </p>
      <NuxtLink
        to="/galleries"
        class="text-[11px] uppercase tracking-[0.14em] text-muted-warm hover:text-ink"
      >
        ← back to collections
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const collectionSlug = route.params.collection as string;

// R2 folder names never contain spaces, so the slug is the collection name as-is
const collectionName = collectionSlug
const collectionDisplayName = collectionName.charAt(0).toUpperCase() + collectionName.slice(1)

// SEO
useSeoMeta({
  title: `${collectionDisplayName} - Fiftymillimeter`,
  ogTitle: `${collectionDisplayName} - Fiftymillimeter`,
  description: `Photographs from the ${collectionDisplayName} collection, exploring moments and scenes that caught my eye.`,
  ogDescription: `Photographs from the ${collectionDisplayName} collection, exploring moments and scenes that caught my eye.`,
})

// Fetch collection images
const { data: collectionData, pending, error } = await useFetch(`/api/images/${collectionName}`, {
  default: () => ({ images: [], count: 0, collection: collectionName })
})

const images = computed(() => collectionData.value?.images.map(img => ({
  ...img,
  lastModified: img.lastModified ? new Date(img.lastModified) : undefined
})) || [])

// Handle 404 for non-existent collections
if (error.value && error.value.statusCode === 500) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Collection not found'
  })
}
</script>