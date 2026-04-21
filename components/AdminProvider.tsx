'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface AdminContextValue {
  isAdmin: boolean
  refresh: () => void
}

const AdminContext = createContext<AdminContextValue>({ isAdmin: false, refresh: () => {} })

export function useAdmin() { return useContext(AdminContext) }

export default function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)

  async function checkSession() {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'same-origin' })
      const data = await res.json()
      setIsAdmin(data.isAdmin === true)
    } catch {
      setIsAdmin(false)
    }
  }

  useEffect(() => { checkSession() }, [])

  return (
    <AdminContext.Provider value={{ isAdmin, refresh: checkSession }}>
      {children}
      {isAdmin && (
        <div style={{ position: 'fixed', bottom: 12, right: 12, zIndex: 50 }}>
          <span className="nl-admin-badge">⚡ admin</span>
        </div>
      )}
    </AdminContext.Provider>
  )
}
