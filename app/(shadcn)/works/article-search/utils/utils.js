export function getDictionary(locale) {
    if (locale == 'jp') {
        return {
            "title": {
                "article_search": "記事検索",
                "fetched_articles": "取得した記事",
                "_within_the_past_": "（過去4日間の記事：[NUMBER]件）"
            },
            "label": {
                "article_sources": "記事ソース：",
                "input_hint": "次のテキストに近い記事でソート：",
                "last_fetched": "毎時自動取得、最後の取得は[TIME AGO]。",
                "loading": "読み込み中..."
            },
            "button": {
                "sort": "並べ替え",
                "wait": "待機..."
            },
            "zoneBadgeNames": ['不適当', '可能', '良好', '絶妙', '似た話題', '同じ記事'],
            "loading_text": {
                "getting_articles": "記事取得中...",
                "getting_embedding": `"[QUERY TEXT]]"の埋め込み取得中...`,
                "article_embedding": "記事の埋め込み取得中＋距離計算...",
                "sorting_articles": "記事並べ替え中...",
                "final_steps": "最終ステップ..."
            }
        };
    } else {
        return {
            "title": {
                "article_search": "Article Search",
                "fetched_articles": "Fetched Articles ",
                "_within_the_past_": "([NUMBER] within the past 4 days): "
            },
            "label": {
                "article_sources": "Article sources: ",
                "input_hint": "Sort by how closely the article matches: ",
                "last_fetched": "articles are fetched from these sources every hour, last fetch happened [TIME AGO].",
                "loading": "loading..."
            },
            "button": {
                "sort": "Sort",
                "wait": "wait..."
            },
            "zoneBadgeNames": ['Bad Match', 'Maybe', 'Good Match', 'Excellent Match', 'Similar Topic', 'Same Article'],
            "loading_text": {
                "getting_articles": "Getting articles...",
                "getting_embedding": `Getting embedding for "[QUERY TEXT]"...`,
                "article_embedding": "Getting article embeddings + calculating distances...",
                "sorting_articles": "Sorting articles...",
                "final_steps": "Final steps..."
            }
        };
    }
}

export function timeAgo(dateString, locale = 'en') {
    if (!dateString) { return `not yet`; }
    const eventTime = new Date(dateString);
    const currentTime = new Date();

    const diffInSeconds = Math.floor((currentTime - eventTime) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    // Create the formatter
    const rtf = new Intl.RelativeTimeFormat(locale == 'jp' ? 'ja-JP' : 'en-US', {
        localeMatcher: "best fit",
        numeric: 'auto',
        style: "narrow",
    });

    if (diffInDays > 0) {
        return `${rtf.format(-diffInDays, 'day')} (${rtf.format(-diffInHours, 'hour')})`;
    }

    if (diffInHours > 0) {
        return `${rtf.format(-diffInHours, 'hour')}`;
    }

    if (diffInMinutes > 0) {
        return `${rtf.format(-diffInMinutes, 'minute')}`;
    }

    return `${rtf.format(0, 'second')}`;
}

export function dotProduct(a, b) {
    if (a.length != b.length) { return 1; }
    let dotProduct = 0;
    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
    }
    return dotProduct;
}

export function getDomainNameFromUrl(url) {
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