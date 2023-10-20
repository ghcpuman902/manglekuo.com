import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import { Skeleton } from "@components/ui/skeleton"
import { AspectRatio } from "@components/ui/aspect-ratio"

import { Badge } from "@components/ui/badge";

export const LoadingCardGrid = async () => {
    const colorData = ["amber|100|600", "sky|100|400", "sky|200|600", "blue|200|600", "emerald|200|600", "violet|200|600", "neutral|200|600"];

    const zoneColors = colorData.map(color => {
        const [baseColor, defaultIntensity, darkModeIntensity] = color.split("|");
        return `bg-${baseColor}-${defaultIntensity} dark:bg-${baseColor}-${darkModeIntensity} hover:bg-${baseColor}-${parseInt(defaultIntensity)} dark:hover:bg-${baseColor}-${parseInt(darkModeIntensity)} active:bg-${baseColor}-${parseInt(defaultIntensity)} dark:active:bg-${baseColor}-${parseInt(darkModeIntensity)}`;
    });

    const zoneBorderColors = colorData.map(color => {
        const [baseColor, defaultIntensity, darkModeIntensity] = color.split("|");
        return `border-${baseColor}-${parseInt(defaultIntensity) + 100} dark:border-${baseColor}-${parseInt(darkModeIntensity) - 100}`;
    });

    const loadingPlaceHolderArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'];

    return (
        <>
            <div className="items-stretch justify-center mb-6">
                <div className="scroll-m-20 font-semibold tracking-tight text-neutral-400 dark:text-neutral-600">loading articles</div>
            </div>
            <div className="items-stretch justify-center gap-6 rounded-lg grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {loadingPlaceHolderArr.map((key) => {
                    return (<Card key={key} className={`overflow-clip ${zoneBorderColors[6]}`}>
                        <AspectRatio ratio={16 / 9} className="relative overflow-hidden">
                            <Skeleton className="w-full h-full" />
                        </AspectRatio>
                        <CardHeader>
                            <CardTitle><Skeleton className="w-5/6 h-[1em]" /></CardTitle>
                            <CardTitle><Skeleton className="w-full h-[1em]" /></CardTitle>
                            <CardTitle><Skeleton className="w-2/6 h-[1em]" /></CardTitle>
                            <div className="text-sm text-muted-foreground pt-1"><Badge variant="secondary" className="mr-1" suppressHydrationWarning>0h ago</Badge><Badge variant="secondary" className={zoneColors[6]}>___ (???%)</Badge></div>
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-[1rem] w-full" />
                            <Skeleton className="h-[1rem] w-full" />
                            <Skeleton className="h-[1rem] w-full" />
                            <Skeleton className="h-[1rem] w-5/6" />
                        </CardContent>
                        <CardFooter>
                            <div className="leading-7 [&:not(:first-child)]:mt-6 text-ellipsis overflow-hidden">Source: <Skeleton className="w-[40px] h-[1em]" /></div>
                        </CardFooter>
                    </Card>
                    );
                })}
            </div>
        </>
    );
}
