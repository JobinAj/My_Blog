import { getBlogData } from '@/lib/supabase'
import type { Metadata } from 'next'
import Link from 'next/link'
import AdminButton from '@/components/AdminButton'

export const metadata: Metadata = { title: 'projects', description: 'Things I\'ve built and maintained.' }
export const revalidate = 0

export default async function ProjectsPage() {
  const { projects } = await getBlogData()

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ fontFamily: 'var(--nl-font-mono)', fontSize: 12, color: 'var(--nl-fg-2)', marginBottom: 12 }}>
        <span style={{ color: 'var(--nl-accent)' }}>$</span>&nbsp;ls -la ~/projects
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h1 style={{ fontFamily: 'var(--nl-font-mono)', fontWeight: 700, fontSize: 36, color: 'var(--nl-fg-0)', letterSpacing: '-0.01em' }}>
          projects
        </h1>
        <AdminButton mode="project" label="+ new project" />
      </div>
      <p style={{ marginBottom: 36, fontFamily: 'var(--nl-font-sans)', fontSize: 16, color: 'var(--nl-fg-2)', lineHeight: 1.6, maxWidth: '60ch' }}>
        Things I&apos;ve built and maintained. Most are small. A few are not.
      </p>

      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--nl-line-2)' }}>
            {['name', 'description', '★', 'lang', ''].map(h => {
              let w;
              if (h === 'name') w = 240;
              else if (h === '★' || h === 'lang') w = 60;
              else if (h === '') w = 50; // admin button col

              return (
                <th key={h} style={{
                  width: w,
                  padding: '10px 0', textAlign: h === '★' ? 'right' : 'left',
                  fontFamily: 'var(--nl-font-mono)', fontSize: 10, textTransform: 'uppercase',
                  letterSpacing: '0.08em', color: 'var(--nl-fg-3)', fontWeight: 500,
                  paddingLeft: h === 'description' || h === 'lang' ? 16 : 0,
                }}>{h}</th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {projects.length === 0 ? (
            <tr><td colSpan={5} style={{ fontFamily: 'var(--nl-font-mono)', fontSize: 12, color: 'var(--nl-fg-3)', padding: '32px 0' }}>
              $ # no projects yet — click &quot;+ new project&quot; above
            </td></tr>
          ) : projects.map((p, i) => (
            <tr key={p.name} className="nl-row" style={{ position: 'relative', borderBottom: '1px dashed var(--nl-line-1)' }}>

              {/* col 1: NAME — stretched link lives here */}
              <td style={{
                padding: '12px 16px 12px 0',
                fontFamily: 'var(--nl-font-mono)', fontSize: 13, color: 'var(--nl-accent)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                position: 'relative',
              }}>
                {/* stretched link covers the whole row (z-index 1) */}
                <Link
                  href={`/projects/${encodeURIComponent(p.name)}`}
                  style={{ position: 'absolute', inset: '-12px -9999px', zIndex: 1 }}
                  aria-label={p.name}
                />
                {p.name}
              </td>

              {/* col 2: DESCRIPTION — truncated */}
              <td style={{
                padding: '12px 16px', fontFamily: 'var(--nl-font-sans)', fontSize: 14,
                color: 'var(--nl-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                maxWidth: 0, /* forces ellipsis in fixed table */
              }}>
                {p.desc}
              </td>

              {/* col 3: STARS */}
              <td style={{
                padding: '12px 0', fontFamily: 'var(--nl-font-mono)', fontSize: 11,
                color: 'var(--nl-fg-3)', textAlign: 'right', whiteSpace: 'nowrap',
              }}>
                {p.stars ? `${p.stars} ★` : ''}
              </td>

              {/* col 4: LANG */}
              <td style={{
                padding: '12px 0 12px 16px', fontFamily: 'var(--nl-font-mono)',
                fontSize: 11, color: 'var(--nl-fg-2)', whiteSpace: 'nowrap',
              }}>
                {p.lang}
              </td>

              {/* col 5: admin edit button */}
              <td style={{ padding: '12px 0', position: 'relative', zIndex: 2, textAlign: 'right' }}>
                <AdminButton mode="project" item={p} index={i} label="edit" isEdit />
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
