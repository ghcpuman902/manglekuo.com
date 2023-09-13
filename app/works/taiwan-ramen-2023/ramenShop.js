'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link'

import { useUser } from './user-context';
import { getLocalUserShops, updateLocalUserSingleShop } from './utils/local-user-shops';

import styles from './styles.module.css';


const BracketText = ({ text }) => {
    // Extract text within square brackets or fallback to the entire string
    const regex = /\[([^\]]+)\]/g;
    let matches = [...text.matchAll(regex)].map(match => match[1]);
    if (matches.length === 0) matches = [text];

    const flexParentStyle = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'baseline'
    };

    const childDivStyle = {
        padding: '0px',
    };

    return (
        <div style={flexParentStyle}>
            {matches.map((content, index) => (
                <div key={index} style={childDivStyle}>
                    {content}
                </div>
            ))}
        </div>
    );
}

const Shop = ({ shop }) => {
    const base = 'https://www.google.com/maps/dir/?api=1';
    const destinationID = encodeURIComponent(shop.googlePlaceName.split('/')[1]);
    const destinationName = encodeURIComponent(shop.name);
    return (<div>
        {(shop.city && shop.area) ? (<div>{`${shop.city}${shop.area}`}</div>) : null}
        {shop.name ? (<h2 className={styles.shopName}>{shop.name}</h2>) : null}
        {!shop.isOperational ? (<div>這家店已歇業</div>) : null}
        <Link target="_blank" href={`${base}&destination_place_id=${destinationID}&destination=${destinationName}`} className={styles.shopAddr}>{shop.fullAddress ? (<div>{shop.fullAddress}</div>) : "用Google地圖打開"}</Link>
        {(shop.userRatingCount && shop.rating) ? (<div>{`${shop.rating}🌟（${shop.userRatingCount}評價）`}</div>) : null}
        {shop.websiteUri ? (<Link target="_blank" href={shop.websiteUri}>店家網址</Link>) : null}
    </div>);
}

export default function RamenShop({ ramenChainId, ramenChain }) {
    const { isLoggedIn, userProfile, handleUpdateShop } = useUser();
    const prevIsLoggedInRef = useRef();
    const [isWent, setIsWent] = useState(false);
    const [isExpand, setIsExpand] = useState(false);


    let cityList = '';
    let allshopClosed = false;


    useEffect(() => {
        let isJustLoggedIn;
        if(prevIsLoggedInRef.current == false && isLoggedIn == true){
            // first time logged in, sync local state to 
            isJustLoggedIn = false;
        }else{
            isJustLoggedIn = true;
        }
        prevIsLoggedInRef.current = isLoggedIn;
        if (userProfile !== undefined) {
            // loaded
            if (userProfile.email !== undefined) {
                // logged in 
                if (userProfile.shops && userProfile.shops[ramenChainId] && userProfile?.shops[ramenChainId].isWent) {
                    // user online data went here
                    setIsWent(userProfile.shops[ramenChainId].isWent);
                    console.log(`Rendering ${ramenChain.name},${userProfile.shops[ramenChainId].isWent ? 'went' : ''}`);
                } else {
                    // user online data didnt went here
                    if(isJustLoggedIn){
                        console.log(`isJustLoggedIn`);
                    }
                    if(isJustLoggedIn && isWent == true){
                        console.log(`handleCheckInClick,isWent is `,isWent);
                        handleCheckInClick(true);
                    }else{
                        setIsWent(false);
                    }
                }
            } else {
                // not logged in
                const localUserShops = getLocalUserShops();
                if (localUserShops[ramenChainId] && localUserShops[ramenChainId].isWent) {
                    setIsWent(localUserShops[ramenChainId].isWent);
                } else {
                    setIsWent(false);
                }
            }
        } else {
            // loading...
            const localUserShops = getLocalUserShops();
            if (localUserShops[ramenChainId] && localUserShops[ramenChainId].isWent) {
                setIsWent(localUserShops[ramenChainId].isWent);
            } else {
                setIsWent(false);
            }
        }
    }, [userProfile]);

    if (ramenChain.shops && Array.isArray(ramenChain.shops) && ramenChain.shops.length > 0) {
        // has branches
        cityList = [...new Set(ramenChain.shops.map(shop => shop.city.replace(/市|縣/g, "")))].join(" ");
        allshopClosed = ramenChain.shops.every(shop => !shop.isOperational);
    } else {
        allshopClosed = true;
    }


    const handleCheckInClick = useCallback(async (newIsWent) => {
        if (isLoggedIn) {
            console.log(`handleUpdateShop`, { shopId: ramenChainId, shopChange: { isWent: newIsWent } });
            // handle cloud change
            handleUpdateShop({ shopId: ramenChainId, shopChange: { isWent: newIsWent } });
        } else {
            console.log(`handleUpdateShop failed, isLoggedIn:`, isLoggedIn);
        }
        // handle local change
        updateLocalUserSingleShop({ shopId: ramenChainId, shopChange: { isWent: newIsWent } });
        setIsWent(newIsWent);
    }, [isLoggedIn]);


    return (
        <div className={styles.shop + ` ${isWent ? styles.went : ""} ${isExpand ? styles.expand : ""} ${allshopClosed ? styles.allshopClosed : ""}`} onClick={() => setIsExpand(!isExpand)} >
            {!isExpand ? (<div className={styles.cityList}>{cityList}</div>) : null}
            <div className={styles.chainName}><BracketText text={ramenChain.name} /></div>
            {isExpand ? (<div>
                {
                    <button className={styles.checkInButton} onClick={() => { handleCheckInClick(!isWent) }} disabled={userProfile ? false : true}>
                        {isWent ? "啊，我還沒去" : "🍜 去過了～打卡！😋"}
                    </button>
                }
                <div className={styles.shopList}>
                    {ramenChain.shops.map((shop) => { return (<Shop key={shop.googlePlaceName.replace("places/", "")} shop={shop} />) })}
                </div>
                <div className={styles.contractButton}>關閉</div>
            </div>) : null}
        </div>
    );
}