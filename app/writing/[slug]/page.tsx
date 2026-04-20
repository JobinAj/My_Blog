import { getBlogData } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import AdminButton from '@/components/AdminButton'
import { renderMarkdown } from '@/lib/markdown'
import CodeCopyButtons from '@/components/CodeCopyButtons'
import ReadingProgress from '@/components/ReadingProgress'
import PostNav from '@/components/PostNav'

export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { posts } = await getBlogData()
  const post = posts.find(p => p.slug === slug)
  if (!post) return { title: 'Not Found' }
  return {
    title: post.title,
    description: post.dek,
    openGraph: {
      title: post.title,
      description: post.dek,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { posts } = await getBlogData()
  const idx  = posts.findIndex(p => p.slug === slug)
  const post = posts[idx]
  if (!post) notFound()

  // ordered newest-first → higher index = older
  const prevPost = posts[idx + 1] ?? null   // older — left arrow
  const nextPost = posts[idx - 1] ?? null   // newer — right arrow

  const bodyHtml = post.body ? renderMarkdown(post.body) : null

  const mono = 'var(--nl-font-mono)'
  const sans = 'var(--nl-font-sans)'

  return (
    <>
      <ReadingProgress />

      <article style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* ── back nav ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <Link href="/" style={{ fontFamily: mono, fontSize: 13, color: 'var(--nl-fg-3)', textDecoration: 'none', transition: 'color 80ms' }}>
            <span style={{ color: 'var(--nl-accent)' }}>$</span> cd ../writing
          </Link>
          <AdminButton mode="post" item={post} index={idx} label="edit in vim" />
        </div>

        {/* ── metadata row ── */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 20, fontFamily: mono, fontSize: 12, color: 'var(--nl-fg-3)' }}>
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.min} min read</span>
          <span>·</span>
          {/* clickable tags — link back to / with ?tag=x so PostList pre-filters */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {post.tags.map(t => (
              <Link key={t} href={`/?tag=${encodeURIComponent(t)}`} style={{
                fontFamily: mono, fontSize: 11, padding: '2px 8px', borderRadius: 999,
                border: '1px solid var(--nl-line-2)', color: 'var(--nl-fg-2)',
                textDecoration: 'none', transition: 'color 80ms, border-color 80ms',
              }}>
                #{t}
              </Link>
            ))}
          </div>
        </div>

        {/* ── title ── */}
        <h1 style={{
          margin: '0 0 12px', fontFamily: mono, fontWeight: 700,
          fontSize: 'clamp(26px, 5vw, 38px)', color: 'var(--nl-fg-0)',
          letterSpacing: '-0.02em', lineHeight: 1.15,
        }}>
          {post.title}
          <span className="nl-cursor" style={{ display: 'inline-block', width: 12, height: '0.8em', background: 'var(--nl-accent)', marginLeft: 8, verticalAlign: '-0.1em' }} />
        </h1>

        {/* ── dek / lead ── */}
        {post.dek && (
          <p style={{
            margin: '0 0 40px', fontFamily: sans, fontSize: 18, lineHeight: 1.6,
            color: 'var(--nl-fg-2)', borderLeft: '2px solid var(--nl-accent)',
            paddingLeft: 16, maxWidth: '68ch',
          }}>
            {post.dek}
          </p>
        )}

        {/* ── body ── */}
        <div
          className="prose"
          style={{ fontFamily: sans, fontSize: 17, lineHeight: 1.8, color: 'var(--nl-fg-1)', maxWidth: '72ch' }}
          {...(bodyHtml ? { dangerouslySetInnerHTML: { __html: bodyHtml } } : {})}
        >
          {!bodyHtml && (
            <p style={{ color: 'var(--nl-fg-3)', fontStyle: 'italic', fontFamily: mono, fontSize: 13 }}>
              $ # no content yet — click &quot;edit in vim&quot; above to write the post body.
            </p>
          )}
        </div>

        <CodeCopyButtons />

        {/* ── sign-off ── */}
        <p style={{ marginTop: 48, fontFamily: mono, fontSize: 13, color: 'var(--nl-fg-3)' }}>-- null</p>

        {/* ── prev / next ── */}
        <PostNav prev={prevPost} next={nextPost} />
      </article>
    </>
  )
}
