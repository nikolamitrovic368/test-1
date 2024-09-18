import { fetchSanity } from '@/sanity/fetch'
import { blogQuery, BlogType } from '@/sanity/queries/pages/blog.query'

export const fetchBlogData = (slug: string) =>
  fetchSanity<BlogType>(blogQuery, { tags: ['blog'], params: { slug } })
