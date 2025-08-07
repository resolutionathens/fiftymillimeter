<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

// Get current route for active state detection
const route = useRoute();

// Fetch collections for navigation (client-side to avoid SSR issues with R2 bindings)
const { data: collectionsData } = await useLazyFetch('/api/collections', {
  default: () => ({ collections: [], count: 0 }),
  server: false // Force client-side fetching to avoid R2 binding issues during SSR
});

const collections = computed(() => collectionsData.value?.collections || []);

// Create navigation items
const navigationItems = computed<NavigationMenuItem[]>(() => {
  const items: NavigationMenuItem[] = [
    {
      label: "Home",
      to: "/",
      icon: "i-heroicons-home",
      active: route.path === "/",
    },
    {
      label: "About",
      to: "/about",
      icon: "i-heroicons-user",
      active: route.path === "/about",
    },
    {
      label: "Contact",
      to: "/contact",
      icon: "i-heroicons-envelope",
      active: route.path === "/contact",
    }
  ];

  // Add galleries dropdown if we have collections
  if (collections.value.length > 0) {
    items.splice(1, 0, {
      label: "Galleries",
      icon: "i-heroicons-photo",
      active: route.path.startsWith("/galleries"),
      children: [
        {
          label: "All Galleries",
          to: "/galleries",
          icon: "i-heroicons-squares-2x2"
        },
        { type: "separator" },
        ...collections.value.map(collection => ({
          label: collection.displayName,
          icon: "i-heroicons-camera",
          to: `/galleries/${collection.slug}`,
        }))
      ],
    });
  } else {
    // Fallback when collections haven't loaded yet
    items.splice(1, 0, {
      label: "Galleries",
      to: "/galleries",
      icon: "i-heroicons-photo",
      active: route.path.startsWith("/galleries"),
    });
  }

  return items;
});
</script>

<template>
  <UHeader
    toggle-side="right"
    mode="slideover"
    to="/"
    class="mb-8"
  >
    <template #title>
      <div class="flex items-center gap-2">
        <UIcon
          name="i-heroicons-camera"
          class="h-6 w-6"
        />
        <span class="font-light tracking-wide">fiftymillimeter</span>
      </div>
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