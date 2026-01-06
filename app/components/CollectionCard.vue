<template>
  <NuxtLink
    :to="`/galleries/${collection.slug}`"
    class="group relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-900"
  >
    <NuxtImg
      v-if="collection.coverImage"
      :src="collection.coverImage"
      :alt="collection.displayName"
      class="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
      :width="600"
      :height="600"
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 384px, 384px"
      loading="lazy"
    />
    <div
      v-else
      class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800"
    />

    <!-- Collection title - always visible on mobile, hover on desktop -->
    <div
      class="absolute inset-0 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
    >
      <div class="text-center text-white px-4">
        <!-- Mobile: Subtle background with text -->
        <div class="md:hidden bg-black/60 px-4 py-2">
          <h3 class="text-lg font-light tracking-wider">{{ collection.displayName }}</h3>
        </div>
        <!-- Desktop: Hover text -->
        <div class="hidden md:block">
          <h3 class="text-lg font-light tracking-wider">{{ collection.displayName }}</h3>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Collection {
  name: string
  slug: string
  displayName: string
  coverImage?: string | null
  imageCount?: number
}

interface Props {
  collection: Collection
}

defineProps<Props>()
</script>