<template>
  <div class="py-12">
    <UContainer>
      <!-- Hero Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <h1
            class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
          >
            About
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300 pb-6">
            The first iteration of fiftymillimeter was launched in 2004 with a
            bio which read, "Ian takes all of his photos one at a time with a
            rusted shovel and a plastic spoon." At the time, I felt that most
            writing about photography was pretentious and self-indulgent.
          </p>
          <p class="text-lg text-gray-600 dark:text-gray-300 pb-6">
            I don't know what to say about photography. I don't really know how
            to classify my work. Something like New Topographics mixed up with
            magical realism? I do know that I often feel like I am pulling at
            something that I lack the education or skill to portray. The beauty
            in the banal. The majesty in the mundane.
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
