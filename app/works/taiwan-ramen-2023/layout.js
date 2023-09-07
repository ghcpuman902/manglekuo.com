'use client';
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import { Analytics } from '@vercel/analytics/react'
import Link from 'next/link'
import styles from './styles.module.css'
import Nav from './nav.js'
import { useCallback, useMemo, useState, useEffect, } from 'react';
import { ToastProvider } from './toast.js';

import AuthContext from './AuthContext.js';

// export const metadata = {
//   title: '2023台灣拉麵101',
//   description: '在2023台灣拉麵101中發掘並評價台灣最好的拉麵餐廳。分享您的體驗，上傳照片，並填寫您的拉麵賓果卡。通過Google安全登入。',
//   creator: '郭皓存（Mangle Kuo）',
//   authors: [
//     {
//       name: '郭皓存（Mangle Kuo）',
//       url: 'https://github.com/ghcpuman902/',
//     }
//   ],
//   applicationName: 'TaiwanRamen2023',
//   keywords: ['拉麵', '台灣拉麵', '最佳拉麵店', '拉麵評價', '拉麵照片', 'Google OAuth', '拉麵賓果卡'],
//   publisher: '郭皓存（Mangle Kuo）',
//   generator: 'Next.js',
//   referrer: 'origin-when-cross-origin',
//   colorScheme: 'light',
//   formatDetection: {
//     email: false,
//     address: false,
//     telephone: false,
//   },
// }

export default function RamenLayout({
  children,
}) {
  const [userProfile, setUserProfile] = useState({});
  const [userShops, setUserShops] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const callApi = useCallback(async () => {
    // this pattern is to prevent infinite loop, since we will set state in an useEffect,
    // but because next.js doesnt like async in client component, using useEffect to fetch is necessary
    try {
      const res = await fetch('/works/taiwan-ramen-2023/api/getUser', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const resJson = await res.json();
      if (resJson.result) {
        console.log('resJson.result', resJson.result);
        if (Object.keys(resJson.result).length === 0) {
          setIsLoggedIn(false);
        } else {
          if (resJson.result.email && resJson.result.name) {
            setIsLoggedIn(true);
            setUserProfile({
              email: resJson.result.email,
              name: resJson.result.name,
              picture: resJson.result.picture ? resJson.result.picture : "",
            });
            setUserShops(resJson.result.shops);
          } else {
            throw new Error("Server response missing email and name, responding with", resJson);
          }
        }
      } else {
        throw new Error("Server response missing result, responding with", resJson);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);
  useEffect(() => {
    callApi();
    console.log(`this should only happen once, init callApi`);
  }, []);
  const handleLogin = useCallback((userDetail) => {
    if (userDetail.email && userDetail.name) {
      setIsLoggedIn(true);
      setUserProfile({
        email: userDetail.email,
        name: userDetail.name,
        picture: userDetail.picture ? userDetail.picture : "",
      });
      setUserShops({});
      callApi();
      console.log(`this should only happen once (handleLogin)`);
    }
  }, []);
  const handleLogoutClick = useCallback(async () => {
    const res = await fetch('/works/taiwan-ramen-2023/api/logout', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const resJson = await res.json();
    if (resJson.result && resJson.result == 'success') {
      setUserProfile({});
      setIsLoggedIn(false);
      setUserShops({});
    }
  }, []);
  const contextValue = useMemo(() => ({
    isLoggedIn,
    userProfile,
    userShops, setUserShops,
    handleLogin,
    handleLogoutClick
  }), [isLoggedIn, userProfile, userShops, setUserShops, handleLogin, handleLogoutClick]);

  return (
    <html lang="en">
      <head>
        <title>2023 台灣ラーマン 101</title>
      </head>
      <body className={`${inter.className} ${styles.body}`}>
        <AuthContext.Provider value={contextValue}>
          <ToastProvider>
            <section>
              <Nav />
              <main>{children}</main>
              <footer className={styles.footer}>資料來源：台灣拉麵愛好會(台湾ラーメン愛好会 / Taiwan Ramen Club)Stars Yang的<Link href="https://www.facebook.com/groups/RamenTW/permalink/3487913364793047/">這篇貼文</Link><br />網站製作：<Link href="/">Mangle Kuo</Link> | <Link href="./terms-of-service">服務條款</Link> | <Link href="./privacy-policy">隱私政策</Link></footer>
            </section>
          </ToastProvider>
        </AuthContext.Provider>
        <Analytics />
      </body>
    </html>
  )
}
