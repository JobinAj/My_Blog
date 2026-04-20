import { createClient } from '@supabase/supabase-js'
import type { BlogData } from './types'

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(URL, KEY)

export async function getBlogData(): Promise<BlogData> {
  try {
    const { data, error } = await supabase
      .from('blog_data')
      .select('*')
      .eq('id', 1)
      .single()
    if (error || !data) return { posts: [], notes: [], projects: [] }
    return {
      posts:    data.posts    ?? [],
      notes:    data.notes    ?? [],
      projects: data.projects ?? [],
    }
  } catch {
    return { posts: [], notes: [], projects: [] }
  }
}

export async function saveBlogData(payload: BlogData) {
  return supabase.from('blog_data').upsert({ id: 1, ...payload })
}
