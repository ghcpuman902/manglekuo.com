'use client';
import styles from './styles.module.css'
import { useContext } from "react";
import AuthContext from './AuthContext.js';
import GoogleLogin from './login/googleLogin.js';
import Image from 'next/image'

export default function Nav(){
   
  const {
    isLoggedIn,
    userProfile,
    handleLogin,
    handleLogoutClick
  } = useContext(AuthContext);
    return (
        <div className={styles.nav}>
            <div className={styles.bigText}>2023</div><div className={styles.bigText}>台灣ラーマン101</div>
            {/* <pre>{JSON.stringify(userInfo, null, 2)}</pre>     */}
            {
              isLoggedIn ? (
                <div>
                  {userProfile.email ? (<button className={styles.logoutButton} onClick={handleLogoutClick}>
                    <Image
                    src={userProfile.picture}
                    width={100}
                    height={100}
                    alt={userProfile.name}
                    />登出</button>) : (`待って`)}
                </div>) : (<GoogleLogin handleLogin={handleLogin} />)
            }
        </div>
    );
}