import { publicProcedure, router, adminProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { blogPosts, blogPostCategories, blogCategories } from "../../shared/schema";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";

export const blogRouter = router({
  // Get all published blog posts (public)
  getPosts: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(50);
  }),

  // Get all blog posts including drafts (admin only)
  getAllPosts: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    return await db
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.publishedAt))
      .limit(100);
  }),

  // Get a single blog post by slug (public)
  getPostBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const posts = await db
        .select()
        .from(blogPosts)
        .where(and(eq(blogPosts.slug, input.slug), eq(blogPosts.published, true)))
        .limit(1);

      if (!posts.length) {
        throw new Error("Post not found");
      }

      // Increment views
      await db
        .update(blogPosts)
        .set({ views: posts[0].views + 1 })
        .where(eq(blogPosts.id, posts[0].id));

      return posts[0];
    }),

  // Get related blog posts (public)
  getRelatedPosts: publicProcedure
    .input(z.object({ slug: z.string(), limit: z.number().default(3) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const currentPost = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.slug, input.slug))
        .limit(1);

      if (!currentPost.length) {
        return [];
      }

      // Get categories of the current post
      const postCategories = await db
        .select()
        .from(blogPostCategories)
        .where(eq(blogPostCategories.postId, currentPost[0].id));

      if (!postCategories.length) {
        return [];
      }

      // Get related posts from the same categories
      const relatedPosts = await db
        .select()
        .from(blogPosts)
        .innerJoin(
          blogPostCategories,
          eq(blogPosts.id, blogPostCategories.postId)
        )
        .where(
          and(
            eq(blogPosts.published, true),
            eq(blogPostCategories.categoryId, postCategories[0].categoryId)
          )
        )
        .orderBy(desc(blogPosts.publishedAt))
        .limit(input.limit);

      return relatedPosts
        .map((r) => r.blog_posts)
        .filter((p) => p.id !== currentPost[0].id)
        .slice(0, input.limit);
    }),

  // Get all blog categories (public)
  getCategories: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    return await db
      .select()
      .from(blogCategories)
      .orderBy(blogCategories.name);
  }),

  // Get posts by category (public)
  getPostsByCategory: publicProcedure
    .input(z.object({ categorySlug: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const category = await db
        .select()
        .from(blogCategories)
        .where(eq(blogCategories.slug, input.categorySlug))
        .limit(1);

      if (!category.length) {
        return [];
      }

      const posts = await db
        .select()
        .from(blogPosts)
        .innerJoin(
          blogPostCategories,
          eq(blogPosts.id, blogPostCategories.postId)
        )
        .where(
          and(
            eq(blogPosts.published, true),
            eq(blogPostCategories.categoryId, category[0].id)
          )
        )
        .orderBy(desc(blogPosts.publishedAt));

      return posts.map((p) => p.blog_posts);
    }),

  // Create a new blog post (admin only)
  createPost: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        excerpt: z.string().min(1),
        content: z.string().min(1),
        metaDescription: z.string().optional(),
        metaKeywords: z.string().optional(),
        published: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      // Check if slug already exists
      const existing = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.slug, input.slug))
        .limit(1);

      if (existing.length > 0) {
        throw new Error("El slug ya existe");
      }

      const result = await db.insert(blogPosts).values({
        ...input,
        author: "GiftCards Colombia",
        publishedAt: input.published ? new Date() : null,
      });

      return result;
    }),

  // Update a blog post (admin only)
  updatePost: adminProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        slug: z.string().min(1),
        excerpt: z.string().min(1),
        content: z.string().min(1),
        metaDescription: z.string().optional(),
        metaKeywords: z.string().optional(),
        published: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...data } = input;

      // Check if slug already exists (excluding current post)
      const existing = await db
        .select()
        .from(blogPosts)
        .where(and(eq(blogPosts.slug, data.slug), eq(blogPosts.id, id)))
        .limit(1);

      if (existing.length === 0) {
        // Slug changed, check if new slug exists
        const slugExists = await db
          .select()
          .from(blogPosts)
          .where(eq(blogPosts.slug, data.slug))
          .limit(1);

        if (slugExists.length > 0) {
          throw new Error("El slug ya existe");
        }
      }

      const result = await db
        .update(blogPosts)
        .set({
          ...data,
          publishedAt: data.published ? new Date() : null,
        })
        .where(eq(blogPosts.id, id));

      return result;
    }),

  // Delete a blog post (admin only)
  deletePost: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      // Delete associated categories
      await db
        .delete(blogPostCategories)
        .where(eq(blogPostCategories.postId, input.id));

      // Delete the post
      const result = await db
        .delete(blogPosts)
        .where(eq(blogPosts.id, input.id));

      return result;
    }),

  // Create a blog category (admin only)
  createCategory: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const result = await db.insert(blogCategories).values(input);
      return result;
    }),

  // Delete a blog category (admin only)
  deleteCategory: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      // Delete associated post categories
      await db
        .delete(blogPostCategories)
        .where(eq(blogPostCategories.categoryId, input.id));

      // Delete the category
      const result = await db
        .delete(blogCategories)
        .where(eq(blogCategories.id, input.id));

      return result;
    }),
});
