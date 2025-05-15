import { Suspense } from "react";

import { trpc, getQueryClient } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { ProductList,
   ProductListSkeleton
} from "@/modules/products/ui/components/product-list";

 interface Props{
    params:Promise<{
        subcategory?:string
    }>
 }
 
 const Page =async  ({ params}:Props )=>{
      
   const {subcategory} = await params;
    const queryClient = getQueryClient()
    void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({category:subcategory }));
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
         <Suspense fallback={<ProductListSkeleton/>}>
                <ProductList category={subcategory}/>
         </Suspense>
     
        </HydrationBoundary>
    )
 }


 export default Page; 

