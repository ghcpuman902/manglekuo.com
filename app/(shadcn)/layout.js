import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import './global.css'
import { ThemeProvider } from "@components/theme-provider"

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
      </body>
    </html>
  )
}
