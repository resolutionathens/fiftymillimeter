<template>
  <div class="flex-1 flex flex-col px-6 sm:px-10 lg:px-14 pt-11 pb-8">
    <div class="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 min-h-0">
      <!-- photo -->
      <div class="relative flex flex-col min-h-0">
        <NuxtLink
          v-if="randomImage"
          :to="`/galleries/${randomImage.collection}`"
          class="relative flex-1 block bg-rule/40 overflow-hidden"
        >
          <div
            v-if="isImageLoading"
            class="absolute inset-0 flex items-center justify-center"
          >
            <UIcon
              name="i-heroicons-arrow-path"
              class="w-6 h-6 text-muted-warm animate-spin"
            />
          </div>
          <NuxtImg
            :src="randomImage.url"
            :alt="`From the ${randomImage.collection} collection`"
            class="w-full h-full object-cover transition-opacity duration-300"
            :class="isImageLoading ? 'opacity-0' : 'opacity-100'"
            loading="eager"
            width="1800"
            format="auto"
            fit="cover"
            @load="isImageLoading = false"
          />
        </NuxtLink>
        <div
          v-else
          class="flex-1 bg-rule/40"
        />

        <div class="pt-3 flex justify-between text-[10px] uppercase tracking-[0.12em] text-muted-warm">
          <span>{{ captionLeft }}</span>
          <span v-if="randomImage">
            from
            <NuxtLink
              :to="`/galleries/${randomImage.collection}`"
              class="text-ink border-b border-gold ml-1"
            >{{ randomImage.collection }}</NuxtLink>
          </span>
        </div>
      </div>

      <!-- caption column -->
      <aside class="flex flex-col justify-between pt-0.5">
        <div>
          <div class="text-[10px] uppercase tracking-[0.2em] text-muted-warm mb-4">
            <span class="text-gold">●</span>&nbsp; a random frame from the archive
          </div>
          <div class="text-[15px] leading-[1.65] text-ink mb-5">
            One image, picked at random from the archive. Reload for another.
          </div>
          <div class="text-[11px] text-muted-warm leading-[1.8]">
            <template v-if="randomImage">
              {{ formatCollection(randomImage.collection) }}<br />
              50mm
            </template>
          </div>
        </div>

        <div>
          <div class="h-px bg-rule mb-4" />
          <div class="flex flex-col gap-3 text-[11px]">
            <button
              type="button"
              class="flex justify-between items-center text-left hover:text-ink"
              @click="reroll"
            >
              <span class="text-muted-warm">↺&nbsp;reroll</span>
              <span class="text-ink">↗</span>
            </button>
            <NuxtLink
              v-if="randomImage"
              :to="`/galleries/${randomImage.collection}`"
              class="flex justify-between items-center"
            >
              <span>open the {{ randomImage.collection }} collection</span>
              <span class="text-gold">→</span>
            </NuxtLink>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
const isImageLoading = ref(true);

interface Image {
  key: string;
  name: string;
  url: string;
  collection: string;
  size: number;
  lastModified: Date;
}

interface ImagesResponse {
  collection: string;
  images: Image[];
  count: number;
}

useSeoMeta({
  title: "Fiftymillimeter",
  ogTitle: "Fiftymillimeter",
  description:
    "Photography by Ian Kennedy exploring the extraordinary within the ordinary. Contemporary scenes from the Southeast and beyond that challenge conventional notions of the picturesque.",
  ogDescription:
    "Photography by Ian Kennedy exploring the extraordinary within the ordinary. Contemporary scenes from the Southeast and beyond that challenge conventional notions of the picturesque.",
  ogUrl: "https://fiftymillimeter.com",
  ogImage:
    "https://fiftymillimeter.com/cdn-cgi/image/f=jpeg,w=1200,h=630,fit=cover/https://cdn.fiftymillimeter.com/maine/maine-00003.webp",
  ogImageWidth: "1200",
  ogImageHeight: "630",
  ogImageType: "image/jpeg",
  twitterCard: "summary_large_image",
  twitterImage:
    "https://fiftymillimeter.com/cdn-cgi/image/f=jpeg,w=1200,h=630,fit=cover/https://cdn.fiftymillimeter.com/maine/maine-00003.webp",
});

const { data: athensData } = await useFetch<ImagesResponse>("/api/images/maps", {
  default: () => ({ collection: "maps", images: [], count: 0 }),
});

const seed = ref(0);
const randomImage = computed(() => {
  // touch seed so reroll re-evaluates
  void seed.value;
  const images = athensData.value?.images || [];
  if (images.length === 0) return null;
  return images[Math.floor(Math.random() * images.length)];
});

const captionLeft = computed(() => {
  if (!randomImage.value) return "";
  return randomImage.value.name
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]/g, " ");
});

const formatCollection = (slug: string) =>
  slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");

const reroll = () => {
  isImageLoading.value = true;
  seed.value++;
};
</script>
