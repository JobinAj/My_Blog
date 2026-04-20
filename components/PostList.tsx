'use client'
import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import type { Post } from '@/lib/types'
import Tag from './Tag'
import AdminButton from './AdminButton'

function PostListInner({ posts }: { posts: Post[] }) {
  const searchParams = useSearchParams()
  const [q, setQ]             = useState('')
  const [activeTag, setActiveTag] = useState('')

  // seed active tag from URL ?tag=foo (from clicking tags on post detail page)
  useEffect(() => {
    const t = searchParams.get('tag') ?? ''
    setActiveTag(t)
  }, [searchParams])

  const filtered = useMemo(() => {
    return posts.filter(p => {
      const matchTag = !activeTag || p.tags.includes(activeTag)
      const matchQ   = !q || p.title.toLowerCase().includes(q.toLowerCase()) ||
                       p.dek.toLowerCase().includes(q.toLowerCase()) ||
                       p.tags.some(t => t.toLowerCase().includes(q.toLowerCase()))
      return matchTag && matchQ
    })
  }, [posts, q, activeTag])

  const allTags = useMemo(() => [...new Set(posts.flatMap(p => p.tags))].sort(), [posts])

  const clearFilter = () => { setQ(''); setActiveTag('') }

  return (
    <>
      {/* terminal grep search */}
      {posts.length > 0 && (
        <div className="nl-search-wrap" style={{ marginBottom: 16 }}>
          <span style={{ color: 'var(--nl-accent)', userSelect: 'none' }}>$</span>
          <span style={{ userSelect: 'none' }}>grep -i &quot;</span>
          <input
            className="nl-search-input"
            value={q}
            onChange={e => { setQ(e.target.value); setActiveTag('') }}
            placeholder="tag or keyword…"
            aria-label="Filter posts"
          />
          <span style={{ userSelect: 'none' }}>&quot;</span>
          {(q || activeTag) && (
            <button onClick={clearFilter} style={{
              background: 'none', border: 'none', color: 'var(--nl-fg-3)',
              cursor: 'pointer', fontFamily: 'var(--nl-font-mono)', fontSize: 11,
            }}>✕ clear</button>
          )}
        </div>
      )}

      {/* tag chips */}
      {allTags.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
          {allTags.map(t => (
            <Tag key={t} active={activeTag === t} onClick={() => {
              setActiveTag(activeTag === t ? '' : t); setQ('')
            }}>{t}</Tag>
          ))}
        </div>
      )}

      {/* results */}
      {filtered.length === 0 && posts.length > 0 ? (
        <div style={{ fontFamily: 'var(--nl-font-mono)', fontSize: 13, color: 'var(--nl-fg-3)', padding: '24px 0' }}>
          $ # no posts matching &quot;{q || activeTag}&quot;
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ fontFamily: 'var(--nl-font-mono)', fontSize: 13, color: 'var(--nl-fg-3)', padding: '24px 0' }}>
          $ # no posts yet — press Ctrl+Shift+A then &quot;+ new post&quot;
        </div>
      ) : filtered.map((p, i) => (
        <article key={p.slug} style={{
          position: 'relative', padding: '20px 0',
          borderBottom: '1px dashed var(--nl-line-1)',
          display: 'grid', gridTemplateColumns: '100px 1fr auto', gap: 24,
        }}>
          {/* stretched link covers the card (z-index 1) */}
          <Link href={`/writing/${p.slug}`} style={{ position: 'absolute', inset: 0, zIndex: 1 }} aria-label={p.title} />
          
          <div style={{ fontFamily: 'var(--nl-font-mono)', fontSize: 12, color: 'var(--nl-fg-3)', paddingTop: 4 }}>
            {p.date}
          </div>
          
          <div>
            <h2 style={{ margin: '0 0 8px', fontFamily: 'var(--nl-font-mono)', fontWeight: 600, fontSize: 22, color: 'var(--nl-fg-0)', letterSpacing: '-0.01em', lineHeight: 1.25 }}>
              {p.title}
            </h2>
            <p style={{ margin: '0 0 12px', fontFamily: 'var(--nl-font-sans)', fontSize: 16, color: 'var(--nl-fg-1)', lineHeight: 1.6, maxWidth: '62ch' }}>
              {p.dek}
            </p>
            {/* interactive elements must sit above the stretched link (z-index 2) */}
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 2 }}>
              {p.tags.map(t => (
                <Tag key={t} active={t === activeTag} onClick={() => { setActiveTag(t === activeTag ? '' : t); setQ('') }}>
                  {t}
                </Tag>
              ))}
              <span style={{ fontFamily: 'var(--nl-font-mono)', fontSize: 11, color: 'var(--nl-fg-3)', marginLeft: 8 }}>{p.min} min</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', paddingTop: 4, position: 'relative', zIndex: 2 }}>
            <AdminButton mode="post" item={p} index={posts.indexOf(p)} label="edit" isEdit />
          </div>
        </article>
      ))}
    </>
  )
}

export default function PostList({ posts }: { posts: Post[] }) {
  return (
    <Suspense fallback={null}>
      <PostListInner posts={posts} />
    </Suspense>
  )
}
