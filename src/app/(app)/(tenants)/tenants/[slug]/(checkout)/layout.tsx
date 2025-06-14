
import { Footer } from "@/modules/home/ui/components/footer";
import { NavBar } from "@/modules/checkout/ui/components/navbar";


interface LayoutProps { 
    children: React.ReactNode;
    params:Promise<{slug:string}>
}

const Layout = async({children,params}:LayoutProps) => {
    const { slug } = await params;


     
    return (
        <div className="min-h-screen flex flex-col bg-[#F4F4F0]" >
                    <NavBar slug={slug} />
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