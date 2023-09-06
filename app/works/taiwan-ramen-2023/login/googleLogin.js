'use client';
import { useGoogleOneTapLogin } from 'react-google-one-tap-login';

export default function GoogleLogin({ handleLogin }) {
    if (typeof window !== "undefined") { //prevent next.js build time error
        useGoogleOneTapLogin({
            onError: (error) => { console.log(error); },
            onSuccess: async (response) => { 
                if (response.email) {
                    const callApi = async () => {
                        // this pattern is because you can't directly call async in client component in next.js
                        try {
                            const res = await fetch('/works/taiwan-ramen-2023/api/login', {
                                method: "POST",
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(response),
                            })
                            const resJson = await res.json();
                            if (resJson && resJson.result && resJson.result == 'success') {
                                handleLogin(response);
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    };
                    callApi();
                } },
            googleAccountConfigs: {
                client_id: "415886415394-8u8dp7041i30hm6a2gr0fb0f49plbul3.apps.googleusercontent.com"
            },
        });
    }
    return null;
}