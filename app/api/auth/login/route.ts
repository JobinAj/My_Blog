import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createToken, COOKIE_NAME, getPasswordHash } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  const hash = getPasswordHash()
  if (!hash) {
    return NextResponse.json({ error: 'Server misconfigured: ADMIN_PASSWORD_HASH not set' }, { status: 500 })
  }

  const valid = await bcrypt.compare(password, hash)
  if (!valid) {
    // Consistent timing to prevent timing attacks
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const token = await createToken()
  const res = NextResponse.json({ ok: true })

  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return res
}
