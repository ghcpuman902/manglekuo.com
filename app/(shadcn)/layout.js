import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react';
const inter = Inter({ subsets: ['latin'] })
import './global.css'
import { ThemeProvider } from "@components/theme-provider";

export const metadata = {
  title: 'Articles Search',
  description: 'The web application fetches the latest articles based on user queries related to astronomy scientific research, space exploration, and deep sky news, and sorts them based on relevance using OpenAI Embedding. It showcases articles from multiple sources along with their respective source links.',
  creator: 'Mangle Kuo',
  authors: [
    {
      name: 'Mangle Kuo',
      url: 'https://github.com/ghcpuman902/',
    }
  ],
  applicationName: 'ArticleSearchApp',
  keywords: ['astronomy', 'scientific research', 'space exploration', 'deep sky news', 'science articles', 'sort articles', 'fetch articles', 'OpenAI Embedding'],
  publisher: 'Mangle Kuo',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  themeColor: [
    { 
      media: '(prefers-color-scheme: light)', 
      color: 'hsl(0, 0%, 100%)' 
    },
    { 
      media: '(prefers-color-scheme: dark)', 
      color: 'hsl(20, 14.3%, 4.1%)' 
    }
  ],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

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
        <Analytics/>
      </body>
    </html>
  )
}
