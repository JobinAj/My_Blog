import { getBlogData } from '@/lib/supabase'
import type { Metadata } from 'next'
import AdminButton from '@/components/AdminButton'
import PostList from '@/components/PostList'

export const metadata: Metadata = {
  title: 'null.log',
  description: 'A log of things reverse-engineered, broken, rebuilt, or worth writing down.',
}
export const revalidate = 0

export default async function HomePage() {
  const { posts } = await getBlogData()

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }}>

      {/* ── author bio / whoami ── */}
      <section style={{ marginBottom: 56 }}>
        <div style={{ fontFamily: 'var(--nl-font-mono)', fontSize: 12, color: 'var(--nl-fg-2)', marginBottom: 12 }}>
          <span style={{ color: 'var(--nl-accent)' }}>$</span>&nbsp;whoami
        </div>
        <h1 style={{
          margin: '0 0 20px', fontFamily: 'var(--nl-font-mono)', fontWeight: 700,
          fontSize: 42, color: 'var(--nl-fg-0)', letterSpacing: '-0.02em', lineHeight: 1.1, maxWidth: '22ch',
        }}>
          writes from the wire
          <span className="nl-cursor" style={{
            display: 'inline-block', width: 14, height: 36,
            background: 'var(--nl-accent)', marginLeft: 8, verticalAlign: '-6px',
          }} />
        </h1>

        {/* intro — target 65–75 chars per line */}
        <p style={{
          margin: '0 0 28px',
          fontFamily: 'var(--nl-font-sans)', fontSize: 18, lineHeight: 1.7,
          color: 'var(--nl-fg-1)', maxWidth: '70ch',
        }}>
          A log of things I&apos;ve reverse-engineered, broken, rebuilt, or had to read twice.
          Mostly Go, networking, and security. No newsletter. No affiliates.
        </p>

        {/* author bio card */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16,
          padding: '16px 20px',
          background: 'var(--nl-bg-1)',
          border: '1px solid var(--nl-line-1)',
          borderRadius: 2,
          maxWidth: '60ch',
        }}>
          {/* avatar placeholder — ASCII art initials */}
          <div style={{
            width: 44, height: 44, flexShrink: 0,
            background: 'var(--nl-accent-wash)',
            border: '1px solid var(--nl-accent-line)',
            borderRadius: 2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--nl-font-mono)', fontSize: 18, fontWeight: 700,
            color: 'var(--nl-accent)',
          }}>
            ~
          </div>
          <div>
            <div style={{ fontFamily: 'var(--nl-font-mono)', fontSize: 14, color: 'var(--nl-fg-0)', fontWeight: 600 }}>
              null
            </div>
            <div style={{ fontFamily: 'var(--nl-font-sans)', fontSize: 14, color: 'var(--nl-fg-2)', marginTop: 2 }}>
              Engineer · Go · Networks · Security
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
              {[['github', '#'], ['mastodon', '#'], ['rss', '/feed.xml']].map(([label, href]) => (
                <a key={label} href={href} style={{
                  fontFamily: 'var(--nl-font-mono)', fontSize: 11, color: 'var(--nl-fg-3)',
                  textDecoration: 'none', borderBottom: '1px solid var(--nl-line-2)',
                  transition: 'color 80ms, border-color 80ms',
                }}>{label}</a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── writing section ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--nl-font-mono)', fontSize: 11, color: 'var(--nl-fg-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          § writing
        </div>
        <div style={{ flex: 1, height: 1, background: 'var(--nl-line-1)' }} />
        <AdminButton mode="post" label="+ new post" />
        <div style={{ fontFamily: 'var(--nl-font-mono)', fontSize: 11, color: 'var(--nl-fg-3)' }}>
          {posts.length} posts
        </div>
      </div>

      {/* tag search + post list — client component */}
      <PostList posts={posts} />
    </div>
  )
}
