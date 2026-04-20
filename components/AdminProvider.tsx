'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface AdminContextValue {
  isAdmin: boolean
  toggle: () => void
}

const AdminContext = createContext<AdminContextValue>({ isAdmin: false, toggle: () => {} })

export function useAdmin() { return useContext(AdminContext) }

export default function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // restore from sessionStorage so it persists across navigation
    setIsAdmin(sessionStorage.getItem('nl-admin') === '1')

    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault()
        setIsAdmin(v => {
          const next = !v
          sessionStorage.setItem('nl-admin', next ? '1' : '0')
          return next
        })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <AdminContext.Provider value={{ isAdmin, toggle: () => setIsAdmin(v => !v) }}>
      {children}
      {isAdmin && (
        <div style={{
          position: 'fixed', bottom: 12, right: 12, zIndex: 50,
        }}>
          <span className="nl-admin-badge">⚡ admin</span>
        </div>
      )}
    </AdminContext.Provider>
  )
}
