<template>
  <div class="w-full">
    <div class="relative w-full">
      <!-- Navigation Controls -->
      <div class="flex items-center justify-center gap-4 mb-4 md:mb-6">
        <UPagination
          v-model:page="currentPage"
          :total="images.length"
          :items-per-page="itemsPerPage"
          :sibling-count="1"
          show-edges
          color="neutral"
          variant="outline"
          size="sm"
        />

        <!-- View Toggle Button -->
        <UButton
          color="neutral"
          variant="outline"
          size="sm"
          :title="viewMode === 'grid' ? 'Single image view' : 'Grid view'"
          :aria-label="viewMode === 'grid' ? 'Switch to single image view' : 'Switch to grid view'"
          @click="toggleViewMode"
        >
          <UIcon
            :name="viewMode === 'grid' ? 'i-heroicons-square-2-stack' : 'i-heroicons-squares-2x2'"
            class="w-4 h-4"
          />
        </UButton>
      </div>

      <!-- Grid View -->
      <div
        v-if="viewMode === 'grid'"
        class="grid grid-cols-2 md:grid-cols-3 gap-4"
      >
        <div
          v-for="(image, index) in paginatedImages"
          :key="image.key"
          class="aspect-square cursor-pointer overflow-hidden rounded-lg"
          @click="openModalAtIndex(pageStartIndex + index)"
        >
          <NuxtImg
            :src="image.url"
            :alt="image.name"
            class="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
            width="400"
            height="400"
            loading="lazy"
          />
        </div>
      </div>

      <!-- Single Image View -->
      <div
        v-else
        ref="_imageContainer"
        class="w-full overflow-hidden flex items-center justify-center"
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
      <UModal
        v-model:open="isModalOpen"
        :fullscreen="true"
        :close="false"
      >
        <template #content>
          <div
            class="relative flex items-center justify-center h-screen bg-white/90 backdrop-blur-sm p-4 md:p-8"
            @click.stop
          >
            <!-- Previous Button -->
            <button
              v-if="currentImageIndex > 0"
              class="absolute left-4 z-10 p-3 text-neutral-500 hover:text-neutral-700 transition-colors"
              aria-label="Previous image"
              @click="previousImage"
            >
              <UIcon
                name="i-heroicons-chevron-left"
                class="w-6 h-6"
              />
            </button>

            <!-- Next Button -->
            <button
              v-if="currentImageIndex < images.length - 1"
              class="absolute right-4 z-10 p-3 text-neutral-500 hover:text-neutral-700 transition-colors"
              aria-label="Next image"
              @click="nextImage"
            >
              <UIcon
                name="i-heroicons-chevron-right"
                class="w-6 h-6"
              />
            </button>

            <!-- Close Button -->
            <button
              class="absolute top-4 right-4 z-10 p-3 text-neutral-500 hover:text-neutral-700 transition-colors"
              aria-label="Close modal"
              @click="isModalOpen = false"
            >
              <UIcon
                name="i-heroicons-x-mark"
                class="w-6 h-6"
              />
            </button>

            <!-- Image Counter -->
            <div
              class="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 px-4 py-2 text-neutral-500 text-sm font-medium"
            >
              {{ currentImageIndex + 1 }} of {{ images.length }}
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
  key: string;
  url: string;
  name: string;
  lastModified?: Date;
  size?: number;
  collection?: string;
}

interface Props {
  images: ImageData[];
  columns?: 1 | 2 | 3 | 4;
  defaultView?: 'single' | 'grid';
}

const props = withDefaults(defineProps<Props>(), {
  columns: 1,
  defaultView: 'grid',
});

// View mode state
const viewMode = ref<'single' | 'grid'>(props.defaultView);

const currentPage = ref(1);
const modalImageIndex = ref(0); // Separate index for modal navigation

// Pagination computed properties
const itemsPerPage = computed(() => viewMode.value === 'single' ? 1 : 9);
const pageStartIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);

const paginatedImages = computed(() => {
  const start = pageStartIndex.value;
  return props.images.slice(start, start + itemsPerPage.value);
});

const currentImageIndex = computed(() => {
  // In single view mode, use page-based index; in grid mode, use modal index
  return viewMode.value === 'single' ? currentPage.value - 1 : modalImageIndex.value;
});

const currentImage = computed(() => {
  return props.images[currentImageIndex.value];
});

// Toggle view mode and reset page
const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'single' ? 'grid' : 'single';
  currentPage.value = 1;
};

