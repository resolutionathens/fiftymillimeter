<template>
  <div class="image-gallery">
    <!-- Masonry Grid -->
    <div 
      ref="galleryRef"
      class="grid gap-4 md:gap-6"
      :class="{
        'grid-cols-1': columns === 1,
        'grid-cols-2': columns === 2,
        'grid-cols-2 md:grid-cols-3': columns === 3,
        'grid-cols-2 md:grid-cols-4': columns === 4
      }"
    >
      <div 
        v-for="(image, index) in images" 
        :key="image.key"
        class="group cursor-pointer relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 aspect-square"
        @click="openLightbox(index)"
      >
        <NuxtImg
          :src="image.url"
          :alt="image.name"
          :width="400"
          :height="400"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          :placeholder="[20, 20, 10, 50]"
          loading="lazy"
        />
        
        <!-- Overlay on hover -->
        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end">
          <div class="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <h3 class="font-medium text-sm">{{ image.name }}</h3>
            <p class="text-xs opacity-80">{{ formatDate(image.lastModified) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <UModal v-model="isLightboxOpen" :ui="{ width: 'w-screen max-w-none', height: 'h-screen max-h-none' }">
      <div class="relative w-full h-full bg-black flex items-center justify-center">
        <!-- Close Button -->
        <UButton
          variant="ghost"
          color="white"
          size="lg"
          class="absolute top-4 right-4 z-10"
          @click="closeLightbox"
        >
          <UIcon name="i-heroicons-x-mark" class="w-6 h-6" />
        </UButton>

        <!-- Navigation Buttons -->
        <UButton
          v-if="currentImageIndex > 0"
          variant="ghost"
          color="white"
          size="lg"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
          @click="previousImage"
        >
          <UIcon name="i-heroicons-chevron-left" class="w-8 h-8" />
        </UButton>

        <UButton
          v-if="currentImageIndex < images.length - 1"
          variant="ghost"
          color="white"
          size="lg"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
          @click="nextImage"
        >
          <UIcon name="i-heroicons-chevron-right" class="w-8 h-8" />
        </UButton>

        <!-- Current Image -->
        <div class="max-w-full max-h-full p-8">
          <NuxtImg
            v-if="currentImage"
            :src="currentImage.url"
            :alt="currentImage.name"
            class="max-w-full max-h-full object-contain"
            :width="1200"
            :height="800"
          />
        </div>

        <!-- Image Info -->
        <div class="absolute bottom-4 left-4 right-4 text-white">
          <div class="bg-black bg-opacity-50 rounded-lg p-4">
            <h3 class="text-lg font-medium">{{ currentImage?.name }}</h3>
            <p class="text-sm opacity-80 mt-1">{{ formatDate(currentImage?.lastModified) }}</p>
            <p class="text-xs opacity-60 mt-1">
              {{ currentImageIndex + 1 }} of {{ images.length }}
            </p>
          </div>
        </div>
      </div>
    </UModal>
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
  columns: 3
})

const galleryRef = ref(null)
const isLightboxOpen = ref(false)
const currentImageIndex = ref(0)

const currentImage = computed(() => {
  return props.images[currentImageIndex.value]
})

const openLightbox = (index: number) => {
  currentImageIndex.value = index
  isLightboxOpen.value = true
}

const closeLightbox = () => {
  isLightboxOpen.value = false
}

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

const formatDate = (date?: Date) => {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date))
}

// Keyboard navigation
onMounted(() => {
  const handleKeydown = (event: KeyboardEvent) => {
    if (!isLightboxOpen.value) return
    
    switch (event.key) {
      case 'Escape':
        closeLightbox()
        break
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