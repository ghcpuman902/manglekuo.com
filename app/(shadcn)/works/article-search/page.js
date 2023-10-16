'use client';
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Badge } from "@components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";


import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import ArticleCard from "./ArticleCard";

import { dotProduct, timeAgo, olderThan1hr, getDictionary, getDomainNameFromUrl } from "./utils/utils";
import { getCacheArticles, updateCacheArticles, searchCacheQueryEmbedding, appendCacheQueryEmbedding, clearAllData } from './utils/local-articles';

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

    let defaultQueryText = `astronomy scientific research, space exploration, deep sky news`;
    let articlesFetchUrl = '/works/article-search/api/articles';
    let locale = 'en';
    if (searchParams.has('jp')) {
        defaultQueryText = `天文学の研究、宇宙探査、深宇宙のニュース`;
        articlesFetchUrl = '/works/article-search/api/articles-jp';
        locale = 'jp';
        updateCacheArticles({ articles: null, successfulSources: null, updateTime: null });
    }
    if (searchParams.has('q')) {
        defaultQueryText = searchParams.get('q');
    }
    const dict = getDictionary(locale);


    const [loading, setLoading] = useState(0);
    const [articles, setArticles] = useState(null);
    const [successfulSources, setSuccessfulSources] = useState(null);
    const [updateTime, setUpdateTime] = useState(null);
    const [queryText, setQueryText] = useState(defaultQueryText);
    const queryEmbedding = useRef(null);
    const [sortingMethod, setSortingMethod] = useState("relevance");
    const [filterByDays, setFilterByDays] = useState(4);

    const sortArticles = (arts, options = {}) => {
        setLoading(4);
        const daysAgo = Date.now() - (options.filterByDays ? options.filterByDays : 4) * 24 * 60 * 60 * 1000;

        const updatedArticles = JSON.parse(JSON.stringify(arts)); // create a deep copy of arts

        // Filter for articles published within the last n days
        const filteredArticles = updatedArticles.map(art => {
            // Create a new Date object from the pubDate string
            const pubDate = new Date(art.pubDate);
            // Convert the date to the number of milliseconds elapsed since January 1, 1970
            const articleDateInMs = pubDate.getTime();

            // If article is not from the specified last days, hide it.
            art.hidden = !(articleDateInMs >= daysAgo);
            return art;
        });

        // First sort by date in descending order (newest first)
        filteredArticles.sort((a, b) => {
            const aDate = new Date(a.pubDate);
            const bDate = new Date(b.pubDate);

            return bDate - aDate; // swap these to change order
        });

        if (options.sortingMethod && options.sortingMethod === "date") {
            return filteredArticles;
        }

        // Next sort by distance
        const final = filteredArticles.sort((a, b) => {
            if (!a.hasOwnProperty('distance') || a.distance == null) return 1;
            if (!b.hasOwnProperty('distance') || b.distance == null) return -1;

            return b.distance - a.distance;
        });

        // console.log(final.map(a => a.distance).join(`|`));
        return final;
    }

    useEffect(() => {

        async function getQueryEmbedding(text) {
            setLoading(2);
            if (text == '') {
                console.error(`getQueryEmbedding: text empty!`);
                return;
            }
            router.push(pathname + '?' + createQueryString('q', queryText));
            const res = await fetch('/works/article-search/api/embedding', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });
            const resJson = await res.json();
            if (!res.ok) {
                throw new Error('Failed to fetch', resJson);
            }
            return resJson.result;
        }

        async function updateEmbeddings(articles, targetEmbedding) {
            setLoading(3);
            const res = await fetch('/works/article-search/api/batch-embedding', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    texts: articles.map(article => `${article.title}||||${article.description.replace(/\n|\t|[ ]{4}/g, '').replace(/<[^>]*>/g, '')}`)
                }),
            });
            const embeddingsResult = await res.json();

            const updatedArticles = articles.map((article, index) => {
                if (!article.embedding || article.embedding.length == 0) {
                    console.log(`article embedding fetched.`);
                    article.embedding = embeddingsResult.result[index];
                    article.distance = dotProduct(embeddingsResult.result[index], targetEmbedding);
                } else {
                    article.distance = dotProduct(article.embedding, targetEmbedding);
                }
                return article;
            });

            return updatedArticles;
        }

        async function fetchData() {
            const [LArticles, LSuccessfulSources, LUpdateTime] = await getCacheArticles();
            if (LUpdateTime) {
                const diffInSeconds = Math.floor((new Date() - new Date(LUpdateTime)) / 1000);
                if (diffInSeconds < 3600) {
                    console.log(`less than an hour, using cached articles`);
                    setArticles(LArticles);
                    setSuccessfulSources(LSuccessfulSources);
                    setUpdateTime(LUpdateTime);
                    setLoading(200);
                    return;
                }
            }
            console.log(`fetching articles`);
            const res = await fetch(articlesFetchUrl);
            const resJson = await res.json();
            if (!res.ok) {
                throw new Error('Failed to fetch', resJson);
            }
            const cachedQueryEmbedding = await searchCacheQueryEmbedding(queryText);
            if (cachedQueryEmbedding) {
                console.log(`using cached targetEmbedding`);
                queryEmbedding.current = cachedQueryEmbedding;
            } else {
                console.log(`fetching targetEmbeddings`);
                const targetEmbedding = await getQueryEmbedding(queryText);
                queryEmbedding.current = targetEmbedding;
                await appendCacheQueryEmbedding({ query: queryText, embedding: targetEmbedding });
            }
            console.log(`sorting articles`);
            const sortedAndUpdatedArticles = sortArticles(resJson.articles, { sortingMethod: "date", filterByDays: filterByDays });
            setArticles(sortedAndUpdatedArticles);
            setSuccessfulSources(resJson.successfulSources);
            setUpdateTime(resJson.updateTime);

            async function addEmbeddings(arts) {
                console.log(`updating articles (fetching individual embeddings + calculate distance)`);
                const updatedArticles = await updateEmbeddings(arts, queryEmbedding.current);
                console.log(`sorting articles`);
                const sortedAndUpdatedArticles = sortArticles(updatedArticles, { sortingMethod: sortingMethod, filterByDays: filterByDays });
                setArticles(sortedAndUpdatedArticles);
                setSuccessfulSources(resJson.successfulSources);
                setUpdateTime(resJson.updateTime);
                await updateCacheArticles({ articles: sortedAndUpdatedArticles, successfulSources: resJson.successfulSources, updateTime: resJson.updateTime });
                setLoading(200);
            }
            addEmbeddings(sortedAndUpdatedArticles);
        }
        setLoading(1);
        fetchData();
    }, []);

    const handleReorder = (options = {}) => {
        if (queryText == '') {
            console.log(`query text empty!`);
            return;
        }
        setLoading(0);
        if (options.sortingMethod == "date") {
            async function fetchData() {
                console.log(`sorting articles`);
                const sortedAndUpdatedArticles = sortArticles(articles, options);
                setArticles(sortedAndUpdatedArticles);
                await updateCacheArticles({ articles: sortedAndUpdatedArticles, successfulSources, updateTime });
                setLoading(200);
            }
            fetchData();
        } else {
            async function fetchData() {
                async function getQueryEmbedding(text) {
                    router.push(pathname + '?' + createQueryString('q', queryText));
                    const res = await fetch('/works/article-search/api/embedding', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ text }),
                    });
                    const resJson = await res.json();
                    if (!res.ok) {
                        throw new Error('Failed to fetch', resJson);
                    }
                    return resJson.result;
                }
                const cachedQueryEmbedding = await searchCacheQueryEmbedding(queryText);
                if (cachedQueryEmbedding) {
                    console.log(`using local cached targetEmbedding`);
                    queryEmbedding.current = await cachedQueryEmbedding;
                } else {
                    console.log(`fetching targetEmbeddings`);
                    const targetEmbedding = await getQueryEmbedding(queryText);
                    queryEmbedding.current = targetEmbedding;
                    await appendCacheQueryEmbedding({ query: queryText, embedding: targetEmbedding });
                }
                const updatedArticles = articles.map((article) => {
                    article.distance = dotProduct(article.embedding, queryEmbedding.current);
                    return article;
                });
                console.log(`sorting articles`);
                const sortedAndUpdatedArticles = sortArticles(updatedArticles, options);
                setArticles(sortedAndUpdatedArticles);
                await updateCacheArticles({ articles: sortedAndUpdatedArticles, successfulSources, updateTime });
                setLoading(200);
            }
            fetchData();
        }
    }

    useEffect(() => {
        if (searchParams.has('q') && searchParams.get('q') != '' && articles) {
            setQueryText(searchParams.get('q'));
            setLoading(0);
            async function fetchData() {
                async function getQueryEmbedding(text) {
                    const res = await fetch('/works/article-search/api/embedding', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ text }),
                    });
                    const resJson = await res.json();
                    if (!res.ok) {
                        throw new Error('Failed to fetch', resJson);
                    }
                    return resJson.result;
                }
                const cachedQueryEmbedding = await searchCacheQueryEmbedding(searchParams.get('q'));
                if (cachedQueryEmbedding) {
                    console.log(`using local cached targetEmbedding`);
                    queryEmbedding.current = cachedQueryEmbedding;
                } else {
                    console.log(`fetching targetEmbeddings`);
                    const targetEmbedding = await getQueryEmbedding(searchParams.get('q'));
                    queryEmbedding.current = targetEmbedding;
                    await appendCacheQueryEmbedding({ query: searchParams.get('q'), embedding: targetEmbedding });
                }
                const updatedArticles = articles.map((article) => {
                    article.distance = dotProduct(article.embedding, queryEmbedding.current);
                    return article;
                });
                console.log(`sorting articles`);
                const sortedAndUpdatedArticles = sortArticles(updatedArticles, { sortingMethod: sortingMethod, filterByDays: filterByDays });
                setArticles(sortedAndUpdatedArticles);
                await updateCacheArticles({ articles: sortedAndUpdatedArticles, successfulSources, updateTime });
                setLoading(200);
            }
            fetchData();
        }
    }, [searchParams]);

    const updateSortingMethod = (e) => {
        if (e == "date") {
            setSortingMethod("date");
            handleReorder({ sortingMethod: "date", filterByDays: filterByDays });
        } else {
            setSortingMethod("relevance");
            handleReorder({ sortingMethod: "relevance", filterByDays: filterByDays });
        }
        console.log(e);
    }


    const updateFilterDays = (e) => {
        const durations = {
            "one-month": 30,
            "one-week": 7,
            "four-days": 4,
            "fourty-eight-hours": 2
        };
        setFilterByDays(durations.hasOwnProperty(e) ? durations[e] : 4);
        handleReorder({ sortingMethod: sortingMethod, filterByDays: durations.hasOwnProperty(e) ? durations[e] : 4 });
        console.log(e);
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

            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">{dict.title.fetched_articles}{articles ? dict.title._within_the_past_.replace("[NUMBER]", articles.filter(article => !article.hidden).length).replace("[DAYS]", filterByDays) : ''}</h2>

            <div className="my-6 items-stretch justify-center gap-6 rounded-lg grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                <div className="col-span-4">
                    <div className="w-full flex">
                        <Input id="query" type="text" className="mr-2" value={queryText} onChange={e => setQueryText(e.target.value)} onKeyPress={event => {
                            if (event.key === 'Enter') {
                                handleReorder();
                                event.preventDefault(); // Prevents the default action of enter key
                            }
                        }} />
                        <Button className="flex flex-nowrap whitespace-nowrap" onClick={() => { handleReorder() }} disabled={loading != 200}>{loading != 200 ? (<><span className="animate-spin text-xl">☻</span>&nbsp;&nbsp;{dict.button.wait}</>) : dict.button.search}</Button>
                    </div>
                </div>
                <div className="col-span-4 flex flex-wrap justify-center">
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
                </div>
                {loading != 200 ? (
                    <div className="col-span-4 flex flex-wrap justify-center">
                        {loading >= 1 ? dict.loading_text.getting_articles : ''}<br />
                        {loading >= 2 ? dict.loading_text.getting_embedding.replace("[QUERY TEXT]", queryText) : ''}<br />
                        {loading >= 3 ? dict.loading_text.article_embedding : ''}<br />
                        {loading >= 4 ? dict.loading_text.sorting_articles : ''}<br />
                    </div>
                ) : null}
            </div>
            <div className="items-stretch justify-center gap-6 rounded-lg grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {articles ?
                    articles.map((article, index) => {
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