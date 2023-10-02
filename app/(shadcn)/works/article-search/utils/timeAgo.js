export default function timeAgo(dateString) {
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