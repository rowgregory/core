import './globals.css'
import { SessionProvider } from 'next-auth/react'
import { Lobster_Two, Sora } from 'next/font/google'
import { metadata as siteMetadata } from './metadata'
import { GoogleAnalytics } from '@next/third-parties/google'
import RootLayoutWrapper from './root-layout'

export const metadata = siteMetadata

const sora = Sora({
  variable: '--font-sora',
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
  preload: false
})
const lobsterTwo = Lobster_Two({
  variable: '--font-sora',
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  preload: false
})

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta property="fb:app_id" content="2265167933990680" />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </head>
      <body className={`${sora.variable} ${lobsterTwo.variable} antialiased`}>
        <SessionProvider>
          <RootLayoutWrapper>{children}</RootLayoutWrapper>
        </SessionProvider>
      </body>
    </html>
  )
}
