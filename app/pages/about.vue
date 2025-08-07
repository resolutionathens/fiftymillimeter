<template>
  <div class="py-12">
    <UContainer>
      <!-- Hero Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            About Me
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Welcome to my world through the lens. I'm a passionate photographer dedicated to 
            capturing life's most beautiful and authentic moments.
          </p>
          <p class="text-lg text-gray-600 dark:text-gray-300">
            Based in [Your Location], I specialize in [Your Specialties] photography, 
            always seeking to tell compelling stories through powerful imagery.
          </p>
        </div>
        <div class="relative">
          <div class="aspect-[4/5] bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden">
            <!-- Replace this with your actual portrait -->
            <div class="w-full h-full flex items-center justify-center">
              <UIcon name="i-heroicons-camera" class="w-24 h-24 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <!-- Philosophy Section -->
      <section class="mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          My Photography Philosophy
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-heroicons-eye" class="w-8 h-8 text-gray-600 dark:text-gray-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Authentic Vision
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              I believe in capturing authentic moments that reflect genuine emotions and real stories.
            </p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-heroicons-heart" class="w-8 h-8 text-gray-600 dark:text-gray-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Emotional Connection
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Every photograph should evoke emotion and create a meaningful connection with the viewer.
            </p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-heroicons-sparkles" class="w-8 h-8 text-gray-600 dark:text-gray-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Creative Excellence
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              I strive for technical precision while maintaining artistic creativity in every shot.
            </p>
          </div>
        </div>
      </section>

      <!-- Journey Section -->
      <section class="mb-16 bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 md:p-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
          My Journey
        </h2>
        <div class="prose prose-gray dark:prose-invert max-w-none">
          <p class="text-lg">
            My passion for photography began [Your Story - when you started, what inspired you]. 
            Over the years, I've had the privilege of working with [types of clients/subjects] 
            and capturing [types of moments/events].
          </p>
          <p class="text-lg">
            What drives me most is the ability to freeze fleeting moments in time, creating 
            lasting memories that can be treasured for generations. Whether it's [your specialties], 
            I approach each project with dedication, creativity, and attention to detail.
          </p>
          <p class="text-lg">
            When I'm not behind the camera, you'll find me [your hobbies/interests]. 
            These experiences continue to inspire my photographic work and help me see the 
            world through different perspectives.
          </p>
        </div>
      </section>

      <!-- Equipment Section -->
      <section class="mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Tools of the Trade
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Camera Equipment
            </h3>
            <ul class="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Primary Camera: [Your Main Camera]</li>
              <li>• Secondary Camera: [Your Backup Camera]</li>
              <li>• Favorite Lens: [Your Go-to Lens]</li>
              <li>• Portrait Lens: [Your Portrait Lens]</li>
            </ul>
          </div>
          <div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Post-Processing
            </h3>
            <ul class="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Adobe Lightroom</li>
              <li>• Adobe Photoshop</li>
              <li>• [Other Software]</li>
              <li>• [Other Tools]</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Call to Action -->
      <section class="text-center bg-gray-900 rounded-2xl p-8 md:p-12 text-white">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">
          Let's Work Together
        </h2>
        <p class="text-lg mb-8 max-w-2xl mx-auto">
          I'd love to hear about your vision and help bring it to life through photography. 
          Whether it's a special event, portrait session, or commercial project, let's create 
          something beautiful together.
        </p>
        <UButton 
          to="/contact"
          color="white"
          variant="solid"
          size="lg"
          class="px-8 py-3"
        >
          Get In Touch
        </UButton>
      </section>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
// SEO
useSeoMeta({
  title: 'About - Fifty Millimeter',
  ogTitle: 'About - Fifty Millimeter',
  description: 'Learn about my photography journey, philosophy, and passion for capturing life\'s most beautiful moments.',
  ogDescription: 'Learn about my photography journey, philosophy, and passion for capturing life\'s most beautiful moments.',
})
</script>