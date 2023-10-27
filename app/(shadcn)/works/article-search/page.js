export const dynamic = 'force-static'
export const revalidate = 'force-cache'

// import { SearchSortFilter } from './_components/search-sort-filter'
// import { ArticlesGrid } from './_components/articles-grid'
// import { SuccessfulSources } from "./_components/succesful-sources";
// import { LoadingCardGrid, LoadingSources, LoadingSearchSortFilter } from './_components/loading-templates'
// import { Suspense } from 'react';
// import { AppContextProvider } from './_components/article-context';
// import { fetchAllArticles } from './_utils/fetchRSS-with-cache';

export default async function Page() {
    // const locale = 'en';
    // const { articles, successfulSources, updateTime } = await fetchAllArticles();
    const res = await fetch('http://localhost:3000/works/article-search/api/getTime', { cache: 'force-cache' });
    const resJson = await res.json();
    const serverRenderTime = new Date().toISOString();
    return (
        <>
            {/* <Suspense fallback={<><LoadingSources /><LoadingSearchSortFilter /><LoadingCardGrid /></>}>
                <AppContextProvider>
                    <SuccessfulSources locale={locale} successfulSources={successfulSources} updateTime={updateTime} />
                    <SearchSortFilter locale={locale} />
                    <ArticlesGrid locale={locale} articles={articles} updateTime={updateTime} />
                </AppContextProvider>
            </Suspense> */}
            <div className="flex flex-col w-full items-center text-neutral-400">
                {JSON.stringify(resJson, null, 2)}
                server page render: {serverRenderTime}<br />
            </div>
        </>
    );
}