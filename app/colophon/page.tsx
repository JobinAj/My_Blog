import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'colophon', description: 'Who I am and how this site is built.' }

export default function ColophonPage() {
  const inlineCode: React.CSSProperties = {
    fontFamily: 'var(--nl-font-mono)', fontSize: 13, background: 'var(--nl-bg-2)',
    color: 'var(--nl-fg-0)', padding: '1px 5px', border: '1px solid var(--nl-line-1)', borderRadius: 2,
  }
  const link: React.CSSProperties = {
    color: 'var(--nl-accent)', textDecoration: 'none', borderBottom: '1px solid var(--nl-accent-line)',
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ fontFamily: 'var(--nl-font-mono)', fontSize: 12, color: 'var(--nl-fg-2)', marginBottom: 12 }}>
        <span style={{ color: 'var(--nl-accent)' }}>$</span>&nbsp;cat ~/.colophon
      </div>
      <h1 style={{ margin: '0 0 20px', fontFamily: 'var(--nl-font-mono)', fontWeight: 700, fontSize: 36, color: 'var(--nl-fg-0)', letterSpacing: '-0.01em' }}>
        colophon
      </h1>
      <pre style={{ fontFamily: 'var(--nl-font-mono)', fontSize: 13, color: 'var(--nl-accent)', lineHeight: 1.3, margin: '0 0 32px' }}>
{`          ___
         (o o)
        (  V  )     null.log
       /--m-m-`}
      </pre>
      <div style={{ fontFamily: 'var(--nl-font-sans)', fontSize: 16, lineHeight: 1.7, color: 'var(--nl-fg-1)' }}>
        <p>I&apos;m an engineer who writes mostly Go, spends too much time in Wireshark, and keeps finding new reasons to care about DNS. This site is where I write things down so I stop forgetting them.</p>
        <p style={{ marginTop: 16 }}>No trackers. No analytics. No cookies.</p>
        <h3 style={{ margin: '32px 0 10px', fontFamily: 'var(--nl-font-mono)', fontSize: 18, fontWeight: 600, color: 'var(--nl-fg-0)' }}>Built with</h3>
        <ul style={{ paddingLeft: 22 }}>
          <li><code style={inlineCode}>Next.js</code> — App Router, deployed on Vercel</li>
          <li style={{ marginTop: 6 }}><code style={inlineCode}>Supabase</code> — Postgres for blog data</li>
          <li style={{ marginTop: 6 }}><code style={inlineCode}>JetBrains Mono</code> + <code style={inlineCode}>IBM Plex Sans</code></li>
          <li style={{ marginTop: 6 }}>One accent colour, <code style={inlineCode}>#00ff9c</code>, and a lot of hairlines</li>
        </ul>
        <h3 style={{ margin: '32px 0 10px', fontFamily: 'var(--nl-font-mono)', fontSize: 18, fontWeight: 600, color: 'var(--nl-fg-0)' }}>Reach me</h3>
        <ul style={{ paddingLeft: 22 }}>
          <li><a href="#" style={link}>mail</a> — encrypt if you like (<code style={inlineCode}>0BDF7EBFB38BF69D9531F7E6CD44CE2DA84B5813</code>)</li>
          <li style={{ marginTop: 6 }}><a href="https://github.com/JobinAj/" style={link}>github</a></li>
        </ul>
      </div>
    </div>
  )
}
