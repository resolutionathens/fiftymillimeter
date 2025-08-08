<template>
  <div class="w-full">
    <!-- Single Image View -->
    <div class="relative w-full">
      <!-- Navigation Controls -->
      <div class="flex items-center justify-between mb-6">
        <!-- Previous Button -->
        <UButton
          v-if="currentImageIndex > 0"
          variant="outline"
          color="neutral"
          size="lg"
          class="flex items-center gap-2"
          @click="previousImage"
        >
          <UIcon
            name="i-heroicons-chevron-left"
            class="w-5 h-5"
          />
          Previous
        </UButton>
        <div
          v-else
          class="w-24"
        />

        <!-- Image Counter -->
        <div class="text-center">
          <span class="text-lg font-medium text-gray-900 dark:text-white">
            {{ currentImageIndex + 1 }} of {{ images.length }}
          </span>
        </div>

        <!-- Next Button -->
        <UButton
          v-if="currentImageIndex < images.length - 1"
          variant="outline"
          color="neutral"
          size="lg"
          class="flex items-center gap-2"
          @click="nextImage"
        >
          Next
          <UIcon
            name="i-heroicons-chevron-right"
            class="w-5 h-5"
          />
        </UButton>
        <div
          v-else
          class="w-24"
        />
      </div>

      <!-- Main Image Display -->
      <div
        class="w-full overflow-hidden flex items-center justify-center"
        style="height: calc(100vh - 120px);"
      >
        <NuxtImg
          v-if="currentImage"
          :src="currentImage.url"
          :alt="currentImage.name"
          class="max-w-full max-h-full object-contain"
          :width="1600"
          :height="1200"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          loading="lazy"
          provider="cloudflare"
        />
      </div>


    </div>
  </div>
</template>

<script setup lang="ts">
interface ImageData {
  key: string
  url: string
  name: string
  lastModified?: Date
  size?: number
  collection?: string
}

interface Props {
  images: ImageData[]
  columns?: 1 | 2 | 3 | 4
}

const props = withDefaults(defineProps<Props>(), {
  columns: 1
})

const currentImageIndex = ref(0)

const currentImage = computed(() => {
  return props.images[currentImageIndex.value]
})

const nextImage = () => {
  if (currentImageIndex.value < props.images.length - 1) {
    currentImageIndex.value++
  }
}

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

// Keyboard navigation
onMounted(() => {
  const handleKeydown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        previousImage()
        break
      case 'ArrowRight':
        nextImage()
        break
    }
  }

  window.addEventListener('keydown', handleKeydown)

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
})
</script>
