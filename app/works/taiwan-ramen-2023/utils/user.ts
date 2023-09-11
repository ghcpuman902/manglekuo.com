import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore/lite';
import { hashForDB } from './hash-for-db';
import { cookies } from 'next/headers';

const firebaseConfig = {
    apiKey: process.env.GOOGLE_FIREBASE_API_KEY,
    authDomain: "taiwan-ramen-2023.firebaseapp.com",
    projectId: "taiwan-ramen-2023",
    storageBucket: "taiwan-ramen-2023.appspot.com",
    messagingSenderId: "415886415394",
    appId: "1:415886415394:web:9df3b552298ea5d25edc7b"
};

export const getUser = async () => {

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    const db = getFirestore(app);

    const cookieStore = cookies();
    let result = {};
    if (cookieStore.get('email')?.value && cookieStore.get('name')?.value && cookieStore.get('picture')?.value) {
        // logged in and normal
        result = {
            email: cookieStore.get('email')?.value,
            name: cookieStore.get('name')?.value,
            picture: cookieStore.get('picture')?.value,
            shops: {}
        };

        const hashedEmail = await hashForDB(cookieStore.get('email')?.value);
        if (hashedEmail != "") {
            const docRef = doc(db, "user-list", hashedEmail);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                console.log("Existing user, user data:", docSnap.data());
                await updateDoc(docRef, {
                    email: cookieStore.get('email')?.value,
                    name: cookieStore.get('name')?.value,
                    picture: cookieStore.get('picture')?.value,
                });
                result = { ...result, shops: docSnap.data().shops };
            } else {
                console.log("New user, creating...");
                await setDoc(docRef, {
                    email: cookieStore.get('email')?.value,
                    name: cookieStore.get('name')?.value,
                    picture: cookieStore.get('picture')?.value,
                    shops: {}
                });
                result = { ...result, shops: {} };
            }
        } else {
            throw new Error("hashedEmail is empty");
        }
    } else {
        // not logged in or abnormal
        result = {message:`not logged in or abnormal`};
    }

    console.log(`user fetched, time: ${new Date().toISOString()}`);
    return result;
};


export const updateUser = async ({shopId, shopChange}) => {

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    const db = getFirestore(app);

    const cookieStore = cookies();
    let result = {};
    if (cookieStore.get('email')?.value && cookieStore.get('name')?.value && cookieStore.get('picture')?.value) {
        // logged in and normal
        result = {
            email: cookieStore.get('email')?.value,
            name: cookieStore.get('name')?.value,
            picture: cookieStore.get('picture')?.value,
            shops: {}
        };

        const hashedEmail = await hashForDB(cookieStore.get('email')?.value);
        if (hashedEmail != "") {
            const docRef = doc(db, "user-list", hashedEmail);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              console.log("Existing user, user data:", docSnap.data());
              let originalShops = docSnap.data().shops;
              let mergedShops = {...originalShops}
              if(!(shopId in mergedShops)) {
                // no existing record for this shop
                mergedShops[shopId] = {...shopChange};
              }else{
                const mergeOldAndNewShopInfo = (oldShopInfo: { hasOwnProperty: (arg0: string) => any; isWent: any; review: any; photo: any; },shopChange: { hasOwnProperty: (arg0: string) => any; isWent: any; review: any; photo: any; })=>{
                    const newIsWent = shopChange.hasOwnProperty('isWent')?shopChange.isWent : (oldShopInfo.hasOwnProperty('isWent')?oldShopInfo.isWent:false);
                    const newReview = shopChange.hasOwnProperty('review')?shopChange.review : (oldShopInfo.hasOwnProperty('review')?oldShopInfo.review:'');
                    const newPhoto = shopChange.hasOwnProperty('photo')?shopChange.photo : (oldShopInfo.hasOwnProperty('photo')?oldShopInfo.photo:'');
                    return {isWent: newIsWent, review: newReview, photo: newPhoto};
                }
                const oldShopInfo = {...mergedShops[shopId]};
                mergedShops[shopId] = mergeOldAndNewShopInfo(oldShopInfo,shopChange);
              }
              await updateDoc(docRef, {
                shops: mergedShops 
              });
              result = { ...result, shops: mergedShops };
            } else {
                console.log("New user, creating (from PATCH)...");
                await setDoc(docRef, {
                    email: cookieStore.get('email')?.value,
                    name: cookieStore.get('name')?.value,
                    picture: cookieStore.get('picture')?.value,
                    shops: {}
                });
                result = { ...result, shops: {} };
            }
        } else {
            throw new Error("hashedEmail is empty");
        }
    } else {
        // not logged in or abnormal
        result = {message:`not logged in or abnormal`};
    }

    console.log(`user patched, time: ${new Date().toISOString()}`);
    return result;
};