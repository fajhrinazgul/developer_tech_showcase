import { MotionExit } from '@/components/motion-exit'
import { ScrollToTop } from '@/components/scroll-to-top'
import { GoogleOAuthProvider } from '@react-oauth/google'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
  title: {
    default: 'Developer Tech Showcase',
    template: '%s | Developer Tech Showcase',
  },
  description:
    'Explore a collection of innovative projects, source code, and developer portfolios. A curated hub for technical excellence and creative software engineering.',
  keywords: [
    'developer',
    'portfolio',
    'tech showcase',
    'coding',
    'web development',
    'nextjs',
    'software engineering',
    'open source',
    'projects',
  ],
  authors: [{ name: 'Fajri Fath' }],
  creator: 'Fajri Fath',

  // Open Graph for WhatsApp, Discord, LinkedIn, etc.
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Developer Tech Showcase',
    description:
      'Explore high-quality technical projects and developer portfolios.',
    siteName: 'Developer Tech Showcase',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Developer Tech Showcase Preview',
      },
    ],
  },

  // Twitter (X) Card
  twitter: {
    card: 'summary_large_image',
    title: 'Developer Tech Showcase',
    description:
      'Explore high-quality technical projects and developer portfolios.',
    images: ['/og-image.png'],
    creator: '@your_twitter_handle',
  },

  // Tambahan penting
  robots: {
    index: true,
    follow: true,
  },
}

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      {/* Menggunakan font mono untuk kesan terminal total */}
      <body className={`${inter.className} font-mono antialiased min-h-screen`}>
        {/* Container Utama */}
        <GoogleOAuthProvider clientId={`${process.env.GOOGLE_CLIENT_ID}`}>
          <main className="relative flex min-h-screen flex-col">
            {/* Efek gradient tipis di bagian atas agar terlihat seperti 'glow' monitor */}
            <div className="absolute inset-0 bg-linear-to-b from-emerald-900/10 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 flex-1">
              <MotionExit>{children}</MotionExit>
            </div>
          </main>

          <Toaster position="top-right" richColors />
          <ScrollToTop />
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
