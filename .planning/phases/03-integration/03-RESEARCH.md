# Phase 3: Integration - Research

**Researched:** 2026-01-29
**Domain:** Blog integration features (categories, RSS feeds, navigation)
**Confidence:** HIGH

## Summary

Phase 3 integrates the blog with the site's navigation system, adds category organization to posts, and provides RSS feed distribution. Research focused on three implementation domains:

1. **Category Display**: Standard patterns for showing categories on blog posts using badge/tag UI components
2. **RSS Feed Generation**: Server route approaches for RSS 2.0 feed generation in Nuxt applications
3. **Navigation Integration**: Adding blog links to existing Nuxt UI navigation components

The standard approach for Nuxt applications involves:
- Using the existing category field already in the schema (from Phase 2)
- Creating server routes for RSS feeds with the `feed` or `rss` npm packages
- Extending computed navigation arrays in existing header components

**Primary recommendation:** Use the `feed` npm package for RSS generation (TypeScript support, multiple format support), display categories with Nuxt UI Badge components, and extend the existing AppHeader navigationItems computed array.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| feed | ^4.2.2 | RSS/Atom feed generation | TypeScript support, maintains RSS 2.0/Atom/JSON Feed, actively maintained |
| Nuxt UI Badge | v3 | Category badge display | Already in project, consistent styling, accessible |
| Nuxt Server Routes | Built-in | RSS endpoint hosting | Native Nuxt feature, no external dependency |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| rss | ^1.2.2 | Alternative RSS generator | Simpler API if TypeScript not needed, Ghost uses it |
| gray-matter | Already installed | Frontmatter parsing | Already in use for custom blog API |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| feed | rss | rss package simpler but lacks TypeScript, last updated 9 years ago |
| Server route | @nuxtjs/feed module | Module adds dependency, server route more flexible for custom API |
| Badge component | Custom spans | Badge provides consistent theming, accessibility, variants |

**Installation:**
```bash
bun add feed
```

## Architecture Patterns

### Recommended Project Structure
```
server/
├── routes/
│   └── rss.xml.ts           # RSS feed endpoint (accessible at /rss.xml)
├── api/
│   └── content/
│       └── blog.get.ts       # Already exists, reuse for RSS data
app/
├── components/
│   ├── AppHeader.vue         # Update navigationItems array
│   └── BlogPostCard.vue      # Add category badge display
└── pages/
    └── blog/
        ├── index.vue         # Add category display
        └── [slug].vue        # Add category display
```

### Pattern 1: RSS Feed via Server Route
**What:** Create RSS feed at `/rss.xml` or `/blog/rss.xml` using Nuxt server routes
**When to use:** Standard for all RSS feeds - SEO-friendly URL, easy to discover

