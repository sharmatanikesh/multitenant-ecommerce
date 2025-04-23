"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { useDropdownPosition } from "./use-dropdown-postion";
import { SubcategoryMenu } from "./subcategory-menu";

interface Props {
  category: any;
  isActive: boolean;
  isNavigatedHovered: boolean;
}

export const CategoryDropdown = ({
  category,
  isActive,
  isNavigatedHovered,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const {getDropdownPosition} = useDropdownPosition(dropdownRef);

  const onMouseEnter = () => {
    if (category.subcategories) {
        console.log("Hellp")
      setIsOpen(true);
    }
  };

  const onMouseLeave = () => setIsOpen(false);

  const dropdownPosition=getDropdownPosition();

  return (
    <div
      className="relative "
      ref={dropdownRef}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
    >
      <div className="relative">
        <Button
          variant="elevated"
          className={cn(
            "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",
            isActive && !isNavigatedHovered && "bg-white border-primary"
          )}
        >
          {category.name}
        </Button>

        {category.subcategories && category.subcategories.length > 0 && (
            <div className={cn("opacity-0 absolute -bottom-3 w-0 h-0 border-l-[10px] border-b-[10px] border-r-[10px] border-l-transparent border-r-transparent border-b-black left-1/2 -translate-x-1/2",
                isOpen && "opacity-100"
            )}>
            </div>
        )}
      </div>

      <SubcategoryMenu
      category={category}
      isOpen={isOpen}
      postion={dropdownPosition}
      />
    </div>
  );
};
