import { Feed } from 'feed'

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

  // Fetch posts from existing API
  const posts = await $fetch<any[]>('/api/content/blog')

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
