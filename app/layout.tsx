import type { Metadata } from 'next'
import { DM_Sans, Space_Grotesk } from 'next/font/google'
import './layers.css'
import './globals.css'
import { siteConfig } from '@/config/site'
import { DesignProvider } from '@/components/providers/design-provider'

const body = DM_Sans({ subsets: ['latin'], variable: '--font-body', display: 'swap' })
const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' })

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: [{
    url: "/logo.svg",
    href: "/logo.svg",
  }
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${body.variable} ${display.variable}`}>
      <body><DesignProvider>{children}</DesignProvider></body>
    </html>
  )
}
