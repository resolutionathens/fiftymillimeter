<script setup lang="ts">
const route = useRoute();

const items = [
  { label: "home", to: "/" },
  { label: "galleries", to: "/galleries" },
  { label: "shop", to: "/shop" },
  { label: "about", to: "/about" },
];

const isActive = (to: string) => {
  if (to === "/") return route.path === "/";
  return route.path.startsWith(to);
};

const mobileOpen = ref(false);
</script>

<template>
  <header class="px-6 sm:px-10 lg:px-14 pt-7">
    <div class="flex items-baseline justify-between pb-4 border-b border-rule">
      <NuxtLink
        to="/"
        class="text-[17px] tracking-[0.02em] text-ink"
      >
        fiftymillimeter
      </NuxtLink>

      <nav class="hidden md:flex gap-10 text-xs">
        <NuxtLink
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          class="relative tracking-[0.04em]"
          :class="isActive(item.to) ? 'text-ink' : 'text-muted-warm'"
        >
          {{ item.label }}
          <span
            v-if="isActive(item.to)"
            class="absolute left-1/2 -translate-x-1/2 -bottom-[22px] w-1 h-1 rounded-full bg-gold"
            aria-hidden="true"
          />
        </NuxtLink>
      </nav>

      <div class="hidden md:block text-[10px] uppercase tracking-[0.14em] text-muted-warm">
        athens · ga
      </div>

      <button
        type="button"
        class="md:hidden text-xs uppercase tracking-[0.14em] text-ink"
        :aria-expanded="mobileOpen"
        aria-label="Toggle navigation"
        @click="mobileOpen = !mobileOpen"
      >
        {{ mobileOpen ? "close" : "menu" }}
      </button>
    </div>

    <nav
      v-if="mobileOpen"
      class="md:hidden flex flex-col gap-3 pt-4 pb-2 text-sm"
    >
      <NuxtLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="tracking-[0.04em]"
        :class="isActive(item.to) ? 'text-ink' : 'text-muted-warm'"
        @click="mobileOpen = false"
      >
        {{ item.label }}
        <span
          v-if="isActive(item.to)"
          class="inline-block w-1 h-1 rounded-full bg-gold align-middle ml-2"
          aria-hidden="true"
        />
      </NuxtLink>
    </nav>
  </header>
</template>
