import { promises as fs } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'

export default defineEventHandler(async () => {
  const contentDir = join(process.cwd(), 'content', 'blog')

  try {
    const files = await fs.readdir(contentDir)
    const markdownFiles = files.filter(f => f.endsWith('.md'))

    const posts = await Promise.all(
      markdownFiles.map(async (file) => {
        const filePath = join(contentDir, file)
        const fileContent = await fs.readFile(filePath, 'utf-8')
        const { data, content } = matter(fileContent)
        const slug = file.replace(/\.md$/, '')

        return {
          ...data,
          path: `/blog/${slug}`,
          _path: `/blog/${slug}`,
          body: content
        }
      })
    )

    // Sort by date (newest first)
    posts.sort((a: any, b: any) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateB - dateA
    })

    return posts
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load blog posts'
    })
  }
})