// Modal state
const isModalOpen = ref(false);

const openModal = (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
  isModalOpen.value = true;
};

// Open modal at specific image index (for grid view)
const openModalAtIndex = (index: number) => {
  modalImageIndex.value = index;
  isModalOpen.value = true;
};

const nextImage = () => {
  if (viewMode.value === 'single') {
    if (currentPage.value < props.images.length) {
      currentPage.value++;
    }
  } else {
    if (modalImageIndex.value < props.images.length - 1) {
      modalImageIndex.value++;
    }
  }
};

const previousImage = () => {
  if (viewMode.value === 'single') {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  } else {
    if (modalImageIndex.value > 0) {
      modalImageIndex.value--;
    }
  }
};

// Touch/swipe navigation
const _imageContainer = ref<HTMLElement>();
let touchStartX = 0;
let touchStartY = 0;
let isSwiping = false;

// Modal touch variables
let modalTouchStartX = 0;
let modalTouchStartY = 0;
let isModalSwiping = false;

const handleTouchStart = (event: TouchEvent) => {
  const touch = event.touches[0];
  if (touch) {
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    isSwiping = false;
  }
};

const handleTouchMove = (event: TouchEvent) => {
  if (!touchStartX || !touchStartY) return;

  const touch = event.touches[0];
  if (!touch) return;

  const touchCurrentX = touch.clientX;
  const touchCurrentY = touch.clientY;

  const diffX = touchStartX - touchCurrentX;
  const diffY = touchStartY - touchCurrentY;

  // Only consider horizontal swipes (more horizontal than vertical movement)
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
    isSwiping = true;
    // Prevent default scrolling behavior during swipe
    if (event.cancelable) {
      event.preventDefault();
    }
  }
};

const handleTouchEnd = (event: TouchEvent) => {
  if (!touchStartX || !isSwiping) {
    // Reset values even if not swiping
    touchStartX = 0;
    touchStartY = 0;
    isSwiping = false;
    return;
  }

  const touch = event.changedTouches[0];
  if (!touch) return;

  const touchEndX = touch.clientX;
  const diffX = touchStartX - touchEndX;
  const threshold = 50; // Minimum swipe distance

  if (Math.abs(diffX) > threshold) {
    // Prevent click event if we're swiping
    event.preventDefault();
    if (diffX > 0) {
      // Swiped left - next image
      nextImage();
    } else {
      // Swiped right - previous image
      previousImage();
    }
  }

  // Reset values
  touchStartX = 0;
  touchStartY = 0;
  isSwiping = false;
};

// Modal touch handlers (non-interfering)
const handleModalTouchStart = (event: TouchEvent) => {
  const touch = event.touches[0];
  if (touch) {
    modalTouchStartX = touch.clientX;
    modalTouchStartY = touch.clientY;
    isModalSwiping = false;
  }
};

const handleModalTouchMove = (event: TouchEvent) => {
  if (!modalTouchStartX || !modalTouchStartY) return;

  const touch = event.touches[0];
  if (!touch) return;

  const touchCurrentX = touch.clientX;
  const touchCurrentY = touch.clientY;

  const diffX = modalTouchStartX - touchCurrentX;
  const diffY = modalTouchStartY - touchCurrentY;

  // Only consider horizontal swipes (more horizontal than vertical movement)
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
    isModalSwiping = true;
  }
};

const handleModalTouchEnd = (event: TouchEvent) => {
  if (!modalTouchStartX || !isModalSwiping) {
    // Reset values even if not swiping
    modalTouchStartX = 0;
    modalTouchStartY = 0;
    isModalSwiping = false;
    return;
  }

  const touch = event.changedTouches[0];
  if (!touch) return;

  const touchEndX = touch.clientX;
  const diffX = modalTouchStartX - touchEndX;
  const threshold = 50; // Minimum swipe distance

  if (Math.abs(diffX) > threshold) {
    if (diffX > 0) {
      // Swiped left - next image
      nextImage();
    } else {
      // Swiped right - previous image
      previousImage();
    }
  }

  // Reset values
  modalTouchStartX = 0;
  modalTouchStartY = 0;
  isModalSwiping = false;
};

// Keyboard navigation
onMounted(() => {
  const handleKeydown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowLeft":
        previousImage();
        break;
      case "ArrowRight":
        nextImage();
        break;
    }
  };

  window.addEventListener("keydown", handleKeydown);

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeydown);
  });
});
</script>
