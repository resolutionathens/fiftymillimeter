<template>
  <NuxtLink
    :to="`/galleries/${collection.slug}`"
    class="group block"
  >
    <div class="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-900">
      <!-- Loading Indicator -->
      <div
        v-if="isImageLoading && collection.coverImage"
        class="absolute inset-0 flex items-center justify-center z-10"
      >
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-6 h-6 text-neutral-400 animate-spin"
        />
      </div>

      <NuxtImg
        v-if="collection.coverImage"
        :src="collection.coverImage"
        :alt="collection.displayName"
        class="w-full h-full object-cover transition-opacity duration-300"
        :class="isImageLoading ? 'opacity-0' : 'group-hover:opacity-80'"
        :width="800"
        :height="800"
        loading="lazy"
        @load="isImageLoading = false"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800"
      />
    </div>

    <h3 class="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
      {{ collection.displayName }}
    </h3>
  </NuxtLink>
</template>

<script setup lang="ts">
// Loading state for cover image
const isImageLoading = ref(true);

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