import { CategoryDropdown } from "./category-dropdown";
import { CustomCategory } from "../types";

interface CategoriesProps{
    data:CustomCategory[];
}


export const Categories=({data}:CategoriesProps)=>{
    return(
        <div className="relative w-full ">

            <div className="flex flex-nowrap items-center">
           
           {data.map((category)=>(
            <div key={category.id}>
                <CategoryDropdown category={category}
                isActive={false}
                isNavigatedHovered={false}
                />
            </div>
           ))}
           </div>   
        </div>
    )
}