import { DEFAULT_LIMIT } from "@/constants";
import { loadProductFilters } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server"


interface Props{
    params:Promise<{
        slug?:string
    }>,
    searchParams:Promise<SearchParams>
}
 export const dynamic = "force-dynamic";
const Page = async ({ params, searchParams }: Props) => {
    
    const {slug} = await params;
    const filters = await loadProductFilters(searchParams);
    const queryClient = getQueryClient()
    void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({tenantSlug:slug ,...filters, limit:DEFAULT_LIMIT}));
       
    return(
          <HydrationBoundary state={dehydrate(queryClient)}>
         <ProductListView tenantSlug={slug} narrowView/>
        </HydrationBoundary>
    )
} 

export default Page;
