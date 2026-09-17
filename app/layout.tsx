import type { Metadata } from 'next'
import './layers.css'
import './globals.css'
import { siteConfig } from '@/config/site'
import { NeoPopStyleRegistry } from '@/components/neopop/registry'
import { cirkaFallback, gilroyFallback } from './fonts'

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
    <html lang="en" className={`dark ${gilroyFallback.variable} ${cirkaFallback.variable}`}>
      <body><NeoPopStyleRegistry>{children}</NeoPopStyleRegistry></body>
    </html>
  )
}
