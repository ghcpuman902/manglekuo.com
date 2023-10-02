const Firestore = require('@google-cloud/firestore');
const fs = require('fs');

const db = new Firestore({
  projectId: 'taiwan-ramen-2023',
  keyFilename: "./taiwan-ramen-2023-firebase-adminsdk-7hzd1-1ca17072aa.json",
});

// Read JSON file and parse it
const jsonData = fs.readFileSync('./listOfRamenChains.json');
const ramenChains = JSON.parse(jsonData);

// Add each chain to the database
ramenChains.list.forEach(async (chain) => {
  const res = await db.collection('ramen-shop-list-2023').add(chain);
  console.log('Added document with ID: ', res.id);
});