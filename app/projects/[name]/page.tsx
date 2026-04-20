import { getBlogData } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import AdminButton from '@/components/AdminButton'
import { renderMarkdown } from '@/lib/markdown'
import CodeCopyButtons from '@/components/CodeCopyButtons'
import ReadingProgress from '@/components/ReadingProgress'

export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params
  const { projects } = await getBlogData()
  const project = projects.find(p => p.name === decodeURIComponent(name))
  if (!project) return { title: 'Not Found' }
  return {
    title: project.name,
    description: project.desc,
    openGraph: { title: project.name, description: project.desc, type: 'website' },
  }
}

const statusConfig = {
  active:   { label: 'active',   color: 'var(--nl-accent)',  bg: 'var(--nl-accent-wash)',  border: 'var(--nl-accent-line)' },
  wip:      { label: 'wip',      color: 'var(--nl-warn)',    bg: 'rgba(255,176,32,0.08)',  border: 'rgba(255,176,32,0.25)' },
  archived: { label: 'archived', color: 'var(--nl-fg-3)',    bg: 'transparent',            border: 'var(--nl-line-2)' },
}

export default async function ProjectPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const { projects } = await getBlogData()
  const project = projects.find(p => p.name === decodeURIComponent(name))
  const idx     = projects.findIndex(p => p.name === decodeURIComponent(name))
  if (!project) notFound()

  const bodyHtml = project.body ? renderMarkdown(project.body) : null
  const status   = statusConfig[project.status ?? 'active'] ?? statusConfig.active
  const mono     = 'var(--nl-font-mono)'
  const sans     = 'var(--nl-font-sans)'

  // only render links that exist
  const links: { label: string; href: string; icon: string }[] = []
  if (project.url)  links.push({ label: 'git clone', href: project.url,  icon: '$' })
  if (project.demo) links.push({ label: 'live demo', href: project.demo, icon: '↗' })
  if (project.docs) links.push({ label: 'docs',      href: project.docs, icon: '↗' })

  return (
    <>
      <ReadingProgress />

      <article style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* ── back nav ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <Link href="/projects" style={{ fontFamily: mono, fontSize: 13, color: 'var(--nl-fg-3)', textDecoration: 'none' }}>
            <span style={{ color: 'var(--nl-accent)' }}>$</span> cd ../projects
          </Link>
          <AdminButton mode="project" item={project} index={idx} label="edit in vim" />
        </div>

        {/* ── metadata row ── */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20, fontFamily: mono, fontSize: 12 }}>
          {/* status badge */}
          <span style={{
            padding: '2px 10px', borderRadius: 2,
            border: `1px solid ${status.border}`,
            color: status.color, background: status.bg,
            fontSize: 11, letterSpacing: '0.04em',
          }}>
            {status.label}
          </span>
          {project.lang && <span style={{ color: 'var(--nl-fg-2)' }}>lang: {project.lang}</span>}
          {project.stars && <span style={{ color: 'var(--nl-fg-3)' }}>★ {project.stars}</span>}
        </div>

        {/* ── title ── */}
        <h1 style={{
          margin: '0 0 20px', fontFamily: mono, fontWeight: 700,
          fontSize: 'clamp(26px, 5vw, 38px)', color: 'var(--nl-fg-0)',
          letterSpacing: '-0.02em', lineHeight: 1.15,
        }}>
          {project.name}
          <span className="nl-cursor" style={{ display: 'inline-block', width: 12, height: '0.8em', background: 'var(--nl-accent)', marginLeft: 8, verticalAlign: '-0.1em' }} />
        </h1>

        {/* ── short desc ── */}
        <p style={{
          margin: '0 0 32px', fontFamily: sans, fontSize: 18, lineHeight: 1.6,
          color: 'var(--nl-fg-1)', borderLeft: '2px solid var(--nl-accent)',
          paddingLeft: 16, maxWidth: '68ch',
        }}>
          {project.desc}
        </p>

        {/* ── links row ── */}
        {links.length > 0 && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 40 }}>
            {links.map(l => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" style={{
                fontFamily: mono, fontSize: 12, padding: '6px 16px',
                background: 'var(--nl-bg-1)', border: '1px solid var(--nl-line-2)',
                borderRadius: 2, color: 'var(--nl-fg-1)', textDecoration: 'none',
                transition: 'border-color 80ms, color 80ms',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                <span style={{ color: 'var(--nl-accent)' }}>{l.icon}</span> {l.label}
              </a>
            ))}
          </div>
        )}

        {/* ── body ── */}
        <div
          className="prose"
          style={{ fontFamily: sans, fontSize: 17, lineHeight: 1.8, color: 'var(--nl-fg-1)', maxWidth: '72ch' }}
          {...(bodyHtml ? { dangerouslySetInnerHTML: { __html: bodyHtml } } : {})}
        >
          {!bodyHtml && (
            <p style={{ color: 'var(--nl-fg-3)', fontStyle: 'italic', fontFamily: mono, fontSize: 13 }}>
              $ # no detail yet — click &quot;edit in vim&quot; above to add content.
            </p>
          )}
        </div>

        <CodeCopyButtons />

        {/* ── back link at bottom ── */}
        <div style={{ marginTop: 64, paddingTop: 24, borderTop: '1px solid var(--nl-line-1)' }}>
          <Link href="/projects" style={{ fontFamily: mono, fontSize: 13, color: 'var(--nl-fg-3)', textDecoration: 'none' }}>
            <span style={{ color: 'var(--nl-accent)' }}>$</span> ls ../projects
          </Link>
        </div>
      </article>
    </>
  )
}
