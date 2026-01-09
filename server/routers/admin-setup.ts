import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc.js";
import bcrypt from "bcrypt";
import { db } from "../db.js";
import { users } from "../../drizzle/schema.js";

export const adminSetupRouter = router({
  createAdmin: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().min(1),
        secretKey: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Simple security check
      if (input.secretKey !== "create-admin-2025") {
        throw new Error("Invalid secret key");
      }

      try {
        // Hash password
        const passwordHash = await bcrypt.hash(input.password, 12);

        // Check if user exists
        const existingUser = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.email, input.email),
        });

        if (existingUser) {
          // Update existing user to admin
          await db
            .update(users)
            .set({
              passwordHash,
              role: "admin",
              lastSignedInAt: new Date(),
            })
            .where((u) => u.email.eq(input.email));

          return {
            success: true,
            message: "User updated to admin successfully",
            email: input.email,
          };
        } else {
          // Create new admin user
          await db.insert(users).values({
            name: input.name,
            email: input.email,
            passwordHash,
            role: "admin",
            createdAt: new Date(),
            lastSignedInAt: new Date(),
          });

          return {
            success: true,
            message: "Admin user created successfully",
            email: input.email,
          };
        }
      } catch (error: any) {
        console.error("Error creating admin:", error);
        throw new Error(`Failed to create admin: ${error.message}`);
      }
    }),
});
