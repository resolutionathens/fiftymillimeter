<template>
  <div class="py-16 lg:py-24">
    <UContainer>
      <h1 class="text-3xl font-bold mb-8">Blog</h1>

      <div v-if="postsList.length === 0" class="text-gray-500 dark:text-gray-400">
        Posts coming soon.
      </div>
      <div v-else class="space-y-8">
        <BlogPostCard
          v-for="post in postsList"
          :key="post.path"
          :post="post"
        />
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
// Fetch blog posts from the content API
const { data } = await useFetch('/api/content/blog')
const postsList = computed(() => data.value || [])

// SEO
useSeoMeta({
  title: 'Blog - Fiftymillimeter',
  ogTitle: 'Blog - Fiftymillimeter',
  description: 'Photography stories and experiences from Ian Kennedy',
  ogDescription: 'Photography stories and experiences from Ian Kennedy',
})
</script>
