import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import Link from 'next/link'
import { Analytics } from '@vercel/analytics/react'
import styles from './styles.module.css'
export default async function RamenLayout({
    children,
  }) {
    return (
        <html lang="en">
          <head>
            <title>2023 台灣ラーマン 101</title>
          </head>
          <body className={`${inter.className} ${styles.body}`}>
            <section>
                <div className={styles.title}><div>2023</div><div>台灣ラーマン101</div></div>
                <main>{children}</main>
                <footer className={styles.footer}>資料來源：台灣拉麵愛好會(台湾ラーメン愛好会 / Taiwan Ramen Club)Stars Yang的<Link href="https://www.facebook.com/groups/RamenTW/permalink/3487913364793047/">這篇貼文</Link><br />網站製作：<Link href="/">Mangle Kuo</Link> | <Link href="./terms-of-service">服務條款</Link> | <Link href="./privacy-policy">隱私政策</Link></footer>
            </section>
            <Analytics />
          </body>
        </html>
    )
  }