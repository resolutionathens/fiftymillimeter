<template>
  <div class="flex items-center justify-center min-h-[calc(100vh-200px)] py-8">
    <NuxtLink
      v-if="randomImage"
      :to="`/galleries/${randomImage.collection}`"
      class="block max-w-4xl mx-auto px-4"
    >
      <NuxtImg
        :src="randomImage.url"
        :alt="`From the ${randomImage.collection} collection`"
        class="w-full h-auto max-h-[80vh] object-contain"
        loading="eager"
      />
    </NuxtLink>
    <div
      v-else
      class="aspect-[3/2] w-full max-w-4xl bg-gray-100 dark:bg-gray-900"
    />
  </div>
</template>

<script setup lang="ts">
interface Image {
  key: string
  name: string
  url: string
  collection: string
  size: number
  lastModified: Date
}

interface ImagesResponse {
  collection: string
  images: Image[]
  count: number
}

// SEO
useSeoMeta({
  title: 'Fiftymillimeter',
  ogTitle: 'Fiftymillimeter',
  description: 'Photography by Ian Kennedy exploring the extraordinary within the ordinary. Contemporary scenes from the Southeast and beyond that challenge conventional notions of the picturesque.',
  ogDescription: 'Photography by Ian Kennedy exploring the extraordinary within the ordinary. Contemporary scenes from the Southeast and beyond that challenge conventional notions of the picturesque.',
  ogUrl: 'https://fiftymillimeter.com',
  ogImage: 'https://fiftymillimeter.com/cdn-cgi/image/f=jpeg,w=1200,h=630,fit=cover/https://pub-77d2c63f12a143a59270d491959246da.r2.dev/maine/maine-00003.webp',
  ogImageWidth: '1200',
  ogImageHeight: '630',
  ogImageType: 'image/jpeg',
  twitterCard: 'summary_large_image',
  twitterImage: 'https://fiftymillimeter.com/cdn-cgi/image/f=jpeg,w=1200,h=630,fit=cover/https://pub-77d2c63f12a143a59270d491959246da.r2.dev/maine/maine-00003.webp',
})

// Fetch Athens images for random display
const { data: athensData } = await useFetch<ImagesResponse>('/api/images/athens', {
  default: () => ({ collection: 'athens', images: [], count: 0 })
})

// Select a random image from Athens collection
const randomImage = computed(() => {
  const images = athensData.value?.images || []
  if (images.length === 0) return null
  const randomIndex = Math.floor(Math.random() * images.length)
  return images[randomIndex]
})
</script>