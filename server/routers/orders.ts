import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import * as db from "../db";

export const ordersRouter = router({
  // User procedures
  myOrders: protectedProcedure.query(async ({ ctx }) => {
    return await db.getOrdersByUser(ctx.user.id);
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const order = await db.getOrderById(input.id);
      if (!order) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
      }
      
      // Check if user owns this order or is admin
      if (order.userId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
      }
      
      return order;
    }),

  getOrderItems: protectedProcedure
    .input(z.object({ orderId: z.number() }))
    .query(async ({ input, ctx }) => {
      const order = await db.getOrderById(input.orderId);
      if (!order) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
      }
      
      // Check if user owns this order or is admin
      if (order.userId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
      }
      
      return await db.getOrderItems(input.orderId);
    }),

  create: protectedProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            productId: z.number(),
            productName: z.string(),
            amount: z.string(),
            quantity: z.number(),
            price: z.string(),
          })
        ),
        customerName: z.string().optional(),
        customerEmail: z.string().optional(),
        customerPhone: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Calculate total
      const totalAmount = input.items.reduce((sum, item) => {
        return sum + parseFloat(item.price) * item.quantity;
      }, 0);

      // Create order
      const orderResult = await db.createOrder({
        userId: ctx.user.id,
        status: "pending",
        totalAmount: totalAmount.toFixed(2),
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        notes: input.notes,
      });

      const orderId = Number((orderResult as any).insertId);

      // Create order items
      for (const item of input.items) {
        const subtotal = parseFloat(item.price) * item.quantity;
        await db.createOrderItem({
          orderId,
          productId: item.productId,
          productName: item.productName,
          amount: item.amount,
          quantity: item.quantity,
          price: item.price,
          subtotal: subtotal.toFixed(2),
        });
      }

      return { orderId, success: true };
    }),

  // Admin procedures
  listAll: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }
    return await db.getAllOrders();
  }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "processing", "completed", "cancelled"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      await db.updateOrderStatus(input.id, input.status);
      return { success: true };
    }),
});
