'use client'
import Image from 'next/image'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@components/ui/popover"

function abbrTitle (title) {
    let originalTitle = title;
    
    // check if title has brackets, extract the string inside
    let match = title.match(/\((.*?)\)/);
    if (match) originalTitle = match[1];

    // remove all symbols and THE
    let cleanTitle = originalTitle.replace(/[^a-z\s]/gi, '').replace(/\bTHE\b/gi, '').trim();

    // split the title by spaces and filter out any empty strings
    let splitTitle = cleanTitle.toUpperCase().split(' ').filter(word => word !== '');

    switch (splitTitle.length) {
      case 0:
        return '';
      case 1:
        // the title has only one word
        return splitTitle[0].substr(0, 3);
      case 2:
         // the title contains two words
         if(splitTitle[0].length>=2){
            return splitTitle[0].substr(0, 2) + splitTitle[1].substr(0, 1);
         }else if(splitTitle[1].length>=2){
            return splitTitle[0].substr(0, 1) + splitTitle[1].substr(0, 2);
         }else if(splitTitle[1].length>=2){
            return splitTitle[0].substr(0, 1) + splitTitle[1].substr(0, 1);
         }
      default:
          // the title contains three or more words
          return splitTitle.slice(0, 3).map(word => word[0]).join('');
    }
}

export default function Film({ film }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className={`flex-1 flex items-center justify-center overflow-hidden rounded ${film.category == "In Competition - Feature Films" ? "bg-red-500" :
                    film.category == "Un Certain Regard" ? "bg-sky-500" :
                        film.category == "Cannes Cinéma" ? "bg-amber-500" :
                            film.category == "Out of Competition" || film.category == "Out of Competition - Midnight Screenings" ? "bg-slate-500" :
                                film.category == "Special Screenings" || film.category == "Cannes Premiere" ? "bg-orange-400" :
                                    film.category == "Cannes Classics - Documentaries about Cinema" || film.category == "Cannes Classics - Restored prints" || film.category == "Cannes Classics - World Cinéma Project" ? "bg-yellow-500" :
                                        "bg-gray-400"} ${film.hasTicket ? 'opacity-100' : 'opacity-40'} w-full`}>
                    <p className='w-[0px] mb-[-100%] transform -rotate-90 leading-tight'>
                        {abbrTitle(film.filmTitle)}
                    </p>
                </div>
            </PopoverTrigger>
            <PopoverContent className="bg-gray-200 text-slate-600 p-2 md:p-5">
                <div className="font-bold">{film.filmTitle}</div>
                by {film.director}<br />
                <div className="text-sm font-bold">{film.category}</div>
                {film.startTime} to {film.endTime}<br />
                at {film.location}<br />
                {film.posterUrl ? (<Image
                    src={film.posterUrl}
                    width={340}
                    height={470}
                    alt=""
                    className='max-h-[200px] w-auto'
                />) : null}
                {/* <pre>{JSON.stringify(film, null, " ")}</pre> */}
            </PopoverContent>
        </Popover >
    );
}