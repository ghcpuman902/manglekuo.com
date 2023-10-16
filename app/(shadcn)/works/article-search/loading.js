import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";

import { timeAgo, getDictionary } from "./utils/utils";

export default function Loading() {
    const dict = getDictionary();
    return (
        <div className="p-4 md:p-8">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">{dict.title.article_search}<span className="text-lg text-blue-600 inline-block align-text-top">beta</span></h1>

            <div className="my-6">
                <Label className="mr-1">{dict.label.article_sources}</Label>
                {dict.label.loading}
            </div>

            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">{dict.title.fetched_articles}{dict.title._within_the_past_.replace("[NUMBER]", 0).replace("[DAYS]", 0)}</h2>

            <div className="my-6 items-stretch justify-center gap-6 rounded-lg grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                <div className="col-span-4">
                    <div className="w-full flex">
                        <Input id="query" type="text" className="mr-2" value="" readOnly={true}/>
                        <Button className="flex flex-nowrap whitespace-nowrap" disabled={true}><span className="animate-spin text-xl">☻</span>&nbsp;&nbsp;{dict.button.wait}</Button>
                    </div>
                </div>
                <div className="col-span-4 flex flex-wrap justify-center">
                    <div className="flex items-center">
                        <Label htmlFor="sort-by-options" className="my-2 mr-3">{dict.label.sort_by}</Label>
                        <RadioGroup defaultValue="relevance" id="sort-by-options" className="grid-cols-2 gap-2" readOnly={true}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="relevance" id="relevance" checked={true} />
                                <Label htmlFor="relevance">{dict.label.relevance}</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="date" id="date" checked={false} />
                                <Label htmlFor="date">{dict.label.date}</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="flex items-center">
                        <Label htmlFor="filter-by-options" className="my-2 mr-3">{dict.label.filter_by}</Label>
                        <RadioGroup defaultValue="four-days" id="filter-by-options" className="grid-cols-4 gap-2" readOnly={true}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="one-month" id="one-month" checked={false} />
                                <Label htmlFor="one-month">{dict.label["one-month"]}</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="one-week" id="one-week" checked={false} />
                                <Label htmlFor="one-week">{dict.label["one-week"]}</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="four-days" id="four-days" checked={true} />
                                <Label htmlFor="four-days">{dict.label["four-days"]}</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="fourty-eight-hours" id="fourty-eight-hours" checked={false} />
                                <Label htmlFor="fourty-eight-hours">{dict.label["fourty-eight-hours"]}</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
            </div>
            <div className="hidden">
                {/* Sample colors to help tailwind treeshaking correctly*/}
                <div className="bg-amber-100 dark:bg-amber-600 hover:bg-amber-200 dark:hover:bg-amber-700 active:bg-amber-300 dark:active:bg-amber-700" />
                <div className="bg-sky-100 dark:bg-sky-400 hover:bg-sky-200 dark:hover:bg-sky-500 active:bg-sky-300 dark:active:bg-sky-500" />
                <div className="bg-sky-200 dark:bg-sky-600 hover:bg-sky-300 dark:hover:bg-sky-700 active:bg-sky-400 dark:active:bg-sky-700" />
                <div className="bg-blue-200 dark:bg-blue-600 hover:bg-blue-300 dark:hover:bg-blue-700 active:bg-blue-400 dark:active:bg-blue-700" />
                <div className="bg-emerald-200 dark:bg-emerald-600 hover:bg-emerald-300 dark:hover:bg-emerald-700 active:bg-emerald-400 dark:active:bg-emerald-700" />
                <div className="bg-violet-200 dark:bg-violet-600 hover:bg-violet-300 dark:hover:bg-violet-700 active:bg-violet-400 dark:active:bg-violet-700" />
                {/* Sample border colors to help tailwind treeshaking correctly*/}
                <div className="border-amber-200 dark:border-amber-500" />
                <div className="border-sky-200 dark:border-sky-300" />
                <div className="border-sky-300 dark:border-sky-500" />
                <div className="border-blue-300 dark:border-blue-500" />
                <div className="border-emerald-300 dark:border-emerald-500" />
                <div className="border-violet-300 dark:border-violet-500" />
            </div>
            <div className="mt-4 md:mt-8 flex flex-col w-full items-center">
                Made by Mangle Kuo. All rights reserved.<br />
                <Button variant="link">clear all data</Button><br />
            </div>
        </div>
    );
}