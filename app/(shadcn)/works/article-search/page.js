import { SearchSortFilter } from './_components/search-sort-filter'
import { ArticlesGrid } from './_components/articles-grid'
import { SuccessfulSources } from "./_components/succesful-sources";
import { LoadingCardGrid, LoadingSources, LoadingSearchSortFilter } from './_components/loading-templates'
import { Suspense } from 'react';
import { AppContextProvider } from './_components/article-context';
import { fetchAllArticles } from './_utils/fetchRSS';

export default async function Page({ searchParams }) {
    const locale = 'en';
    try {
        const articlesFetchUrl = '/works/article-search/api/articles';
    
        const env = process.env.NODE_ENV;
        const api_key = process.env.NEXT_PUBLIC_APP_INTERNAL_API_KEY;
        let baseURL = 'https://manglekuo.com';
        if (env == "development") {
            baseURL = 'http://localhost:3000';
        }
        const fetchURL = baseURL + articlesFetchUrl;
        const res = await fetch(fetchURL,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + api_key
                },
                next: { revalidate: 3600, tags: ['articles'] }
            },
        );
        const resJson = await res.json();
        if (!res.ok) {
            throw new Error('Failed to fetch', resJson);
        }
        const { articles, successfulSources, updateTime } = resJson;
        return (
            <>
                <Suspense fallback={<><LoadingSources /><LoadingSearchSortFilter /><LoadingCardGrid /></>}>
                    <AppContextProvider> {/* THIS IS CAUSING CLIENT SIDE RENDER*/}
                        <SuccessfulSources locale={locale} successfulSources={successfulSources} updateTime={updateTime} />
                        <SearchSortFilter locale={locale} />
                        <ArticlesGrid locale={locale} articles={articles} updateTime={updateTime} />
                    </AppContextProvider>
                </Suspense>
                <div className="flex flex-col w-full items-center text-neutral-400">
                    {JSON.stringify(searchParams, null, 2)}<br />
                    server page render: {new Date().toISOString()}<br />
                </div>
            </>
        );
    } catch (error) {
        console.log(`build time can't fetch from API, fetch directly from source`);
        const { articles, successfulSources, updateTime } = await fetchAllArticles();
        return (
            <>
                <Suspense fallback={<><LoadingSources /><LoadingSearchSortFilter /><LoadingCardGrid /></>}>
                    <AppContextProvider> {/* THIS IS CAUSING CLIENT SIDE RENDER*/}
                        <SuccessfulSources locale={locale} successfulSources={successfulSources} updateTime={updateTime} />
                        <SearchSortFilter locale={locale} />
                        <ArticlesGrid locale={locale} articles={articles} updateTime={updateTime} />
                    </AppContextProvider>
                </Suspense>
                <div className="flex flex-col w-full items-center text-neutral-400">
                    {JSON.stringify(searchParams, null, 2)}<br />
                    server page render: {new Date().toISOString()}<br />
                </div>
            </>
        );
    }
}