'use client';
import styles from './styles.module.css'
import Image from 'next/image'
import { useGoogleOneTapLogin } from 'react-google-one-tap-login';
import { useUser } from './user-context';
import { memo } from 'react';

const GoogleLogin = memo(({ handleLogin, isLoggedIn }) => {
  if (typeof window !== "undefined") {
      // console.log(`Google One Tap running, isLoggedIn is`,isLoggedIn);
      useGoogleOneTapLogin({
          disabled: isLoggedIn,
          onError: (error) => { console.log(error); },
          onSuccess: async (response) => {
              handleLogin(response);
          },
          googleAccountConfigs: {
              client_id: "415886415394-8u8dp7041i30hm6a2gr0fb0f49plbul3.apps.googleusercontent.com"
          },
      });
  }
  return null;
});

export default function Nav(){
   
  const {isLoggedIn, userProfile, handleLogin, handleLogout} = useUser();
  // console.log(`Nav rendered, isLoggedIn:${isLoggedIn}`);

  return (
      <div className={styles.nav}>
          <div className={styles.bigText}>2023</div><div className={styles.bigText}>台灣ラーマン101</div>
          {/* <pre>{JSON.stringify(userInfo, null, 2)}</pre>     */}
          {userProfile ? (
              isLoggedIn === true ? (
                <div>
                  {userProfile.email ? (<button className={styles.logoutButton} onClick={() => {handleLogout()}}>
                    <Image
                    src={userProfile.picture}
                    width={100}
                    height={100}
                    alt={userProfile.name}
                    />登出</button>) : (`待って`)}
                </div>) : (
                  isLoggedIn === false ? (<GoogleLogin handleLogin={handleLogin} isLoggedIn={isLoggedIn} />):(null)
                )
            ):(<div>...</div>)
          }
      </div>
  );
}