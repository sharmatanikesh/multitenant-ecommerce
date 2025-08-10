import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import type { Sort, Where } from "payload";
import { TRPCError } from "@trpc/server";


import { headers as getHeaders } from "next/headers"
import { DEFAULT_LIMIT } from "@/constants";
import { Category, Media, Tenant } from "@/payload-types";
import { sortValues } from "../search-params";


export const productsRouter = createTRPCRouter({
  getOne: baseProcedure.input(
    z.object({
      id: z.string(),
    })
  ).query(async ({ ctx, input }) => {
    const headers = await getHeaders();
    const session = await ctx.db.auth({ headers });
    const product = await ctx.db.findByID({
      collection: "products",
      id: input.id,
      depth: 2, // Populate categories and images tenant and tenant image
      select: {
        content: false,
      }
    });
    if (product.isArchived) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Product not found"
      })
    }
    let isPurchased = false;

    if (session.user) {
      const orderData = await ctx.db.find({
        collection: "orders",
        pagination: false,
        limit: 1,
        where: {
          and: [
            {
              product: {
                equals: input.id
              },
              user: {
                equals: session.user.id
              }

            }
          ]
        }
      })
      isPurchased = !!orderData.docs[0];
    }

    const reviews = await ctx.db.find({
      collection: "reviews",
      pagination: false,
      where: {
        product: {
          equals: input.id
        }
      }
    })

    const reviewRating = reviews.docs.length > 0 ? reviews.docs.reduce((acc, review) => acc + review.rating, 0) / reviews.docs.length : 0;

    const ratingDistribution: Record<number, number> = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    if (reviews.totalDocs > 0) {
      reviews.docs.forEach((review) => {
        ratingDistribution[review.rating] = (ratingDistribution[review.rating] || 0) + 1;
      })

      Object.keys(ratingDistribution).forEach((key) => {
        const rating = Number(key);
        const count = ratingDistribution[rating] || 0;
        ratingDistribution[rating] = Math.round((count / reviews.totalDocs) * 100);
      })
    }
    return {
      ...product,
      isPurchased,
      image: product.image as Media | null,
      tenant: product.tenant as Tenant & { image: Media | null },
      reviewRating,
      reviewCount: reviews.totalDocs,
      ratingDistribution
    }
  }),
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
        sort: z.enum(sortValues).nullable().optional(),
        tenantSlug: z.string().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {
        isArchived: {
          not_equals: false, // Only fetch products that are not archived 
        },
      };

      let sort: Sort = "-createdAt";

      if (input.sort === "curated") {
        sort = "-createdAt";
      }
      if (input.sort === "trending") {
        sort = "name";
      }
      if (input.sort === "hot_and_new") {
        sort = "+createdAt";
      }

      if (input.minPrice && input.maxPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
          less_than_equal: input.maxPrice,
        };
      } else if (input.minPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
        };
      } else if (input.maxPrice) {
        where.price = {
          less_than_equal: input.maxPrice,
        };
      }

      if (input.tenantSlug) {
        where["tenant.slug"] = {
          equals: input.tenantSlug,
        };
      }else{
        where["isPrivate"]={
          not_equals: true, // Only fetch public products
        }
      }
      if (input.category) {
        const categoriesData = await ctx.db.find({
          collection: "categories",
          limit: 1,
          depth: 1, // Populate subcategories, subcategories[0] is type of category
          pagination: false,
          where: {
            slug: {
              equals: input.category,
            },
          },
        });

        const formattedData = categoriesData.docs.map((doc) => ({
          ...doc,
          subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
            // because of the depth 1 we are confident doc will be a type of Category
            ...(doc as Category),
            subcategories: undefined,
          })),
        }));

        const subcategoriesSlug = [];
        const parentCategory = formattedData[0];

        if (parentCategory) {
          subcategoriesSlug.push(
            ...parentCategory.subcategories.map(
              (subcategory) => subcategory.slug
            )
          );
        }
      }

      if (input.tags && input.tags.length > 0) {
        where["tags.name"] = {
          in: input.tags,
        };
      }
      const data = await ctx.db.find({
        collection: "products",
        depth: 2, // Populate categories and images tenant and tenant image
        where,
        sort,
        page: input.cursor,
        limit: input.limit,
        select: {
          content: false,
        }
      });

      const dataWithSummarizedReviews = await Promise.all(
        data.docs.map(async (doc) => {
          const reviewsData = await ctx.db.find({
            collection: "reviews",
            pagination: false,
            where: {
              product: {
                equals: doc.id
              }
            }
          })

          return {
            ...doc,
            reviewCount: reviewsData.totalDocs,
            reviewRating: reviewsData.docs.reduce((acc, review) => acc + review.rating, 0) / reviewsData.totalDocs
          }
        })
      )
      return {
        ...data,
        docs: dataWithSummarizedReviews.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
