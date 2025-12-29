import { z } from "zod";
import { publicProcedure, protectedProcedure, router, adminProcedure } from "../_core/trpc";
import * as db from "../db";

export const announcementsRouter = router({
  getActive: publicProcedure.query(async () => {
    return await db.getActiveAnnouncement();
  }),

  getAll: adminProcedure.query(async () => {
    return await db.getAllAnnouncements();
  }),

  create: adminProcedure
    .input(
      z.object({
        text: z.string().min(1),
        isActive: z.boolean().optional(),
        backgroundColor: z.string().optional(),
        textColor: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await db.createAnnouncement(input);
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        text: z.string().min(1).optional(),
        isActive: z.boolean().optional(),
        backgroundColor: z.string().optional(),
        textColor: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateAnnouncement(id, data);
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.deleteAnnouncement(input.id);
    }),
});
