'use client';
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { useEffect, useRef, useState } from 'react';
import ArticleCard from "./ArticleCard";


function dotProduct(a, b) {
    if (a.length != b.length) { return 1; }
    let dotProduct = 0;
    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
    }
    return dotProduct;
}



export default function Page() {
    const [loading, setLoading] = useState(0);
    const [articles, setArticles] = useState(null);
    const [successfulSources, setSuccessfulSources] = useState(null);
    const [queryText, setQueryText] = useState(`astronomy scientific research, space exploration, deep sky news`);
    const queryEmbedding = useRef(null);

    const sortArticles = (arts) => {
        setLoading(4);
        const twoDaysAgo = Date.now() - 4 * 24 * 60 * 60 * 1000; // 48 hours ago
    
        // Filter for articles published within the last 48 hours
        const filteredArticles = arts.filter(art => {
            // Create a new Date object from the pubDate string
            const pubDate = new Date(art.pubDate);
            // Convert the date to the number of milliseconds elapsed since January 1, 1970
            const articleDateInMs = pubDate.getTime();
    
            // return true;
            return articleDateInMs >= twoDaysAgo;
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
            const updatedArticles = await Promise.all(articles.map(async (article) => {
                console.log(`article embedding fetched.`);
                const text = `${article.title}||||${article.description.replace(/\n|\t|[ ]{4}/g, '').replace(/<[^>]*>/g, '')}`;
                const res = await fetch('/works/article-search/api/embedding', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text }),
                });
                const resJson = await res.json();
                if (!res.ok) {
                    throw new Error('Failed to patch', resJson);
                }
                article.embedding = resJson.result; //updating embedding field of article
                article.distance = dotProduct(resJson.result, targetEmbedding);
                return article;
            }));
            return updatedArticles;
        }

        async function getQueryEmbedding(text) {
            setLoading(2);
            if(text==''){
                console.error(`getQueryEmbedding: text empty!`);
            }
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
            setLoading(200);
        }
        setLoading(1);
        fetchData();
    }, []);

    const handleReorder = () => {
        setLoading(0);
        async function fetchData() {
            async function getQueryEmbedding(text) {
                if(text==''){
                    console.error(`getQueryEmbedding: text empty!`);
                }
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
        <div className="md-8 p-8">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Articles Search</h1>

            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Successful Sources:</h2>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                {successfulSources ? successfulSources.map((url, index) => (
                    <li key={index}>
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{url}</a>
                    </li>
                )) : 'none'}
            </ul>

            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Fetched Articles ({articles ? articles.length : '0'}):</h2>

            <div className="pt-8 flex w-full max-w-sm items-center space-x-2">
                <Input type="text" value={queryText} onChange={e => setQueryText(e.target.value)} onKeyPress={event => {
                    if(event.key === 'Enter'){ 
                        handleReorder();
                        event.preventDefault(); // Prevents the default action of enter key
                    }
                }} />
                <Button onClick={() => { handleReorder() }} disabled={loading!=200}>{loading!=200?(<><span className="animate-spin text-xl">☻</span>&nbsp;&nbsp;wait...</>):'Sort'}</Button>
            </div>
            <div className="pt-8 items-stretch justify-center gap-6 rounded-lg grid lg:grid-cols-2 xl:grid-cols-3">
                {articles ?
                    articles.map((article, index) => (
                        <ArticleCard key={article.key} article={article}/>
                    )) : (loading!=200?(<>{loading>=1?`Getting articles...`:''}<br/>{loading>=2?`Getting embedding for "${queryText}"...`:''}<br/>{loading>=3?`Getting article embeddings + calculating distances...`:''}<br/>{loading>=4?`Sorting articles...`:''}</>):`Final steps...`)
                }
            </div>
        </div>
    );
}