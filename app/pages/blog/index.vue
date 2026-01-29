<template>
  <div class="py-16 lg:py-24">
    <UContainer>
      <h1 class="text-3xl font-bold mb-8">Blog</h1>

      <div v-if="postsList.length === 0" class="text-gray-500 dark:text-gray-400">
        Posts coming soon.
      </div>
      <div v-else>
        <!-- Post listing will be implemented in Phase 2 -->
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
// Query blog posts
const { data: posts } = await useAsyncData('blog-posts', () =>
  queryContent('blog').find()
)

// Provide default empty array if posts is null/undefined
const postsList = computed(() => posts.value || [])

// SEO
useSeoMeta({
  title: 'Blog - Fiftymillimeter',
  ogTitle: 'Blog - Fiftymillimeter',
  description: 'Photography stories and experiences from Ian Kennedy',
  ogDescription: 'Photography stories and experiences from Ian Kennedy',
})
</script>
