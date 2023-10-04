'use client';
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Badge } from "@components/ui/badge";
import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import ArticleCard from "./ArticleCard";

import{dotProduct, timeAgo,  getDictionary, getDomainNameFromUrl} from "./utils/utils";
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
    if(searchParams.has('jp')){
        defaultQueryText = `天文学の研究、宇宙探査、深宇宙のニュース`;
        articlesFetchUrl = '/works/article-search/api/articles-jp';
        locale = 'jp';
        updateCacheArticles({ articles:null, successfulSources:null, updateTime:null });
    }
    if(searchParams.has('q')){
        defaultQueryText = searchParams.get('q');
    }
    const dict = getDictionary(locale);


    const [loading, setLoading] = useState(0);
    const [articles, setArticles] = useState(null);
    const [successfulSources, setSuccessfulSources] = useState(null);
    const [updateTime, setUpdateTime] = useState(null);
    const [queryText, setQueryText] = useState(defaultQueryText);
    const queryEmbedding = useRef(null);

    const sortArticles = (arts,options={}) => {
        setLoading(4);
        const fourDaysAgo = Date.now() - (options.day?options.day:4) * 24 * 60 * 60 * 1000;
    
        // Filter for articles published within the last 48 hours
        const filteredArticles = arts.filter(art => {
            // Create a new Date object from the pubDate string
            const pubDate = new Date(art.pubDate);
            // Convert the date to the number of milliseconds elapsed since January 1, 1970
            const articleDateInMs = pubDate.getTime();
    
            // return true;
            return articleDateInMs >= fourDaysAgo;
        });
    
        // First sort by date in descending order (newest first)
        filteredArticles.sort((a, b) => {
            const aDate = new Date(a.pubDate);
            const bDate = new Date(b.pubDate);
    
            return bDate - aDate; // swap these to change order
        });
    
        if(options.newest_first === true){
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
               if(!article.embedding || article.embedding.length == 0){
                   console.log(`article embedding fetched.`);
                   article.embedding = embeddingsResult.result[index];
                   article.distance = dotProduct(embeddingsResult.result[index], targetEmbedding);
               }else{
                   article.distance = dotProduct(article.embedding, targetEmbedding);
               }
               return article;
           });
           
           return updatedArticles;
        }

        async function getQueryEmbedding(text) {
            setLoading(2);
            if(text==''){
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
    
        async function fetchData() {
            const [ LArticles, LSuccessfulSources, LUpdateTime ] = await getCacheArticles();
            if(LUpdateTime){
                const diffInSeconds = Math.floor((new Date() - new Date(LUpdateTime) ) / 1000);
                if(diffInSeconds < 3600){
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
            if(cachedQueryEmbedding){
                console.log(`using cached targetEmbedding`);
                queryEmbedding.current = cachedQueryEmbedding;
            }else{
                console.log(`fetching targetEmbeddings`);
                const targetEmbedding = await getQueryEmbedding(queryText);
                queryEmbedding.current = targetEmbedding;
                await appendCacheQueryEmbedding({query:queryText,embedding:targetEmbedding});
            }
            console.log(`updating articles (fetching individual embeddings + calculate distance)`);
            const updatedArticles = await updateEmbeddings(resJson.articles,queryEmbedding.current);
            console.log(`sorting articles`);
            const sortedAndUpdatedArticles = sortArticles(updatedArticles);
            setArticles(sortedAndUpdatedArticles);
            setSuccessfulSources(resJson.successfulSources);
            setUpdateTime(resJson.updateTime);
            await updateCacheArticles({articles: sortedAndUpdatedArticles, successfulSources: resJson.successfulSources, updateTime: resJson.updateTime});
            setLoading(200);
        }
        setLoading(1);
        fetchData();
    }, []);

    const handleReorder = (option={}) => {
        if(queryText==''){
            console.log(`query text empty!`);
            return;
        }
        setLoading(0);
        if(option.type && option.type == "newest_first"){
            async function fetchData() {
                console.log(`sorting articles`);
                const sortedAndUpdatedArticles = sortArticles(articles,{newest_first:true});
                setArticles(sortedAndUpdatedArticles);
                await updateCacheArticles({articles: sortedAndUpdatedArticles, successfulSources, updateTime});
                setLoading(200);
            }
            fetchData();
        }else{
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
                if(cachedQueryEmbedding){
                    console.log(`using local cached targetEmbedding`);
                    queryEmbedding.current = await cachedQueryEmbedding;
                }else{
                    console.log(`fetching targetEmbeddings`);
                    const targetEmbedding = await getQueryEmbedding(queryText);
                    queryEmbedding.current = targetEmbedding;
                    await appendCacheQueryEmbedding({query:queryText,embedding:targetEmbedding});
                }
                const updatedArticles = articles.map((article) => {
                    article.distance = dotProduct(article.embedding, queryEmbedding.current);
                    return article;
                });
                console.log(`sorting articles`);
                const sortedAndUpdatedArticles = sortArticles(updatedArticles);
                setArticles(sortedAndUpdatedArticles);
                await updateCacheArticles({articles: sortedAndUpdatedArticles, successfulSources, updateTime});
                setLoading(200);
            }
            fetchData();
        }
    }


    useEffect(() => {
        if(searchParams.has('q') && searchParams.get('q')!='' && articles){
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
                if(cachedQueryEmbedding){
                    console.log(`using local cached targetEmbedding`);
                    queryEmbedding.current = cachedQueryEmbedding;
                }else{
                    console.log(`fetching targetEmbeddings`);
                    const targetEmbedding = await getQueryEmbedding(searchParams.get('q'));
                    queryEmbedding.current = targetEmbedding;
                    await appendCacheQueryEmbedding({query:searchParams.get('q'),embedding:targetEmbedding});
                }
                const updatedArticles = articles.map((article) => {
                    article.distance = dotProduct(article.embedding, queryEmbedding.current);
                    return article;
                });
                console.log(`sorting articles`);
                const sortedAndUpdatedArticles = sortArticles(updatedArticles);
                setArticles(sortedAndUpdatedArticles);
                await updateCacheArticles({articles: sortedAndUpdatedArticles, successfulSources, updateTime});
                setLoading(200);
            }
            fetchData();
        }
    },[searchParams]);



    return (
        <div className="p-4 md:p-8">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">{dict.title.article_search}</h1>

            <div className="my-6">
                <Label className="mr-1">{dict.label.article_sources}</Label>
                {successfulSources ? successfulSources.map((source, index) => {
                    const {url,count} = source;
                    return (
                        <Badge key={index} variant="outline" className="mx-1">
                            <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">{getDomainNameFromUrl(url)} ({count})</a>
                        </Badge>
                    );
                }) : dict.label.loading} 
                <Label className="text-gray-400 dark:text-gray-500">{dict.label.last_fetched.replace("[TIME AGO]",timeAgo(updateTime,locale))}</Label>
            </div>

            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">{dict.title.fetched_articles}{articles ? dict.title._within_the_past_.replace("[NUMBER]",articles.length) : ''}</h2>

            <div className="my-5 py-2 flex flex-wrap w-full items-center">
                <Label htmlFor="query" className="w-full my-2">{dict.label.input_hint}</Label>
                <Input id="query" type="text" className="max-w-lg my-2 mr-2" value={queryText} onChange={e => setQueryText(e.target.value)} onKeyPress={event => {
                    if(event.key === 'Enter'){ 
                        handleReorder();
                        event.preventDefault(); // Prevents the default action of enter key
                    }
                }} />
                <Button className="max-w-sm my-2 mr-2" onClick={() => { handleReorder() }} disabled={loading!=200}>{loading!=200?(<><span className="animate-spin text-xl">☻</span>&nbsp;&nbsp;{dict.button.wait}</>):dict.button.sort}</Button>
                <Button className="max-w-sm my-2" onClick={() => { handleReorder({type:"newest_first"}) }} variant="secondary" disabled={loading!=200}>{loading!=200?(<><span className="animate-spin text-xl">☻</span>&nbsp;&nbsp;{dict.button.wait}</>):dict.button.sort_newest_first}</Button>
            </div>
            <div className="items-stretch justify-center gap-6 rounded-lg grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {articles ?
                    articles.map((article, index) => (
                        <ArticleCard key={article.key} article={article}/>
                    )) : (loading!=200?(
                        <>
                            {loading>=1?dict.loading_text.getting_articles:''}<br/>
                            {loading>=2?dict.loading_text.getting_embedding.replace("[QUERY TEXT]",queryText):''}<br/>
                            {loading>=3?dict.loading_text.article_embedding:''}<br/>
                            {loading>=4?dict.loading_text.sorting_articles:''}<br/>
                        </>
                    ):dict.loading_text.final_steps)
                }
            </div>
            <div className="mt-4 md:mt-8 flex flex-col w-full items-center">
                {articles?<Button variant="link" onClick={() => { clearAllData(); }}>clear all data</Button>:null}
                Made by Mangle Kuo. All rights reserved.<br/>
            </div>
        </div>
    );
}