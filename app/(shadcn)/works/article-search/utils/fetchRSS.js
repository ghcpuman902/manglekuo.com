import { cache } from 'react'
 
export const revalidate = 3600;
 
import xml2js from 'xml2js';

export const linkToKey =  function (message) {
    // Replace symbols with ASCII characters
    const sanitizedLink = message.replace(/[^a-zA-Z0-9]+/g, '-');

    // Remove leading and trailing dashes
    return sanitizedLink.replace(/^-+|-+$/g, '');
}

// URLs of the RSS feeds
const rss_feeds = [
    "https://scitechdaily.com/feed/", 
    "https://phys.org/rss-feed/space-news/", 
    "https://www.universetoday.com/feed",
    "https://www.space.com/feeds/news",
    "https://www.sciencealert.com/feed",
    "https://skyandtelescope.org/astronomy-news/feed",
    "https://spacenews.com/feed/", 
    "http://rss.sciam.com/ScientificAmerican-Global",
    "https://ras.ac.uk/rss.xml",
    "https://www.sci.news/astronomy/feed",
    "https://www.newscientist.com/subject/space/feed/",
    "https://theconversation.com/us/technology/articles.atom"
];

const rss_feed_jp = [
    "https://sorae.info/feed",
    "https://www.nao.ac.jp/atom.xml",
    "http://www.astroarts.co.jp/article/feed.atom",
    "https://subarutelescope.org/jp/atom.xml",
    "https://alma-telescope.jp/news/feed",
    "https://www.jaxa.jp/rss/press_j.rdf"
];

export const fetchArticlesFromFeed = async (url) => {
    let articles = [];
    try {
        const response = await fetch(url);
        const data = await response.text();
        const parsedResult = await xml2js.parseStringPromise(data);
        
        if (parsedResult.rss && parsedResult.rss.channel && parsedResult.rss.channel[0].item) {
            // RSS format
            const items = parsedResult.rss.channel[0].item;
            for(let item of items) {
                const title = item.title[0];
                const link = item.link[0];
                const pubDate = item.pubDate[0];
                let description = item.description ? item.description[0] : '';
                const thumbnail = item['media:thumbnail'] ? item['media:thumbnail'][0].$.url : null
                if (thumbnail) {
                    description = "<img src = '"+ thumbnail +"' style='max-width:100%;height:auto;'>" + description
                }
                articles.push({ title, link, pubDate, description, source: url, distance: null, embedding: null, key: linkToKey(link) });
            }
        } else if (parsedResult.feed && parsedResult.feed.entry) {
            // Atom format
            const entries = parsedResult.feed.entry;
            for(let entry of entries) {
                if(entry && entry.title && entry.title[0] && entry.link){
                    const title = entry.title[0];
                    const link = entry.link && entry.link[0] && entry.link[0].$.href;
                    const pubDate = entry.updated[0];
                    let description = entry.summary ? entry.summary[0] : '';
                    const thumbnail = entry['media:thumbnail'] ? entry['media:thumbnail'][0].$.url : null
                    if (thumbnail) {
                        description = "<img src = '"+ thumbnail +"' style='max-width:100%;height:auto;'>" + description
                    }
                    articles.push({ title, link, pubDate, description, source: url, distance: null, embedding: null, key: linkToKey(link) });
                }
            }
        } else if (parsedResult['rdf:RDF'] && parsedResult['rdf:RDF'].item) {
            // RDF format
            const items = parsedResult['rdf:RDF'].item;
            for(let item of items) {
                const title = item.title[0];
                const link = item.about || item.link[0]; // 'about' attribute or <link> tag corresponds to 'link' in RDF
                const pubDate = item['dc:date'][0];
                let description = item.description ? item.description[0] : '';

                articles.push({ title, link, pubDate, description, source: url, distance: null, embedding: null, key: linkToKey(link) });
            }
        } else {
            console.error(`Unexpected XML structure for URL: ${url}`);
            return [];
        }
        
    } catch (error) {
        console.error(`Error fetching the feed for URL: ${url}`, error);
        return [];
    }
    return articles;
}

export const fetchAllArticles = cache(async () => {
    let allArticles = [];
    let successfulSources = [];

    for(let url of rss_feeds) {
        const articles = await fetchArticlesFromFeed(url);
        if (articles.length > 0) {
            successfulSources.push({url,count:articles.length});
            allArticles = allArticles.concat(articles);
        }
    }

    let date = new Date();
    let day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getUTCDay()];
    let dayOfMonth = date.getUTCDate().toString().padStart(2, '0');
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let year = date.getUTCFullYear();
    let hours = date.getUTCHours().toString().padStart(2, '0');
    let minutes = date.getUTCMinutes().toString().padStart(2, '0');
    let seconds = date.getUTCSeconds().toString().padStart(2, '0');
    
    let formattedString = `${day}, ${dayOfMonth} ${months[date.getUTCMonth()]} ${year} ${hours}:${minutes}:${seconds} +0000`;
    console.log(`fetchAllArticles ${formattedString}`);
    return { articles: allArticles, successfulSources, updateTime: formattedString};
});

export const fetchAllJapanArticles = cache(async () => {
    let allArticles = [];
    let successfulSources = [];

    for(let url of rss_feed_jp) {
        const articles = await fetchArticlesFromFeed(url);
        if (articles.length > 0) {
            successfulSources.push({url,count:articles.length});
            allArticles = allArticles.concat(articles);
        }
    }

    let date = new Date();
    let day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getUTCDay()];
    let dayOfMonth = date.getUTCDate().toString().padStart(2, '0');
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let year = date.getUTCFullYear();
    let hours = date.getUTCHours().toString().padStart(2, '0');
    let minutes = date.getUTCMinutes().toString().padStart(2, '0');
    let seconds = date.getUTCSeconds().toString().padStart(2, '0');
    
    let formattedString = `${day}, ${dayOfMonth} ${months[date.getUTCMonth()]} ${year} ${hours}:${minutes}:${seconds} +0000`;
    console.log(`fetchAllJapanArticles ${formattedString}`);
    return { articles: allArticles, successfulSources, updateTime: formattedString};
});