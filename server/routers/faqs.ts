import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import * as db from "../db";

export const faqsRouter = router({
  // Public procedures
  list: publicProcedure.query(async () => {
    return await db.getAllFAQs();
  }),

  // Admin procedures
  listAll: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }
    return await db.getAllFAQsAdmin();
  }),

  create: protectedProcedure
    .input(
      z.object({
        question: z.string(),
        answer: z.string(),
        order: z.number().default(0),
        published: z.boolean().default(true),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      return await db.createFAQ(input);
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        question: z.string().optional(),
        answer: z.string().optional(),
        order: z.number().optional(),
        published: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const { id, ...data } = input;
      await db.updateFAQ(id, data);
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      await db.deleteFAQ(input.id);
      return { success: true };
    }),
});
