import styles from './styles.module.css'
import { getShops } from './utils/get-shops'
import RamenShop from './ramenShop'


function removeAndReturn(obj) {
  for (let key in obj) {
    if (obj[key].ranking === 0) {
      const item = obj[key];
      const newObj = { ...obj };
      delete newObj[key];
      return [key, item, newObj]; // Return the key, item, and the new object
    }
  }
  return null; // or undefined, or however you wish to handle "not found"
}


export default async function Page() {
  let Shops = await getShops();
  const [zerothItemKey, zerothItem, newShops] = removeAndReturn(Shops);

  return (
    <>
      <div className={`${styles.grid} ${styles.gridTop}`}>
        <RamenShop
          key={zerothItemKey}
          ramenChainId={zerothItemKey}
          ramenChain={zerothItem}
        />
      </div>
      <div className={styles.grid}>
        {Object.entries(newShops).map(([id, Shop]) => {
          return (
            <RamenShop
              key={id}
              ramenChainId={id}
              ramenChain={Shop}
            />);
        })}
      </div>
    </>
  )
}

