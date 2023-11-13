const fs = require('fs');

let listOfRamenChains = [
    {"name": "一番星","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 0},
    {"name": "鬼金棒","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 1},
    {"name": "勝王","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 2},
    {"name": "雞吉君","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 3},
    {"name": "五之神","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 4},
    {"name": "隱家","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 5},
    {"name": "你回來啦","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 6},
    {"name": "拉麵公子","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 7},
    {"name": "柑橘Shinn","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 8},
    {"name": "塩琉","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 9},
    {"name": "真劍","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 10},
    {"name": "吉天元","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 11},
    {"name": "數寄屋辻葉","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 12},
    {"name": "麵屋壹の穴","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 13},
    {"name": "麵屋武藏","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""},{"area": "台中", "shopName": "", "gps": {}, "url": ""},{"area": "高雄", "shopName": "", "gps": {}, "url": ""}],"ranking": 14},
    {"name": "豚人","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""},{"area": "台南", "shopName": "", "gps": {}, "url": ""}],"ranking": 15},
    {"name": "麵屋壹慶","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 16},
    {"name": "麵屋昕家","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 17},
    {"name": "道樂","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""},{"area": "新北", "shopName": "", "gps": {}, "url": ""}],"ranking": 18},
    {"name": "悠然","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 19},
    {"name": "山嵐","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 20},
    {"name": "鳳華","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 21},
    {"name": "麵屋千雲","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 22},
    {"name": "墨洋","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 23},
    {"name": "旨燕","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 24},
    {"name": "壹の穴沾麵","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 25},
    {"name": "麵屋一燈","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 26},
    {"name": "美濃屋","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 27},
    {"name": "雞二","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 28},
    {"name": "蘭丸","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 29},
    {"name": "特濃屋","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 30},
    {"name": "極匠","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 31},
    {"name": "二屋","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 32},
    {"name": "CHILL RAMEN","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 33},
    {"name": "博多幸龍","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 34},
    {"name": "吉鴙","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 35},
    {"name": "麵屋雞金","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 36},
    {"name": "富察家","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 37},
    {"name": "古流","shops": [{"area": "台北", "shopName": "", "gps": {}, "url": ""}],"ranking": 38},
    {"name": "山下公園","shops": [{"area": "台中", "shopName": "", "gps": {}, "url": ""}],"ranking": 39},
    {"name": "有囍","shops": [{"area": "台中", "shopName": "", "gps": {}, "url": ""}],"ranking": 40},
    {"name": "牛庵","shops": [{"area": "台中", "shopName": "", "gps": {}, "url": ""}],"ranking": 41},
    {"name": "麵屋零","shops": [{"area": "台中", "shopName": "", "gps": {}, "url": ""}],"ranking": 42},
    {"name": "七面鳥","shops": [{"area": "台中", "shopName": "", "gps": {}, "url": ""}],"ranking": 43},
    {"name": "MEN Monster","shops": [{"area": "台中", "shopName": "", "gps": {}, "url": ""}],"ranking": 44},
    {"name": "麵本初","shops": [{"area": "台中", "shopName": "", "gps": {}, "url": ""}],"ranking": 45},
    {"name": "麵屋田宗","shops": [{"area": "台中", "shopName": "", "gps": {}, "url": ""}],"ranking": 46},
    {"name": "鮭の大助","shops": [{"area": "台中", "shopName": "", "gps": {}, "url": ""}],"ranking": 47},
    {"name": "元氣屋","shops": [{"area": "台中", "shopName": "", "gps": {}, "url": ""}],"ranking": 48},
    {"name": "千勝軒","shops": [{"area": "台中", "shopName": "", "gps": {}, "url": ""}],"ranking": 49},
    {"name": "麵屋黑心","shops": [{"area": "台中", "shopName": "", "gps": {}, "url": ""}],"ranking": 50},
    {"name": "麵屋聚","shops": [{"area": "台中", "shopName": "", "gps": {}, "url": ""}],"ranking": 51},
    {"name": "中華そば東池袋","shops": [{"area": "台中", "shopName": "", "gps": {}, "url": ""}],"ranking": 52},
    {"name": "麵屋秋鳴","shops": [{"area": "台中", "shopName": "", "gps": {}, "url": ""}],"ranking": 53},
    {"name": "吞山郎","shops": [{"area": "台中", "shopName": "", "gps": {}, "url": ""}],"ranking": 54},
    {"name": "雞勵軒","shops": [{"area": "台中", "shopName": "", "gps": {}, "url": ""}],"ranking": 55},
    {"name": "狸匠","shops": [{"area": "台中", "shopName": "", "gps": {}, "url": ""}],"ranking": 56},
    {"name": "超極丸","shops": [{"area": "台中", "shopName": "", "gps": {}, "url": ""}],"ranking": 57},
    {"name": "豚骨一笑","shops": [{"area": "台中", "shopName": "", "gps": {}, "url": ""}],"ranking": 58},
    {"name": "北穗製麵所","shops": [{"area": "台中", "shopName": "", "gps": {}, "url": ""}],"ranking": 59},
    {"name": "渡山樓","shops": [{"area": "台中", "shopName": "", "gps": {}, "url": ""}],"ranking": 60},
    {"name": "暴走中村","shops": [{"area": "台中", "shopName": "", "gps": {}, "url": ""}],"ranking": 61},
    {"name": "麵屋清流","shops": [{"area": "台中", "shopName": "", "gps": {}, "url": ""}],"ranking": 62},
    {"name": "福屋","shops": [{"area": "台中", "shopName": "", "gps": {}, "url": ""}],"ranking": 63},
    {"name": "三冬麵舖","shops": [{"area": "桃園", "shopName": "", "gps": {}, "url": ""}],"ranking": 64},
    {"name": "実家 另一個家","shops": [{"area": "桃園", "shopName": "", "gps": {}, "url": ""}],"ranking": 65},
    {"name": "辰拉麵","shops": [{"area": "新北", "shopName": "", "gps": {}, "url": ""}],"ranking": 66},
    {"name": "双豚","shops": [{"area": "新北", "shopName": "", "gps": {}, "url": ""}],"ranking": 67},
    {"name": "熊越岳","shops": [{"area": "新北", "shopName": "", "gps": {}, "url": ""}],"ranking": 68},
    {"name": "讓麵煮一會","shops": [{"area": "新北", "shopName": "", "gps": {}, "url": ""}],"ranking": 69},
    {"name": "麵屋山茶","shops": [{"area": "新北", "shopName": "", "gps": {}, "url": ""}],"ranking": 70},
    {"name": "海貓亭","shops": [{"area": "新北", "shopName": "", "gps": {}, "url": ""}],"ranking": 71},
    {"name": "懸日","shops": [{"area": "新北", "shopName": "", "gps": {}, "url": ""}],"ranking": 72},
    {"name": "丸宗","shops": [{"area": "新北", "shopName": "", "gps": {}, "url": ""}],"ranking": 73},
    {"name": "醉心","shops": [{"area": "新北", "shopName": "", "gps": {}, "url": ""}],"ranking": 74},
    {"name": "藏味","shops": [{"area": "新北", "shopName": "", "gps": {}, "url": ""}],"ranking": 75},
    {"name": "寶來軒","shops": [{"area": "台南", "shopName": "", "gps": {}, "url": ""}],"ranking": 76},
    {"name": "菜良","shops": [{"area": "台南", "shopName": "", "gps": {}, "url": ""}],"ranking": 77},
    {"name": "麵屋青鈴","shops": [{"area": "台南", "shopName": "", "gps": {}, "url": ""}],"ranking": 78},
    {"name": "麵屋青鳥","shops": [{"area": "台南", "shopName": "", "gps": {}, "url": ""}],"ranking": 79},
    {"name": "豚骨家","shops": [{"area": "台南", "shopName": "", "gps": {}, "url": ""}],"ranking": 80},
    {"name": "俺の豚","shops": [{"area": "台南", "shopName": "", "gps": {}, "url": ""}],"ranking": 81},
    {"name": "麵家壹霖丸","shops": [{"area": "台南", "shopName": "", "gps": {}, "url": ""}],"ranking": 82},
    {"name": "淳鳩一夫","shops": [{"area": "台南", "shopName": "", "gps": {}, "url": ""}],"ranking": 83},
    {"name": "拉麵山田","shops": [{"area": "屏東", "shopName": "", "gps": {}, "url": ""}],"ranking": 84},
    {"name": "麵魂家","shops": [{"area": "宜蘭", "shopName": "", "gps": {}, "url": ""}],"ranking": 85},
    {"name": "黑潮","shops": [{"area": "花蓮", "shopName": "", "gps": {}, "url": ""}],"ranking": 86},
    {"name": "匠心食堂","shops": [{"area": "花蓮", "shopName": "", "gps": {}, "url": ""}],"ranking": 87},
    {"name": "定置漁場三代目","shops": [{"area": "花蓮", "shopName": "", "gps": {}, "url": ""},{"area": "宜蘭", "shopName": "", "gps": {}, "url": ""},{"area": "基隆", "shopName": "", "gps": {}, "url": ""}],"ranking": 88},
    {"name": "麵屋祥","shops": [{"area": "高雄", "shopName": "", "gps": {}, "url": ""}],"ranking": 89},
    {"name": "らーめん壱","shops": [{"area": "高雄", "shopName": "", "gps": {}, "url": ""}],"ranking": 90},
    {"name": "吉胤家","shops": [{"area": "高雄", "shopName": "", "gps": {}, "url": ""}],"ranking": 91},
    {"name": "瀧澤軒","shops": [{"area": "高雄", "shopName": "", "gps": {}, "url": ""}],"ranking": 92},
    {"name": "沐瀧家","shops": [{"area": "高雄", "shopName": "", "gps": {}, "url": ""}],"ranking": 93},
    {"name": "中村製麵","shops": [{"area": "高雄", "shopName": "", "gps": {}, "url": ""}],"ranking": 94},
    {"name": "麵屋浩","shops": [{"area": "新竹", "shopName": "", "gps": {}, "url": ""}],"ranking": 95},
    {"name": "麵屋吉光","shops": [{"area": "新竹", "shopName": "", "gps": {}, "url": ""}],"ranking": 96},
    {"name": "Hiro's","shops": [{"area": "新竹", "shopName": "", "gps": {}, "url": ""},{"area": "新北", "shopName": "", "gps": {}, "url": ""},{"area": "台中", "shopName": "", "gps": {}, "url": ""}],"ranking": 97},
    {"name": "山越","shops": [{"area": "嘉義", "shopName": "", "gps": {}, "url": ""},{"area": "雲林", "shopName": "", "gps": {}, "url": ""}],"ranking": 98},
    {"name": "嵐田","shops": [{"area": "彰化", "shopName": "", "gps": {}, "url": ""}],"ranking": 99},
    {"name": "哈拉麵","shops": [{"area": "台東", "shopName": "", "gps": {}, "url": ""}],"ranking": 100}
  ];

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function populateShops() {
  for(let i = 0; i < listOfRamenChains.length; i++) {
    if (i % 10 === 0 && i !== 0) await delay(1000);
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': 'AIzaSyD5tT5hB67FyWM-UZcVThPtfWaklpvFH0s',
        'X-Goog-FieldMask': 'places.name,places.location,places.googleMapsUri,places.rating,places.userRatingCount,places.websiteUri,places.openingHours,places.addressComponents,places.formattedAddress,places.photos,places.types,places.businessStatus'
      },
      body: JSON.stringify({
        textQuery : `${listOfRamenChains[i].name} 拉麵`,
        languageCode: 'zh-TW',
        locationBias: {
          circle: {
            center: {
              latitude: 24.874558,
              longitude: 121.471935
            },
            radius: 50000.0
          }
        }
      })
    });

    const data = await response.json();

    listOfRamenChains[i].shops = data.places.map(place => {
      if(!place.name || !place.location || !place.googleMapsUri) {
        throw new Error('Required field is missing');
      }

      return {
        googlePlaceName: place.name,
        fullAddress: place.formattedAddress || '',
        city: place.addressComponents?.find(ac => ac.types.includes('administrative_area_level_1'))?.longText || '',
        area: place.addressComponents?.find(ac => ac.types.includes('administrative_area_level_2'))?.longText || place.addressComponents?.find(ac => ac.types.includes('administrative_area_level_3'))?.longText || '',
        gps: place.location,
        rating: place.rating || '',
        userRatingCount: place.userRatingCount || '',
        googleMapsUri: place.googleMapsUri,
        websiteUri: place.websiteUri || '',
        openingTime: place.openingHours?.weekdayDescriptions.join('\n') || '',
        isOperational: place.businessStatus === 'OPERATIONAL'
      };
    });
  }
}

populateShops().then(() => {
    fs.writeFile('output.json', JSON.stringify(listOfRamenChains, null, 2), (err) => {
      if (err) {
        console.error('Error writing file', err);
      } else {
        console.log('Successfully wrote to output.json');
        console.log(JSON.stringify(listOfRamenChains, null, 2));
      }
    });
});