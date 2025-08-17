
import { trpc, getQueryClient } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { SearchParams } from "nuqs";
import { loadProductFilters } from "@/modules/products/search-params";
import { DEFAULT_LIMIT } from "@/constants";

 interface Props{
    params:Promise<{
        subcategory?:string
    }>,
     searchParams:Promise<SearchParams>
 }
 export const dynamic = "force-dynamic";
 
 const Page =async  ({ params,searchParams}:Props )=>{
      
   const {subcategory} = await params;
   const filters = await loadProductFilters (searchParams);
   
   const queryClient = getQueryClient()

    void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({category:subcategory,...filters,limit:DEFAULT_LIMIT}));

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
         <ProductListView category={subcategory}/>
        </HydrationBoundary>
    )
 }


 export default Page; 

