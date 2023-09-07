import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers';

import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore/lite';
import crypto from 'crypto';

const firebaseConfig = {
  apiKey: process.env.GOOGLE_FIREBASE_API_KEY,
  authDomain: "taiwan-ramen-2023.firebaseapp.com",
  projectId: "taiwan-ramen-2023",
  storageBucket: "taiwan-ramen-2023.appspot.com",
  messagingSenderId: "415886415394",
  appId: "1:415886415394:web:9df3b552298ea5d25edc7b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


async function hashForDB(message: string | undefined){
  if (message === undefined) {
    console.error("undefined message to encrypt");
    return "";
  }
  // Convert the message to an ArrayBuffer
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  // Compute the hash using the SHA-256 algorithm
  const hash = await crypto.subtle.digest("SHA-256", data);
  // Convert the hash to a hexadecimal string
  const hashArray = Array.from(new Uint8Array(hash));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  return hashHex; // Output the hash
}

// Get a list of cities from your database
// async function getRamenChains(db) {
//   const userList = collection(db, 'user-list');

//   const ramenChains = {}; 
//   shopSnapshot.docs.map(doc => ramenChains[doc.id]=doc.data());
//   return ramenChains;
// }

// const res = await db.collection('cities').doc('LA').set(data);
// export async function POST(request: NextRequest) {
//   let ramenChains = await getRamenChains(db);
//   return NextResponse.json(ramenChains)
// }


export async function POST(request: NextRequest) {
  const cookieStore = cookies()
  let result = {};
  if (cookies().get('email')?.value && cookies().get('name')?.value && cookies().get('picture')?.value) {
    result = {
      email: cookieStore.get('email')?.value,
      name: cookieStore.get('name')?.value,
      picture: cookieStore.get('picture')?.value,
    };

    try {
      const hashedEmail = await hashForDB(cookieStore.get('email')?.value);
      if(hashedEmail != ""){
        const docRef = doc(db, "user-list", hashedEmail);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("Existing user, user data:", docSnap.data());
          await updateDoc(docRef, {
            email: cookieStore.get('email')?.value,
            name: cookieStore.get('name')?.value,
            picture: cookieStore.get('picture')?.value,
          });
          result = { ...result, shops: docSnap.data().shops }
        } else {
          console.log("New user, creating...");
          await setDoc(docRef, {
            email: cookieStore.get('email')?.value,
            name: cookieStore.get('name')?.value,
            picture: cookieStore.get('picture')?.value,
            shops: {}
          });
        }
      }else{
        throw new Error("hashedEmail is empty");
      }

    } catch (error) {
      console.log(error);
    }
  } else {
    cookies().delete('email');
    cookies().delete('name');
    cookies().delete('picture');
    if (cookies().get('email')?.value !== '' || cookies().get('name')?.value !== '' || cookies().get('picture')?.value !== '') {
      throw new Error('cookie can not be deleted');
    }
  }
  return NextResponse.json({ message: 'success', result: result })
}



export async function PATCH(request: NextRequest) {
  const reqData = await request.json();
  const updatedShops = reqData.updatedShops;
  console.log(updatedShops);

  const cookieStore = cookies()
  let result = {};
  let errorMessage = '';
  if (cookies().get('email')?.value && cookies().get('name')?.value && cookies().get('picture')?.value) {
    result = {shops:{}};
    try {
      const hashedEmail = await hashForDB(cookieStore.get('email')?.value);
      if(hashedEmail != ""){
        const docRef = doc(db, "user-list", hashedEmail);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("Existing user, user data:", docSnap.data());
          let mergeShops = Object.assign({}, docSnap.data().shops, updatedShops);
          await updateDoc(docRef, {
            shops: mergeShops 
          });
          result = { shops: mergeShops };
        } else {
          console.log("New user, creating...");
          await setDoc(docRef, {
            email: cookieStore.get('email')?.value,
            name: cookieStore.get('name')?.value,
            picture: cookieStore.get('picture')?.value,
            shops: updatedShops
          });
        }
      }else{
        throw new Error("hashedEmail is empty");
      }

    } catch (error) {
      console.log(error);
    }
  } else {
    cookies().delete('email');
    cookies().delete('name');
    cookies().delete('picture');
    if (cookies().get('email')?.value !== '' || cookies().get('name')?.value !== '' || cookies().get('picture')?.value !== '') {
      throw new Error('cookie can not be deleted');
    }
    errorMessage = 'NOT LOGGED IN';
  }
  return NextResponse.json({ message: errorMessage?errorMessage:'success', result: result })
}