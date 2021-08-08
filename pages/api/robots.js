export default function handler(req, res) {
    const crawlableRobotsTxt = `User-agent: *\nAllow: /`;
    const uncrawlableRobotsTxt = `User-agent: *\nDisallow: /`;
    res.setHeader('Content-Type', 'text/plain');
    // Return a non-crawlable robots.txt in non-production environments
    res.status(200).write(process.env.VERCEL_ENV === "production"
        ? crawlableRobotsTxt
        : uncrawlableRobotsTxt
    );
    res.end();
}