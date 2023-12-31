import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '../../provider/authProvider'
import ReactQueryProvider from '../../provider/reactQueryProvider'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Green Talao Park',
  description: 'GTP Village',
  icons: '/icon/logo.svg'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // <html lang="en">
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
