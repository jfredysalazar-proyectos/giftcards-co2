import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../_core/trpc";
import * as db from "../db";
import { TRPCError } from "@trpc/server";

export const blogRouter = router({
  getPosts: publicProcedure.query(async () => {
    try {
      return await db.getAllBlogPosts();
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "No se pudieron cargar los artículos del blog",
      });
    }
  }),

  getPostBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      try {
        const post = await db.getBlogPostBySlug(input.slug);
        if (!post) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Artículo no encontrado",
          });
        }
        return post;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Error fetching blog post by slug:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error al cargar el artículo",
        });
      }
    }),

  getCategories: publicProcedure.query(async () => {
    try {
      return await db.getAllBlogCategories();
    } catch (error) {
      console.error("Error fetching blog categories:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "No se pudieron cargar las categorías",
      });
    }
  }),

  createPost: adminProcedure
    .input(z.any())
    .mutation(async ({ input }) => {
      try {
        return await db.createBlogPost(input);
      } catch (error) {
        console.error("Error creating blog post:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No se pudo crear el artículo",
        });
      }
    }),

  updatePost: adminProcedure
    .input(z.object({ id: z.number(), data: z.any() }))
    .mutation(async ({ input }) => {
      try {
        await db.updateBlogPost(input.id, input.data);
        return { success: true };
      } catch (error) {
        console.error("Error updating blog post:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No se pudo actualizar el artículo",
        });
      }
    }),

  deletePost: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        await db.deleteBlogPost(input.id);
        return { success: true };
      } catch (error) {
        console.error("Error deleting blog post:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No se pudo eliminar el artículo",
        });
      }
    }),
});
// Cache bust: Tue Jan 27 13:50:08 EST 2026
