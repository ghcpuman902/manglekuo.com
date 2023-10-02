import { cache } from 'react'
 
export const revalidate = 3600 * 24 // revalidate the data at most every day
 
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
    "https://www.newscientist.com/subject/space/feed/", 
    "https://spacenews.com/feed/", 
    "https://www.space.com/feeds/news", 
    "https://theconversation.com/us/technology/articles.atom"
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
                const description = item.description ? item.description[0] : '';
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
                    const description = entry.summary ? entry.summary[0] : '';
                    articles.push({ title, link, pubDate, description, source: url, distance: null, embedding: null, key: linkToKey(link) });
                }
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
            successfulSources.push(url);
            allArticles = allArticles.concat(articles);
        }
    }

    return { articles: allArticles, successfulSources };
});