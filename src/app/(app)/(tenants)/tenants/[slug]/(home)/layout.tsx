import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { Footer } from "@/modules/tenants/ui/components/Footer";
import { NavBar, NavBarSkeleton } from "@/modules/tenants/ui/components/NavBar";
import { Suspense } from "react";

interface LayoutProps { 
    children: React.ReactNode;
    params:Promise<{slug:string}>
}

const Layout = async({children,params}:LayoutProps) => {
    const { slug } = await params;

    const queryClient = getQueryClient()
    void queryClient.prefetchQuery(trpc.tenants.getOne.queryOptions({slug} ));
     
    return (
        <div className="min-h-screen flex flex-col bg-[#F4F4F0]" >
            
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<NavBarSkeleton/>}>
                    <NavBar slug={slug} />
                </Suspense>
            </HydrationBoundary>    
            <div className="flex-1">
                <div className="max-w-[--breakpoint] mx-auto" >
                    {children}
                </div>
            </div>
            
            <Footer/>
        </div>
    )
}

export default Layout;