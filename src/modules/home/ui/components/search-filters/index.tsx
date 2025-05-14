"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { Categories } from "./categories";
import { SearchInput } from "./search-input";
import { DEFAULT_BG_COLOR } from "@/modules/home/constants";
import BreadcrumbNavigation from "./breadcrumb-navigation";

export const SearchFilters = () => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

  const params = useParams();
  const categoryParam = params.category as string | undefined;
  const activeCategory = categoryParam || "all";

  const activeCategroyData = data.find((category)=>category.slug === activeCategory);
  const activeCategroyColor = activeCategroyData?.color ||DEFAULT_BG_COLOR; 
  const activeCategoryName = activeCategroyData?.name || null;

  const activeSubcategory = params.subcategory as string | undefined;
  const activeSubcategoryName= activeCategroyData?.subcategories?.find((subcategory)=>subcategory.slug === activeSubcategory)?.name || null;
  return (
    <div className="px-4 lg:px-12 py-8 border-b  flex flex-col gap-4 w-full" style={{
      backgroundColor: activeCategroyColor
    }}>
      <SearchInput />
      <div className=" hidden lg:block">
        <Categories data={data} />
        <BreadcrumbNavigation
          activeCategory={activeCategory}
          activeCategoryName={activeCategoryName||""}
          activeSubcategoryName={activeSubcategoryName||""}
        />
      </div>
    </div>
  );
};


export const SearchFiltersSkelton = () => {
  return (
    <div
      className="px-4 lg:px-12 py-8 border-b  flex flex-col gap-4 w-full"
      style={{ backgroundColor: "#F5F5F5" }}
    >
      <SearchInput disable />
      <div className=" hidden lg:block">
        <div className="h-11"></div>
      </div>
    </div>
  );
};
