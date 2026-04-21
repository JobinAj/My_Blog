'use client'
import { useAdmin } from './AdminProvider'

export default function Footer() {
  const { isAdmin, toggle } = useAdmin()

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
            <a key={label} href={href} style={{
              color: 'var(--nl-fg-1)', textDecoration: 'none',
              borderBottom: '1px solid var(--nl-accent-line)',
            }}>{label}</a>
          ))}
          <span style={{ color: 'var(--nl-fg-3)' }}>·</span>
          <span style={{ color: 'var(--nl-fg-3)' }}>© {new Date().getFullYear()}</span>
          <span style={{ color: 'var(--nl-fg-3)' }}>·</span>
          {/* admin toggle — subtle, only you know it's there */}
          <button
            onClick={toggle}
            title={isAdmin ? 'Exit admin mode' : 'Enter admin mode (or Ctrl+Shift+A)'}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              fontFamily: 'var(--nl-font-mono)', fontSize: 11,
              color: isAdmin ? 'var(--nl-accent)' : 'var(--nl-fg-3)',
              opacity: isAdmin ? 1 : 0.4,
              transition: 'opacity 120ms, color 120ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = isAdmin ? '1' : '0.4')}
          >
            {isAdmin ? '⚡ admin on' : '⚙'}
          </button>
        </div>
      </div>
    </footer>
  )
}
