// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection,  query, orderBy, getDocs } from 'firebase/firestore/lite';

// Your web app's Firebase configuration
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

// Get a list of cities from your database
async function getShops(db) {
  const ramenShopList2023 = collection(db, 'ramen-shop-list-2023');
  const q = query(ramenShopList2023, orderBy("ranking"));
  const shopSnapshot = await getDocs(q);
  const shopList = {}; 
  shopSnapshot.docs.map(doc => shopList[doc.id]=doc.data());
  return shopList;
}

export default async function Page() {
    const list = await getShops(db);
    return (
        <div className="w-full text-xs">
            <pre>{JSON.stringify(list, null, 2)}</pre>
        </div>
    );
}
