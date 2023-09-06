'use client';
import { useState } from "react";
import { useGoogleOneTapLogin } from 'react-google-one-tap-login';

export default function Page() {
    const [userInfo,setUserInfo] = useState({});
    useGoogleOneTapLogin({
        onError: (error) => {console.log(error);setUserInfo(error);},
        onSuccess: (response) => {console.log(response);setUserInfo(response);},
        googleAccountConfigs: {
          client_id: "415886415394-8u8dp7041i30hm6a2gr0fb0f49plbul3.apps.googleusercontent.com"
        },
    });
    const handleLogInClick = () =>{

    }
    return (
        <div className="w-full text-xs">
            <pre>{JSON.stringify(userInfo, null, 2)}</pre>
            <button onClick={() => handleLogInClick()}>Login with Google</button>
            
        </div>
    );
}