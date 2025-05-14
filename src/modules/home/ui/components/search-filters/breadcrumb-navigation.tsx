import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";

interface Props{
    activeCategory:string;
    activeCategoryName:string;
    activeSubcategoryName:string;
}

const BreadcrumbNavigation=({activeCategory,activeCategoryName,activeSubcategoryName}:Props)=>{

    if(!activeCategoryName || activeCategory=="all") return null;
    return(
        <Breadcrumb>
            <BreadcrumbList>
            {
                activeSubcategoryName?(<>
                <BreadcrumbItem>
                <BreadcrumbLink className="text-xl font-medium underline text-primary">
                <Link href={`/${activeCategory}`}>{activeCategoryName}</Link>
                </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator className="text-primary text-lg font-medium">/</BreadcrumbSeparator>
                <BreadcrumbItem>
                <BreadcrumbPage className="text-xl font-medium ">
                {activeSubcategoryName }
                </BreadcrumbPage>
                </BreadcrumbItem>
                </>):(
                    <BreadcrumbItem>
                <BreadcrumbPage className="text-xl font-medium ">
                {activeCategoryName}
                </BreadcrumbPage>
                </BreadcrumbItem> 
                )
            }
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default BreadcrumbNavigation;