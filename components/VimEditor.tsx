'use client'
import { useEffect, useRef, useState } from 'react'
import type { Post, Note, Project } from '@/lib/types'

type Mode = 'post' | 'note' | 'project'

interface Props {
  mode: Mode
  item?: Post | Note | Project | null
  index?: number | null
  onSave: (item: Post | Note | Project, index: number | null) => void
  onClose: () => void
}

function getContent(mode: Mode, item?: Post | Note | Project | null): string {
  if (mode === 'note') {
    const n = item as Note | undefined
    return n?.body ?? ''
  }
  if (mode === 'project') {
    const p = item as Project | undefined
    return `name: ${p?.name ?? ''}\ndesc: ${p?.desc ?? ''}\nstars: ${p?.stars ?? '0'}\nlang: ${p?.lang ?? ''}\nstatus: ${p?.status ?? 'active'}\nurl: ${p?.url ?? ''}\ndemo: ${p?.demo ?? ''}\ndocs: ${p?.docs ?? ''}\n\n${p?.body ?? ''}`
  }
  if (mode === 'post') {
    const p = item as Post | undefined
    const tags = (p?.tags ?? []).join(', ')
    return `---\ntitle: ${p?.title ?? ''}\ndate: ${p?.date ?? new Date().toISOString().slice(0, 10)}\nmin: ${p?.min ?? 5}\ndek: ${p?.dek ?? ''}\ntags: ${tags}\nslug: ${p?.slug ?? ''}\n---\n\n${p?.body ?? ''}`
  }
  return ''
}

