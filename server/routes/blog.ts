import { Router } from 'express';
import { db } from '../db';
import { blogPosts, blogPostCategories, blogCategories } from "../shared/schema";
import { eq, and, desc } from 'drizzle-orm';

const router = Router();

/**
 * GET /api/blog/posts
 * Fetch all published blog posts
 */
router.get('/posts', async (req, res) => {
  try {
    const posts = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(50);

    res.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

/**
 * GET /api/blog/posts/:slug
 * Fetch a single blog post by slug
 */
router.get('/posts/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const post = await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.slug, slug), eq(blogPosts.published, true)))
      .limit(1);

    if (!post.length) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Increment views
    await db
      .update(blogPosts)
      .set({ views: post[0].views + 1 })
      .where(eq(blogPosts.id, post[0].id));

    res.json(post[0]);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

/**
 * GET /api/blog/posts/:slug/related
 * Fetch related blog posts based on categories
 */
router.get('/posts/:slug/related', async (req, res) => {
  try {
    const { slug } = req.params;

    // Get the current post
    const currentPost = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1);

    if (!currentPost.length) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Get categories of the current post
    const postCategories = await db
      .select()
      .from(blogPostCategories)
      .where(eq(blogPostCategories.postId, currentPost[0].id));

    if (!postCategories.length) {
      return res.json([]);
    }

    const categoryIds = postCategories.map((pc) => pc.categoryId);

    // Get related posts from the same categories
    const relatedPosts = await db
      .select({ post: blogPosts })
      .from(blogPosts)
      .innerJoin(
        blogPostCategories,
        eq(blogPosts.id, blogPostCategories.postId)
      )
      .where(
        and(
          eq(blogPosts.published, true),
          // Exclude current post
          // @ts-ignore - Drizzle doesn't have a ne operator
          blogPosts.id !== currentPost[0].id
        )
      )
      .orderBy(desc(blogPosts.publishedAt))
      .limit(3);

    res.json(relatedPosts.map((r) => r.post));
  } catch (error) {
    console.error('Error fetching related posts:', error);
    res.status(500).json({ error: 'Failed to fetch related posts' });
  }
});

/**
 * GET /api/blog/categories
 * Fetch all blog categories
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = await db
      .select()
      .from(blogCategories)
      .orderBy(blogCategories.name);

    res.json(categories);
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    res.status(500).json({ error: 'Failed to fetch blog categories' });
  }
});

export default router;
