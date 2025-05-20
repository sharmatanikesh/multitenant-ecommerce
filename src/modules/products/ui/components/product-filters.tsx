"use client"

import { cn } from "@/lib/utils";
import { ChevronDownIcon,ChevronRightIcon } from "lucide-react";
import { useState } from "react"
import { PriceFilter } from "./price-filter";
import { useProductFilters } from "../../hooks/use-product-filters";

interface ProductFilterProps{
    title:string,
    className?:string,
    children:React.ReactNode
}

const ProductFilter = ({title,className,children}:ProductFilterProps)=>{
    const [isOpen,setIsOpen] = useState(false);

    const Icon = isOpen ?ChevronDownIcon:ChevronRightIcon

    return(
        <div className={cn("border-b p-4 flex flex-col gap-2",className)}>
            <div onClick={()=>setIsOpen((current)=>!current)} className="flex items-center justify-between cursor-pointer">
                <p className="font-medium">{title}</p>
                <Icon className="size-5"/>
            </div>
            {isOpen&& children}
        </div> 
    )
}
export const ProductFilters =()=>{
    const [filters,setFilters] = useProductFilters();

    const onChange =(key:keyof typeof filters,value:unknown)=>{
        setFilters({...filters,[key]:value})
    } 
    return (
        <div className="border rounded-md bg-white">
            <div className="p-4 border-b flex items-center justify-between">
                <p className="font-medium">Filters</p>
                <button className="underline" onClick={()=>{}} type="button">Clear</button>
            </div>
            <ProductFilter className="border-b-0" title="Price">
               <PriceFilter maxPrice={filters.maxPrice} minPrice={filters.minPrice}
               onMaxPriceChange={(value)=>onChange("maxPrice",value)}
               onMinPriceChange={(value)=>onChange("minPrice",value)}/>
            </ProductFilter>
        </div>
    )
}