import matter from 'gray-matter'
import { marked } from 'marked'

interface BlogPost {
  title: string
  date: string
  description?: string
  category?: string
  path: string
  _path: string
  body: string
  html: string
  slug: string
}

// Inline the blog content at build time since we can't use filesystem on Workers
const blogPostsRaw: Record<string, string> = {
  'first-post': `---
title: "This guy tweets"
date: "2026-01-30"
description: "Hello world where I share some old tweets."
category: "Personal"
---

Ash recently sent me a bunch of screenshots of old tweets.

Anyway, they seemed like as good a place to start as any. So here they are:

<img src="https://cdn.fiftymillimeter.com/blog/tweets/tweet-1.png" alt="Tweet 1" style="max-width: 600px; width: 100%;" />

<img src="https://cdn.fiftymillimeter.com/blog/tweets/tweet-2.png" alt="Tweet 2" style="max-width: 600px; width: 100%;" />

<img src="https://cdn.fiftymillimeter.com/blog/tweets/tweet-3.png" alt="Tweet 3" style="max-width: 600px; width: 100%;" />

<img src="https://cdn.fiftymillimeter.com/blog/tweets/tweet-4.png" alt="Tweet 4" style="max-width: 600px; width: 100%;" />

<img src="https://cdn.fiftymillimeter.com/blog/tweets/tweet-5.png" alt="Tweet 5" style="max-width: 600px; width: 100%;" />

<img src="https://cdn.fiftymillimeter.com/blog/tweets/tweet-6.png" alt="Tweet 6" style="max-width: 600px; width: 100%;" />

<img src="https://cdn.fiftymillimeter.com/blog/tweets/tweet-7.png" alt="Tweet 7" style="max-width: 600px; width: 100%;" />

<img src="https://cdn.fiftymillimeter.com/blog/tweets/tweet-8.png" alt="Tweet 8" style="max-width: 600px; width: 100%;" />

<img src="https://cdn.fiftymillimeter.com/blog/tweets/tweet-9.png" alt="Tweet 9" style="max-width: 600px; width: 100%;" />

<img src="https://cdn.fiftymillimeter.com/blog/tweets/tweet-10.png" alt="Tweet 10" style="max-width: 600px; width: 100%;" />

<img src="https://cdn.fiftymillimeter.com/blog/tweets/tweet-11.png" alt="Tweet 11" style="max-width: 600px; width: 100%;" />

<img src="https://cdn.fiftymillimeter.com/blog/tweets/tweet-12.png" alt="Tweet 12" style="max-width: 600px; width: 100%;" />

<img src="https://cdn.fiftymillimeter.com/blog/tweets/tweet-13.png" alt="Tweet 13" style="max-width: 600px; width: 100%;" />

<img src="https://cdn.fiftymillimeter.com/blog/tweets/tweet-14.png" alt="Tweet 14" style="max-width: 600px; width: 100%;" />

<img src="https://cdn.fiftymillimeter.com/blog/tweets/tweet-15.png" alt="Tweet 15" style="max-width: 600px; width: 100%;" />

<img src="https://cdn.fiftymillimeter.com/blog/tweets/tweet-16.png" alt="Tweet 16" style="max-width: 600px; width: 100%;" />

<img src="https://cdn.fiftymillimeter.com/blog/tweets/tweet-17.png" alt="Tweet 17" style="max-width: 600px; width: 100%;" />

<img src="https://cdn.fiftymillimeter.com/blog/tweets/tweet-18.png" alt="Tweet 18" style="max-width: 600px; width: 100%;" />

<img src="https://cdn.fiftymillimeter.com/blog/tweets/tweet-19.png" alt="Tweet 19" style="max-width: 600px; width: 100%;" />

<img src="https://cdn.fiftymillimeter.com/blog/tweets/tweet-20.png" alt="Tweet 20" style="max-width: 600px; width: 100%;" />

<img src="https://cdn.fiftymillimeter.com/blog/tweets/tweet-21.png" alt="Tweet 21" style="max-width: 600px; width: 100%;" />

<img src="https://cdn.fiftymillimeter.com/blog/tweets/tweet-22.png" alt="Tweet 22" style="max-width: 600px; width: 100%;" />

<img src="https://cdn.fiftymillimeter.com/blog/tweets/tweet-23.png" alt="Tweet 23" style="max-width: 600px; width: 100%;" />

<img src="https://cdn.fiftymillimeter.com/blog/tweets/tweet-24.png" alt="Tweet 24" style="max-width: 600px; width: 100%;" />

<img src="https://cdn.fiftymillimeter.com/blog/tweets/tweet-25.png" alt="Tweet 25" style="max-width: 600px; width: 100%;" />

<img src="https://cdn.fiftymillimeter.com/blog/tweets/tweet-26.png" alt="Tweet 26" style="max-width: 600px; width: 100%;" />

<img src="https://cdn.fiftymillimeter.com/blog/tweets/tweet-27.png" alt="Tweet 27" style="max-width: 600px; width: 100%;" />

<img src="https://cdn.fiftymillimeter.com/blog/tweets/tweet-28.png" alt="Tweet 28" style="max-width: 600px; width: 100%;" />

Maybe this blog will eventually turn into something more focused. Maybe it won't. For now, I built it.
`
}

// Process markdown content
function processMarkdown(raw: string, slug: string): BlogPost {
  const { data, content } = matter(raw)
  const html = marked.parse(content) as string

  return {
    title: data.title || '',
    date: data.date || '',
    description: data.description,
    category: data.category,
    path: `/blog/${slug}`,
    _path: `/blog/${slug}`,
    body: content,
    html,
    slug
  }
}

// All blog posts bundled at build time
export const blogPosts: BlogPost[] = Object.entries(blogPostsRaw)
  .map(([slug, raw]) => processMarkdown(raw, slug))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

// Get all posts (without heavy html/body fields)
export function getAllPosts(): Omit<BlogPost, 'html' | 'body'>[] {
  return blogPosts.map(({ html, body, ...rest }) => rest)
}

// Get single post by slug
export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug)
}
