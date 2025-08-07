<template>
  <div class="image-gallery">
    <!-- Single Image View -->
    <div class="relative w-full">
      <!-- Navigation Controls -->
      <div class="flex items-center justify-between mb-6">
        <!-- Previous Button -->
        <UButton
          v-if="currentImageIndex > 0"
          variant="outline"
          color="gray"
          size="lg"
          @click="previousImage"
          class="flex items-center gap-2"
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
        ></div>

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
          color="gray"
          size="lg"
          @click="nextImage"
          class="flex items-center gap-2"
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
        ></div>
      </div>

      <!-- Main Image Display -->
      <div
        class="w-full bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center"
        style="height: calc(100vh - 180px);"
      >
        <NuxtImg
          v-if="currentImage"
          :src="currentImage.url"
          :alt="currentImage.name"
          class="max-w-full max-h-full object-contain"
          :width="1600"
          :height="1200"
          loading="lazy"
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

<style scoped>
.image-gallery {
  @apply w-full;
}
</style>