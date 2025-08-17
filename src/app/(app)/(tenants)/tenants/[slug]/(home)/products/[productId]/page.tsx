import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { ProductView, ProductViewSkelton } from "@/modules/products/ui/views/product-view";
import { Suspense } from "react";

interface Props{
    params: Promise<{productId: string, slug: string}>
}

export const dynamic = "force-dynamic";

const Page = async ({ params }: Props) => { 

    const { productId,slug,  } = await params;
    console.log("PRODUCT ID", productId);

    const queryClient = getQueryClient()
    void queryClient.prefetchQuery(trpc .tenants.getOne.queryOptions({ slug }));
    
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<ProductViewSkelton/>}>
            <ProductView  productId={productId} tenantSlug={slug} />
            </Suspense>
      </HydrationBoundary>
    )
}
export default Page; 

