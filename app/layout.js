import { Analytics } from '@vercel/analytics/react';
import '../styles/global.scss'
import localFont from 'next/font/local'
 
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
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#ffffff' },
      { media: '(prefers-color-scheme: dark)', color: '#000000' },
    ],
}

export default function RootLayout({ children }) {
return (
    <html lang="en" className={`${tuppenceFont.variable} ${tuppenceFont.variable}`}>
    <head>
        <title>Next.js</title>
    </head>
    <body>
        {children}
        <Analytics />
    </body>
    </html>
);
}