<template>
  <div class="py-12">
    <UContainer>
      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Get In Touch
        </h1>
      </div>

      <div class="grid grid-cols-1 gap-16">
        <!-- Contact Information -->
        <div>
          <div class="space-y-6">
            <!-- Location -->
            <div class="flex items-start space-x-4">
              <div
                class="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0"
              >
                <UIcon
                  name="i-heroicons-map-pin"
                  class="w-6 h-6 text-gray-600 dark:text-gray-400"
                />
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  Location
                </h3>
                <p class="text-gray-600 dark:text-gray-300">
                  Athens, Georgia
                </p>
              </div>
            </div>
            <!-- Email -->
            <div class="flex items-start space-x-4">
              <div
                class="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0"
              >
                <UIcon
                  name="i-heroicons-envelope"
                  class="w-6 h-6 text-gray-600 dark:text-gray-400"
                />
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  Email
                </h3>
                <p class="text-gray-600 dark:text-gray-300">
                  <a href="mailto:hello@fiftymillimeter.com">hello@fiftymillimeter.com</a>
                </p>
              </div>
            </div>


            <!-- Social Media -->
            <div class="flex items-start space-x-4">
              <div
                class="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0"
              >
                <UIcon
                  name="i-heroicons-camera"
                  class="w-6 h-6 text-gray-600 dark:text-gray-400"
                />
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Follow me (I follow back)
                </h3>
                <div class="flex space-x-3">
                  <UButton
                    variant="outline"
                    color="neutral"
                    size="sm"
                    to="https://instagram.com/fiftymillimeter_"
                    external
                    target="_blank"
                  >
                    <UIcon
                      name="i-simple-icons-instagram"
                      class="w-4 h-4"
                    />
                    Instagram
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
// SEO
useSeoMeta({
  title: 'Contact - Fifty Millimeter',
  ogTitle: 'Contact - Fifty Millimeter',
  description: 'Get in touch to discuss your photography needs. Available for portraits, events, commercial, and landscape photography.',
  ogDescription: 'Get in touch to discuss your photography needs. Available for portraits, events, commercial, and landscape photography.',
})


</script>