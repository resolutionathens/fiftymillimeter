<template>
  <NuxtLink 
    :to="`/galleries/${collection.slug}`"
    class="group relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-900 hover:scale-[0.98] transition-transform duration-300"
  >
    <NuxtImg
      v-if="collection.coverImage"
      :src="collection.coverImage"
      :alt="collection.displayName"
      class="w-full h-full object-cover group-hover:brightness-75 transition-all duration-300"
      :width="600"
      :height="600"
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      loading="lazy"
      provider="cloudflare"
    />
    <div 
      v-else
      class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800"
    >
      <UIcon name="i-heroicons-photo" class="w-8 h-8 text-gray-300" />
    </div>
    
    <!-- Subtle overlay on hover -->
    <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
    
    <!-- Collection title on hover - minimal -->
    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div class="text-center text-white px-4">
        <h3 class="text-lg font-light tracking-wide">{{ collection.displayName }}</h3>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Collection {
  name: string
  slug: string
  displayName: string
  coverImage?: string
  imageCount?: number
}

interface Props {
  collection: Collection
}

defineProps<Props>()
</script>