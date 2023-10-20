'use client';

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import { useLoading, useQueryString, useSortingMethod, useFilterByDays } from './article-context';

import { useEffect, useRef, useState, useCallback } from 'react';
import { getDictionary } from "../_utils/utils";

export const SearchSortFilter = ({locale}) => {
    const [loading, setLoading] = useLoading();
    const [queryString, setQueryString] = useQueryString();
    const [sortingMethod, setSortingMethod] = useSortingMethod();
    const [filterByDays, setFilterByDays] = useFilterByDays();
    const dict = getDictionary(locale);
    
    const queryInputRef = useRef();

    const updateSortingMethod = (e) => {
        if (e == 'date') {
            setSortingMethod('date');
        } else {
            setSortingMethod('relevance');
        }
    }

    const updateFilterDays = (e) => {
        const durations = {
            'one-month': 30,
            'one-week': 7,
            'four-days': 4,
            'fourty-eight-hours': 2
        };
        setFilterByDays(durations.hasOwnProperty(e) ? durations[e] : 4);
    }

    useEffect(()=>{
        queryInputRef.current.value = queryString;
    },[queryString]);

    return (
        <div className="mt-6 mb-3 w-full flex flex-wrap justify-center">
            <div className="w-full flex">
                <Input id="query" type="text" className="mr-2" defaultValue={queryString} ref={queryInputRef} onKeyPress={event => {
                    if (event.key === 'Enter') {
                        event.preventDefault(); // Prevents the default action of enter key
                        setQueryString(queryInputRef.current.value ? queryInputRef.current.value : queryString);
                    }
                }} />
                <Button className="flex flex-nowrap whitespace-nowrap" onClick={() => { setQueryString(queryInputRef.current.value ? queryInputRef.current.value : queryString); }} disabled={loading != 200}>{loading != 200 ? (<><span className="animate-spin text-xl">☻</span>&nbsp;&nbsp;{dict.button.wait}</>) : dict.button.search}</Button>
            </div>
            <div className="flex items-center mx-2">
                <Label htmlFor="sort-by-options" className="my-2 mr-3">{dict.label.sort_by}</Label>
                <RadioGroup defaultValue="relevance" id="sort-by-options" className="flex gap-2"
                    onValueChange={updateSortingMethod}>
                        <RadioGroupItem value="relevance" id="relevance" checked={sortingMethod == "relevance"} />
                        <Label className="mr-1" htmlFor="relevance">{dict.label.relevance}</Label>
                        <RadioGroupItem value="date" id="date" checked={sortingMethod == "date"} />
                        <Label className="mr-1" htmlFor="date">{dict.label.date}</Label>
                </RadioGroup>
            </div>
            <div className="flex items-center mx-2">
                <Label htmlFor="filter-by-options" className="my-2 mr-3">{dict.label.filter_by}</Label>
                <RadioGroup defaultValue="four-days" id="filter-by-options" className="flex gap-2"
                    onValueChange={updateFilterDays}>
                        <RadioGroupItem value="one-month" id="one-month" checked={filterByDays == 30} />
                        <Label className="mr-1" htmlFor="one-month">{dict.label["one-month"]}</Label>
                        <RadioGroupItem value="one-week" id="one-week" checked={filterByDays == 7} />
                        <Label className="mr-1" htmlFor="one-week">{dict.label["one-week"]}</Label>
                        <RadioGroupItem value="four-days" id="four-days" checked={filterByDays == 4} />
                        <Label className="mr-1" htmlFor="four-days">{dict.label["four-days"]}</Label>
                        <RadioGroupItem value="fourty-eight-hours" id="fourty-eight-hours" checked={filterByDays == 2} />
                        <Label className="mr-1" htmlFor="fourty-eight-hours">{dict.label["fourty-eight-hours"]}</Label>
                </RadioGroup>
            </div>
        </div>
    );
}