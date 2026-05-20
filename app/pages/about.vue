<template>
  <div class="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 px-6 sm:px-10 lg:px-14 pt-10 pb-5 min-h-0">
    <!-- left — half title -->
    <div class="flex flex-col gap-10">
      <div>
        <div class="text-[10px] uppercase tracking-[0.2em] text-muted-warm mb-7">
          the photographer
        </div>
        <div class="text-[44px] leading-[1.05] tracking-[-0.01em] text-ink mb-5">
          Ian<br />Kennedy.
        </div>
        <div class="text-[11px] uppercase tracking-[0.16em] text-muted-warm">
          athens, ga · b. 1974
        </div>
      </div>
      <blockquote class="text-[18px] leading-[1.5] text-ink border-t border-gold pt-4 max-w-[460px]">
        &ldquo;I don&rsquo;t create images, I collect them. Each photograph is proof that I was here, proof that I saw this thing.&rdquo;
      </blockquote>
    </div>

    <!-- right — portrait + bio -->
    <div class="flex flex-col min-h-0">
      <div class="relative h-[50%] mb-6">
        <NuxtImg
          src="https://cdn.fiftymillimeter.com/shop/eponymous.jpg"
          alt="Ian Kennedy"
          class="w-full h-full object-cover"
          width="800"
          height="800"
          loading="lazy"
        />
        <div class="absolute -bottom-5 left-0 text-[9px] uppercase tracking-[0.18em] text-muted-warm">
          self · living room · march 2026
        </div>
      </div>
      <div class="flex-1 text-[12px] leading-[1.85] text-ink mt-4 space-y-3.5">
        <p>
          Ian Kennedy is a photographer based in Athens, Georgia, whose work leans into the ambiguity of the photograph &mdash; images that shift meaning depending on what song is playing. The first iteration of
          <span class="border-b border-gold">fiftymillimeter</span>
          launched in 2004 with a bio that read, &ldquo;Ian takes all of his photos one at a time with a rusted shovel and a plastic spoon.&rdquo; Since then, he has built a body of work drawn from contemporary scenes across the American Southeast and beyond.
        </p>
        <p>
          Recurring themes include a tug-of-war between nature and man in which he tries not to take sides. His photographs are less concerned with spectacle than with accumulation &mdash; each image is a piece of a larger puzzle, relying on the others to reveal something greater. Ultimately, he&rsquo;s trying to capture the images that would otherwise seep into his subconscious.
        </p>
        <p class="text-muted-warm">
          He still takes all of his photos one at a time.
        </p>

        <div class="pt-4 mt-2 border-t border-rule flex flex-col gap-1.5 text-[11px] uppercase tracking-[0.14em] text-muted-warm">
          <a
            href="mailto:hello@fiftymillimeter.com"
            class="hover:text-ink"
          >hello@fiftymillimeter.com</a>
          <a
            href="https://instagram.com/fiftymillimeter_"
            target="_blank"
            rel="noopener"
            class="hover:text-ink"
          >@fiftymillimeter_</a>
          <a
            href="https://theprinttrade.com/p/ian-kennedy"
            target="_blank"
            rel="noopener"
            class="hover:text-ink"
          >the print trade</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "About - Fiftymillimeter",
  ogTitle: "About - Fiftymillimeter",
  description:
    "Ian Kennedy is a photographer based in Athens, Georgia, exploring the extraordinary within the ordinary through contemporary scenes from the Southeast and beyond.",
  ogDescription:
    "Ian Kennedy is a photographer based in Athens, Georgia, exploring the extraordinary within the ordinary through contemporary scenes from the Southeast and beyond.",
});
</script>
