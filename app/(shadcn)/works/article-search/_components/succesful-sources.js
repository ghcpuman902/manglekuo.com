export const dynamic = 'force-dynamic'
export const revalidate = 0

import { Label } from "@components/ui/label";
import { Badge } from "@components/ui/badge";
import { timeAgo, olderThan1hr, getDictionary, getDomainNameFromUrl } from "../_utils/utils";

export const SuccessfulSources = async ({ locale, successfulSources, updateTime }) => {
    const dict = getDictionary(locale);

    return (
        <div className="my-6">
            <Label className="mr-1">{dict.label.article_sources}</Label>
            {successfulSources ? successfulSources.map((source, index) => {
                const { url, count } = source;
                return (
                    <Badge key={index} variant="outline" className="mx-1">
                        <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">{getDomainNameFromUrl(url)} ({count})</a>
                    </Badge>
                );
            }) : dict.label.loading}
            <Label className="text-neutral-400 dark:text-neutral-600" suppressHydrationWarning>{dict.label.last_fetched.replace("[TIME AGO]", timeAgo(updateTime, locale))} {olderThan1hr(updateTime) ? dict.label.please_refresh : null}</Label>
        </div>
    );
}