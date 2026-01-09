import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import * as db from "../db";
import bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";
import { sdk } from "../_core/sdk";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "../_core/cookies";

const SALT_ROUNDS = 12;

// Validation schemas
const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
});

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export const authRouter = router({
  /**
   * Register a new user with email and password
   */
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input }) => {
      const { email, password, name } = input;

      // Check if user already exists
      const existingUser = await db.getUserByEmail(email);
      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Ya existe un usuario con este email",
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

      // Create user
      const user = await db.createUser({
        email,
        passwordHash,
        name,
        loginMethod: "email",
        lastSignedIn: new Date(),
      });

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    }),

  /**
   * Login with email and password
   */
  login: publicProcedure
    .input(loginSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;

      // Find user by email
      const user = await db.getUserByEmail(email);
      if (!user || !user.passwordHash) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Email o contraseña incorrectos",
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Email o contraseña incorrectos",
        });
      }

      // Update last signed in
      await db.updateUserLastSignedIn(user.id);

      // Create session token (using email as identifier instead of openId)
      const sessionToken = await sdk.signSession(
        {
          openId: `email:${user.email}`, // Use email as identifier
          appId: "local",
          name: user.name || user.email,
        },
        { expiresInMs: ONE_YEAR_MS }
      );

      // Set cookie
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    }),
});
