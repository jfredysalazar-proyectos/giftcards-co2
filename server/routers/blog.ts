import { publicProcedure, router } from "../_core/trpc";
import { db } from "../db";
import { blogPosts, blogPostCategories, blogCategories } from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";

export const blogRouter = router({
  // Get all published blog posts
  getPosts: publicProcedure.query(async () => {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(50);
  }),

  // Get a single blog post by slug
  getPostBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
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

  // Get related blog posts
  getRelatedPosts: publicProcedure
    .input(z.object({ slug: z.string(), limit: z.number().default(3) }))
    .query(async ({ input }) => {
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
            // Exclude current post using a different approach
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

  // Get all blog categories
  getCategories: publicProcedure.query(async () => {
    return await db
      .select()
      .from(blogCategories)
      .orderBy(blogCategories.name);
  }),

  // Get posts by category
  getPostsByCategory: publicProcedure
    .input(z.object({ categorySlug: z.string() }))
    .query(async ({ input }) => {
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
});
