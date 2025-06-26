import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig={
    slug :"products",
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
        }
    ]
}