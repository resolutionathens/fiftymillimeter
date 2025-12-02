<template>
  <UFooter class="mt-12">
    <template #left>
      <p class="text-muted text-sm font-light">
        © {{ new Date().getFullYear() }} fiftymillimeter
      </p>
    </template>

    <template #right>
      <UButton
        icon="i-heroicons-envelope"
        color="neutral"
        variant="ghost"
        to="mailto:hello@fiftymillimeter.com"
        aria-label="Email"
      />
      <UButton
        icon="i-simple-icons-instagram"
        color="neutral"
        variant="ghost"
        to="https://instagram.com/fiftymillimeter_"
        target="_blank"
        aria-label="Instagram"
      />
    </template>
  </UFooter>
</template>
