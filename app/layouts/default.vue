<template>
  <div class="min-h-screen flex flex-col bg-paper text-ink">
    <AppHeader />
    <main class="flex-1 flex flex-col">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
