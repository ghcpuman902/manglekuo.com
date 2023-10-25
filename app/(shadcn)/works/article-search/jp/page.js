import { SearchSortFilter } from '../_components/search-sort-filter'
import { ArticlesGrid } from '../_components/articles-grid'
import { SuccessfulSources } from "../_components/succesful-sources";
import { LoadingCardGrid } from '../_components/loading-templates'
import { Suspense } from 'react';

export const metadata = {
    title: 'Article Search 日本語版',
};

export default async function Page({searchParams}) {
    const locale = 'jp';
    const articlesFetchUrl = '/works/article-search/api/articles-jp';

    const env = process.env.NODE_ENV;
    let baseURL = 'https://manglekuo.com';
    if (env == "development") {
        baseURL = 'http://localhost:3000';
    }
    const res = await fetch(baseURL + articlesFetchUrl + '?key=' + process.env.APP_INTERNAL_API_KEY,
        { next: { revalidate: 3600, tags: ['articles'] } },
    );
    const resJson = await res.json();
    if (!res.ok) {
        throw new Error('Failed to fetch', resJson);
    }
    const { articles, successfulSources, updateTime } = resJson;

    return (
        <>
            <Suspense fallback={<LoadingSources />}>
                <SuccessfulSources locale={locale} successfulSources={successfulSources} updateTime={updateTime} />
            </Suspense>
            <Suspense fallback={<LoadingSearchSortFilter />}>
                <SearchSortFilter locale={locale} />
            </Suspense>
            <Suspense fallback={<LoadingCardGrid />}>
                <ArticlesGrid locale={locale} articles={articles} updateTime={updateTime} />
            </Suspense>
            <div className="flex flex-col w-full items-center text-neutral-400">
                server page render: {new Date().toISOString()}<br />
            </div>
        </>
    );
}