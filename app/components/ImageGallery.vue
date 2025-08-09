<template>
  <div class="w-full">
    <!-- Single Image View -->
    <div class="relative w-full">
      <!-- Navigation Controls -->
      <div class="flex items-center justify-center mb-1 md:mb-6">
        <UPagination
          v-model:page="currentPage"
          :total="images.length"
          :items-per-page="1"
          :sibling-count="1"
          show-edges
          color="neutral"
          variant="outline"
          size="sm"
          class="md:!text-base"
        />
      </div>

      <!-- Main Image Display -->
      <div 
        ref="imageContainer"
        class="w-full overflow-hidden flex items-center justify-center h-[calc(100vh-80px)] md:h-[calc(100vh-120px)]"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
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

const currentPage = ref(1)

const currentImageIndex = computed(() => {
  return currentPage.value - 1
})

const currentImage = computed(() => {
  return props.images[currentImageIndex.value]
})

const nextImage = () => {
  if (currentPage.value < props.images.length) {
    currentPage.value++
  }
}

const previousImage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Touch/swipe navigation
const imageContainer = ref<HTMLElement>()
let touchStartX = 0
let touchStartY = 0
let isSwiping = false

const handleTouchStart = (event: TouchEvent) => {
  touchStartX = event.touches[0].clientX
  touchStartY = event.touches[0].clientY
  isSwiping = false
}

const handleTouchMove = (event: TouchEvent) => {
  if (!touchStartX || !touchStartY) return

  const touchCurrentX = event.touches[0].clientX
  const touchCurrentY = event.touches[0].clientY
  
  const diffX = touchStartX - touchCurrentX
  const diffY = touchStartY - touchCurrentY
  
  // Only consider horizontal swipes (more horizontal than vertical movement)
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
    isSwiping = true
    // Prevent default scrolling behavior during swipe
    event.preventDefault()
  }
}

const handleTouchEnd = (event: TouchEvent) => {
  if (!touchStartX || !isSwiping) return

  const touchEndX = event.changedTouches[0].clientX
  const diffX = touchStartX - touchEndX
  const threshold = 50 // Minimum swipe distance

  if (Math.abs(diffX) > threshold) {
    if (diffX > 0) {
      // Swiped left - next image
      nextImage()
    } else {
      // Swiped right - previous image  
      previousImage()
    }
  }

  // Reset values
  touchStartX = 0
  touchStartY = 0
  isSwiping = false
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
