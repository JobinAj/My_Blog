import { getBlogData } from '@/lib/supabase'
import type { Metadata } from 'next'
import AdminButton from '@/components/AdminButton'

export const metadata: Metadata = { title: 'notes', description: 'Short things I found out and want to remember.' }
export const revalidate = 0

export default async function NotesPage() {
  const { notes } = await getBlogData()

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ fontFamily: 'var(--nl-font-mono)', fontSize: 12, color: 'var(--nl-fg-2)', marginBottom: 12 }}>
        <span style={{ color: 'var(--nl-accent)' }}>$</span>&nbsp;tail -f ~/notes.log
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h1 style={{ fontFamily: 'var(--nl-font-mono)', fontWeight: 700, fontSize: 36, color: 'var(--nl-fg-0)', letterSpacing: '-0.01em' }}>
          notes
        </h1>
        <AdminButton mode="note" label="+ new note" />
      </div>
      <p style={{ marginBottom: 40, fontFamily: 'var(--nl-font-sans)', fontSize: 16, color: 'var(--nl-fg-2)', lineHeight: 1.6, maxWidth: '60ch' }}>
        Short things I found out and want to remember. No editing pass, no dek. Reverse chronological.
      </p>

      {notes.length === 0 ? (
        <div style={{ fontFamily: 'var(--nl-font-mono)', fontSize: 12, color: 'var(--nl-fg-3)', padding: '32px 0' }}>
          $ # no notes yet — click &quot;+ new note&quot; above
        </div>
      ) : notes.map((n, i) => (
        <div key={i} className="nl-row" style={{ padding: '16px 0', borderBottom: '1px dashed var(--nl-line-1)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: 'var(--nl-font-mono)', fontSize: 11, color: 'var(--nl-fg-3)', marginBottom: 6, letterSpacing: '0.04em' }}>
              <span style={{ color: 'var(--nl-accent)' }}>&gt;</span>&nbsp;{n.date}
            </div>
            <div style={{ fontFamily: 'var(--nl-font-sans)', fontSize: 15, lineHeight: 1.6, maxWidth: '60ch', color: 'var(--nl-fg-1)' }}>
              {n.body}
            </div>
          </div>
          <AdminButton mode="note" item={n} index={i} label="edit" isEdit />
        </div>
      ))}
    </div>
  )
}
