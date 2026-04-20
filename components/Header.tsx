'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/',         label: 'writing'  },
  { href: '/projects', label: 'projects' },
  { href: '/notes',    label: 'notes'    },
  { href: '/colophon', label: 'colophon' },
]

export default function Header() {
  const path = usePathname()
  const isActive = (href: string) =>
    href === '/' ? path === '/' || path.startsWith('/writing')
                 : path.startsWith(href)

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 20,
      background: 'rgba(13,13,13,0.9)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--nl-line-1)',
    }}>
      <div style={{
        maxWidth: 1120, margin: '0 auto', padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* logo */}
        <Link href="/" style={{
          fontFamily: 'var(--nl-font-mono)', fontWeight: 700, fontSize: 16,
          letterSpacing: '-0.01em', textDecoration: 'none', color: 'var(--nl-fg-0)',
          display: 'inline-flex', alignItems: 'center', gap: 2,
        }}>
          <span>null</span>
          <span style={{ color: 'var(--nl-accent)' }}>.log</span>
          <span className="nl-cursor" style={{
            display: 'inline-block', width: 8, height: 16,
            background: 'var(--nl-accent)', marginLeft: 4,
          }} />
        </Link>

        {/* nav links with active indicator */}
        <div style={{ display: 'flex', gap: 4 }}>
          {links.map(l => {
            const active = isActive(l.href)
            return (
              <Link key={l.href} href={l.href} style={{
                fontFamily: 'var(--nl-font-mono)', fontSize: 13,
                textDecoration: 'none', padding: '4px 10px', borderRadius: 2,
                transition: 'color 80ms, background 80ms',
                color: active ? 'var(--nl-accent)' : 'var(--nl-fg-2)',
                background: active ? 'var(--nl-accent-wash)' : 'transparent',
                borderBottom: active ? '1px solid var(--nl-accent-line)' : '1px solid transparent',
              }}>
                {active && <span style={{ marginRight: 4, opacity: 0.7 }}>|</span>}
                {l.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
