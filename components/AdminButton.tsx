'use client'
import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
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

  // ⚠ All hooks must be called before early return (Rules of Hooks)
  const handleSave = useCallback(async (newItem: Post | Note | Project, idx: number | null) => {
    setSaving(true)
    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          mode,
          item: newItem,
          // pass original identifiers so the server can find the existing record
          existingSlug: mode === 'post'    ? (item as Post)?.slug       : undefined,
          existingName: mode === 'project' ? (item as Project)?.name    : undefined,
          index: idx,
        }),
      })

      if (res.status === 401) {
        // session expired — redirect to login
        router.push('/admin')
        return
      }

      if (!res.ok) {
        console.error('Save failed', await res.text())
        return
      }

      setOpen(false)
      router.refresh()
    } finally {
      setSaving(false)
    }
  }, [mode, item, router])

  // guard AFTER all hooks
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
