<template>
  <div class="py-16 lg:py-24">
    <UContainer>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
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
          <!-- Name -->
          <h1 class="text-3xl lg:text-4xl font-light tracking-tight text-gray-900 dark:text-white mb-8">
            Ian Kennedy
          </h1>

          <!-- Pull Quote -->
          <blockquote class="text-sm italic text-gray-500 dark:text-gray-400 border-l-2 border-gray-300 dark:border-gray-600 pl-6 mb-10">
            "I don't create images, I collect them. Each photograph is proof that I was here, proof that I saw this thing."
          </blockquote>

          <!-- Bio -->
          <div class="space-y-4">
            <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              Ian Kennedy is a photographer based in Athens, Georgia, whose work finds the extraordinary within the ordinary. Since launching fiftymillimeter in 2004, he has built a body of work drawn from contemporary scenes across the American Southeast and beyond.
            </p>
            <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              His photographs are less concerned with spectacle than with accumulation. Each image is a piece of a larger puzzle, relying on the others to reveal something greater. Though personal symbolism runs through every frame, the work is left open — he'd rather you find your own meaning than be led to his.
            </p>
            <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              He still takes all of his photos one at a time.
            </p>
          </div>

          <!-- Contact -->
          <div class="space-y-2 pt-8">
            <a
              href="mailto:hello@fiftymillimeter.com"
              class="block text-sm text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              hello@fiftymillimeter.com
            </a>
            <a
              href="https://instagram.com/fiftymillimeter_"
              target="_blank"
              class="block text-sm text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              @fiftymillimeter_
            </a>
            <a
              href="https://theprinttrade.com/p/ian-kennedy"
              target="_blank"
              class="block text-sm text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              The Print Trade
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
