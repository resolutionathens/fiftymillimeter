<template>
  <NuxtLink
    :to="post.path"
    class="group block p-6 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors duration-200"
  >
    <!-- Post metadata -->
    <div class="mb-3">
      <!-- Category badge -->
      <UBadge
        v-if="post.category"
        :label="post.category"
        color="primary"
        variant="soft"
        size="sm"
        class="mb-2"
      />
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {{ post.title }}
      </h3>
      <time
        :datetime="post.date"
        class="text-sm text-gray-500 dark:text-gray-400"
      >
        {{ formattedDate }}
      </time>
    </div>

    <!-- Description -->
    <p class="text-gray-600 dark:text-gray-300 line-clamp-3">
      {{ post.description }}
    </p>

    <!-- Read more indicator -->
    <div class="mt-4 flex items-center text-sm text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300">
      <span>Read more</span>
      <UIcon
        name="i-heroicons-arrow-right"
        class="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform"
      />
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface BlogPost {
  path: string
  title: string
  date: string
  description: string
  image?: string
  category?: string
}

interface Props {
  post: BlogPost
}

const props = defineProps<Props>()

// Format date as "January 29, 2026"
const formattedDate = computed(() => {
  const date = new Date(props.post.date)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})
</script>
