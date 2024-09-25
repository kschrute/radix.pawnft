import { Jost } from 'next/font/google'

export const jost = Jost({
  display: 'swap',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-jost',
  weight: ['400', '700'],
})
