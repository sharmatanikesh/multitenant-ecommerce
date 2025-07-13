 import { isSuperAdmin } from '@/lib/access'
import type { CollectionConfig } from 'payload'
 
 export const Tenants: CollectionConfig = {
   slug: 'tenants',
   access:{
    read:()=>true,
    create:({req})=>isSuperAdmin(req.user),
    delete:({req})=>isSuperAdmin(req.user),
   },
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
        access:{
          create:({req})=>isSuperAdmin(req.user),
        },
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
        access:{
          update:({req})=>isSuperAdmin(req.user),
        },
        admin:{
          description:"Stripe Account ID associated with this store"
      }
     },
      {
        name:"stripeDetailSubmitted",
        type: 'checkbox',
        admin:{
            description:"You cannont create account until you have submitted your Stripe details"
        },
        access:{
          update:({req})=>isSuperAdmin(req.user),
        }
     }

   ],
 }
 