**Example:**
```typescript
// server/routes/rss.xml.ts or server/routes/blog/rss.xml.ts
// Source: https://github.com/jpmonette/feed + Nuxt server routes pattern
import { Feed } from 'feed'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.siteUrl

  // Create feed instance
  const feed = new Feed({
    title: 'Fiftymillimeter Blog',
    description: 'Photography stories and experiences from Ian Kennedy',
    id: `${baseUrl}/blog`,
    link: `${baseUrl}/blog`,
    language: 'en',
    favicon: `${baseUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Ian Kennedy`,
    feedLinks: {
      rss2: `${baseUrl}/rss.xml`,
    },
    author: {
      name: 'Ian Kennedy',
      email: 'contact@fiftymillimeter.com', // Optional
      link: baseUrl
    }
  })

  // Fetch posts using existing API logic
  const posts = await $fetch('/api/content/blog')

  // Add each post to feed
  for (const post of posts) {
    feed.addItem({
      title: post.title,
      id: `${baseUrl}${post.path}`,
      link: `${baseUrl}${post.path}`,
      description: post.description,
      date: new Date(post.date),
      // Optional: add category
      category: post.category ? [{ name: post.category }] : undefined
    })
  }

  // Set proper content type and return XML
  event.node.res.setHeader('content-type', 'application/rss+xml')
  return feed.rss2()
})
```

**Alternative using custom file reading (consistent with Phase 2 approach):**
```typescript
// server/routes/rss.xml.ts
import { Feed } from 'feed'
import { promises as fs } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.siteUrl

  const feed = new Feed({
    title: 'Fiftymillimeter Blog',
    description: 'Photography stories and experiences from Ian Kennedy',
    id: `${baseUrl}/blog`,
    link: `${baseUrl}/blog`,
    language: 'en',
    favicon: `${baseUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Ian Kennedy`,
    feedLinks: {
      rss2: `${baseUrl}/rss.xml`,
    },
    author: {
      name: 'Ian Kennedy',
      link: baseUrl
    }
  })

  // Read posts directly (consistent with existing blog API)
  const contentDir = join(process.cwd(), 'content', 'blog')
  const files = await fs.readdir(contentDir)
  const markdownFiles = files.filter(f => f.endsWith('.md'))

  const posts = await Promise.all(
    markdownFiles.map(async (file) => {
      const filePath = join(contentDir, file)
      const fileContent = await fs.readFile(filePath, 'utf-8')
      const { data } = matter(fileContent)
      const slug = file.replace(/\.md$/, '')

      return {
        ...data,
        slug,
        path: `/blog/${slug}`
      }
    })
  )

  // Sort by date (newest first)
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Add items to feed
  for (const post of posts) {
    feed.addItem({
      title: post.title,
      id: `${baseUrl}${post.path}`,
      link: `${baseUrl}${post.path}`,
      description: post.description,
      date: new Date(post.date),
      category: post.category ? [{ name: post.category }] : undefined
    })
  }

  event.node.res.setHeader('content-type', 'application/rss+xml')
  return feed.rss2()
})
```

### Pattern 2: Category Badge Display
**What:** Display post category as a badge/tag UI element
**When to use:** On both blog index cards and individual post pages

**Example:**
```vue
<!-- In BlogPostCard.vue -->
<template>
  <NuxtLink :to="post.path" class="group block p-6 border...">
    <!-- Category badge at top -->
    <div v-if="post.category" class="mb-3">
      <UBadge
        :label="post.category"
        color="primary"
        variant="soft"
        size="sm"
      />
    </div>

    <!-- Rest of card content -->
    <div class="mb-3">
      <h3 class="text-xl font-semibold...">{{ post.title }}</h3>
      <time :datetime="post.date" class="text-sm...">
        {{ formattedDate }}
      </time>
    </div>
    <p class="text-gray-600...">{{ post.description }}</p>
  </NuxtLink>
</template>
```

```vue
<!-- In blog/[slug].vue -->
<template>
  <div class="py-16 lg:py-24">
    <UContainer>
      <!-- Category badge before title -->
      <UBadge
        v-if="post.category"
        :label="post.category"
        color="primary"
        variant="soft"
        size="md"
        class="mb-4"
      />

      <h1 class="text-3xl font-bold mb-4">{{ post.title }}</h1>
      <time :datetime="post.date" class="text-gray-500 mb-8 block">
        {{ formattedDate }}
      </time>

      <!-- Post content -->
      <div v-html="post.html" class="prose dark:prose-invert" />
    </UContainer>
  </div>
</template>
```

### Pattern 3: Navigation Menu Extension
**What:** Add new link to existing computed navigation items array
**When to use:** Integrating new section into site navigation

**Example:**
```vue
<!-- app/components/AppHeader.vue -->
<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const route = useRoute();

// Add Blog to existing navigation items
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
  <UHeader toggle-side="right" mode="slideover" to="/">
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
```

### Anti-Patterns to Avoid

- **Don't create duplicate navigation arrays**: Use the same computed array for both desktop and mobile navigation (DRY principle)
- **Don't hardcode site URLs in RSS feeds**: Use `useRuntimeConfig().public.siteUrl` for environment flexibility
- **Don't use `serverQueryContent` with custom file-based blog**: Project already uses custom file reading with gray-matter, stay consistent
- **Don't add category filtering yet**: Out of scope for Phase 3 (would be Phase 4 feature)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| RSS XML generation | Custom XML string concatenation | `feed` or `rss` npm package | Handles escaping, namespaces, valid XML structure, RSS 2.0 spec compliance |
| Date formatting in XML | Manual ISO string conversion | `feed` package handles Date objects | RSS requires RFC-822 date format, not ISO 8601 |
| Category badge styling | Custom styled spans with Tailwind | UBadge component | Consistent theming, accessibility, dark mode, variants |
| XML content type headers | Manual header strings | Package handles or use standard `application/rss+xml` | Correct MIME type for RSS readers |
| RSS feed validation | Manual testing | W3C Feed Validator (https://validator.w3.org/feed/) | Catches spec violations, encoding issues |

**Key insight:** RSS 2.0 spec has nuances (date formats, XML escaping, required elements, GUID handling). Established packages handle edge cases that custom implementations miss.

## Common Pitfalls

### Pitfall 1: Incorrect RSS Feed URL Path
**What goes wrong:** Creating server route at `server/routes/blog/rss.xml.ts` makes feed accessible at `/blog/rss.xml`, but many RSS readers expect `/rss.xml` or `/feed.xml`

**Why it happens:** Natural assumption that blog RSS belongs under `/blog/` path

**How to avoid:**
- Use `server/routes/rss.xml.ts` for main feed (accessible at `/rss.xml`)
- OR use both locations and have one redirect to the other
- Add `<link rel="alternate" type="application/rss+xml">` in blog pages to auto-discovery

**Warning signs:** RSS readers can't find feed, manual URL entry required

### Pitfall 2: RSS Feed Not Pre-rendered for Static Hosting
**What goes wrong:** Server routes don't execute on static Cloudflare Pages unless pre-rendered, RSS feed returns 404 or tries to execute server code

**Why it happens:** Nuxt server routes are dynamic by default, `nuxt generate` doesn't pre-render them automatically

**How to avoid:**
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    prerender: {
      routes: ['/rss.xml']
    }
  }
})
```

**Warning signs:** RSS feed works in `bun run dev` but fails in production on Cloudflare Pages

**Note:** Current project uses `nitro.preset: 'cloudflare-module'` which supports server routes, but pre-rendering still recommended for performance

### Pitfall 3: Invalid XML Characters in RSS Content
**What goes wrong:** Blog post titles or descriptions contain unescaped `&`, `<`, `>` characters, breaking RSS XML parsing

**Why it happens:** Markdown content may include special characters, URLs with `&` in query params

**How to avoid:**
- Use `feed` or `rss` packages (handle escaping automatically)
- If hand-rolling: escape `&` → `&amp;`, `<` → `&lt;`, `>` → `&gt;`
- Validate feed with W3C validator before deploying

**Warning signs:** RSS readers show parsing errors, feed validation fails, some items don't display

### Pitfall 4: Wrong Date Format in RSS Items
**What goes wrong:** Using ISO 8601 dates (`2026-01-29T10:00:00Z`) instead of RFC-822 format, RSS readers misinterpret dates

**Why it happens:** ISO dates are standard in JSON APIs and JavaScript, but RSS 2.0 requires RFC-822

**How to avoid:**
- Use `feed` package's `date` property with Date objects (handles conversion)
- RFC-822 format example: `Wed, 29 Jan 2026 10:00:00 GMT`

**Warning signs:** Dates show as "Invalid" or wrong timezone in RSS readers

### Pitfall 5: Missing Absolute URLs in RSS Feed
**What goes wrong:** Using relative URLs (`/blog/post-slug`) in RSS items instead of absolute URLs (`https://fiftymillimeter.com/blog/post-slug`)

