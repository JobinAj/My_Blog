'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push('/')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error ?? 'Login failed')
      }
    } catch {
      setError('Network error — check connection')
    } finally {
      setLoading(false)
    }
  }

  const mono = 'var(--nl-font-mono)'

  return (
    <div style={{
      minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '48px 24px',
    }}>
      <div style={{
        width: '100%', maxWidth: 400,
        background: 'var(--nl-bg-1)', border: '1px solid var(--nl-line-1)',
        borderRadius: 4, padding: '32px 28px',
      }}>
        {/* header */}
        <div style={{ fontFamily: mono, fontSize: 12, color: 'var(--nl-fg-2)', marginBottom: 20 }}>
          <span style={{ color: 'var(--nl-accent)' }}>$</span>&nbsp;sudo -s
        </div>
        <h1 style={{
          fontFamily: mono, fontWeight: 700, fontSize: 24,
          color: 'var(--nl-fg-0)', marginBottom: 28, letterSpacing: '-0.01em',
        }}>
          admin login
          <span style={{
            display: 'inline-block', width: 10, height: 20,
            background: 'var(--nl-accent)', marginLeft: 6, verticalAlign: '-4px',
          }} />
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block', fontFamily: mono, fontSize: 11,
              color: 'var(--nl-fg-3)', marginBottom: 6, letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
              placeholder="Enter admin password"
              required
              style={{
                width: '100%', fontFamily: mono, fontSize: 14,
                background: 'var(--nl-bg-2)', border: '1px solid var(--nl-line-2)',
                borderRadius: 2, color: 'var(--nl-fg-0)', padding: '10px 12px',
                outline: 'none', caretColor: 'var(--nl-accent)',
                transition: 'border-color 80ms',
                boxSizing: 'border-box',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--nl-accent-line)')}
              onBlur={e => (e.target.style.borderColor = 'var(--nl-line-2)')}
            />
          </div>

          {error && (
            <div style={{
              fontFamily: mono, fontSize: 12, color: 'var(--nl-error)',
              marginBottom: 12, padding: '8px 10px',
              background: 'rgba(255,77,94,0.08)', border: '1px solid rgba(255,77,94,0.2)',
              borderRadius: 2,
            }}>
              ✕&nbsp;{error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: '100%', fontFamily: mono, fontSize: 13, padding: '10px 0',
              background: loading ? 'transparent' : 'var(--nl-accent-wash)',
              color: 'var(--nl-accent)', border: '1px solid var(--nl-accent-line)',
              borderRadius: 2, cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 80ms',
            }}
          >
            {loading ? 'authenticating…' : '$ login'}
          </button>
        </form>
      </div>
    </div>
  )
}
