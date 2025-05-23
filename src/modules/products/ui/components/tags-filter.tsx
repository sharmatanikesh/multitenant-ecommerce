import { useTRPC } from "@/trpc/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { DEFAULT_LIMIT } from "../../../../constants";
import { LoaderIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface TagsFilterProps {
    values?: string[] | null;
    onChange: (value: string[]) => void;
}   

export const TagsFilter = ({ values, onChange }: TagsFilterProps) => {
    const trpc =useTRPC();

    const {data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
        
    } = useInfiniteQuery(trpc.tags.getMany.infiniteQueryOptions({limit:DEFAULT_LIMIT},
        {
            getNextPageParam:(lastPage)=>{
               return lastPage.docs.length >1?lastPage.nextPage:undefined;
            },
        }
    ))

    // understand 
    const onClick=(tag:string)=>{
        if(values?.includes(tag)){
            onChange(values?.filter((t)=>t!==tag) || []);
        }else{
            onChange([...(values || []),tag]);
        }
    }
    return(
        <div className="flex flex-col gap-y-2">
            {
                isLoading?(
                    <div className="flex justify-center items-center p-4">
                        <LoaderIcon className="animate-spin size-4"  />
                    </div>
                ):(
                    data?.pages.map((page)=>
                    page.docs.map((tag)=>(
                        <div key={tag.id} className="flex items-center justify-between cursor-pointer" onClick={()=>onClick(tag.name)}>
                            <p className="font-medium">{tag.name}</p>
                            <Checkbox checked={values?.includes(tag?.name)}
                            onCheckedChange={()=>onClick(tag.name)}/>
                        </div>
                    )))
                )
            }
            {hasNextPage && (
                <button
                    className="underline font-medium justify-start text-start disabled:opacity-50 cursor-pointer "
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                >
                    Load more...
                </button>
            )}
        </div>
    )
}