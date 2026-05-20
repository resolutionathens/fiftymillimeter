<template>
  <div class="flex-1 flex flex-col px-6 sm:px-10 lg:px-14 pt-9 pb-4">
    <!-- Product -->
    <div
      v-if="product && !checkoutOpen"
      class="flex-1 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-14 min-h-0"
    >
      <!-- left — cover with shadow + thumbs -->
      <div class="flex flex-col min-h-0">
        <div class="text-[10px] uppercase tracking-[0.2em] text-muted-warm mb-3">
          shop
        </div>

        <div class="relative flex-1 mb-4 flex items-center justify-center">
          <div
            class="relative w-[78%] h-full"
            style="box-shadow: 24px 30px 60px rgba(0, 0, 0, 0.15);"
          >
            <NuxtImg
              :src="previewImages[selected]"
              alt="Athens is a Subtropical Rainforest cover"
              class="w-full h-full object-cover"
              width="900"
              height="1200"
              loading="eager"
            />
          </div>
        </div>

        <!-- thumbs -->
        <div class="flex gap-2">
          <button
            v-for="(src, i) in previewImages"
            :key="i"
            type="button"
            class="flex-1 h-[58px] p-0.5 border"
            :class="i === selected ? 'border-gold' : 'border-rule'"
            :aria-label="`Preview spread ${i + 1}`"
            @click="selected = i"
          >
            <NuxtImg
              :src="src"
              :alt="`Spread ${i + 1}`"
              class="w-full h-full object-cover"
              width="240"
              height="180"
              loading="lazy"
            />
          </button>
        </div>
      </div>

      <!-- right — book detail -->
      <div class="flex flex-col min-h-0 pt-6">
        <div class="text-[11px] uppercase tracking-[0.18em] text-muted-warm mb-2.5">
          zine · first edition
        </div>
        <h1 class="text-[28px] sm:text-[32px] leading-[1.18] tracking-[0.005em] mb-4">
          Athens is a<br />Subtropical Rainforest.
        </h1>
        <p class="text-[13px] leading-[1.7] text-ink mb-6 max-w-[380px]">
          {{ product.description }}
        </p>

        <dl class="flex flex-col gap-2 mb-6 text-[11px]">
          <div
            v-for="row in spec"
            :key="row[0]"
            class="grid grid-cols-[88px_1fr] gap-4 pb-2 border-b border-dotted border-rule"
          >
            <dt class="text-muted-warm uppercase tracking-[0.1em] text-[10px]">
              {{ row[0] }}
            </dt>
            <dd>{{ row[1] }}</dd>
          </div>
        </dl>

        <div class="flex items-baseline justify-between mb-2">
          <span class="text-[32px] tracking-[0.01em] text-ink">
            ${{ (product.price / 100).toFixed(0) }}
          </span>
          <span class="text-[10px] uppercase tracking-[0.16em] text-muted-warm">
            <span class="text-gold">●</span>
            &nbsp;{{ product.stock_quantity }} of 100 remain
          </span>
        </div>

        <div class="flex-1" />

        <button
          type="button"
          :disabled="!product.inStock"
          class="px-4 py-3.5 border border-ink bg-paper text-ink text-[12px] uppercase tracking-[0.18em] flex justify-between items-center hover:bg-ink hover:text-paper transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          @click="checkoutOpen = true"
        >
          <span>{{ product.inStock ? "buy a copy" : "sold out" }}</span>
          <span class="text-gold">→</span>
        </button>
      </div>
    </div>

    <!-- Checkout view -->
    <div
      v-else-if="product && checkoutOpen"
      class="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 min-h-0"
    >
      <div class="flex flex-col">
        <button
          type="button"
          class="self-start text-[10px] uppercase tracking-[0.18em] text-muted-warm hover:text-ink mb-5"
          @click="checkoutOpen = false"
        >
          ← back
        </button>
        <div class="text-[10px] uppercase tracking-[0.2em] text-muted-warm mb-3">
          checkout
        </div>
        <h2 class="text-[24px] leading-[1.18] mb-3">
          Athens is a Subtropical Rainforest.
        </h2>
        <div class="text-[11px] uppercase tracking-[0.14em] text-muted-warm mb-1">
          zine · first edition
        </div>
        <div class="text-[20px] mt-4">
          ${{ (product.price / 100).toFixed(0) }}
        </div>
      </div>
      <div>
        <ShopCheckoutForm
          :product="product"
          @success="handleCheckoutSuccess"
        />
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="pending"
      class="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-10"
    >
      <USkeleton class="h-[480px]" />
      <div class="space-y-4">
        <USkeleton class="h-10 w-3/4" />
        <USkeleton class="h-8 w-1/3" />
        <USkeleton class="h-32 w-full" />
        <USkeleton class="h-12 w-full" />
      </div>
    </div>

    <!-- Error -->
    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      title="Failed to load product"
      :description="error.message"
      class="max-w-2xl mx-auto"
    />
  </div>
</template>

<script setup lang="ts">
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  inStock: boolean;
  stock_quantity: number;
}

interface ProductResponse {
  product: Product;
}

const checkoutOpen = ref(false);
const selected = ref(0);

const {
  data: productData,
  pending,
  error,
} = await useFetch<ProductResponse>("/api/shop/product");
const product = computed(() => productData.value?.product);

const previewImages = [
  "https://cdn.fiftymillimeter.com/shop/01.webp",
  "https://cdn.fiftymillimeter.com/shop/02.webp",
  "https://cdn.fiftymillimeter.com/shop/03.webp",
  "https://cdn.fiftymillimeter.com/shop/04.webp",
  "https://cdn.fiftymillimeter.com/shop/06.webp",
];

const spec: [string, string][] = [
  ["Format", 'Landscape Golden Age · 7.38" × 10.25"'],
  ["Pages", "48 · full-color · 100lb satin"],
  ["Binding", "Perfect bound, hand-numbered"],
  ["Edition", "100, signed by the artist"],
  ["Shipping", "Free · USPS Media Mail · 3–5 days"],
];

useSeoMeta({
  title: "Shop - Athens is a Subtropical Rainforest Zine",
  ogTitle: "Shop - Athens is a Subtropical Rainforest Zine",
  description:
    'Purchase the limited edition photography zine "Athens is a Subtropical Rainforest" by Ian Kennedy',
  ogDescription:
    'Purchase the limited edition photography zine "Athens is a Subtropical Rainforest" by Ian Kennedy',
  ogImage:
    "https://fiftymillimeter.com/cdn-cgi/image/f=auto,w=1600,h=2000/https://cdn.fiftymillimeter.com/shop/athens-rainforest-cover.jpg",
  ogImageWidth: "1200",
  ogImageHeight: "1500",
  ogImageType: "image/jpeg",
  twitterCard: "summary_large_image",
  twitterImage:
    "https://fiftymillimeter.com/cdn-cgi/image/f=auto,w=1600,h=2000/https://cdn.fiftymillimeter.com/shop/athens-rainforest-cover.jpg",
});

const handleCheckoutSuccess = (paymentIntentId: string) => {
  navigateTo(`/shop/success?payment_intent=${paymentIntentId}`);
};
</script>
