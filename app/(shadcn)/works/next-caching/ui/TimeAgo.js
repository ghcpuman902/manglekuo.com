'use client'
import { Label } from "@components/ui/label";
import { useEffect, useState } from "react";

export function timeAgo(dateString) {
    if (!dateString) { return `not yet`; }
    const eventTime = new Date(dateString);
    const currentTime = new Date();

    const diffInSeconds = -1*Math.floor((currentTime - eventTime) / 1000);

    // Create the formatter
    const rtf = new Intl.RelativeTimeFormat( 'en-US', {
        localeMatcher: "best fit",
        numeric: 'auto',
        style: "narrow",
    });
    return `${rtf.format(diffInSeconds, 'second')}`;
}

export const TimeAgo = ({ timestamp }) => {
    const [label, setLabel] = useState(timeAgo(timestamp));

    // useEffect(() => {
    //     // Update the label every 500 milliseconds (0.5 seconds)
    //     const intervalId = setInterval(() => {
    //         setLabel(timeAgo(timestamp));
    //     }, 500);
        
    //     // Clean up the interval on component unmount
    //     return () => clearInterval(intervalId);
    // }, [timestamp]); // Effect depends on timestamp, so if the timestamp changes, restart the interval

    return (
        <Label className="text-neutral-400 dark:text-neutral-600" suppressHydrationWarning>{label}</Label>
    );
}
