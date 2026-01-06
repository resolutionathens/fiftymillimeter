<template>
  <div class="py-16 lg:py-24">
    <UContainer>
      <!-- Hero Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-16">
        <div>
          <NuxtImg
            src="https://pub-77d2c63f12a143a59270d491959246da.r2.dev/shop/ian.webp"
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
            Twenty years later, I still don't know how to classify what I do. I
            know that I'm pulled toward something I can't quite capture
            completely—quiet mystery in the ordinary, the shimmer in a scene
            that transforms a photograph into an emotion.
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
