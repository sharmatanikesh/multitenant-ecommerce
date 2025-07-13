import { isSuperAdmin } from '@/lib/access'
import { Tenant } from '@/payload-types'
import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig={
    slug :"products",
    access:{
        read:()=>true,
        create:({req})=>{
            if(isSuperAdmin(req.user)){
                return true
            }
           
            const tenant = req.user?.tenants?.[0]?.tenant as Tenant
            return Boolean(tenant?.stripeDetailSubmitted)

        }
  
    },
    admin:{
        useAsTitle:"name",
    },
    fields:[
        {
            name:"name",
            type:"text",
            required:true,
        },
        {
            name:"description",
            type:"text",
           
        },
        {
           name:"price",
           type:"number", 
           required:true,
           admin:{
            description:"Price in USD",
           }
        },
        {
            name:"category",
            type:"relationship", 
            relationTo:"categories",
            hasMany:false,
        },
        {
            name:"tags",
            type:"relationship", 
            relationTo:"tags",
            hasMany:false,
        },
        {
            name:"image",
            type:"upload",
            relationTo:"media",
        },
        {
            name:"refundPolicy",
            type:"select",
            options:["30-day","14-day","7-day","no-refund"], 
            defaultValue:"30-day",
        },
        {
            name:"content",
            type:"textarea",
            admin:{
                description:"Protected content only visible to the tenan. Add product downloadatble files, getting strarted guides and bonus mateeial"
            }
        }
    ]
}