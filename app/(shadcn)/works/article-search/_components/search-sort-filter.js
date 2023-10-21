'use client';
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert"

import { useLoading, useQueryString, useSortingMethod, useFilterByDays } from './article-context';
import { clearAllData } from '../_utils/local-articles';

import { useEffect, useRef, useState, useCallback } from 'react';
import { getDictionary } from "../_utils/utils";

export const SearchSortFilter = ({ locale }) => {
    const [loading, setLoading] = useLoading();
    const [queryString, setQueryString] = useQueryString();
    const [sortingMethod, setSortingMethod] = useSortingMethod();
    const [filterByDays, setFilterByDays] = useFilterByDays();

    const [showAlert, setShowAlert] = useState(false);
    const queryInputRef = useRef();

    const dict = getDictionary(locale);

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

    useEffect(() => {
        queryInputRef.current.value = queryString;
    }, [queryString]);


    const timerRef = useRef(null);

    useEffect(() => {
        // Whenever loading changes, check its value
        if (loading !== 200) {
            // If a timer is not already going, start a new timer
            if (timerRef.current === null) {
                timerRef.current = setTimeout(() => {
                    setShowAlert(true);
                    // Clear the timer reference
                    timerRef.current = null;
                }, 90000);   // 1.5 minute
            }
        } else {
            // If loading is finished and there's a timer going, clear it
            if (timerRef.current !== null) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        }

        // When component unmounts, clear any running timer
        return () => {
            if (timerRef.current !== null) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [loading]);

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
            {showAlert ? (
                <div className="w-full flex">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>{dict.label["issue-alert-title"]}</AlertTitle>
                        <AlertDescription>
                            {dict.label['issue-alert-description'].split('\n').map((line, i) => (
                                <div key={i}>{line}<br /></div>
                            ))}
                        </AlertDescription>
                        <Button className="mr-1 px-6 mt-2" variant="outline" onClick={() => { clearAllData(); }}>{dict.button['clear-all-data']}</Button>
                        <Button className="mr-1 px-6 mt-2" variant="outline" onClick={() => { location.reload() }}>{dict.button['reload']}</Button>
                    </Alert>
                </div>) : null}
        </div>
    );
}