import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  categories, 
  products, 
  productAmounts, 
  orders, 
  orderItems, 
  reviews, 
  faqs,
  settings,
  InsertCategory,
  InsertProduct,
  InsertProductAmount,
  InsertOrder,
  InsertOrderItem,
  InsertReview,
  InsertFAQ,
  InsertSetting
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
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
  
  return await db.select().from(products).orderBy(desc(products.createdAt));
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

export async function createOrder(order: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(orders).values(order);
  return result;
}

export async function updateOrderStatus(id: number, status: "pending" | "processing" | "completed" | "cancelled") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(orders).set({ status }).where(eq(orders.id, id));
}

// Order items queries
export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}

export async function createOrderItem(item: InsertOrderItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(orderItems).values(item);
  return result;
}

// Review queries
export async function getProductReviews(productId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(reviews)
    .where(and(eq(reviews.productId, productId), eq(reviews.approved, true)))
    .orderBy(desc(reviews.createdAt));
}

export async function getAllReviews() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(reviews).orderBy(desc(reviews.createdAt));
}

export async function createReview(review: InsertReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(reviews).values(review);
  return result;
}

export async function approveReview(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(reviews).set({ approved: true }).where(eq(reviews.id, id));
}

export async function deleteReview(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(reviews).where(eq(reviews.id, id));
}

// FAQ queries
export async function getAllFAQs() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(faqs).where(eq(faqs.published, true)).orderBy(faqs.order);
}

export async function getAllFAQsAdmin() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(faqs).orderBy(faqs.order);
}

export async function createFAQ(faq: InsertFAQ) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(faqs).values(faq);
  return result;
}

export async function updateFAQ(id: number, faq: Partial<InsertFAQ>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(faqs).set(faq).where(eq(faqs.id, id));
}

export async function deleteFAQ(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(faqs).where(eq(faqs.id, id));
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
