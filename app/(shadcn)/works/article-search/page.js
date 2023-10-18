'use client';
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Badge } from "@components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import { gzip } from 'pako';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import ArticleCard from "./ArticleCard";

import { dotProduct, timeAgo, olderThan1hr, getDictionary, getDomainNameFromUrl, customHash } from "./utils/utils";
import { initializeCache, getCacheArticles, updateCacheArticles, searchCacheQueryEmbedding, appendCacheQueryEmbedding, borrowCacheEmbeddings, returnCacheEmbeddings, clearAllData } from './utils/local-articles';

export default function Page() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

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

    let defaultQueryString = 'astronomy scientific research, space exploration, deep sky news';
    let articlesFetchUrl = '/works/article-search/api/articles';
    let batchEmbeddingUrl = '/works/article-search/api/batch-embedding-kv';
    let locale = 'en';
    if (searchParams.has('jp')) {
        defaultQueryString = '天文学の研究、宇宙探査、深宇宙のニュース';
        articlesFetchUrl = '/works/article-search/api/articles-jp';
        locale = 'jp';
    }
    if (searchParams.has('q')) {
        defaultQueryString = searchParams.get('q');
    }
    const dict = getDictionary(locale);


    const [loading, setLoading] = useState(0);
    const [articles, setArticles] = useState(null);
    const [successfulSources, setSuccessfulSources] = useState(null);
    const [updateTime, setUpdateTime] = useState(null);
    const queryInputRef = useRef();
    const [queryString, setQueryString] = useState(defaultQueryString);
    const queryEmbedding = useRef(null);
    const [sortingMethod, setSortingMethod] = useState('relevance');
    const [filterByDays, setFilterByDays] = useState(4);

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
            const getArticles = async () => {
                try {
                    const [cArticles, cSuccessfulSources, cUpdateTime, cLocale] = await getCacheArticles();
                    if (cUpdateTime) {
                        const diffInSeconds = Math.floor((new Date() - new Date(cUpdateTime)) / 1000);
                        if (diffInSeconds < 3600 && cLocale && cLocale == locale) {
                            console.log(`less than an hour, using cached articles`);
                            return [cArticles, cSuccessfulSources, cUpdateTime];
                        }
                    }
                    console.log(`fetching articles`);
                    const res = await fetch(articlesFetchUrl);
                    const resJson = await res.json();
                    if (!res.ok) {
                        throw new Error('Failed to fetch', resJson);
                    }
                    return [resJson.articles, resJson.successfulSources, resJson.updateTime];
                } catch (error) {
                    console.error('getArticles error', error);
                }
            }
            const [gAArticles, gASuccessfulSources, gAUpdateTime] = await getArticles();
            const sortedArticles = sortArticles(gAArticles);
            setArticles(sortedArticles);
            setSuccessfulSources(gASuccessfulSources);
            setUpdateTime(gAUpdateTime);
            // router.push(pathname + '?' + createQueryString('q', queryString));
            queryEmbedding.current = await getQueryEmbedding(queryString);

            const partiallyAddEmbeddings = async (articlesWithoutEmbeddings) => {
                console.log(`updating displaying articles (fetching individual embeddings + calculate distance)`);
                const updatedArticles = await updateEmbeddings(articlesWithoutEmbeddings, queryEmbedding.current);
                console.log(`sorting articles`);
                const sortedAndUpdatedArticles = sortArticles(updatedArticles);
                setArticles(sortedAndUpdatedArticles);
                updateCacheArticles({ articles: sortedAndUpdatedArticles, successfulSources: gASuccessfulSources, updateTime: gAUpdateTime, locale: locale });
                setLoading(200);
                const fullyAddEmbeddings = async (articlesWithSomeEmbeddings) => {
                    console.log(`updating remaining articles (fetching individual embeddings + calculate distance)`);
                    const updatedArticles = await updateEmbeddings(articlesWithSomeEmbeddings, queryEmbedding.current, true);
                    console.log(`sorting articles`);
                    const sortedAndUpdatedArticles = sortArticles(updatedArticles);
                    setArticles(sortedAndUpdatedArticles);
                    await updateCacheArticles({ articles: sortedAndUpdatedArticles, successfulSources: gASuccessfulSources, updateTime: gAUpdateTime, locale: locale });
                    setLoading(200);
                }
                fullyAddEmbeddings(sortedAndUpdatedArticles);
            }
            setLoading(3);
            partiallyAddEmbeddings(sortedArticles);
        }
        setLoading(1);
        fetchData();
    }, []);



    const reorderArticlesByDistance = async (query) => {
        // setLoading(2);
        if (queryString == '' || !articles) {
            return;
        }
        queryEmbedding.current = await getQueryEmbedding(query);
        console.log(`${query} ${JSON.stringify(queryEmbedding.current).slice(0, 100)}`);
        const updatedArticles = articles.map((article) => {
            article.distance = dotProduct(article.embedding, queryEmbedding.current);
            return article;
        });
        // setLoading(4);
        const sortedAndUpdatedArticles = sortArticles(updatedArticles);
        setArticles(sortedAndUpdatedArticles);
        updateCacheArticles({ articles: sortedAndUpdatedArticles, successfulSources, updateTime });
        setLoading(200);
    }

    useEffect(() => {
        //handleReorder
        if (queryString == '' || !articles) {
            return;
        }
        setLoading(0);
        if (sortingMethod == 'date') {
            async function reorderArticlesByDate() {
                console.log(`reordering articles by date`);
                // setLoading(4);
                const sortedAndUpdatedArticles = sortArticles(articles);
                setArticles(sortedAndUpdatedArticles);
                updateCacheArticles({ articles: sortedAndUpdatedArticles, successfulSources, updateTime });
                setLoading(200);
            }
            reorderArticlesByDate();
        } else {
            console.log(`re-sorting articles after targetEmbedding changed`);
            router.push(pathname + '?' + createQueryString('q', queryString));
            reorderArticlesByDistance(queryString);
        }
    }, [sortingMethod, filterByDays, queryString]);

    useEffect(() => {
        // handle page nav using FORWARD '←' OR BACKWARD'→' buttons.
        if (!searchParams.has('q') || !searchParams.get('q') || !articles || searchParams.get('q') === queryString) {
            return;
        }
        queryInputRef.current.value = searchParams.get('q');
        setQueryString(searchParams.get('q'));
        setLoading(0);
        console.log(`re-sorting articles after page nav`);
        reorderArticlesByDistance(searchParams.get('q'));
    }, [searchParams]);

    const updateSortingMethod = (e) => {
        if (e == 'date') {
            setSortingMethod('date');
        } else {
            setSortingMethod('relevance');
        }
    }

    const updateFilterDays = (e) => {
        const durations = {
            'one-month': 30,
            'one-week': 7,
            'four-days': 4,
            'fourty-eight-hours': 2
        };
        setFilterByDays(durations.hasOwnProperty(e) ? durations[e] : 4);
    }


    return (
        <div className="p-4 md:p-8">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">{dict.title.article_search}<span className="text-lg text-blue-600 inline-block align-text-top">beta</span></h1>

            <div className="my-6">
                <Label className="mr-1">{dict.label.article_sources}</Label>
                {successfulSources ? successfulSources.map((source, index) => {
                    const { url, count } = source;
                    return (
                        <Badge key={index} variant="outline" className="mx-1">
                            <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">{getDomainNameFromUrl(url)} ({count})</a>
                        </Badge>
                    );
                }) : dict.label.loading}
                <Label className="text-gray-400 dark:text-gray-500">{dict.label.last_fetched.replace("[TIME AGO]", timeAgo(updateTime, locale))} {olderThan1hr(updateTime) ? dict.label.please_refresh : null}</Label>
            </div>

            <h2 
                className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
            >{dict.title.fetched_articles}{articles ? dict.title._within_the_past_.replace("[NUMBER]", articles.filter(article => !article.hidden).length).replace("[DAYS]", filterByDays) : ''}</h2>
            <div className="my-6 w-full flex flex-wrap justify-center">
                <div className="w-full flex mb-6">
                    <Input id="query" type="text" className="mr-2" defaultValue={queryString} ref={queryInputRef} onKeyPress={event => {
                        if (event.key === 'Enter') {
                            event.preventDefault(); // Prevents the default action of enter key
                            setQueryString(queryInputRef.current.value ? queryInputRef.current.value : queryString);
                        }
                    }} />
                    <Button className="flex flex-nowrap whitespace-nowrap" onClick={() => { setQueryString(queryInputRef.current.value ? queryInputRef.current.value : queryString); }} disabled={loading != 200}>{loading != 200 ? (<><span className="animate-spin text-xl">☻</span>&nbsp;&nbsp;{dict.button.wait}</>) : dict.button.search}</Button>
                </div>
                <div className="flex items-center">
                    <Label htmlFor="sort-by-options" className="my-2 mr-3">{dict.label.sort_by}</Label>
                    <RadioGroup defaultValue="relevance" id="sort-by-options" className="grid-cols-2 gap-2"
                        onValueChange={updateSortingMethod}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="relevance" id="relevance" checked={sortingMethod == "relevance"} />
                            <Label htmlFor="relevance">{dict.label.relevance}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="date" id="date" checked={sortingMethod == "date"} />
                            <Label htmlFor="date">{dict.label.date}</Label>
                        </div>
                    </RadioGroup>
                </div>
                <div className="flex items-center">
                    <Label htmlFor="filter-by-options" className="my-2 mr-3">{dict.label.filter_by}</Label>
                    <RadioGroup defaultValue="four-days" id="filter-by-options" className="grid-cols-4 gap-2"
                        onValueChange={updateFilterDays}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="one-month" id="one-month" checked={filterByDays == 30} />
                            <Label htmlFor="one-month">{dict.label["one-month"]}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="one-week" id="one-week" checked={filterByDays == 7} />
                            <Label htmlFor="one-week">{dict.label["one-week"]}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="four-days" id="four-days" checked={filterByDays == 4} />
                            <Label htmlFor="four-days">{dict.label["four-days"]}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fourty-eight-hours" id="fourty-eight-hours" checked={filterByDays == 2} />
                            <Label htmlFor="fourty-eight-hours">{dict.label["fourty-eight-hours"]}</Label>
                        </div>
                    </RadioGroup>
                </div>
                {(loading != 200 && articles == null) ? (
                    <div className="col-span-4 flex flex-wrap justify-center">
                        {loading >= 1 ? dict.loading_text.getting_articles : ''}<br />
                        {loading >= 2 ? dict.loading_text.getting_embedding.replace("[QUERY TEXT]", queryString) : ''}<br />
                        {loading >= 3 ? dict.loading_text.article_embedding : ''}<br />
                        {loading >= 4 ? dict.loading_text.sorting_articles : ''}<br />
                    </div>
                ) : null}
            </div>
            <div className="items-stretch justify-center gap-6 rounded-lg grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {articles ?
                    articles.map((article) => {
                        return (article.hidden && article.hidden === true) ? null : (<ArticleCard key={article.key} article={article} />);
                    }) : null
                }
            </div>
            <div className="hidden">
                {/* Sample colors to help tailwind treeshaking correctly*/}
                <div className="bg-amber-100 dark:bg-amber-600 hover:bg-amber-200 dark:hover:bg-amber-700 active:bg-amber-300 dark:active:bg-amber-700" />
                <div className="bg-sky-100 dark:bg-sky-400 hover:bg-sky-200 dark:hover:bg-sky-500 active:bg-sky-300 dark:active:bg-sky-500" />
                <div className="bg-sky-200 dark:bg-sky-600 hover:bg-sky-300 dark:hover:bg-sky-700 active:bg-sky-400 dark:active:bg-sky-700" />
                <div className="bg-blue-200 dark:bg-blue-600 hover:bg-blue-300 dark:hover:bg-blue-700 active:bg-blue-400 dark:active:bg-blue-700" />
                <div className="bg-emerald-200 dark:bg-emerald-600 hover:bg-emerald-300 dark:hover:bg-emerald-700 active:bg-emerald-400 dark:active:bg-emerald-700" />
                <div className="bg-violet-200 dark:bg-violet-600 hover:bg-violet-300 dark:hover:bg-violet-700 active:bg-violet-400 dark:active:bg-violet-700" />
                <div className="bg-neutral-200 dark:bg-neutral-600 hover:bg-neutral-300 dark:hover:bg-neutral-700 active:bg-neutral-400 dark:active:bg-neutral-700" />
                {/* Sample border colors to help tailwind treeshaking correctly*/}
                <div className="border-amber-200 dark:border-amber-500" />
                <div className="border-sky-200 dark:border-sky-300" />
                <div className="border-sky-300 dark:border-sky-500" />
                <div className="border-blue-300 dark:border-blue-500" />
                <div className="border-emerald-300 dark:border-emerald-500" />
                <div className="border-violet-300 dark:border-violet-500" />
                <div className="border-neutral-300 dark:border-neutral-500" />
            </div>
            <div className="mt-4 md:mt-8 flex flex-col w-full items-center">
                Made by Mangle Kuo. All rights reserved.<br />
                {articles ? <Button variant="link" onClick={() => { clearAllData(); }}>clear all data</Button> : null}<br />
            </div>
        </div>
    );
}