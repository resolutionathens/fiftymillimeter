<template>
  <footer class="px-6 sm:px-10 lg:px-14 pb-6 pt-3">
    <div
      class="border-t border-rule pt-3.5 flex flex-col gap-1 sm:flex-row sm:justify-between text-[10px] uppercase tracking-[0.14em] text-muted-warm"
    >
      <span>© {{ year }} ian kennedy</span>
      <span>
        <a
          href="mailto:hello@fiftymillimeter.com"
          class="hover:text-ink"
        >hello@fiftymillimeter.com</a>
        ·
        <a
          href="https://instagram.com/fiftymillimeter_"
          target="_blank"
          rel="noopener"
          class="hover:text-ink"
        >@fiftymillimeter_</a>
      </span>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear();
</script>
