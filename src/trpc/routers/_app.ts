import {  createTRPCRouter } from '../init';

import { categoriesRouter } from '@/modules/categories/server/procedures';
import { authRouter } from '@/modules/auth/server/procedures';
import { productsRouter } from '@/modules/products/server/procedures';
import { tagsRouter } from '@/modules/tags/server/procedures';
import { tenantsRouter } from '@/modules/tenants/server/procedures';
import { checkoutRouter } from '@/modules/checkout/server/procedures';
import { libraryRouter } from '@/modules/library/server/procedures';


export const appRouter = createTRPCRouter({

 auth: authRouter,
 tags:tagsRouter,
 categories:categoriesRouter,
 tenants:tenantsRouter,
 library:libraryRouter,
 products:productsRouter,
 checkout:checkoutRouter,
 
});
// export type definition of API
export type AppRouter = typeof appRouter;