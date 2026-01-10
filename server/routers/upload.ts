import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { uploadImage, deleteImage } from "../_core/cloudinary";

export const uploadRouter = router({
  /**
   * Upload an image to Cloudinary
   * Accepts base64 encoded image data
   */
  uploadImage: protectedProcedure
    .input(
      z.object({
        imageData: z.string(), // Base64 encoded image
        folder: z.string().default("giftcards"),
        filename: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      try {
        // Convert base64 to buffer
        const buffer = Buffer.from(input.imageData, "base64");

        // Upload to Cloudinary
        const result = await uploadImage(buffer, input.folder, input.filename);

        return {
          success: true,
          url: result.url,
          publicId: result.publicId,
          format: result.format,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
        };
      } catch (error: any) {
        console.error("Error uploading image to Cloudinary:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to upload image: ${error.message}`,
        });
      }
    }),

  /**
   * Delete an image from Cloudinary
   */
  deleteImage: protectedProcedure
    .input(
      z.object({
        publicId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      try {
        await deleteImage(input.publicId);
        return { success: true };
      } catch (error: any) {
        console.error("Error deleting image from Cloudinary:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete image: ${error.message}`,
        });
      }
    }),
});
