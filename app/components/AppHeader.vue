<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

// Get current route for active state detection
const route = useRoute();

// Simplified navigation items - no icons, no dropdowns
const navigationItems = computed<NavigationMenuItem[]>(() => [
  {
    label: "Home",
    to: "/",
    active: route.path === "/",
  },
  {
    label: "Blog",
    to: "/blog",
    active: route.path.startsWith("/blog"),
  },
  {
    label: "Shop",
    to: "/shop",
    active: route.path.startsWith("/shop"),
  },
  {
    label: "Galleries",
    to: "/galleries",
    active: route.path.startsWith("/galleries"),
  },
  {
    label: "About",
    to: "/about",
    active: route.path === "/about",
  }
]);
</script>

<template>
  <UHeader
    toggle-side="right"
    mode="slideover"
    to="/"
  >
    <template #title>
      <span class="font-light tracking-wider text-lg">fiftymillimeter</span>
    </template>

    <!-- Desktop Navigation -->
    <UNavigationMenu
      :items="navigationItems"
      content-orientation="vertical"
      class="w-full justify-center gap-x-6"
    />

    <template #right>
      <div class="flex items-center gap-2">
        <UColorModeButton variant="ghost" />
      </div>
    </template>

    <!-- Mobile Navigation Body -->
    <template #body>
      <UNavigationMenu
        :items="navigationItems"
        orientation="vertical"
        class="w-full gap-y-2"
      />
    </template>
  </UHeader>
</template>