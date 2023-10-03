'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import{ timeAgo, getDictionary, getDomainNameFromUrl } from "./utils/utils";

export default function ArticleCard({ article }) {
    const searchParams = useSearchParams();
    let locale = 'en';
    if(searchParams.has('jp')){
        locale = 'jp';
    }
    const dict = getDictionary(locale);

    const zoneColors = [ 'bg-amber-100 dark:bg-amber-600', 'bg-sky-100 dark:bg-sky-400', 'bg-sky-200 dark:bg-sky-600','bg-blue-200 dark:bg-blue-600','bg-emerald-200 dark:bg-emerald-600','bg-violet-200 dark:bg-violet-600'];
    const zoneBorderColors = [ 'border-amber-400', 'border-sky-200', 'border-sky-400','border-blue-400','border-emerald-400','border-violet-400'];
    const zoneBadgeNames = dict["zoneBadgeNames"];

    function mapValue(d) {
        const mu = 0.785;
        const sigma = 0.0306;
    
        // Calculate the difference from the mean in terms of sigma
        const diffSigma = (d - mu) / sigma;
    
        // Based on the difference, determine the zone and position within the zone
        let zone = Math.floor(diffSigma + 2); // +1 to shift zones from -1, 0, 1, 2... to 0, 1, 2, 3...
        const positionInZone = diffSigma - zone + 1;
        const newDistance = zone + positionInZone;

        if(zone<0){zone=0;}
        if(zone>5){zone=5;}
    
        // Return the sum of the zone and the position within the zone
        return {newDistance, zone};
    }

    function dToPercentage(d){
        if(d>=5){return `100%`;}
        const percentage = Math.floor(d/5*10000)/100;
        return `${percentage}%`;
    }

    return (
        <>
            {article ? (<Card className={`overflow-clip ${zoneBorderColors[mapValue(article.distance).zone]}`}>
                <CardHeader>
                    <CardTitle><a href={article.link} target="_blank" rel="noopener noreferrer" className={`underline ${locale=='jp'?'leading-relaxed':''}`}>{article.title}</a></CardTitle>
                    <CardDescription className="pt-1"><Badge variant="secondary" className="mr-1" suppressHydrationWarning>{timeAgo(article.pubDate,locale)}</Badge><Badge variant="secondary" className={zoneColors[mapValue(article.distance).zone]}>{zoneBadgeNames[mapValue(article.distance).zone]} ({dToPercentage(mapValue(article.distance).newDistance)})</Badge></CardDescription>
                </CardHeader>
                <CardContent>
                    <div dangerouslySetInnerHTML={{ __html: article.description }}></div>
                </CardContent>
                <CardFooter>
                    <p className="leading-7 [&:not(:first-child)]:mt-6 text-ellipsis overflow-hidden">Source: <Link href={article.source} target="_blank" rel="noopener noreferrer" className="hover:underline">{getDomainNameFromUrl(article.source)}</Link></p>
                </CardFooter>
            </Card>) : null}
        </>
    );
}