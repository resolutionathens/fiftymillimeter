import { getAllPosts } from '../../utils/blog-content'

export default defineEventHandler(() => {
  return getAllPosts()
})
