import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AdminProvider from '@/components/AdminProvider'

const siteUrl = 'https://null-log.netlify.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'null.log', template: '%s — null.log' },
  description: 'A log of things reverse-engineered, broken, rebuilt, or worth writing down. Mostly Go, networking, and security.',
  openGraph: {
    type: 'website',
    siteName: 'null.log',
    title: 'null.log',
    description: 'A log of things reverse-engineered, broken, rebuilt, or worth writing down.',
    url: siteUrl,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'null.log' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'null.log',
    description: 'A log of things reverse-engineered, broken, rebuilt, or worth writing down.',
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AdminProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AdminProvider>
      </body>
    </html>
  )
}
