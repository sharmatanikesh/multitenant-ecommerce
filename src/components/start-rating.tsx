import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_RATING = 5;
const MIN_RATING = 0;

interface StartRatingProps { 
    rating: number;
    className?: string;
    iconClassName?: string;
    text?: string;
}

export const StartRating = ({ rating,className,iconClassName,text}: StartRatingProps) => { 
    
    const safeRating = Math.max(MIN_RATING, Math.min(MAX_RATING, rating));
    
    return (
        <div className={cn("flex items-center gap-x-1", className)}>

            {
                Array.from({ length: MAX_RATING }).map((_, index) => (
                    <StarIcon
                        key={index}
                        className={cn("size-4",index<safeRating ? "fill-black" : "", iconClassName)}
                    />
                ))
            }
            {text && <p>{ text}</p>}

        </div>
    )
}