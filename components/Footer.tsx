'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAdmin } from './AdminProvider'

export default function Footer() {
  const { isAdmin, refresh } = useAdmin()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
    refresh()
    router.refresh()
  }

  return (
    <footer style={{ borderTop: '1px solid var(--nl-line-1)', marginTop: 96, background: 'var(--nl-bg-0)' }}>
      <div style={{
        maxWidth: 1120, margin: '0 auto', padding: '24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ fontFamily: 'var(--nl-font-mono)', fontSize: 12, color: 'var(--nl-fg-2)' }}>
          <span style={{ color: 'var(--nl-accent)' }}>$</span>&nbsp;
          <span>cat /dev/thoughts &gt; null.log</span>
        </div>
        <div style={{ display: 'flex', gap: 12, fontFamily: 'var(--nl-font-mono)', fontSize: 12, alignItems: 'center' }}>
          {[['rss', '/feed.xml'], ['github', 'https://github.com/JobinAj/']].map(([label, href]) => (
            <a key={label} href={href} className="nl-bio-link">{label}</a>
          ))}
          <span style={{ color: 'var(--nl-fg-3)' }}>·</span>
          <span style={{ color: 'var(--nl-fg-3)' }}>© {new Date().getFullYear()}</span>
          <span style={{ color: 'var(--nl-fg-3)' }}>·</span>
          {isAdmin ? (
            <button
              onClick={handleLogout}
              title="Logout from admin"
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                fontFamily: 'var(--nl-font-mono)', fontSize: 11,
                color: 'var(--nl-accent)',
              }}
            >
              ⚡ logout
            </button>
          ) : (
            <Link
              href="/admin"
              title="Admin login"
              style={{
                fontFamily: 'var(--nl-font-mono)', fontSize: 11,
                color: 'var(--nl-fg-3)', textDecoration: 'none',
                opacity: 0.4, transition: 'opacity 120ms',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.4')}
            >
              ⚙
            </Link>
          )}
        </div>
      </div>
    </footer>
  )
}
