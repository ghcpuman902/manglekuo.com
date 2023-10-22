import { SearchSortFilter } from './_components/search-sort-filter'
import { ArticlesGrid } from './_components/articles-grid'
import { SuccessfulSources } from "./_components/succesful-sources";
import { LoadingCardGrid } from './_components/loading-card-grid'
import { Suspense } from 'react';

export default async function Page() {
    const locale = 'en';
    const articlesFetchUrl = '/works/article-search/api/articles';

    const env = process.env.NODE_ENV;
    let baseURL = 'https://manglekuo.com';
    if (env == "development") {
        baseURL = 'http://localhost:3000';
    }
    const res = await fetch(baseURL + articlesFetchUrl, {
        next: { revalidate: 0 },
    });
    const resJson = await res.json();
    if (!res.ok) {
        throw new Error('Failed to fetch', resJson);
    }
    const { articles, successfulSources, updateTime } = resJson;

    return (
        <>
            {/* @ts-expect-error Async Server Component */}
            <SuccessfulSources locale={locale} successfulSources={successfulSources} updateTime={updateTime} />
            <SearchSortFilter locale={locale} />
            <Suspense fallback={<LoadingCardGrid />}>
                <ArticlesGrid locale={locale} articles={articles} updateTime={updateTime} />
            </Suspense>
        </>
    );
}