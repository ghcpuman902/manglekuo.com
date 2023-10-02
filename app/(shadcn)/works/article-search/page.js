'use client';
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Badge } from "@components/ui/badge";
import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import ArticleCard from "./ArticleCard";

import dotProduct from "./utils/dotProduct";
import timeAgo from "./utils/timeAgo";


function getDomainNameFromUrl(url) {
    let hostname = new URL(url).hostname;
    let domainName = '';

    // Remove the 'www.' or 'rss.' from the domain name
    if (hostname.startsWith('www.') || hostname.startsWith('rss.')) {
        hostname = hostname.split('.').slice(1).join('.');
    }

    // If domain is ".com" then remove the .com
    if (hostname.includes('.com')) {
        domainName = hostname.replace('.com', '');
    } else {
        domainName = hostname;
    }
    
    return domainName;
}


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
    if(searchParams.has('q')){
        defaultQueryText = searchParams.get('q');
    }
    const [loading, setLoading] = useState(0);
    const [articles, setArticles] = useState(null);
    const [successfulSources, setSuccessfulSources] = useState(null);
    const [updateTime, setUpdateTime] = useState(0);
    const [queryText, setQueryText] = useState(defaultQueryText);
    const queryEmbedding = useRef(null);

    const sortArticles = (arts) => {
        setLoading(4);
        const fourDaysAgo = Date.now() - 4 * 24 * 60 * 60 * 1000;
    
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
            console.log(`fetching articles`);
            const res = await fetch('/works/article-search/api/articles', { next: { revalidate: 3600 } });
            const resJson = await res.json();
            if (!res.ok) {
                throw new Error('Failed to fetch', resJson);
            }
            console.log(`fetching targetEmbeddings`);
            queryEmbedding.current = await getQueryEmbedding(queryText);
            console.log(`updating articles (fetching individual embeddings + calculate distance)`);
            const updatedArticles = await updateEmbeddings(resJson.articles,queryEmbedding.current);
            console.log(`sorting articles`);
            const sortedAndUpdatedArticles = sortArticles(updatedArticles);
            setArticles(sortedAndUpdatedArticles);
            setSuccessfulSources(resJson.successfulSources);
            setUpdateTime(resJson.updateTime);
            setLoading(200);
        }
        setLoading(1);
        fetchData();
    }, []);

    const handleReorder = () => {
        if(queryText==''){
            console.log(`query text empty!`);
            return;
        }
        setLoading(0);
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
            console.log(`fetching targetEmbeddings`);
            queryEmbedding.current = await getQueryEmbedding(queryText);
            const updatedArticles = articles.map((article) => {
                article.distance = dotProduct(article.embedding, queryEmbedding.current);
                return article;
            });
            console.log(`sorting articles`);
            const sortedAndUpdatedArticles = sortArticles(updatedArticles);
            setArticles(sortedAndUpdatedArticles);
            setLoading(200);
        }
        fetchData();
    }

    return (
        <div className="p-4 md:p-8">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Article Search</h1>

            <div className="my-6">
                <Label className="mr-1">Article sources (last updated {timeAgo(updateTime)}): </Label>
                {successfulSources ? successfulSources.map((source, index) => {
                    const {url,count} = source;
                    return (
                        <Badge key={index} variant="outline" className="mr-1">
                            <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">{getDomainNameFromUrl(url)} ({count})</a>
                        </Badge>
                    );
                }) : 'none'}
            </div>

            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Fetched Articles ({articles ? `${articles.length} within the past 4 days` : '0'}):</h2>

            <div className="my-5 flex flex-wrap w-full items-center">
                <Label htmlFor="query" className="w-full my-2">Sort by how closely the article matches: </Label>
                <Input id="query" type="text" className="max-w-lg my-2 mr-2" value={queryText} onChange={e => setQueryText(e.target.value)} onKeyPress={event => {
                    if(event.key === 'Enter'){ 
                        handleReorder();
                        event.preventDefault(); // Prevents the default action of enter key
                    }
                }} />
                <Button className="max-w-sm my-2" onClick={() => { handleReorder() }} disabled={loading!=200}>{loading!=200?(<><span className="animate-spin text-xl">☻</span>&nbsp;&nbsp;wait...</>):'Sort'}</Button>
            </div>
            <div className="items-stretch justify-center gap-6 rounded-lg grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {articles ?
                    articles.map((article, index) => (
                        <ArticleCard key={article.key} article={article}/>
                    )) : (loading!=200?(<>{loading>=1?`Getting articles...`:''}<br/>{loading>=2?`Getting embedding for "${queryText}"...`:''}<br/>{loading>=3?`Getting article embeddings + calculating distances...`:''}<br/>{loading>=4?`Sorting articles...`:''}</>):`Final steps...`)
                }
            </div>
        </div>
    );
}