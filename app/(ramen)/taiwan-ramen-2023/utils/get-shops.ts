import { cache } from 'react'
 
export const revalidate = 3600 * 24 // revalidate the data at most every day
 
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore/lite';

export const getShops = cache(async () => {
    
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
    
    const ramenShopList2023Ref = collection(db, 'ramen-shop-list-2023');
    const q = query(ramenShopList2023Ref, orderBy("ranking"));
    const shopSnapshot = await getDocs(q);

    const Shops: Record<string, any> = {};
    shopSnapshot.docs.map(doc => Shops[doc.id]=doc.data());

    console.log(`Ramen shops fetched, time: ${new Date().toISOString()}`);

    return Shops;
})