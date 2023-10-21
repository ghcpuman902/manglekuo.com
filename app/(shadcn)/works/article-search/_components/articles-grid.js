'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { ArticleCard } from "./article-card";
import { useLoading, useQueryString, useSortingMethod, useFilterByDays } from './article-context';
import { initializeCache, getCacheArticles, updateCacheArticles, searchCacheQueryEmbedding, appendCacheQueryEmbedding, borrowCacheEmbeddings, returnCacheEmbeddings, clearAllData } from '../_utils/local-articles';

import { dotProduct, timeAgo, olderThan1hr, getDictionary, getDomainNameFromUrl, customHash } from "../_utils/utils";
import { gzip } from 'pako';


export const ArticlesGrid = ({ locale, articles, updateTime }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const dict = getDictionary(locale);

    // Get a new searchParams string by merging the current
    // searchParams with a provided key/value pair
    const createQueryString = useCallback(
        (name, value) => {
            const params = new URLSearchParams(searchParams)
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    );

    const batchEmbeddingUrl = '/works/article-search/api/batch-embedding-kv';
    const [loading, setLoading] = useLoading();
    const [queryString, setQueryString] = useQueryString();
    const [sortingMethod, setSortingMethod] = useSortingMethod();
    const [filterByDays, setFilterByDays] = useFilterByDays();

    const [lArticles, setLArticles] = useState(articles);
    const queryEmbedding = useRef(null);

    const sortArticles = useCallback((arts) => {
        const daysAgo = Date.now() - (filterByDays ? filterByDays : 4) * 24 * 60 * 60 * 1000;

        // Filter for articles published within the last n days
        const filteredArticles = arts.map(art => {
            // Create a new Date object from the pubDate string
            const pubDate = new Date(art.pubDate);
            // Convert the date to the number of milliseconds elapsed since January 1, 1970
            const articleDateInMs = pubDate.getTime();

            // If article is not from the specified last days, hide it.
            return { ...art, hidden: !(articleDateInMs >= daysAgo) };
        });

        // First sort by date in descending order (newest first)
        filteredArticles.sort((a, b) => {
            const aDate = new Date(a.pubDate);
            const bDate = new Date(b.pubDate);

            return bDate - aDate; // swap these to change order
        });

        if (sortingMethod === 'date') {
            return filteredArticles;
        }

        // Next sort by distance
        const final = filteredArticles.sort((a, b) => {
            if (!a.hasOwnProperty('distance') || a.distance == null) return 1;
            if (!b.hasOwnProperty('distance') || b.distance == null) return -1;

            return b.distance - a.distance;
        });

        return final;
    }, [filterByDays, sortingMethod]);

    const getQueryEmbedding = useCallback(async (query) => {
        if (query == '') {
            console.error(`getQueryEmbedding: query empty!`);
            return;
        }
        try {
            query = query.toLowerCase()
            .replace(/\s+/g, ' ')
            .trim().slice(0, 280);
            const cachedQueryEmbedding = await searchCacheQueryEmbedding(query);
            if (cachedQueryEmbedding) {
                console.log(`using cached targetEmbedding`);
                return cachedQueryEmbedding;
            } else {
                console.log(`fetching targetEmbeddings`);
                const res = await fetch('/works/article-search/api/embedding', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query }),
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch', resJson);
                }
                const resJson = await res.json();
                const targetEmbedding = resJson.result;
                appendCacheQueryEmbedding({ query, embedding: targetEmbedding });
                return targetEmbedding;
            }
        } catch (error) {
            console.error(`Error with getting embedding for query: ${error}`);
        }
    }, []);

    useEffect(() => {
        const updateEmbeddings = async (articles, targetEmbedding, updateRestFlag = false) => {
            let articlesToFetchEmbeddingsFor = [];
            const cacheEmbeddings = await borrowCacheEmbeddings();

            // Loop through the articles to check for cached embeddings
            for (const article of articles) {
                if ((!article.hidden) ^ updateRestFlag) {
                    const hashedTitle = `AS::${customHash(`${article.title}||||${article.description.replace(/\n|\t|[ ]{4}/g, '').replace(/<[^>]*>/g, '')}`)}`;
                    const cachedEmbedding = cacheEmbeddings[hashedTitle];

                    if (cachedEmbedding) {
                        article.embedding = cachedEmbedding;
                        console.log(`local cache hit`);
                        article.distance = dotProduct(article.embedding, targetEmbedding);
                    } else {
                        // If no cached embedding found, add it to the list of articles we'll need to fetch embeddings for
                        articlesToFetchEmbeddingsFor.push({ article, hashedTitle });
                    }
                }
            }

            // If there are articles we still need embeddings for, we'll make the batch API call
            if (articlesToFetchEmbeddingsFor.length) {
                const res = await fetch(batchEmbeddingUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Encoding': 'gzip',
                    },
                    body: gzip(JSON.stringify({
                        texts: articlesToFetchEmbeddingsFor.map(({ article }) => `${article.title}||||${article.description.replace(/\n|\t|[ ]{4}/g, '').replace(/<[^>]*>/g, '')}`)
                    })),
                });

                // Retrieve the binary data
                const arrayBuffer = await res.arrayBuffer();

                // Convert the ArrayBuffer to Float64Array
                let embeddingsResult = new Float64Array(arrayBuffer);

                // split embeddingsResult into individual embeddings
                const embeddingSize = 1536;
                articlesToFetchEmbeddingsFor.forEach((item, i) => {
                    let start = i * embeddingSize;
                    let end = start + embeddingSize;
                    item.article.embedding = Array.from(embeddingsResult.slice(start, end));
                    item.article.distance = dotProduct(item.article.embedding, targetEmbedding);
                    cacheEmbeddings[item.hashedTitle] = item.article.embedding; // update our cache
                    console.log(`setting cache for ${item.hashedTitle}`);
                });

                // return the updated cache without waiting for it to complete
                returnCacheEmbeddings(cacheEmbeddings).catch(error => console.error(`Failed to update cache: ${error}`));
            }

            return articles;
        }

        const fetchData = async () => {
            await initializeCache();
            const [cArticles, cUpdateTime, cLocale] = await getCacheArticles();
            if (cUpdateTime) {
                const diffInSeconds = Math.floor((new Date() - new Date(cUpdateTime)) / 1000);
                if (diffInSeconds < 3600 && cLocale && cLocale == locale) {
                    console.log({cLocale, locale});
                    console.log(`less than an hour & same locale, using cached articles`);
                    setLArticles(cArticles);
                    setLoading(200);
                    return;
                }
            } else {
                try {
                    console.log(`older than an hour or locale changed, attempt to add embeddings`);

                    queryEmbedding.current = await getQueryEmbedding(queryString);

                    const partiallyAddEmbeddings = async (articlesWithoutEmbeddings) => {
                        console.log(`updating displaying articles (fetching individual embeddings + calculate distance)`);
                        const updatedArticles = await updateEmbeddings(articlesWithoutEmbeddings, queryEmbedding.current);
                        console.log(`sorting articles`);
                        const sortedAndUpdatedArticles = sortArticles(updatedArticles);
                        setLArticles(sortedAndUpdatedArticles);
                        setLoading(200);
                        const fullyAddEmbeddings = async (articlesWithSomeEmbeddings) => {
                            console.log(`updating remaining articles (fetching individual embeddings + calculate distance)`);
                            const updatedArticles = await updateEmbeddings(articlesWithSomeEmbeddings, queryEmbedding.current, true);
                            console.log(`sorting articles`);
                            const sortedAndUpdatedArticles = sortArticles(updatedArticles);
                            setLArticles(sortedAndUpdatedArticles);
                            updateCacheArticles({ articles: sortedAndUpdatedArticles, updateTime: updateTime, locale: locale });
                        }
                        fullyAddEmbeddings(sortedAndUpdatedArticles);
                    }
                    setLoading(3);
                    partiallyAddEmbeddings(articles);
                } catch (error) {
                    throw new Error(`something went wrong! please let the developer know!\n${JSON.stringify(error, null, 2)}`);
                }
            }
        }
        fetchData();
    }, []);


    useEffect(() => {
        if (loading >= 200) {
            setLoading(0);
            async function reorderArticlesByDate() {
                console.log(`re-ordering articles, sortingMethod or filterByDays chanched`);
                const sortedAndUpdatedArticles = sortArticles(lArticles);
                setLArticles(sortedAndUpdatedArticles);
                updateCacheArticles({ articles: sortedAndUpdatedArticles, updateTime: updateTime, locale: locale });
                setLoading(200);
            }
            reorderArticlesByDate();
        }
    }, [sortingMethod, filterByDays]);




    const reorderArticlesByDistance = async (query, arts) => {
        if (query == '' || !arts) {
            return;
        }
        queryEmbedding.current = await getQueryEmbedding(query);
        console.log(`${query} ${JSON.stringify(queryEmbedding.current).slice(0, 100)}`);
        const updatedArticles = arts.map((article) => {
            article.distance = dotProduct(article.embedding, queryEmbedding.current);
            return article;
        });
        const sortedAndUpdatedArticles = sortArticles(updatedArticles);
        setLArticles(sortedAndUpdatedArticles);
        updateCacheArticles({ articles: sortedAndUpdatedArticles, updateTime: updateTime, locale: locale });
        setLoading(200);
    }

    useEffect(() => {
        if (loading >= 200) {
            if (queryString == '' || !lArticles) {
                return;
            }
            setLoading(0);
            console.log(`re-sorting articles after queryString changed`);
            router.push(pathname + '?' + createQueryString('q', queryString));
            reorderArticlesByDistance(queryString, lArticles);
        }
    }, [queryString]);

    useEffect(() => {
        // handle page nav using FORWARD '←' OR BACKWARD'→' buttons.
        if (!searchParams.has('q') || !searchParams.get('q') || !lArticles || searchParams.get('q') === queryString) {
            // no query, empty query, no loaded article, query string not changed
            return;
        }
        setQueryString(searchParams.get('q'));
        setLoading(0);
        console.log(`re-sorting articles after page nav`);
        reorderArticlesByDistance(searchParams.get('q'), lArticles);;
    }, [searchParams]);
    
    return (
        <>
            <div className="items-stretch justify-center mb-6">
                <div className="scroll-m-20 font-semibold tracking-tight text-neutral-400 dark:text-neutral-600">{
                    lArticles ?
                        dict.title.articles_in_past_days.replace(
                            "[NUMBER]",
                            lArticles.filter(article => !article.hidden).length
                        ).replace(
                            "[DAYS]",
                            filterByDays
                        ) : 'fetching articles'
                }</div>
            </div>
            <div className="items-stretch justify-center gap-6 rounded-lg grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {lArticles ?
                    lArticles.map((article) => {
                        return (article.hidden && article.hidden === true) ? null : (<ArticleCard locale={locale} key={article.key} article={article} />);
                    }) : null
                }
            </div>
            <div className="flex justify-center my-3">
            <Button variant="link" onClick={() => { clearAllData(); }}>clear all data</Button>
            </div>
        </>
    );
}