**Why it happens:** Internal app uses relative paths, easy to forget RSS readers need full URLs

**How to avoid:**
```typescript
const baseUrl = useRuntimeConfig().public.siteUrl
// Use: `${baseUrl}${post.path}` not just `post.path`
```

**Warning signs:** Links in RSS reader open wrong domain or don't work

### Pitfall 6: Category Display Without Fallback
**What goes wrong:** Category badge shows empty space or crashes when `post.category` is undefined/null

**Why it happens:** Category is optional field, not all posts have categories

**How to avoid:**
```vue
<UBadge v-if="post.category" :label="post.category" />
```
Always use `v-if` conditional rendering for optional fields

**Warning signs:** Empty badges, layout shifts, TypeScript errors

## Code Examples

Verified patterns from official sources:

### RSS Feed with TypeScript Types
```typescript
// server/routes/rss.xml.ts
// Source: https://github.com/jpmonette/feed
import { Feed } from 'feed'
import type { FeedOptions, Item } from 'feed'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.siteUrl

  const feedOptions: FeedOptions = {
    title: 'Fiftymillimeter Blog',
    description: 'Photography stories and experiences from Ian Kennedy',
    id: `${baseUrl}/blog`,
    link: `${baseUrl}/blog`,
    language: 'en',
    favicon: `${baseUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Ian Kennedy`,
    feedLinks: {
      rss2: `${baseUrl}/rss.xml`,
    },
    author: {
      name: 'Ian Kennedy',
      link: baseUrl
    }
  }

  const feed = new Feed(feedOptions)

  // Fetch posts (reuse existing API or file reading logic)
  const posts = await $fetch<any[]>('/api/content/blog')

  posts.forEach((post) => {
    const item: Item = {
      title: post.title,
      id: `${baseUrl}${post.path}`,
      link: `${baseUrl}${post.path}`,
      description: post.description,
      date: new Date(post.date),
    }

    if (post.category) {
      item.category = [{ name: post.category }]
    }

    feed.addItem(item)
  })

  event.node.res.setHeader('content-type', 'application/rss+xml')
  return feed.rss2()
})
```

### Category Badge Variants
```vue
<!-- Different badge styles for different contexts -->
<template>
  <!-- Soft variant for blog cards (subtle) -->
  <UBadge
    v-if="post.category"
    :label="post.category"
    color="primary"
    variant="soft"
    size="sm"
  />

  <!-- Outline variant for post pages (more prominent) -->
  <UBadge
    v-if="post.category"
    :label="post.category"
    color="primary"
    variant="outline"
    size="md"
  />

  <!-- Solid variant for emphasis -->
  <UBadge
    v-if="post.category"
    :label="post.category"
    color="secondary"
    variant="solid"
    size="sm"
  />
</template>
```

### Auto-Discovery Link for RSS
```vue
<!-- Add to app.vue or blog layout for RSS auto-discovery -->
<script setup lang="ts">
const config = useRuntimeConfig()

useHead({
  link: [
    {
      rel: 'alternate',
      type: 'application/rss+xml',
      title: 'Fiftymillimeter Blog RSS Feed',
      href: `${config.public.siteUrl}/rss.xml`
    }
  ]
})
</script>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| @nuxtjs/feed module | Server routes + feed package | Nuxt 3 (2022) | More control, less abstraction, TypeScript support |
| rss package | feed package | ~2018 | TypeScript definitions, multiple formats, active maintenance |
| Category as tag array | Single category string | Simplification trend | Easier UX, less decision fatigue |
| Custom XML generation | Dedicated RSS libraries | Always preferred | Spec compliance, security (XSS prevention) |

**Deprecated/outdated:**
- `@nuxtjs/feed` module: Nuxt 2 module, not compatible with Nuxt 3 server routes
- Hand-rolled XML: Security risk (XSS), spec compliance issues
- `serverQueryContent`: Not compatible with custom file-based content API (project uses gray-matter)

## Open Questions

Things that couldn't be fully resolved:

1. **RSS Feed URL Convention**
   - What we know: Both `/rss.xml` and `/blog/rss.xml` are valid, W3C validator accepts both
   - What's unclear: Which is more discoverable for RSS readers in 2026
   - Recommendation: Use `/rss.xml` (simpler, traditional) and add auto-discovery `<link>` tag in HTML

2. **Cloudflare Workers RSS Feed Pre-rendering**
   - What we know: Project uses `nitro.preset: 'cloudflare-module'` which supports server routes
   - What's unclear: Whether RSS route will work on Cloudflare Pages without pre-rendering
   - Recommendation: Add pre-rendering config as safety measure, test in preview deployment

3. **Category Color Mapping**
   - What we know: UBadge supports 7 colors (primary, secondary, success, info, warning, error, neutral)
   - What's unclear: Whether to assign specific colors to categories or use single color
   - Recommendation: Start with single color (primary/soft), add color mapping in future phase if needed

## Sources

### Primary (HIGH confidence)
- [Nuxt UI Badge Component](https://ui.nuxt.com/docs/components/badge) - Badge API, variants, colors
- [Nuxt UI NavigationMenu Component](https://ui.nuxt.com/docs/components/navigation-menu) - NavigationMenuItem type structure
- [RSS 2.0 Specification](https://www.rssboard.org/rss-specification) - Required channel/item elements
- [Feed npm package GitHub](https://github.com/jpmonette/feed) - Complete TypeScript API, examples
- [Create RSS Feed with Nuxt 3 (mokkapps.de)](https://mokkapps.de/blog/create-an-rss-feed-with-nuxt-3-and-nuxt-content-v2) - Server route pattern, pre-rendering

### Secondary (MEDIUM confidence)
- [RSS Feed with Nuxt & Nuxt Content (claytonchew.com)](https://claytonchew.com/article/how-to-create-rss-feed-with-nuxt-and-nuxt-content) - Alternative approach with rss package
- [Nuxt Deploy to Cloudflare](https://nuxt.com/deploy/cloudflare) - Cloudflare preset behavior
- [NuxtHub Pre-rendering](https://hub.nuxt.com/docs/recipes/pre-rendering) - Static generation routes
- [Badge UI Design (setproduct.com)](https://www.setproduct.com/blog/badge-ui-design) - Category badge UX patterns
- [Filter UX Best Practices (NN/G)](https://www.nngroup.com/articles/filter-categories-values/) - Category organization principles

### Tertiary (LOW confidence)
- W3C Feed Validator - Mentioned for validation but not directly accessed
- RSS package (dylangreene) - Found in searches but npm page access blocked, based on tutorial references
- Community discussions about Cloudflare Pages SSR - Mixed information, needs testing

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - feed package well-documented, Nuxt UI Badge official docs, server routes native
- Architecture: HIGH - Multiple verified tutorials show same patterns, official Nuxt docs confirm
- Pitfalls: MEDIUM - Common issues documented in tutorials/Stack Overflow, but Cloudflare-specific behavior needs testing
- Category display: HIGH - Official Nuxt UI docs, standard UX patterns
- RSS generation: HIGH - Official feed package docs, RSS 2.0 spec, multiple tutorials agree
- Navigation integration: HIGH - Official Nuxt UI docs, existing code pattern clear

**Research date:** 2026-01-29
**Valid until:** ~2026-02-28 (30 days - stable domain, unlikely to change)
