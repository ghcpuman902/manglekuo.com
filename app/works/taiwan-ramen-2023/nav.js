'use client';
import styles from './styles.module.css'
// import { useGoogleOneTapLogin } from 'react-google-one-tap-login';
// import { useState, useEffect } from "react";

export default function Nav(){
    // const [userInfo,setUserInfo] = useState({});
    // if (typeof window !== "undefined") {
    //     console.log('running ');
    //     useGoogleOneTapLogin({
    //         onError: (error) => {console.log(error);setUserInfo(error);},
    //         onSuccess: (response) => {console.log(response);setUserInfo(response);},
    //         googleAccountConfigs: {
    //             client_id: "415886415394-8u8dp7041i30hm6a2gr0fb0f49plbul3.apps.googleusercontent.com"
    //         },
    //     });
    // }
    return (
        <div className={styles.title}>
            <div>2023</div><div>台灣ラーマン101</div>
            {/* <pre>{JSON.stringify(userInfo, null, 2)}</pre>     */}
        </div>
    );
}