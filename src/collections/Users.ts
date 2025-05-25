import type { CollectionConfig } from 'payload'
import {tenantsArrayField} from "@payloadcms/plugin-multi-tenant/fields"

const defaultTenantsArrayField = tenantsArrayField({
  tenantsArrayFieldName: 'tenants',
  tenantsCollectionSlug: 'tenants',
  tenantsArrayTenantFieldName: 'tenant',
  arrayFieldAccess:{
    read:()=>true,
    create:()=>true,
    update:()=>true,
  },
  tenantFieldAccess:{
    read:()=>true,
    create:()=>true,
    update:()=>true,
  }
})
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name:"username",
      required: true,
      type: 'text',
      unique: true,
    },
    {
      admin:{
        position: 'sidebar',
      },
      name:'roles',
      type: 'select',
      defaultValue: ['user'],
      hasMany: true,
      options: ["user","super-admin"],
    },
    {
      ...defaultTenantsArrayField,
      admin:{
        ...(defaultTenantsArrayField.admin || {}),
        position: 'sidebar',
      }
    }
  ],
}
