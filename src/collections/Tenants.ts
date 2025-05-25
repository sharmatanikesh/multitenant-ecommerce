 import type { CollectionConfig } from 'payload'
 
 export const Tenants: CollectionConfig = {
   slug: 'tenants',
   admin: {
     useAsTitle: 'slug',
   },
   fields: [
     {
       name:"name",
       required: true,
       type: 'text',
       label:"Store Name",
       admin:{
        description:"This is the name of the store (e.g. 'Tanikesh Store')"
       }
    
     },
     {
        name: "slug",
        type: 'text',
        unique: true,
        required: true,
        index: true,
        admin:{
            description:"This is the subdomain of the store (e.g. [slug].fumoroad.com)"
        }
     },
     {
        name:"image",
        type: 'upload',
        relationTo: 'media',
     },
     {
        name:"stripeAccountId",
        type: 'text',
        required: true,
        admin:{
            readOnly: true,
        }
     },
      {
        name:"stripeDetailSubmitted",
        type: 'checkbox',
        admin:{
            readOnly: true,
            description:"You cannont create account until you have submitted your Stripe details"
        }
     }

   ],
 }
 