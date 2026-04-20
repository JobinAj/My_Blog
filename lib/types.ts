export interface Post {
  slug: string
  title: string
  date: string
  min: number
  dek: string
  tags: string[]
  body?: string
}

export interface Note {
  date: string
  body: string
}

export interface Project {
  name: string
  desc: string
  stars: string
  lang: string
  url?: string
  demo?: string
  docs?: string
  status?: 'active' | 'wip' | 'archived'
  body?: string
}

export interface BlogData {
  posts: Post[]
  notes: Note[]
  projects: Project[]
}
