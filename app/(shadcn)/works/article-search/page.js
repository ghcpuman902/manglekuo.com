import { SearchSortFilter } from './ui/search-sort-filter'
import { ArticlesGrid } from './ui/articles-grid'
import { SuccessfulSources } from "./ui/succesful-sources";
import { LoadingCardGrid, LoadingSources, LoadingSearchSortFilter } from './ui/loading-templates'
import { Suspense } from 'react';
import { AppContextProvider } from './ui/article-context';

export default async function Page({ searchParams }) {
    const locale = 'en';
    const articlesFetchUrl = '/works/article-search/api/articles';
    const api_key = process.env.NEXT_PUBLIC_APP_INTERNAL_API_KEY;

    let baseURL = process.env.NEXT_PUBLIC_URL;
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
            <div className="flex flex-col w-full items-center text-center text-neutral-400">
                {JSON.stringify(searchParams, null, 2)}<br />
                server page render: {new Date().toISOString()}<br />
            </div>
        </>
    );
}