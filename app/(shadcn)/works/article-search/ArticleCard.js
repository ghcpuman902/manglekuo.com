'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import { Badge } from "@components/ui/badge"

function timeAgo(dateString) {
    const eventTime = new Date(dateString); 
    const currentTime = new Date();

    const diffInSeconds = Math.floor((currentTime - eventTime) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    // Create the formatter
    const rtf = new Intl.RelativeTimeFormat('en', { 
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

export default function ArticleCard({ article }) {
    const zoneColors = [ 'bg-amber-100', 'bg-sky-100', 'bg-sky-200','bg-blue-200','bg-emerald-200','bg-violet-200'];
    const zoneBorderColors = [ 'border-amber-200', 'border-sky-200', 'border-sky-400','border-blue-400','border-emerald-400','border-violet-400'];
    const zoneBadgeNames = [ 'Bad Match', 'Maybe', 'Good Match','Excellent Match','Similar Topic','Same Article'];

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

    return (
        <>
            {article ? (<Card className={zoneBorderColors[mapValue(article.distance).zone]}>
                <CardHeader>
                    <CardTitle><a href={article.link} target="_blank" rel="noopener noreferrer" className="underline">{article.title}</a></CardTitle>
                    <CardDescription className="pt-1"><Badge variant="secondary" suppressHydrationWarning>{timeAgo(article.pubDate)}</Badge> <Badge variant="secondary" className={zoneColors[mapValue(article.distance).zone]}>{zoneBadgeNames[mapValue(article.distance).zone]}</Badge></CardDescription>
                </CardHeader>
                <CardContent>
                    <div dangerouslySetInnerHTML={{ __html: article.description }}></div>
                </CardContent>
                <CardFooter>
                    <p className="leading-7 [&:not(:first-child)]:mt-6">Source: <a href={article.source} target="_blank" rel="noopener noreferrer" className="hover:underline">{article.source}</a></p>
                </CardFooter>
            </Card>) : null}
        </>
    );
}