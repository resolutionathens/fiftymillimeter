<template>
  <div class="py-16 lg:py-24">
    <UContainer>
      <!-- Hero Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-16">
        <div>
          <NuxtImg
            src="https://cdn.fiftymillimeter.com/shop/eponymous.jpg"
            alt="Ian Kennedy"
            class="w-full"
            width="800"
            height="800"
            loading="lazy"
          />
        </div>
        <div>
          <p class="text-lg text-gray-600 dark:text-gray-300 pb-6">
            The first iteration of fiftymillimeter was launched in 2004 with a
            bio that read, "Ian takes all of his photos one at a time with a
            rusted shovel and a plastic spoon."
          </p>
          <p class="text-lg text-gray-600 dark:text-gray-300 pb-6">
            Twenty-plus years later, I still can't fully name what pulls me
            toward certain scenes — quiet mystery in the ordinary, a shimmer
            that transforms a photograph into something closer to an emotion.
            When I'm photographing at my best, each image is just another
            sentence in a long love letter to the world. And though there is
            personal symbolism in every frame, I'd rather you find your own
            meaning than be led to mine. Too often, I find that to define the
            work is to limit it.
          </p>
          <p class="text-lg text-gray-600 dark:text-gray-300 pb-6">
            I still take all of my photos one at a time.
          </p>
          <p class="text-lg text-gray-600 dark:text-gray-300 pb-6">
            I am Ian Kennedy, a photographer based in Athens, Georgia.
          </p>

          <!-- Contact -->
          <div class="space-y-2 pt-4">
            <a
              href="mailto:hello@fiftymillimeter.com"
              class="block text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              hello@fiftymillimeter.com
            </a>
            <a
              href="https://instagram.com/fiftymillimeter_"
              target="_blank"
              class="block text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              @fiftymillimeter_
            </a>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
// SEO
useSeoMeta({
  title: "About - Fiftymillimeter",
  ogTitle: "About - Fiftymillimeter",
  description:
    "Ian Kennedy is a photographer based in Athens, Georgia, exploring the extraordinary within the ordinary through contemporary scenes from the Southeast and beyond.",
  ogDescription:
    "Ian Kennedy is a photographer based in Athens, Georgia, exploring the extraordinary within the ordinary through contemporary scenes from the Southeast and beyond.",
});
</script>
