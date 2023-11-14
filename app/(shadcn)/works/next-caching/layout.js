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
            <p className="leading-7 [&:not(:first-child)]:mt-6 mb-4">
                This is some example of bad caching pattern in next.js
            </p>
            <PageNav />
            {children}
    </main>
    </>
  )
}
