<template>
  <div class="flex-1 flex flex-col px-6 sm:px-10 lg:px-14 pt-8 pb-4">
    <!-- Section header -->
    <div class="flex items-baseline gap-7 mb-5">
      <div class="text-[10px] uppercase tracking-[0.2em] text-muted-warm">
        collections
      </div>
      <div class="flex-1 h-px bg-rule" />
      <div class="text-[10px] uppercase tracking-[0.16em] text-muted-warm">
        {{ totalFrames }} frames in the archive
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="pending"
      class="flex-1 flex flex-col"
    >
      <div
        v-for="i in 4"
        :key="i"
        class="flex-1 border-b border-rule"
        :class="i === 1 ? 'border-t' : ''"
      >
        <USkeleton class="h-16 my-6" />
      </div>
    </div>

    <!-- Rows -->
    <div
      v-else-if="collections.length"
      class="flex-1 flex flex-col"
    >
      <CollectionCard
        v-for="(collection, i) in collections"
        :key="collection.slug"
        :collection="collection"
        :roman="toRoman(i + 1)"
        :first="i === 0"
      />
    </div>

    <!-- Empty -->
    <div
      v-else
      class="flex-1 flex flex-col items-center justify-center text-center"
    >
      <h2 class="text-xl text-ink mb-3">
        No collections available
      </h2>
      <p class="text-muted-warm text-sm mb-6">
        Collections are being prepared and will be available soon.
      </p>
      <NuxtLink
        to="/"
        class="text-[11px] uppercase tracking-[0.14em] text-muted-warm hover:text-ink"
      >
        return home
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Galleries - Fiftymillimeter",
  ogTitle: "Galleries - Fiftymillimeter",
  description:
    "Photo collections from my travels and explorations around the Southeast and beyond.",
  ogDescription:
    "Photo collections from my travels and explorations around the Southeast and beyond.",
});

const { data: collectionsData, pending, error } = await useFetch("/api/collections", {
  default: () => ({ collections: [], count: 0 }),
});

const collections = computed(() => collectionsData.value?.collections || []);

const totalFrames = computed(() =>
  collections.value.reduce((sum, c) => sum + (c.imageCount || 0), 0)
);

const toRoman = (num: number) => {
  const map: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let n = num;
  let out = "";
  for (const [v, s] of map) {
    while (n >= v) {
      out += s;
      n -= v;
    }
  }
  return out;
};

if (error.value) {
  console.error("Error fetching collections:", error.value);
}
</script>
