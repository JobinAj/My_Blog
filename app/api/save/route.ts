import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getBlogData, saveBlogData } from '@/lib/supabase'
import type { Post, Note, Project } from '@/lib/types'

export async function POST(req: NextRequest) {
  // ── auth check ──────────────────────────────────────────────
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { mode, item, existingSlug, existingName, index } = await req.json()

  // ── fetch current data ───────────────────────────────────────
  const data = await getBlogData()

  // ── merge item ───────────────────────────────────────────────
  if (mode === 'post') {
    const p = item as Post
    const i = data.posts.findIndex(x => x.slug === (existingSlug ?? p.slug))
    if (i >= 0) data.posts[i] = p; else data.posts.unshift(p)
  }

  if (mode === 'note') {
    const n = item as Note
    const idx = typeof index === 'number' && index >= 0 ? index : -1
    if (idx >= 0) data.notes[idx] = n; else data.notes.unshift(n)
  }

  if (mode === 'project') {
    const p = item as Project
    const i = data.projects.findIndex(x => x.name === (existingName ?? p.name))
    if (i >= 0) data.projects[i] = p; else data.projects.push(p)
  }

  // ── persist ──────────────────────────────────────────────────
  const { error } = await saveBlogData(data)
  if (error) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
