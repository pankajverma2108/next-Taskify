import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans, Space_Grotesk } from 'next/font/google'
import './layers.css'
import './globals.css'
import { siteConfig } from '@/config/site'
import { NeoPopStyleRegistry } from '@/components/neopop/registry'

const body = DM_Sans({ subsets: ['latin'], variable: '--font-body', display: 'swap' })
const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' })
const editorial = Cormorant_Garamond({ subsets: ['latin'], variable: '--font-editorial', display: 'swap', weight: ['600', '700'] })

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
    <html lang="en" className={`dark ${body.variable} ${display.variable} ${editorial.variable}`}>
      <body><NeoPopStyleRegistry>{children}</NeoPopStyleRegistry></body>
    </html>
  )
}
