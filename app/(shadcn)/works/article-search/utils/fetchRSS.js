import { cache } from 'react';
import 'server-only';
import {formatDate} from './utils'; 

export const revalidate = 3600;

import * as htmlparser2 from "htmlparser2";

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

export const fetchArticlesFromFeed = cache(async (url) => {
    let articles = [];
    try {
        const response = await fetch(url);
        const data = await response.text();
        const parsedResult = htmlparser2.parseFeed(data, {xmlMode:true});
        // return;
        if (parsedResult.type === 'rss' && parsedResult.items) {
            // RSS format
            const items = parsedResult.items;
            for(let item of items) {
                const title = item.title;
                const link = item.link;
                const pubDate = item.pubDate;
                let description = item.description?item.description:'';
                const thumbnail = item.media.length > 0 ? item.media[0] : null;
                if (thumbnail) {
                    description = "<img src = '"+ thumbnail +"' style='max-width:100%;height:auto;'>" + description;
                }
                articles.push({ title, link, pubDate, description, source: url, distance: null, embedding: null, key: linkToKey(link) });
            }
        } else if (parsedResult.type === 'atom' && parsedResult.items) {
            // Atom format
            const items = parsedResult.items;
            for(let item of items) {
                const title = item.title;
                const link = item.link;
                const pubDate = item.pubDate;
                let description = item.description?item.description:'';
                const thumbnail = item.media && item.media.length > 0 ? item.media[0] : null;
                if (thumbnail) {
                     description = "<img src = '"+ thumbnail +"' style='max-width:100%;height:auto;'>" + description;
                }
                articles.push({ title, link, pubDate, description, source: url, distance: null, embedding: null, key: linkToKey(link) });
            }
        } else if (parsedResult.type === 'rdf' && parsedResult.items) {
            // RDF format
            const items = parsedResult.items;
            for(let item of items) {
                const title = item.title;
                const link = item.link;
                const pubDate = item.pubDate;
                let description = item.description?item.description:'';
        
                articles.push({ title, link, pubDate, description, source: url, distance: null, embedding: null, key: linkToKey(link) });
            }
        } else {
            console.error(`Unexpected XML structure for URL: ${url}, possible type: ${parsedResult.type?parsedResult.type:'unknown'}`);
            return [];
        }
        
    } catch (error) {
        console.error(`Error fetching the feed for URL: ${url}`, error);
        return [];
    }
    return articles;
});


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

    const date = new Date();
    const formattedString = formatDate(date);
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

    const date = new Date();
    const formattedString = formatDate(date);
    console.log(`fetchAllJapanArticles ${formattedString}`);
    return { articles: allArticles, successfulSources, updateTime: formattedString};
});