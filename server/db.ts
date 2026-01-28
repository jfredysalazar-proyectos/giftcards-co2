import { eq, desc, asc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../drizzle/schema.js";
import { 
  InsertUser, 
  users, 
  categories, 
  products, 
  productAmounts, 
  productImages,
  orders, 
  orderItems, 
  reviews, 
  faqs,
  settings,
  announcements,
  InsertCategory,
  InsertProduct,
  InsertProductAmount,
  InsertProductImage,
  InsertOrder,
  InsertOrderItem,
  InsertReview,
  InsertFAQ,
  InsertSetting,
  InsertAnnouncement
} from "../drizzle/schema.js";
import { ENV } from './_core/env.js';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL, { schema, mode: "default" });
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createUser(user: InsertUser) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(users).values(user);
  const insertId = Number(result[0].insertId);
  
  // Fetch and return the created user
  const createdUser = await db.select().from(users).where(eq(users.id, insertId)).limit(1);
  return createdUser[0];
}

export async function updateUserLastSignedIn(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update user: database not available");
    return;
  }

  await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, userId));
}

// Category queries
export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(categories).orderBy(categories.name);
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCategory(category: InsertCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(categories).values(category);
  return result;
}

export async function updateCategory(id: number, category: Partial<InsertCategory>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(categories).set(category).where(eq(categories.id, id));
}

export async function deleteCategory(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(categories).where(eq(categories.id, id));
}

// Product queries
export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(products).orderBy(asc(products.displayOrder), desc(products.createdAt));
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProductsByCategory(categoryId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(products).where(eq(products.categoryId, categoryId));
}

export async function getFeaturedProducts() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(products).where(eq(products.featured, true));
}

export async function createProduct(product: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(products).values(product);
  const insertId = (result as any).insertId || (result as any)[0]?.insertId;
  
  if (!insertId) {
    throw new Error("Failed to get product ID after insert");
  }
  
  // Return the created product
  const [createdProduct] = await db.select().from(products).where(eq(products.id, insertId));
  return createdProduct;
}

export async function updateProduct(id: number, product: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(products).set(product).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(products).where(eq(products.id, id));
}

// Product amounts queries
export async function getProductAmounts(productId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(productAmounts).where(eq(productAmounts.productId, productId));
}

export async function createProductAmount(amount: InsertProductAmount) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(productAmounts).values(amount);
  return result;
}

export async function deleteProductAmount(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(productAmounts).where(eq(productAmounts.id, id));
}

// Product images queries
export async function getProductImages(productId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(productImages)
    .where(eq(productImages.productId, productId))
    .orderBy(productImages.displayOrder);
}

export async function createProductImage(image: InsertProductImage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(productImages).values(image);
  return result;
}

export async function updateProductImage(id: number, image: Partial<InsertProductImage>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(productImages).set(image).where(eq(productImages.id, id));
}

export async function deleteProductImage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(productImages).where(eq(productImages.id, id));
}

export async function deleteProductImagesByProductId(productId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(productImages).where(eq(productImages.productId, productId));
}

// Order queries
export async function getAllOrders() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOrdersByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
}

// Settings queries
export async function getSetting(key: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllSettings() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(settings);
}

export async function updateSetting(key: string, value: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(settings).set({ value }).where(eq(settings.key, key));
}

export async function createSetting(setting: InsertSetting) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(settings).values(setting);
  return result;
}

// Announcements queries
export async function getActiveAnnouncement() {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(announcements)
    .where(eq(announcements.isActive, true))
    .orderBy(desc(announcements.createdAt))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllAnnouncements() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(announcements).orderBy(desc(announcements.createdAt));
}

export async function createAnnouncement(announcement: InsertAnnouncement) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(announcements).values(announcement);
  return result;
}

export async function updateAnnouncement(id: number, announcement: Partial<InsertAnnouncement>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(announcements).set(announcement).where(eq(announcements.id, id));
}

export async function deleteAnnouncement(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(announcements).where(eq(announcements.id, id));
}

// Blog queries
import { blogPosts, blogCategories, blogPostCategories, InsertBlogPost, InsertBlogCategory } from "../drizzle/schema.js";

export async function getAllBlogPosts() {
  const db = await getDb();
  if (!db) return [];
  // Return all published posts ordered by publication date (most recent first)
  return await db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.publishedAt));
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createBlogPost(post: InsertBlogPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const postData: any = { ...post };
  
  // Si el usuario no proporcionó una fecha pero marcó como publicado, usar ahora
  if (post.published && !post.publishedAt) {
    postData.publishedAt = new Date();
  }
  
  const result = await db.insert(blogPosts).values(postData);
  return result;
}

export async function updateBlogPost(id: number, post: Partial<InsertBlogPost>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: any = { ...post };
  
  // Si se marca como publicado y no hay fecha previa ni nueva, usar ahora
  if (post.published === true && !post.publishedAt) {
    // Solo asignar nueva fecha si no existía una previamente
    const [existing] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    if (!existing.publishedAt) {
      updateData.publishedAt = new Date();
    }
  } else if (post.published === false) {
    updateData.publishedAt = null;
  }
  
  await db.update(blogPosts).set(updateData).where(eq(blogPosts.id, id));
}

export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

export async function getAllBlogCategories() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(blogCategories).orderBy(blogCategories.name);
}

export async function incrementBlogPostViews(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(blogPosts).set({ views: sql`views + 1` }).where(eq(blogPosts.id, id));
}

export async function getRandomBlogPosts(limit: number = 4, excludeId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  let conditions = eq(blogPosts.published, true);
  
  if (excludeId) {
    conditions = and(conditions, sql`id != ${excludeId}`);
  }
  
  return await db.select().from(blogPosts).where(conditions).orderBy(sql`RAND()`).limit(limit);
}
