import Link from 'next/link'
import type { Post } from '@/lib/types'

interface Props {
  /** older post — shown on the left with ← */
  prev: Post | null
  /** newer post — shown on the right with → */
  next: Post | null
}

export default function PostNav({ prev, next }: Props) {
  if (!prev && !next) return null

  const linkStyle = {
    fontFamily: 'var(--nl-font-mono)' as const,
    fontSize: 13,
    color: 'var(--nl-fg-1)' as const,
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 4,
    maxWidth: '40ch',
    padding: '14px 0',
    transition: 'color 80ms',
  }
  const labelStyle = {
    fontSize: 10, letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: 'var(--nl-fg-3)',
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'stretch',
      marginTop: 64, paddingTop: 24,
      borderTop: '1px solid var(--nl-line-1)',
      gap: 24,
    }}>
      {prev ? (
        <Link href={`/writing/${prev.slug}`} style={linkStyle}>
          <span style={labelStyle}>← older</span>
          <span style={{ color: 'var(--nl-fg-0)', fontWeight: 500 }}
            className="post-nav-title">
            {prev.title}
          </span>
        </Link>
      ) : <div />}

      {next ? (
        <Link href={`/writing/${next.slug}`} style={{ ...linkStyle, alignItems: 'flex-end', textAlign: 'right' }}>
          <span style={labelStyle}>newer →</span>
          <span style={{ color: 'var(--nl-fg-0)', fontWeight: 500 }}>
            {next.title}
          </span>
        </Link>
      ) : <div />}
    </div>
  )
}
