import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

export const COOKIE_NAME = 'nl-admin-token'
const EXPIRE            = '7d'

function secret() {
  const s = process.env.JWT_SECRET
  if (!s) throw new Error('JWT_SECRET env variable is not set')
  return new TextEncoder().encode(s)
}

export async function createToken(): Promise<string> {
  return new SignJWT({ admin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(EXPIRE)
    .sign(secret())
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, secret())
    return payload.admin === true
  } catch {
    return false
  }
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return false
    return verifyToken(token)
  } catch {
    return false
  }
}
