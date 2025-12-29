import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import * as db from "../db";

export const productsRouter = router({
  // Public procedures
  list: publicProcedure.query(async () => {
    return await db.getAllProducts();
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const product = await db.getProductBySlug(input.slug);
      if (!product) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
      }
      return product;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const product = await db.getProductById(input.id);
      if (!product) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
      }
      return product;
    }),

  getByCategory: publicProcedure
    .input(z.object({ categoryId: z.number() }))
    .query(async ({ input }) => {
      return await db.getProductsByCategory(input.categoryId);
    }),

  getFeatured: publicProcedure.query(async () => {
    return await db.getFeaturedProducts();
  }),

  getAmounts: publicProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      return await db.getProductAmounts(input.productId);
    }),

  // Admin procedures
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
        fullDescription: z.string().optional(),
        categoryId: z.number(),
        image: z.string().optional(),
        gradient: z.string().optional(),
        inStock: z.boolean().default(true),
        featured: z.boolean().default(false),
        amounts: z.array(z.object({
          amount: z.string(),
          price: z.number()
        })).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const { amounts, ...productData } = input;
      const product = await db.createProduct(productData);
      
      // Create amounts if provided
      if (amounts && amounts.length > 0) {
        for (const amount of amounts) {
          await db.createProductAmount({
            productId: product.id,
            amount: amount.amount,
            price: amount.price.toString()
          });
        }
      }
      
      return product;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
        fullDescription: z.string().optional(),
        categoryId: z.number().optional(),
        image: z.string().optional(),
        gradient: z.string().optional(),
        inStock: z.boolean().optional(),
        featured: z.boolean().optional(),
        amounts: z.array(z.object({
          amount: z.string(),
          price: z.number()
        })).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const { id, amounts, ...data } = input;
      await db.updateProduct(id, data);
      
      // Update amounts if provided
      if (amounts && amounts.length > 0) {
        // Delete existing amounts
        const existingAmounts = await db.getProductAmounts(id);
        for (const existing of existingAmounts) {
          await db.deleteProductAmount(existing.id);
        }
        
        // Create new amounts
        for (const amount of amounts) {
          await db.createProductAmount({
            productId: id,
            amount: amount.amount,
            price: amount.price.toString()
          });
        }
      }
      
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      await db.deleteProduct(input.id);
      return { success: true };
    }),

  // Product amounts management
  createAmount: protectedProcedure
    .input(
      z.object({
        productId: z.number(),
        amount: z.string(),
        price: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      return await db.createProductAmount(input);
    }),

  deleteAmount: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      await db.deleteProductAmount(input.id);
      return { success: true };
    }),

  // Product images management
  getImages: publicProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      return await db.getProductImages(input.productId);
    }),

  createImage: protectedProcedure
    .input(
      z.object({
        productId: z.number(),
        imageUrl: z.string(),
        displayOrder: z.number().default(0),
        isPrimary: z.boolean().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      return await db.createProductImage(input);
    }),

  updateImage: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        imageUrl: z.string().optional(),
        displayOrder: z.number().optional(),
        isPrimary: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const { id, ...data } = input;
      await db.updateProductImage(id, data);
      return { success: true };
    }),

  deleteImage: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      await db.deleteProductImage(input.id);
      return { success: true };
    }),
});
