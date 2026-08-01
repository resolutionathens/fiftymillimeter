<template>
  <NuxtLink
    :to="`/galleries/${collection.slug}`"
    class="group grid gap-8 lg:gap-11 py-8 md:py-11 border-b border-rule"
    :class="flip ? 'md:grid-cols-[1fr_1.15fr]' : 'md:grid-cols-[1.15fr_1fr]'"
  >
    <!-- Image -->
    <div
      class="relative aspect-[3/2] bg-rule/40 overflow-hidden"
      :class="flip ? 'md:order-2' : 'md:order-1'"
    >
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
        :class="isImageLoading ? 'opacity-0' : 'group-hover:opacity-90 opacity-100'"
        :width="900"
        :height="600"
        loading="lazy"
        @load="isImageLoading = false"
      />
    </div>

    <!-- Type -->
    <div
      class="flex flex-col justify-center"
      :class="flip
        ? 'md:order-1 md:items-end md:text-right md:pl-2'
        : 'md:order-2 md:pr-2'"
    >
      <div class="text-[11px] tracking-[0.24em] text-muted-warm mb-3.5">
        {{ roman }}
      </div>

      <div class="text-[30px] md:text-[40px] leading-[1.1] tracking-[-0.005em] text-ink mb-3">
        {{ collection.displayName }}
      </div>

      <div class="w-11 h-px bg-gold mt-1.5 mb-4" />

      <div class="flex items-center gap-3 text-[10px] uppercase tracking-[0.18em]">
        <span class="text-muted-warm">{{ collection.imageCount ?? 0 }} frames</span>
        <span class="text-muted-warm">/</span>
        <span class="text-ink">open</span>
        <span class="text-gold text-sm transition-transform group-hover:translate-x-1">→</span>
      </div>
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
  flip?: boolean;
}

defineProps<Props>();
</script>
