import type { Metadata } from 'next'
import './globals.css'
import { WatermarkRemover } from '@/components/watermark-remover'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <WatermarkRemover />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
