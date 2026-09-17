import { Libre_Bodoni, Urbanist } from 'next/font/google'

export const gilroyFallback = Urbanist({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-urbanist',
  display: 'swap',
})

export const cirkaFallback = Libre_Bodoni({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-libre-bodoni',
  display: 'swap',
})
