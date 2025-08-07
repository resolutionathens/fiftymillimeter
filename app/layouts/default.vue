<template>
  <div class="min-h-screen bg-white dark:bg-black">
    <!-- Minimal Fixed Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="text-lg font-light text-gray-900 dark:text-white tracking-wide">
            Fifty Millimeter
          </NuxtLink>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-8">
            <NuxtLink 
              to="/galleries"
              class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors font-light"
            >
              Galleries
            </NuxtLink>
            <NuxtLink 
              to="/about"
              class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors font-light"
            >
              About
            </NuxtLink>
            <NuxtLink 
              to="/contact"
              class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors font-light"
            >
              Contact
            </NuxtLink>
            
            <!-- Minimal Color Mode Toggle -->
            <button
              @click="$colorMode.preference = $colorMode.value === 'dark' ? 'light' : 'dark'"
              class="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              <UIcon :name="$colorMode.value === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'" class="w-4 h-4" />
            </button>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="md:hidden p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            <UIcon :name="isMobileMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'" class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="isMobileMenuOpen" class="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-black">
        <div class="px-4 py-4 space-y-4">
          <NuxtLink 
            to="/galleries"
            class="block text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors font-light"
            @click="isMobileMenuOpen = false"
          >
            Galleries
          </NuxtLink>
          <NuxtLink 
            to="/about"
            class="block text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors font-light"
            @click="isMobileMenuOpen = false"
          >
            About
          </NuxtLink>
          <NuxtLink 
            to="/contact"
            class="block text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors font-light"
            @click="isMobileMenuOpen = false"
          >
            Contact
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Main Content with top margin for fixed nav -->
    <main class="pt-16">
      <slot />
    </main>

    <!-- Minimal Footer -->
    <footer class="mt-24 border-t border-gray-100 dark:border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div class="text-sm text-gray-500 dark:text-gray-400 font-light">
            © {{ new Date().getFullYear() }} Fifty Millimeter
          </div>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <a 
              href="mailto:hello@fiftymillimeter.com"
              class="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors font-light"
            >
              Email
            </a>
            <a 
              href="https://instagram.com/fiftymillimeter"
              target="_blank"
              rel="noopener"
              class="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors font-light"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const isMobileMenuOpen = ref(false)
</script>