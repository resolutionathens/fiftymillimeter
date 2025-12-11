<template>
  <div class="py-12">
    <UContainer>
      <!-- Hero Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <NuxtImg
            src="https://pub-77d2c63f12a143a59270d491959246da.r2.dev/shop/ian.webp"
            alt="Ian Kennedy"
            class="w-full rounded-lg"
            width="800"
            height="800"
            loading="lazy"
          />
        </div>
        <div>
          <!-- <h1
            class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
          >
            About
          </h1> -->
          <p class="text-lg text-gray-600 dark:text-gray-300 pb-6">
            The first iteration of fiftymillimeter was launched in 2004 with a
            bio which read, "Ian takes all of his photos one at a time with a
            rusted shovel and a plastic spoon."
          </p>
          <p class="text-lg text-gray-600 dark:text-gray-300 pb-6">
            I don't know what to say about photography. I don't really know how to classify my work… new topographics,
            social landscape, documenting space, banalography, mundaaang?
          </p>
          <p class="text-lg text-gray-600 dark:text-gray-300 pb-6">
            I'm also not sure that it matters. What I do know is that I often feel like I am pulling at something that I
            lack the education or skill to portray. The beauty in the banal. The majesty in the mundane. The shimmer in
            a scene that transforms a photo into an emotion.
          </p>
          <p class="text-lg text-gray-600 dark:text-gray-300 pb-6">
            I still take all of my photos one at a time.
          </p>
          <p class="text-lg text-gray-600 dark:text-gray-300 pb-6">
            I am Ian Kennedy, a photographer based in Athens, Georgia.
          </p>
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
