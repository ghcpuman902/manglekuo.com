import { PageNav } from "./ui/PageNav"

export const metadata = {
  title: 'Next.js Bad Caching Patterns',
  description: '',
  creator: 'Mangle Kuo',
  authors: [
    {
      name: 'Mangle Kuo',
      url: 'https://github.com/ghcpuman902/',
    }
  ],
}

export default async function Layout({
  children,
}) {
  return (
    <>
    <main className='w-auto ml-6 m-2 [&_a]:underline'>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Next.js Bad Caching Patterns
            </h1>
            <PageNav />
            <p className="leading-7 max-w-[600px] [&:not(:first-child)]:mt-6 mb-4">
            Hi friend, here I show some examples of bad caching pattern in next.js so you can avoid them!
            </p>
            <p className="leading-7 max-w-[600px] [&:not(:first-child)]:mt-6 mb-4">
            Part of the caching mechanism in next.js only works when it's deployed on to the server so it's difficult to understand their behaviours when testing locally, I hope this site can help you!
            </p>
            <p className="leading-7 max-w-[600px] [&:not(:first-child)]:mt-6 mb-4">
            Please note this is mianly for the App Router instead of the Page Rounter.
            </p>
            {children}
    </main>
    </>
  )
}
