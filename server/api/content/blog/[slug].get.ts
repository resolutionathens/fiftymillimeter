import { promises as fs } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'
import { marked } from 'marked'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug parameter is required'
    })
  }

  const filePath = join(process.cwd(), 'content', 'blog', `${slug}.md`)

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const { data, content } = matter(fileContent)

    // Parse markdown to HTML
    const html = await marked.parse(content)

    return {
      ...data,
      path: `/blog/${slug}`,
      _path: `/blog/${slug}`,
      body: content,
      html
    }
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Post not found'
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load blog post'
    })
  }
})
