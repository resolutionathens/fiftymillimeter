<template>
  <div class="min-h-screen bg-white dark:bg-black">
    <!-- Nuxt UI Pro Header -->
    <AppHeader />

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Minimal Footer -->
    <footer class="mt-12 border-t border-gray-100 dark:border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
              href="https://instagram.com/fiftymillimeter_"
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
