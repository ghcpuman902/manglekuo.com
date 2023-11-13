'use client';
const SHOPS_KEY = 'shops';

// Retrieve shops data from local storage
export const getLocalUserShops = () => {
  try{
    if (typeof window !== "undefined") {
      const shops = JSON.parse(localStorage.getItem(SHOPS_KEY)); 
      if(shops){
          return shops;
      }else{
          return {}; // Return empty object when there's no shops data
      }
    }else{
      return {};
    }
  } catch(e){
      console.error("Error reading from local storage:", e);
      return {};
  }
}


// Update the shops data in local storage
export const updateLocalUserShops = (newShops) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(SHOPS_KEY, JSON.stringify(newShops));
    return newShops;
  }else{
    return {};
  }
}

// Update the shops data in local storage
export const updateLocalUserSingleShop = ({shopId, shopChange}) => {
  if (typeof window !== "undefined") {
    let shops = getLocalUserShops();
    shops[shopId] = mergeShopData(shops[shopId], shopChange);
    localStorage.setItem(SHOPS_KEY, JSON.stringify(shops));
    return shops;
  }else{
    return {};
  }
}

// Merge old and new data
function mergeShopData(oldData, newData) {
  const newIsWent = newData.hasOwnProperty('isWent') ? newData.isWent : (oldData && oldData.hasOwnProperty('isWent') ? oldData.isWent : false);
  const newReview = newData.hasOwnProperty('review') ? newData.review : (oldData && oldData.hasOwnProperty('review') ? oldData.review : '');
  const newPhoto = newData.hasOwnProperty('photo') ? newData.photo :  (oldData && oldData.hasOwnProperty('photo') ? oldData.photo : '');

  return { isWent: newIsWent, review: newReview, photo: newPhoto }
}