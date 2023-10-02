const {Firestore} = require('@google-cloud/firestore');

const db = new Firestore({
  projectId: 'taiwan-ramen-2023',
  keyFilename: "./taiwan-ramen-2023-firebase-adminsdk-7hzd1-1ca17072aa.json",
});

async function getRamenChains() {
  const ramenShopList2023Ref = db.collection('ramen-shop-list-2023');
  const snapshot = await ramenShopList2023Ref.orderBy("ranking").get();
  const ramenChains = {};
  snapshot.forEach(doc => ramenChains[doc.id] = doc.data());
  return ramenChains;
}


async function updateRamenChains() {
  const ramenChains = await getRamenChains();
  for (const [id, ramenChain] of Object.entries(ramenChains)) {
    if(ramenChain.ranking == 84){
      let newShops = [];
      for (const shop of ramenChain.shops) {
        const placeId = shop.googlePlaceName.split('/')[1];
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&language=zh-TW&fields=name,photo&key=AIzaSyD5tT5hB67FyWM-UZcVThPtfWaklpvFH0s`);
        const data = await response.json();
      //   console.log(data);
        const {name, photos} = data.result;
        const topFivePhotos = photos.slice(0, 5); 
      //   console.log(name, topFivePhotos);
        newShops.push({...shop,name, topFivePhotos});
      }
      console.log(newShops);
      const shopRef = db.collection('ramen-shop-list-2023').doc(id);
      await shopRef.update({shops: newShops});

    }
  }
}

updateRamenChains().catch(console.error);