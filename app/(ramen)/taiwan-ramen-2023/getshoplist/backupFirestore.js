const {Firestore} = require('@google-cloud/firestore');
const fs = require('fs');


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


async function backup() {
    const ramenChains = await getRamenChains();
    // Get current date
    const now = new Date();
    // Format date to the desired format
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
    // Use fs to save a file with the formatted date as the name
    const fileName = `./${formattedDate}.txt`;
    fs.writeFileSync(fileName, JSON.stringify(ramenChains, null, 2));
}

backup().catch(console.error);