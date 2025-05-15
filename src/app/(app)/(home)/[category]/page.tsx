import { caller } from "@/trpc/server";

 interface Props{
    params:Promise<{
        category:string
    }>
 }
 
 const Page =async  ({params}:Props )=>{
    const {category } = await params;

    const products = await caller.products.getMany();
    return (
        <div>
           category: {category}
           Products: {JSON.stringify(products)}
            
        </div>
    )
 }


 export default Page; 