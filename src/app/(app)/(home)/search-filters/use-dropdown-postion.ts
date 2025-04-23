import { RefObject } from "react";


export const useDropdownPosition=( ref:RefObject<HTMLDivElement|null>|RefObject<HTMLDivElement>)=>{

    const getDropdownPosition=()=>{
        if(!ref.current) return {top:0, left:0}

        const rect = ref.current.getBoundingClientRect();// check what it is 

        const dropdownWidth=240; // width of the dropdown (w-60 =15rem =240px)

        // Calculate the initial position

        let left = rect.left +window.scrollX;
        const top = rect.bottom + window.scrollY;

        // check if dropdown would go off the right edge of the viewport
        if(left+dropdownWidth>window.innerWidth){

            // Algin to the right edge of the button
            left=rect.right+window.scrollX-dropdownWidth;

            // if still offscreen, align to the right edge of the viewport
            if(left<0){
                left=window.innerWidth-dropdownWidth-16;
            }

        }

        // Ensure dropdown does not go off left edge
        if(left<0){
            left=16;
        }

        return {top, left}



    }   

    return {getDropdownPosition}
}