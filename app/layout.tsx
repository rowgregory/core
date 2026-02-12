import './globals.css'
import { auth } from './lib/auth'
import { SessionProvider } from 'next-auth/react'
import { Sora } from 'next/font/google'
import { metadata as siteMetadata } from './metadata'
import { getUsers } from './lib/actions/getUsers'
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

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  const users = await getUsers()

  return (
    <html lang="en">
      <head>
        <meta property="fb:app_id" content="2265167933990680" />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </head>
      <body className={`${sora.variable} antialiased`}>
        <SessionProvider session={session}>
          <RootLayoutWrapper users={users}>{children}</RootLayoutWrapper>
        </SessionProvider>
      </body>
    </html>
  )
}
