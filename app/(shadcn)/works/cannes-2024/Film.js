'use client'
import Image from 'next/image'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@components/ui/popover"


export default function Film({ film }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className={`flex-1 rounded ${film.category == "In Competition - Feature Films" ? "bg-red-500" :
                    film.category == "Un Certain Regard" ? "bg-sky-500" :
                        film.category == "Cannes Cinéma" ? "bg-amber-500" :
                            film.category == "Out of Competition" || film.category == "Out of Competition - Midnight Screenings" ? "bg-slate-500" :
                                film.category == "Special Screenings" || film.category == "Cannes Premiere" ? "bg-orange-400" :
                                    film.category == "Cannes Classics - Documentaries about Cinema" || film.category == "Cannes Classics - Restored prints" || film.category == "Cannes Classics - World Cinéma Project" ? "bg-yellow-500" :
                                        "bg-gray-400"} ${film.hasTicket ? 'opacity-100' : 'opacity-40'} w-full overflow-hidden`}>
                </div>
            </PopoverTrigger>
            <PopoverContent className="bg-gray-200 text-slate-600 p-2 md:p-5">
                <div className="font-bold">{film.filmTitle}</div>
                by {film.director}<br />
                <div className="text-sm font-bold">{film.category}</div>
                {film.startTime} to {film.endTime}<br />
                at {film.location}<br />
                {film.posterUrl?(<Image
                    src={film.posterUrl}
                    width={340}
                    height={470}
                    alt=""
                    className='max-h-[200px] w-auto'
                />):null}
                {/* <pre>{JSON.stringify(film, null, " ")}</pre> */}
            </PopoverContent>
        </Popover >
    );
}