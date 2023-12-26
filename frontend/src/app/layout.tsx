import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '../../context/authProvider'
import ReactQueryProvider from '../../context/reactQueryProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Green Talao Park',
  description: 'GTP Village',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
    <html lang="en">
      <body className={inter.className}>
      <ReactQueryProvider>
        {children}
      </ReactQueryProvider>
      </body>
    </html>
    </AuthProvider>
  )
}
