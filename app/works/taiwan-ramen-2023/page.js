import styles from './styles.module.css'
import RamenShop from './RamenShop';

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

function removeAndReturn(obj) {
    for (let key in obj) {
      if (obj[key].ranking === 0) {
        const item = obj[key];
        delete obj[key];
        return [key, item];
      }
    }
    return null; // or undefined, or however you wish to handle "not found"
  }




export default async function Page() {
    const ramenChains = await getRamenChains(db);
    const [zerothItemKey, zerothItem] = removeAndReturn(ramenChains);
    
    // console.log(ramenChains);

    return (
        <>

            <div className={`${styles.grid} ${styles.gridTop}`}>
                        <RamenShop 
                            key={zerothItemKey}
                            ramenChain={zerothItem}
                        />
            </div>
            <div className={styles.grid}>
                    {Object.entries(ramenChains).map(([id, ramenChain]) => {
                        return (
                            <RamenShop 
                                key={id}
                                ramenChainId={id}
                                ramenChain={ramenChain}
                            />);
                    })}
            </div>
        </>
    )
}

