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
          <div className={styles.logoWrapper}>
            <Image
              src="/taiwan-ramen-2023/assets/TaiwanRamenLogoP1.svg"
              width={500}
              height={90}
              alt={`2023`}
            />
            <Image
              src="/taiwan-ramen-2023/assets/TaiwanRamenLogoP2.svg"
              width={500}
              height={90}
              alt={`台灣ラーマン`}
            />
            <Image
              src="/taiwan-ramen-2023/assets/TaiwanRamenLogoP3.svg"
              width={500}
              height={90}
              alt={`101`}
            />
          </div>
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
                    />登出</button>) : (`登入異常 請刷新`)}
                </div>) : (
                  isLoggedIn === false ? (<GoogleLogin handleLogin={handleLogin} isLoggedIn={isLoggedIn} />):(null)
                )
            ):(<div>...</div>)
          }
      </div>
  );
}