'use client';
import { useState, useEffect, useContext, useCallback } from 'react';
import styles from './styles.module.css'
import Link from 'next/link';
import { useToast } from './toast.js';

import AuthContext from './AuthContext.js';

const Shop = ({ shop }) => {
    return (<div>
        {(shop.city && shop.area) ? (<div>{`${shop.city}${shop.area}`}</div>) : null}
        {shop.name ? (<h2 className={styles.shopName}>{shop.name}</h2>) : null}
        {!shop.isOperational ? (<div>這家店已歇業</div>) : null}
        <Link href={shop.googleMapsUri} className={styles.shopAddr}>{shop.fullAddress ? (<div>{shop.fullAddress}</div>) : "用Google地圖打開"}</Link>
        {(shop.userRatingCount && shop.rating) ? (<div>{`${shop.rating}🌟（${shop.userRatingCount}評價）`}</div>) : null}
        {shop.websiteUri ? (<Link href={shop.websiteUri}>店家網址</Link>) : null}
    </div>);
}

export default function RamenShop({ ramenChainId, ramenChain }) {

    const pushToast = useToast();

    const {
        isLoggedIn,
        userShops, setUserShops,
    } = useContext(AuthContext);
    const [isExpand, setIsExpand] = useState(false);
    let cityList = '';
    let allshopClosed = false;
    if (ramenChain.shops && Array.isArray(ramenChain.shops) && ramenChain.shops.length > 0) {
        // has branches
        cityList = [...new Set(ramenChain.shops.map(shop => shop.city.replace(/市|縣/g, "")))].join(" ");
        allshopClosed = ramenChain.shops.every(shop => !shop.isOperational);
    } else {
        allshopClosed = true;
    }
    const updateServer = useCallback(async (updatedShops) => {
        const res = await fetch('/works/taiwan-ramen-2023/api/getUser', {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({updatedShops}),
        })
        const resJson = await res.json();
        if (resJson.message == 'success' && resJson.result) {
            let mergeShops = Object.assign({}, userShops, resJson.result?.shops);
            console.log(mergeShops);
            setUserShops(mergeShops);
            pushToast(mergeShops[ramenChainId]?.isWent?'打卡成功！':'取消打卡成功！');
        }else if(resJson.message == 'NOT LOGGED IN'){
            pushToast('未登入無法保存進度喔！');
        }else{
            throw new Error("Unknown error, likely invalid response from server");
        }
    }, []);
    const handleCheckInClick = useCallback(async (newIsWent) => {
        let updatedShops = {};
        let photo= '';
        let review= '';
        if(userShops && userShops[ramenChainId]){
            if(userShops[ramenChainId].photo){photo = userShops[ramenChainId].photo;}
            if(userShops[ramenChainId].review){review = userShops[ramenChainId].review;}
        }
        updatedShops[ramenChainId] = {isWent: newIsWent, photo: photo, review: review};

        let mergeShops = Object.assign({}, userShops, updatedShops);
        setUserShops(mergeShops);
        updateServer(mergeShops);
    }, []);
    return (
        <div className={styles.shop + ` ${((userShops&&userShops[ramenChainId])?userShops[ramenChainId]?.isWent:false) ? styles.went : ""} ${isExpand ? styles.expand : ""} ${allshopClosed ? styles.allshopClosed : ""}`} onClick={() => setIsExpand(!isExpand)} >
            {!isExpand ? (<div className={styles.cityList}>{cityList}</div>) : null}
            <div className={styles.chainName}>{ramenChain.name}</div>
            {isExpand ? (<div>
                {
                    isLoggedIn?
                    (
                    <button className={styles.checkInButton} onClick={()=>{handleCheckInClick(!((userShops&&userShops[ramenChainId])?userShops[ramenChainId]?.isWent:false))}}>
                        {((userShops&&userShops[ramenChainId])?userShops[ramenChainId]?.isWent:false) ? "啊，我還沒去" : "🍜 去過了～打卡！😋"}
                    </button>
                    ):(
                    <button className={styles.checkInButton} disabled={true}>{"沒有登入無法打卡喔～😭"}</button>
                    )
                }
                <div className={styles.shopList}>
                    {ramenChain.shops.map((shop) => { return (<Shop key={shop.googlePlaceName.replace("places/", "")} shop={shop} />) })}
                </div>
                <div className={styles.contractButton}>關閉</div>
            </div>) : null}
        </div>
    );
}