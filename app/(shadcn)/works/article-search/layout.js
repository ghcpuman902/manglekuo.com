import React from 'react';
import { AppContextProvider } from './_components/article-context';
import { LocaleDetector } from './_components/locale-detector';
import { Suspense } from 'react';

export const metadata = {
    title: 'Article Search',
};

export default function ArticleSearchLayout({ children }) {
    return (
        <div className="p-4 md:p-8">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Article Search<Suspense fallback={null}>
                <LocaleDetector />
            </Suspense></h1>
            <AppContextProvider>
                {children}
            </AppContextProvider>
            <div className="hidden">
                {/* Sample colors to help tailwind treeshaking correctly*/}
                <div className="bg-amber-100 dark:bg-amber-600 hover:bg-amber-200 dark:hover:bg-amber-700 active:bg-amber-300 dark:active:bg-amber-700" />
                <div className="bg-sky-100 dark:bg-sky-400 hover:bg-sky-200 dark:hover:bg-sky-500 active:bg-sky-300 dark:active:bg-sky-500" />
                <div className="bg-sky-200 dark:bg-sky-600 hover:bg-sky-300 dark:hover:bg-sky-700 active:bg-sky-400 dark:active:bg-sky-700" />
                <div className="bg-blue-200 dark:bg-blue-600 hover:bg-blue-300 dark:hover:bg-blue-700 active:bg-blue-400 dark:active:bg-blue-700" />
                <div className="bg-emerald-200 dark:bg-emerald-600 hover:bg-emerald-300 dark:hover:bg-emerald-700 active:bg-emerald-400 dark:active:bg-emerald-700" />
                <div className="bg-violet-200 dark:bg-violet-600 hover:bg-violet-300 dark:hover:bg-violet-700 active:bg-violet-400 dark:active:bg-violet-700" />
                <div className="bg-neutral-200 dark:bg-neutral-600 hover:bg-neutral-300 dark:hover:bg-neutral-700 active:bg-neutral-400 dark:active:bg-neutral-700" />
                {/* Sample border colors to help tailwind treeshaking correctly*/}
                <div className="border-amber-200 dark:border-amber-500" />
                <div className="border-sky-200 dark:border-sky-300" />
                <div className="border-sky-300 dark:border-sky-500" />
                <div className="border-blue-300 dark:border-blue-500" />
                <div className="border-emerald-300 dark:border-emerald-500" />
                <div className="border-violet-300 dark:border-violet-500" />
                <div className="border-neutral-300 dark:border-neutral-500" />
            </div>
            <div className="mt-4 md:mt-8 flex flex-col w-full items-center">
                Made by Mangle Kuo. All rights reserved.<br />
            </div>
        </div>
    );
}