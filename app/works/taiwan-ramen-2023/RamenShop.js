'use client';
import { useState } from 'react';
import styles from './styles.module.css'
import Link from 'next/link';

const Shop = ({shop})=>{
    return (<div>
        {(shop.city && shop.area)?(<div>{`${shop.city}${shop.area}`}</div>):null}
        {shop.name?(<h2 className={styles.shopName}>{shop.name}</h2>):null}
        {!shop.isOperational?(<div>這家店已歇業</div>):null}
        <Link href={shop.googleMapsUri} className={styles.shopAddr}>{shop.fullAddress?(<div>{shop.fullAddress}</div>):"用Google地圖打開"}</Link>
        {(shop.userRatingCount && shop.rating)?(<div>{`${shop.rating}🌟（${shop.userRatingCount}評價）`}</div>):null}
        {shop.websiteUri?(<Link href={shop.websiteUri}>店家網址</Link>):null}
    </div>);
}

export default function RamenShop({ramenChain}) {
    const [isWent, setIsWent] = useState(false);
    const [isExpand, setIsExpand] = useState(false);
    let cityList = '';
    let allshopClosed = false;
    if (ramenChain.shops && Array.isArray(ramenChain.shops) && ramenChain.shops.length > 0) {
        cityList = [...new Set(ramenChain.shops.map(shop => shop.city.replace(/市|縣/g, "")))].join(" ");
        allshopClosed = ramenChain.shops.every(shop => !shop.isOperational);
    }else{
        setIsSelected(true);
    }
    
    return (
        <div className={styles.shop+` ${isWent?styles.went:""} ${isExpand?styles.expand:""} ${allshopClosed?styles.allshopClosed:""}`} onClick={() => setIsExpand(!isExpand)} >
            {!isExpand?(<div className={styles.cityList}>{cityList}</div>):null}
            <div className={styles.chainName}>{ramenChain.name}</div>
            {isExpand?(<div>
                <div className={styles.shopList}>
                {ramenChain.shops.map((shop)=>{return (<Shop key={shop.googlePlaceName.replace("places/","")} shop={shop} />)})}
                </div>
                <button className={styles.checkInButton} onClick={() => setIsWent(!isWent)}>{isWent?"我沒去":"打卡～"}</button>
            </div>):null}
        </div>
    );
}