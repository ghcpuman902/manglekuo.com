'use client';
import { useGoogleOneTapLogin } from 'react-google-one-tap-login';

export default function GoogleLogin({ handleLogin }) {
    if (typeof window !== "undefined") { //prevent next.js build time error
        useGoogleOneTapLogin({
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
}