import bcrypt from "bcrypt";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { users } from "./drizzle/schema.js";

async function createAdminUser() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  const email = "misegundoingreso2023@gmail.com";
  const password = "75090298Juan";
  const name = "Administrador";

  console.log("[Admin] Creating admin user...");
  console.log(`[Admin] Email: ${email}`);

  try {
    // Create connection
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    const db = drizzle(connection);

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    console.log("[Admin] Password hashed successfully");

    // Insert admin user
    await db.insert(users).values({
      name,
      email,
      passwordHash,
      role: "admin",
      createdAt: new Date(),
      lastSignedInAt: new Date(),
    });

    console.log("[Admin] ✅ Admin user created successfully!");
    console.log(`[Admin] Email: ${email}`);
    console.log(`[Admin] Role: admin`);

    await connection.end();
    process.exit(0);
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      console.log("[Admin] ⚠️  User already exists, updating password...");
      
      try {
        const connection = await mysql.createConnection(process.env.DATABASE_URL);
        const db = drizzle(connection);
        
        const passwordHash = await bcrypt.hash(password, 12);
        
        // Update existing user
        await connection.execute(
          "UPDATE users SET passwordHash = ?, role = 'admin', lastSignedInAt = NOW() WHERE email = ?",
          [passwordHash, email]
        );
        
        console.log("[Admin] ✅ Admin user updated successfully!");
        await connection.end();
        process.exit(0);
      } catch (updateError) {
        console.error("[Admin] ❌ Error updating user:", updateError);
        process.exit(1);
      }
    } else {
      console.error("[Admin] ❌ Error creating admin user:", error);
      process.exit(1);
    }
  }
}

createAdminUser();
