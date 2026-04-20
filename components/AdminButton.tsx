'use client'
import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { saveBlogData, getBlogData } from '@/lib/supabase'
import type { Post, Note, Project } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { useAdmin } from './AdminProvider'

const VimEditor = dynamic(() => import('./VimEditor'), { ssr: false })

type Mode = 'post' | 'note' | 'project'

interface Props {
  mode: Mode
  item?: Post | Note | Project | null
  index?: number | null
  label: string
  isEdit?: boolean
}

export default function AdminButton({ mode, item = null, index = null, label, isEdit = false }: Props) {
  const { isAdmin } = useAdmin()
  const [open, setOpen]     = useState(false)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  // ⚠ All hooks MUST be called before any early return (Rules of Hooks)
  const handleSave = useCallback(async (newItem: Post | Note | Project, idx: number | null) => {
    setSaving(true)
    try {
      const data = await getBlogData()
      if (mode === 'post') {
        const p = newItem as Post
        const i = data.posts.findIndex(x => x.slug === ((item as Post)?.slug ?? p.slug))
        if (i >= 0) data.posts[i] = p; else data.posts.unshift(p)
      }
      if (mode === 'note') {
        const n = newItem as Note
        if (idx !== null && idx >= 0) data.notes[idx] = n; else data.notes.unshift(n)
      }
      if (mode === 'project') {
        const p = newItem as Project
        const i = data.projects.findIndex(x => x.name === ((item as Project)?.name ?? p.name))
        if (i >= 0) data.projects[i] = p; else data.projects.push(p)
      }
      await saveBlogData(data)
      setOpen(false)
      router.refresh()
    } finally {
      setSaving(false)
    }
  }, [mode, item, router])

  // guard AFTER all hooks — safe to early-return here
  if (!isAdmin) return null

  return (
    <>
      <button
        className={isEdit ? 'nl-ebtn' : 'nl-newbtn'}
        onClick={() => setOpen(true)}
        disabled={saving}
      >
        {saving ? 'saving…' : label}
      </button>
      {open && (
        <VimEditor
          mode={mode}
          item={item}
          index={index}
          onSave={handleSave}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