function parseContent(mode: Mode, content: string, item?: Post | Note | Project | null): Post | Note | Project {
  if (mode === 'note') {
    const n = item as Note | undefined
    return { date: n?.date ?? new Date().toISOString().slice(0, 10), body: content.trim() }
  }
  if (mode === 'project') {
    const lines = content.split('\n')
    const fm: Record<string, string> = {}
    const bodyLines: string[] = []
    let inBody = false
    for (const line of lines) {
      if (!inBody && line === '') { inBody = true; continue }
      if (inBody) { bodyLines.push(line) }
      else { const [k, ...v] = line.split(':'); if (k?.trim()) fm[k.trim()] = v.join(':').trim() }
    }
    return {
      name:   fm.name   ?? '',
      desc:   fm.desc   ?? '',
      stars:  fm.stars  ?? '0',
      lang:   fm.lang   ?? '',
      status: (fm.status as 'active' | 'wip' | 'archived') ?? 'active',
      url:    fm.url    ?? '',
      demo:   fm.demo   ?? '',
      docs:   fm.docs   ?? '',
      body:   bodyLines.join('\n').trim(),
    }
  }
  // post
  const m = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (m) {
    const fm: Record<string, string> = {}
    m[1].split('\n').forEach(line => {
      const [k, ...v] = line.split(':')
      if (k?.trim()) fm[k.trim()] = v.join(':').trim()
    })
    const p = item as Post | undefined
    return {
      slug:  (fm.slug || p?.slug || (fm.title ?? 'new').toLowerCase().replace(/\s+/g, '-')).replace(/[\[\]"']/g, '').replace(/[^a-z0-9-]/g, ''),
      title: fm.title ?? '',
      date:  fm.date  ?? new Date().toISOString().slice(0, 10),
      min:   +(fm.min ?? 5),
      dek:   fm.dek   ?? '',
      tags:  (fm.tags ?? '').split(',').map(t => t.replace(/[\[\]"']/g, '').trim()).filter(Boolean),
      body:  m[2].trim(),
    }
  }
  return item as Post
}

const modeColors: Record<string, string> = {
  NORMAL:  'var(--nl-fg-2)',
  INSERT:  'var(--nl-accent)',
  VISUAL:  'var(--nl-info)',
  REPLACE: 'var(--nl-warn)',
}

export default function VimEditor({ mode, item, index = null, onSave, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const viewRef = useRef<any>(null)
  const [vimMode, setVimMode] = useState('NORMAL')

  const fname =
    mode === 'post'    ? `~/writing/${(item as Post)?.slug ?? 'new-post'}.md`
    : mode === 'note'    ? `~/notes/${(item as Note)?.date ?? 'new'}.md`
    : mode === 'project' ? `~/projects/${(item as Project)?.name ?? 'new'}.toml`
    : '~/.colophon'

  // close on Escape only when in NORMAL mode
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && vimMode === 'NORMAL') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [vimMode, onClose])

  useEffect(() => {
    if (!containerRef.current) return
    let destroyed = false

    ;(async () => {
      const { EditorView, keymap, lineNumbers, highlightActiveLine, drawSelection } = await import('@codemirror/view')
      const { EditorState }   = await import('@codemirror/state')
      const { markdown }      = await import('@codemirror/lang-markdown')
      // @replit/codemirror-vim is a CM5-compatible adapter around CM6
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { vim, Vim, getCM } = await import('@replit/codemirror-vim') as any
      const { defaultKeymap } = await import('@codemirror/commands')

      if (destroyed || !containerRef.current) return

      // ── Vim ex commands ────────────────────────────────────────────────
      // The callback receives a CM5-compatible adapter; use .getValue() to read content
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const commit = (cm: any) => {
        const content: string = cm.getValue()
        onSave(parseContent(mode, content, item), index ?? null)
      }
      Vim.defineEx('write', 'w',  (cm: unknown) => commit(cm))
      Vim.defineEx('quit',  'q',  () => onClose())
      Vim.defineEx('wq',    'wq', (cm: unknown) => { commit(cm); onClose() })

      // ── Vim mode tracking ──────────────────────────────────────────────
      // @replit/codemirror-vim fires 'vim-mode-change' on the underlying cm adapter
      // We hook into it via Vim.on after the view is created
      const modeChangeHandler = (info: { mode: string; subMode?: string }) => {
        const m = info.mode.toUpperCase()
        const s = info.subMode?.toUpperCase()
        setVimMode(s === 'LINEWISE' || s === 'BLOCKWISE' ? `V-${s.slice(0,4)}` : m)
      }

      const view = new EditorView({
        state: EditorState.create({
          doc: getContent(mode, item),
          extensions: [
            vim(),
            lineNumbers(),
            highlightActiveLine(),
            drawSelection(),
            markdown(),
            keymap.of(defaultKeymap),
            EditorView.theme({
              '&': {
                height: '100%',
                background: 'var(--nl-bg-0)',
                color: 'var(--nl-fg-0)',
                fontSize: '14px',
              },
              '.cm-content': {
                fontFamily: 'var(--nl-font-mono)',
                lineHeight: '1.75',
                padding: '16px 28px',
                caretColor: 'var(--nl-accent)',
              },
              '.cm-cursor, .cm-dropCursor': {
                borderLeftColor: 'var(--nl-accent)',
                borderLeftWidth: '2px',
              },
              '.cm-selectionBackground, ::selection': {
                background: 'var(--nl-selection) !important',
              },
              '.cm-gutters': {
                background: 'var(--nl-bg-1)',
                borderRight: '1px solid var(--nl-line-1)',
                color: 'var(--nl-fg-3)',
              },
              '.cm-activeLine': { background: 'rgba(255,255,255,0.02)' },
              '.cm-activeLineGutter': { background: 'rgba(255,255,255,0.04)' },
            }),
          ],
        }),
        parent: containerRef.current!,
      })

      // attach mode-change listener to the CM5 adapter, not Vim itself
      const adapter = getCM(view)
      if (adapter) {
        adapter.on('vim-mode-change', modeChangeHandler)
      }

      viewRef.current = view
      // slight delay so the DOM is settled before focus
      setTimeout(() => view.focus(), 50)
    })()

    return () => {
      destroyed = true
      if (viewRef.current) viewRef.current.destroy()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="nl-ed">
      <div className="nl-ed-top">
        <span style={{ color: 'var(--nl-accent)', fontWeight: 700 }}>null.log</span>
        <span style={{ color: 'var(--nl-fg-0)' }}>{fname}</span>
        <span style={{ marginLeft: 'auto', color: 'var(--nl-fg-3)', fontSize: 11 }}>
          :w&nbsp;save&nbsp;·&nbsp;:q&nbsp;quit&nbsp;·&nbsp;:wq&nbsp;save&amp;quit
        </span>
      </div>

      {/* CodeMirror mounts here */}
      <div ref={containerRef} className="nl-ed-body" />

      <div className="nl-ed-bot">
        <span
          className="nl-ed-mode"
          style={{ background: modeColors[vimMode.split('-')[0]] ?? 'var(--nl-fg-2)' }}
        >
          -- {vimMode} --
        </span>
        <span style={{ color: 'var(--nl-fg-3)' }}>{fname}</span>
        <span style={{ marginLeft: 'auto', color: 'var(--nl-fg-3)', fontSize: 11 }}>
          UTF-8&nbsp;·&nbsp;markdown
        </span>
      </div>
    </div>
  )
}
