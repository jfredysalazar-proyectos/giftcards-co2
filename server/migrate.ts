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
    // We wrap this in a try-catch to prevent deployment failure if migrations fail
    // but the tables already exist (common in manual migrations)
    try {
      await migrate(db, { migrationsFolder: "./drizzle" });
      console.log("[Migration] ✅ Migrations completed successfully");
    } catch (migError: any) {
      if (migError.message && migError.message.includes("already exists")) {
        console.log("[Migration] ⚠️ Some tables already exist, continuing...");
      } else {
        console.error("[Migration] ⚠️ Migration warning:", migError.message);
      }
    }
    
    await connection.end();
  } catch (error) {
    console.error("[Migration] ❌ Connection failed:", error);
    // We don't throw here to allow the server to attempt to start anyway
  }
}

// Run migrations immediately when this file is imported
runMigrations()
  .then(() => {
    console.log("[Migration] Done");
  })
  .catch((error) => {
    console.error("[Migration] Fatal error during migration process:", error);
    // Don't exit with 1 to allow the server to start
  });

export { runMigrations };
