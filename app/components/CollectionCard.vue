<template>
  <NuxtLink
    :to="`/galleries/${collection.slug}`"
    class="group flex-1 grid grid-cols-[60px_1fr_140px_80px] sm:grid-cols-[80px_1fr_180px_100px] items-center gap-7 border-b border-rule"
    :class="first ? 'border-t' : ''"
  >
    <div class="text-[28px] tracking-[0.02em] text-ink">
      {{ roman }}.
    </div>

    <div>
      <div class="text-[20px] sm:text-[26px] tracking-[0.01em] text-ink">
        {{ collection.displayName }}
      </div>
      <div class="text-[10px] uppercase tracking-[0.14em] text-muted-warm mt-1.5">
        {{ collection.imageCount ?? 0 }} frames
      </div>
    </div>

    <div class="relative h-[64px] sm:h-[76px] bg-rule/40 overflow-hidden">
      <div
        v-if="isImageLoading && collection.coverImage"
        class="absolute inset-0 flex items-center justify-center"
      >
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-4 h-4 text-muted-warm animate-spin"
        />
      </div>
      <NuxtImg
        v-if="collection.coverImage"
        :src="collection.coverImage"
        :alt="collection.displayName"
        class="w-full h-full object-cover transition-opacity duration-300"
        :class="isImageLoading ? 'opacity-0' : 'group-hover:opacity-80 opacity-100'"
        :width="600"
        :height="400"
        loading="lazy"
        @load="isImageLoading = false"
      />
    </div>

    <div class="flex justify-end items-center gap-2.5 text-[11px] text-muted-warm">
      <span class="uppercase tracking-[0.14em]">open</span>
      <span class="text-gold text-base transition-transform group-hover:translate-x-1">→</span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const isImageLoading = ref(true);

interface Collection {
  name: string;
  slug: string;
  displayName: string;
  coverImage?: string | null;
  imageCount?: number;
}

interface Props {
  collection: Collection;
  roman: string;
  first?: boolean;
}

defineProps<Props>();
</script>
