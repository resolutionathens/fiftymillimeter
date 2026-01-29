<template>
  <div class="py-2 md:py-12">
    <UContainer>
      <!-- Header -->
      <div class="mb-8 md:mb-12">
        <!-- Breadcrumb -->
        <nav class="mb-4 md:mb-6">
          <ol class="flex items-center space-x-2 text-xs md:text-sm text-gray-500">
            <li>
              <NuxtLink
                to="/"
                class="hover:text-gray-700 dark:hover:text-gray-300"
              >
                Home
              </NuxtLink>
            </li>
            <li>/</li>
            <li>
              <NuxtLink
                to="/blog"
                class="hover:text-gray-700 dark:hover:text-gray-300"
              >
                Blog
              </NuxtLink>
            </li>
            <li>/</li>
            <li class="text-gray-900 dark:text-white font-medium">
              {{ post?.title }}
            </li>
          </ol>
        </nav>

        <!-- Post header -->
        <div class="mb-8">
          <h1 class="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {{ post?.title }}
          </h1>
          <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <time :datetime="post?.date">
              {{ formattedDate }}
            </time>
          </div>
          <p
            v-if="post?.description"
            class="mt-4 text-lg text-gray-600 dark:text-gray-300"
          >
            {{ post.description }}
          </p>
        </div>
      </div>

      <!-- Post content -->
      <article
        v-if="post"
        class="prose prose-gray dark:prose-invert max-w-none
               prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
               prose-p:text-gray-700 dark:prose-p:text-gray-300
               prose-a:text-primary-600 dark:prose-a:text-primary-400
               prose-img:rounded-lg"
      >
        <ContentRenderer :value="post" />
      </article>

      <!-- Error State -->
      <div
        v-else
        class="text-center py-20"
      >
        <UIcon
          name="i-heroicons-exclamation-triangle"
          class="w-20 h-20 text-red-400 mx-auto mb-6"
        />
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Post Not Found
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-8">
          The requested blog post could not be found. It may have been moved or deleted.
        </p>
        <UButton
          to="/blog"
          variant="outline"
        >
          Back to Blog
        </UButton>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

// Query the specific post
const { data: post } = await useAsyncData(`blog-${slug}`, () =>
  queryContent('blog')
    .where({ _path: `/blog/${slug}` })
    .findOne()
)

// Format date
const formattedDate = computed(() => {
  if (!post.value?.date) return ''
  const date = new Date(post.value.date)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// SEO
useSeoMeta({
  title: computed(() => post.value ? `${post.value.title} - Fiftymillimeter` : 'Post Not Found'),
  ogTitle: computed(() => post.value ? `${post.value.title} - Fiftymillimeter` : 'Post Not Found'),
  description: computed(() => post.value?.description || 'Blog post from Fiftymillimeter'),
  ogDescription: computed(() => post.value?.description || 'Blog post from Fiftymillimeter'),
})

// Handle 404 for non-existent posts
if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Post not found'
  })
}
</script>
