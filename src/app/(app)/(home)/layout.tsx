import configPromise from "@payload-config";
import { getPayload } from "payload";
import { Category } from "@/payload-types";

import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { SearchFilters } from "./search-filters";
import { CustomCategory } from "./types";


export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories",
    depth:1, // Populate subcategories, subcategories[0] is type of category
    pagination:false,

    where:{
      parent:{
        exists:false
      }
    },
    sort: "name",
  });

  const formattedData :CustomCategory[]= data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
      // because of the depth 1 we are confident doc will be a type of Category
      ...(doc as Category),
      subcategories:undefined
    })),
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchFilters data={formattedData}/>
      <div className="flex-1 bg-[#F4F4F0]">{children}</div>
      <Footer />
    </div>
  );
}
