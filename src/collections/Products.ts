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

        },
        delete :({req})=> isSuperAdmin(req.user),
    },
    admin:{
        useAsTitle:"name",
        description:"You must verify your account before creating products"
    },
    fields:[
        {
            name:"name",
            type:"text",
            required:true,
        },
        {
            name:"description",
            type:"richText",
           
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
            type:"richText",
            admin:{
                description:"Protected content only visible to the tenan. Add product downloadatble files, getting strarted guides and bonus mateeial"
            }
        },
        {
            name:"isArchived",
            label:"Archive",
            defaultValue:false,
            type:"checkbox",
            admin:{
                description:"Check if you want to hide this product"
            }
        },
        {
            name:"isPrivate",
            label:"Private",
            defaultValue:false,
            type:"checkbox",
            admin:{
                description:"If checked, this product will not be shown on the public storefront."
            }
        } 
    ]
}