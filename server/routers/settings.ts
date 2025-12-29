import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const settingsRouter = router({
  // Public: Get a specific setting by key
  get: publicProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      return await db.getSetting(input.key);
    }),

  // Public: Get all settings
  getAll: publicProcedure.query(async () => {
    return await db.getAllSettings();
  }),

  // Protected: Update a setting (admin only)
  update: protectedProcedure
    .input(
      z.object({
        key: z.string(),
        value: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await db.updateSetting(input.key, input.value);
      return { success: true };
    }),

  // Protected: Create a new setting (admin only)
  create: protectedProcedure
    .input(
      z.object({
        key: z.string(),
        value: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await db.createSetting(input);
      return { success: true };
    }),
});
