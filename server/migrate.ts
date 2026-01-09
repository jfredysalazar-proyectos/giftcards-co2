import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";

async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    console.log("[Migration] DATABASE_URL not set, skipping migrations");
    return;
  }

  console.log("[Migration] Starting database migrations...");
  
  try {
    // Create connection
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    const db = drizzle(connection);

    // Run migrations
    await migrate(db, { migrationsFolder: "./drizzle" });

    console.log("[Migration] ✅ Migrations completed successfully");
    
    await connection.end();
  } catch (error) {
    console.error("[Migration] ❌ Migration failed:", error);
    throw error;
  }
}

// Run migrations immediately when this file is imported
runMigrations()
  .then(() => {
    console.log("[Migration] Done");
  })
  .catch((error) => {
    console.error("[Migration] Fatal error:", error);
    process.exit(1);
  });

export { runMigrations };
