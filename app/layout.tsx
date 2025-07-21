import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Web3Provider } from '@/components/Web3Provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'XMenity Social Token Factory',
  description: 'Create and manage social tokens for X (Twitter) creators using InsightIQ integration',
  keywords: ['social tokens', 'web3', 'twitter', 'creators', 'arbitrum', 'blockchain'],
  authors: [{ name: 'DiamondzShadow' }],
  openGraph: {
    title: 'XMenity Social Token Factory',
    description: 'Create and manage social tokens for X (Twitter) creators',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Web3Provider>
            {children}
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}