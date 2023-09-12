import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import { Analytics } from '@vercel/analytics/react'
import Link from 'next/link'
import styles from './styles.module.css'
import Nav from './nav.js'

import { UserProvider } from './user-context';

export const metadata = {
  title: '2023 台灣ラーマン 101',
  description: '在2023台灣拉麵101中發掘並評價台灣最好的拉麵餐廳。分享您的體驗，上傳照片，並填寫您的拉麵賓果卡。通過Google安全登入。',
  creator: '郭皓存 (Mangle Kuo)',
  authors: [
    {
      name: '郭皓存 (Mangle Kuo)',
      url: 'https://github.com/ghcpuman902/',
    }
  ],
  applicationName: 'TaiwanRamen2023',
  keywords: ['拉麵', '台灣拉麵', '最佳拉麵店', '拉麵評價', '拉麵照片', 'Google OAuth', '拉麵賓果卡'],
  publisher: '郭皓存 (Mangle Kuo)',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'light',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export default async function RamenLayout({
  children,
}) {

  return (
    <html lang="en">
      <head>
        <title>2023 台灣ラーマン 101</title>
      </head>
      <body className={`${inter.className} ${styles.body}`}>
        <UserProvider>
            <section>
              <Nav />
              <main>{children}</main>
              <footer className={styles.footer}>資料來源：台灣拉麵愛好會(台湾ラーメン愛好会 / Taiwan Ramen Club)Stars Yang的<Link href="https://www.facebook.com/groups/RamenTW/permalink/3487913364793047/">這篇貼文</Link><br />網站製作：<Link href="/">Mangle Kuo</Link> | <Link href="./terms-of-service">服務條款</Link> | <Link href="./privacy-policy">隱私政策</Link></footer>
            </section>
        </UserProvider>
        <Analytics />
      </body>
    </html>
  )
}
