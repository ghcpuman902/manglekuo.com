'use client';
import { useState, useEffect, useContext, useCallback } from 'react';
import styles from './styles.module.css'
import Link from 'next/link';

import { useUser } from './user-context';



const BracketText = ({text}) => {
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
    const {isLoggedIn,userProfile,handleUpdateShop} = useUser();

    const [isWent, setIsWent] = useState(false);
    const [isExpand, setIsExpand] = useState(false);

    let cityList = '';
    let allshopClosed = false;

    useEffect(()=>{
        if(userProfile !== undefined){
            if(userProfile.shops && userProfile.shops[ramenChainId] && userProfile?.shops[ramenChainId].isWent){
                setIsWent( userProfile.shops[ramenChainId].isWent);
                console.log(`Rendering ${ramenChain.name},${userProfile.shops[ramenChainId].isWent?'went':''}`);
            }else{
                setIsWent( false );
            }
        }else{
            setIsWent( false );
        }
    },[userProfile]);

    if (ramenChain.shops && Array.isArray(ramenChain.shops) && ramenChain.shops.length > 0) {
        // has branches
        cityList = [...new Set(ramenChain.shops.map(shop => shop.city.replace(/市|縣/g, "")))].join(" ");
        allshopClosed = ramenChain.shops.every(shop => !shop.isOperational);
    } else {
        allshopClosed = true;
    }
    

    const handleCheckInClick = useCallback(async (newIsWent) => {
        if(isLoggedIn){
            console.log(`handleUpdateShop`,{shopId:ramenChainId,shopChange:{isWent: newIsWent}});
            // handle cloud change
            handleUpdateShop({shopId:ramenChainId,shopChange:{isWent: newIsWent}});
        }else{
            console.log(`handleUpdateShop failed, isLoggedIn:`,isLoggedIn);
        }
        // handle local change
        setIsWent( newIsWent );
    }, [isLoggedIn]);


    return (
        <div className={styles.shop + ` ${isWent ? styles.went : ""} ${isExpand ? styles.expand : ""} ${allshopClosed ? styles.allshopClosed : ""}`} onClick={() => setIsExpand(!isExpand)} >
            {!isExpand ? (<div className={styles.cityList}>{cityList}</div>) : null}
            <div className={styles.chainName}><BracketText text={ramenChain.name}/></div>
            {isExpand ? (<div>
                {
                    <button className={styles.checkInButton} onClick={() => { handleCheckInClick(!isWent) }}>
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