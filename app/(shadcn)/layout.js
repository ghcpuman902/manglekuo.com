import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react';
const inter = Inter({ subsets: ['latin'] })
import './global.css'
import { ThemeProvider } from "@components/theme-provider";
import { Toaster } from "@components/ui/toaster"



export default async function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <head>
        <title>Article Search</title>
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
            {children}
        </ThemeProvider>
        <Toaster />
        <Analytics/>
      </body>
    </html>
  )
}
