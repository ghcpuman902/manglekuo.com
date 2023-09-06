import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers';

import { initializeApp } from "firebase/app";
import { getFirestore, collection,  query, orderBy, getDocs } from 'firebase/firestore/lite';
import Link from 'next/link';

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
async function getRamenChains(db) {
  const ramenShopList2023Ref = collection(db, 'ramen-shop-list-2023');
  const q = query(ramenShopList2023Ref, orderBy("ranking"));
  const shopSnapshot = await getDocs(q);
  const ramenChains = {}; 
  shopSnapshot.docs.map(doc => ramenChains[doc.id]=doc.data());
  return ramenChains;
}

export async function POST(request: NextRequest) {
  let ramenChains = await getRamenChains(db);
  return NextResponse.json(ramenChains)
}