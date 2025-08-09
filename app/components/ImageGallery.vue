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
      >
        <NuxtImg
          v-if="currentImage"
          :src="currentImage.url"
          :alt="currentImage.name"
          class="max-w-full max-h-full object-contain cursor-pointer"
          :width="1600"
          :height="1200"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          loading="lazy"
          @click.stop="openModal"
          @touchstart.passive="handleTouchStart"
          @touchmove.passive="handleTouchMove"
          @touchend.passive="handleTouchEnd"
        />
      </div>

      <!-- Fullscreen Image Modal -->
      <UModal v-model:open="isModalOpen" :fullscreen="true" :close="false">
        <template #content>
          <div class="relative flex items-center justify-center h-screen bg-black p-4 md:p-8" @click.stop>
            <!-- Previous Button -->
            <button
              v-if="currentPage > 1"
              class="absolute left-4 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Previous image"
              @click="previousImage"
            >
              <UIcon name="i-heroicons-chevron-left" class="w-6 h-6" />
            </button>

            <!-- Next Button -->
            <button
              v-if="currentPage < images.length"
              class="absolute right-4 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Next image"
              @click="nextImage"
            >
              <UIcon name="i-heroicons-chevron-right" class="w-6 h-6" />
            </button>

            <!-- Close Button -->
            <button
              class="absolute top-4 right-4 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Close modal"
              @click="isModalOpen = false"
            >
              <UIcon name="i-heroicons-x-mark" class="w-6 h-6" />
            </button>

            <!-- Image Counter -->
            <div class="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 px-4 py-2 rounded-full bg-black/50 text-white text-sm font-medium">
              {{ currentPage }} of {{ images.length }}
            </div>

            <!-- Main Image -->
            <img
              v-if="currentImage"
              :src="currentImage.url"
              :alt="currentImage.name"
              class="max-w-[calc(100vw-8rem)] max-h-[calc(100vh-8rem)] w-auto h-auto object-contain"
              loading="lazy"
              @touchstart="handleModalTouchStart"
              @touchmove="handleModalTouchMove"
              @touchend="handleModalTouchEnd"
            />
          </div>
        </template>
      </UModal>

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

// Modal state
const isModalOpen = ref(false)

const openModal = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  isModalOpen.value = true
}

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

// Modal touch variables
let modalTouchStartX = 0
let modalTouchStartY = 0
let isModalSwiping = false

const handleTouchStart = (event: TouchEvent) => {
  const touch = event.touches[0]
  if (touch) {
    touchStartX = touch.clientX
    touchStartY = touch.clientY
    isSwiping = false
  }
}

const handleTouchMove = (event: TouchEvent) => {
  if (!touchStartX || !touchStartY) return
  
  const touch = event.touches[0]
  if (!touch) return

  const touchCurrentX = touch.clientX
  const touchCurrentY = touch.clientY
  
  const diffX = touchStartX - touchCurrentX
  const diffY = touchStartY - touchCurrentY
  
  // Only consider horizontal swipes (more horizontal than vertical movement)
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
    isSwiping = true
    // Prevent default scrolling behavior during swipe
    if (event.cancelable) {
      event.preventDefault()
    }
  }
}

const handleTouchEnd = (event: TouchEvent) => {
  if (!touchStartX || !isSwiping) {
    // Reset values even if not swiping
    touchStartX = 0
    touchStartY = 0
    isSwiping = false
    return
  }

  const touch = event.changedTouches[0]
  if (!touch) return

  const touchEndX = touch.clientX
  const diffX = touchStartX - touchEndX
  const threshold = 50 // Minimum swipe distance

  if (Math.abs(diffX) > threshold) {
    // Prevent click event if we're swiping
    event.preventDefault()
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

// Modal touch handlers (non-interfering)
const handleModalTouchStart = (event: TouchEvent) => {
  const touch = event.touches[0]
  if (touch) {
    modalTouchStartX = touch.clientX
    modalTouchStartY = touch.clientY
    isModalSwiping = false
  }
}

const handleModalTouchMove = (event: TouchEvent) => {
  if (!modalTouchStartX || !modalTouchStartY) return
  
  const touch = event.touches[0]
  if (!touch) return

  const touchCurrentX = touch.clientX
  const touchCurrentY = touch.clientY
  
  const diffX = modalTouchStartX - touchCurrentX
  const diffY = modalTouchStartY - touchCurrentY
  
  // Only consider horizontal swipes (more horizontal than vertical movement)
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
    isModalSwiping = true
  }
}

const handleModalTouchEnd = (event: TouchEvent) => {
  if (!modalTouchStartX || !isModalSwiping) {
    // Reset values even if not swiping
    modalTouchStartX = 0
    modalTouchStartY = 0
    isModalSwiping = false
    return
  }

  const touch = event.changedTouches[0]
  if (!touch) return

  const touchEndX = touch.clientX
  const diffX = modalTouchStartX - touchEndX
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
  modalTouchStartX = 0
  modalTouchStartY = 0
  isModalSwiping = false
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
