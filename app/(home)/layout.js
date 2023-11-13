import { Analytics } from '@vercel/analytics/react';
// import '../../styles/global.scss'
import localFont from 'next/font/local'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import './global.css'
import { ThemeProvider } from "@components/theme-provider";
import { Toaster } from "@components/ui/toaster"
import Link from 'next/link'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

import aS from './index.module.css'

// Font files can be colocated inside of `app`
const tuppenceFont = localFont({
  src: [
    {
      path: './tuppence_normal_400.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './tuppence_normal_700.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-tuppence',
  display: 'swap',
})


// DESCRIPTION CAN BE THIS LONG DESCRIPTION CAN BE THIS LONG DESCRIPTION CAN BE THIS LONG DESCRIPTION CAN BE THIS LONG ///////////
const description = "I'm Mangle Kuo, a web developer who has strong interest in design, photography, beer and city. Looking for a new job.";

export const metadata = {
  title: 'Mangle Kuo',
  description: description,
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${tuppenceFont.variable} ${tuppenceFont.variable} ${inter.className}`}>
      <body className={inter.className}>
        <main className={aS.main}>
          <section>
            <Link href="/"><div className={`${aS.MangleKuo} ${aS['z-7']}`}>
              Mangle Kuo
              <div className={aS.moon} />
            </div></Link>
          </section>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </main>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
