import './globals.css'
import ReduxWrapper from './redux-wrapper'
import { auth } from './lib/auth'
import { SessionProvider } from 'next-auth/react'
import { Sora } from 'next/font/google'
import { metadata as siteMetadata } from './metadata'
import { getUsers } from './actions/getUsers'

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
  const { users } = await getUsers()

  return (
    <html lang="en">
      <head>
        <meta property="fb:app_id" content="2265167933990680" />
      </head>
      <body className={`${sora.variable} antialiased`}>
        <SessionProvider session={session}>
          <ReduxWrapper users={users || []}>{children}</ReduxWrapper>
        </SessionProvider>
      </body>
    </html>
  )
}
