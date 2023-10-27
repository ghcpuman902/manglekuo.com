// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
    const defaultTypes = ['oak', 'teak']
   
    return defaultTypes.map((type) => ({
      type: type,
    }))
  }
   
  // Multiple versions of this page will be statically generated
  // using the `params` returned by `generateStaticParams`
  export default function Page({ params }) {
    const { type } = params
    // const res = await fetch('http://localhost:3000/works/article-search/api/getTime', { cache: 'force-cache' });
    // const resJson = await res.json();
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
                {/* {JSON.stringify(resJson, null, 2)} */}
                server page render: {type} {serverRenderTime}<br />
            </div>
        </>
    );
  }