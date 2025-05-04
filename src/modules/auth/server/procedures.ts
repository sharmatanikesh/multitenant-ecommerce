
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { headers as getHeaders} from "next/headers";

import { registerSchema ,loginSchema} from "../schemas";
import { generateAuthCookie } from "../utils";

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();

    // payload api for auth db==payload
    const session = await ctx.db.auth({ headers });

    return session;
  }),
  register: baseProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      const existingData = await ctx.db.find({
        collection: "users",
        limit: 1,
        where: {
          username: {
            equals: input.username,
          },
        },
      });

      const existingUser = existingData.docs[0];
      if (existingUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username already taken",
        });
      }
      await ctx.db.create({
        collection: "users",
        data: {
          email: input.email,
          password: input.password, // this will be hashed
          username: input.username,
        },
      });

      // try login
      const data = await ctx.db.login({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
        },
      });

      if (!data) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Failed to login",
        });
      }

      await generateAuthCookie({
        prefix:ctx.db.config.cookiePrefix,
        value:data.token || " ",
      })
    }),
  
  // LOGIN PROCESS
  login: baseProcedure
    .input(
      loginSchema
    )
    .mutation(async ({ input, ctx }) => {
      const data = await ctx.db.login({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
        },
      });

      if (!data) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Failed to login",
        });
      }

      await generateAuthCookie({
        prefix:ctx.db.config.cookiePrefix,
        value:data.token || " ",
      })

      return data;
    }),
});
