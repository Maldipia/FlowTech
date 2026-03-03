import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  addOrderItem,
  createAuditLog,
  createDiningTable,
  createMenuCategory,
  createMenuItem,
  createModifierGroup,
  createModifierOption,
  createOrder,
  createPayment,
  createProfile,
  createTenant,
  createZReport,
  deleteMenuCategory,
  deleteMenuItem,
  getDailySalesSummary,
  getDiningTables,
  getMenuCategories,
  getMenuItems,
  getMenuWithModifiers,
  getModifierGroupsByItem,
  getOrderById,
  getOrderWithItems,
  getActiveOrders,
  getAuditLogs,
  getPaymentsByDateRange,
  getPaymentsByOrder,
  getProfileByUserAndTenant,
  getProfilesByTenant,
  getProfilesByUser,
  getRecentOrders,
  getTopSellingItems,
  getTenantById,
  getTenantBySubdomain,
  getAllTenants,
  getZReports,
  getZReportByDate,
  incrementReceiptSequence,
  recalculateOrderTotals,
  updateDiningTable,
  updateDiningTableStatus,
  updateMenuCategory,
  updateMenuItem,
  updateOrder,
  updateOrderItem,
  updatePayment,
  updateProfile,
  updateTenant,
  voidOrderItem,
} from "./db";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
async function requireTenantAccess(userId: number, tenantId: number) {
  const profile = await getProfileByUserAndTenant(userId, tenantId);
  if (!profile || !profile.isActive) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Access denied to this tenant." });
  }
  return profile;
}

async function requireRole(
  userId: number,
  tenantId: number,
  roles: Array<"admin" | "manager" | "cashier">
) {
  const profile = await requireTenantAccess(userId, tenantId);
  if (!roles.includes(profile.role)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `Role '${profile.role}' is not authorized for this action.`,
    });
  }
  return profile;
}

function generateBirReceiptNo(tenantId: number, sequence: number): string {
  const paddedSeq = String(sequence).padStart(8, "0");
  return `FT-${tenantId}-${paddedSeq}`;
}

// ─────────────────────────────────────────────
// TENANT ROUTER
// ─────────────────────────────────────────────
const tenantRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(255),
        subdomain: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
        businessType: z.enum(["RESTAURANT", "CAFE", "BAR", "FOOD_TRUCK", "BAKERY", "FASTFOOD", "OTHER"]).optional(),
        contactEmail: z.string().email().optional(),
        contactPhone: z.string().optional(),
        addressStreet: z.string().optional(),
        addressCity: z.string().optional(),
        addressProvince: z.string().optional(),
        birTin: z.string().optional(),
        birRegisteredName: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await getTenantBySubdomain(input.subdomain);
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "Subdomain already taken." });
      }
      await createTenant({
        ...input,
        businessType: input.businessType ?? "RESTAURANT",
      });
      const tenant = await getTenantBySubdomain(input.subdomain);
      if (!tenant) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      // Create admin profile for the creator
      await createProfile({
        userId: ctx.user.id,
        tenantId: tenant.id,
        role: "admin",
      });
      await createAuditLog({
        tenantId: tenant.id,
        userId: ctx.user.id,
        action: "tenant.created",
        entity: "tenant",
        entityId: tenant.id,
        meta: { name: tenant.name },
      });
      return tenant;
    }),

  get: protectedProcedure
    .input(z.object({ tenantId: z.number() }))
    .query(async ({ ctx, input }) => {
      await requireTenantAccess(ctx.user.id, input.tenantId);
      return getTenantById(input.tenantId);
    }),

  update: protectedProcedure
    .input(
      z.object({
        tenantId: z.number(),
        name: z.string().optional(),
        businessType: z.enum(["RESTAURANT", "CAFE", "BAR", "FOOD_TRUCK", "BAKERY", "FASTFOOD", "OTHER"]).optional(),
        contactEmail: z.string().email().optional(),
        contactPhone: z.string().optional(),
        addressStreet: z.string().optional(),
        addressCity: z.string().optional(),
        addressProvince: z.string().optional(),
        birTin: z.string().optional(),
        birRegisteredName: z.string().optional(),
        birAddress: z.string().optional(),
        birPermitNo: z.string().optional(),
        birAccreditationNo: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await requireRole(ctx.user.id, input.tenantId, ["admin"]);
      const { tenantId, ...data } = input;
      await updateTenant(tenantId, data);
      await createAuditLog({
        tenantId,
        userId: ctx.user.id,
        action: "tenant.updated",
        entity: "tenant",
        entityId: tenantId,
        meta: data,
      });
      return getTenantById(tenantId);
    }),

  myTenants: protectedProcedure.query(async ({ ctx }) => {
    return getProfilesByUser(ctx.user.id);
  }),

  allTenants: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    return getAllTenants();
  }),
});

// ─────────────────────────────────────────────
// MENU ROUTER
// ─────────────────────────────────────────────
const menuRouter = router({
  getFullMenu: protectedProcedure
    .input(z.object({ tenantId: z.number() }))
    .query(async ({ ctx, input }) => {
      await requireTenantAccess(ctx.user.id, input.tenantId);
      return getMenuWithModifiers(input.tenantId);
    }),

  getCategories: protectedProcedure
    .input(z.object({ tenantId: z.number() }))
    .query(async ({ ctx, input }) => {
      await requireTenantAccess(ctx.user.id, input.tenantId);
      return getMenuCategories(input.tenantId);
    }),

  createCategory: protectedProcedure
    .input(
      z.object({
        tenantId: z.number(),
        name: z.string().min(1).max(100),
        description: z.string().optional(),
        sortOrder: z.number().default(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await requireRole(ctx.user.id, input.tenantId, ["admin", "manager"]);
      await createMenuCategory(input);
      await createAuditLog({
        tenantId: input.tenantId,
        userId: ctx.user.id,
        action: "menu_category.created",
        entity: "menu_category",
        meta: { name: input.name },
      });
    }),

  updateCategory: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        tenantId: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        sortOrder: z.number().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await requireRole(ctx.user.id, input.tenantId, ["admin", "manager"]);
      const { id, tenantId, ...data } = input;
      await updateMenuCategory(id, tenantId, data);
    }),

  deleteCategory: protectedProcedure
    .input(z.object({ id: z.number(), tenantId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await requireRole(ctx.user.id, input.tenantId, ["admin", "manager"]);
      await deleteMenuCategory(input.id, input.tenantId);
    }),

  getItems: protectedProcedure
    .input(z.object({ tenantId: z.number(), categoryId: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      await requireTenantAccess(ctx.user.id, input.tenantId);
      return getMenuItems(input.tenantId, input.categoryId);
    }),

  createItem: protectedProcedure
    .input(
      z.object({
        tenantId: z.number(),
        categoryId: z.number(),
        name: z.string().min(1).max(200),
        description: z.string().optional(),
        price: z.string(),
        imageUrl: z.string().optional(),
        isTaxable: z.boolean().default(true),
        sortOrder: z.number().default(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await requireRole(ctx.user.id, input.tenantId, ["admin", "manager"]);
      await createMenuItem(input);
      await createAuditLog({
        tenantId: input.tenantId,
        userId: ctx.user.id,
        action: "menu_item.created",
        entity: "menu_item",
        meta: { name: input.name, price: input.price },
      });
    }),

  updateItem: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        tenantId: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.string().optional(),
        imageUrl: z.string().optional(),
        isAvailable: z.boolean().optional(),
        isTaxable: z.boolean().optional(),
        sortOrder: z.number().optional(),
        categoryId: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await requireRole(ctx.user.id, input.tenantId, ["admin", "manager"]);
      const { id, tenantId, ...data } = input;
      await updateMenuItem(id, tenantId, data);
    }),

  deleteItem: protectedProcedure
    .input(z.object({ id: z.number(), tenantId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await requireRole(ctx.user.id, input.tenantId, ["admin", "manager"]);
      await deleteMenuItem(input.id, input.tenantId);
    }),

  createModifierGroup: protectedProcedure
    .input(
      z.object({
        tenantId: z.number(),
        menuItemId: z.number(),
        name: z.string().min(1).max(100),
        isRequired: z.boolean().default(false),
        allowMultiple: z.boolean().default(false),
        sortOrder: z.number().default(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await requireRole(ctx.user.id, input.tenantId, ["admin", "manager"]);
      await createModifierGroup(input);
    }),

  createModifierOption: protectedProcedure
    .input(
      z.object({
        tenantId: z.number(),
        groupId: z.number(),
        name: z.string().min(1).max(100),
        priceDelta: z.string().default("0.00"),
        isDefault: z.boolean().default(false),
        sortOrder: z.number().default(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await requireRole(ctx.user.id, input.tenantId, ["admin", "manager"]);
      await createModifierOption(input);
    }),

  getModifiers: protectedProcedure
    .input(z.object({ menuItemId: z.number(), tenantId: z.number() }))
    .query(async ({ ctx, input }) => {
      await requireTenantAccess(ctx.user.id, input.tenantId);
      return getModifierGroupsByItem(input.menuItemId, input.tenantId);
    }),
});

// ─────────────────────────────────────────────
// TABLES ROUTER
// ─────────────────────────────────────────────
const tablesRouter = router({
  list: protectedProcedure
    .input(z.object({ tenantId: z.number() }))
    .query(async ({ ctx, input }) => {
      await requireTenantAccess(ctx.user.id, input.tenantId);
      return getDiningTables(input.tenantId);
    }),

  create: protectedProcedure
    .input(
      z.object({
        tenantId: z.number(),
        name: z.string().min(1).max(50),
        capacity: z.number().default(4),
        section: z.string().optional(),
        sortOrder: z.number().default(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await requireRole(ctx.user.id, input.tenantId, ["admin", "manager"]);
      await createDiningTable(input);
      await createAuditLog({
        tenantId: input.tenantId,
        userId: ctx.user.id,
        action: "table.created",
        entity: "dining_table",
        meta: { name: input.name },
      });
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        tenantId: z.number(),
        status: z.enum(["available", "occupied", "reserved", "cleaning"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await requireTenantAccess(ctx.user.id, input.tenantId);
      await updateDiningTableStatus(input.id, input.tenantId, input.status);
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        tenantId: z.number(),
        name: z.string().optional(),
        capacity: z.number().optional(),
        section: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await requireRole(ctx.user.id, input.tenantId, ["admin", "manager"]);
      const { id, tenantId, ...data } = input;
      await updateDiningTable(id, tenantId, data);
    }),
});

// ─────────────────────────────────────────────
// ORDERS ROUTER
// ─────────────────────────────────────────────
const ordersRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        tenantId: z.number(),
        tableId: z.number().optional(),
        orderType: z.enum(["dine_in", "takeout", "delivery"]).default("dine_in"),
        customerName: z.string().optional(),
        customerCount: z.number().default(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await requireTenantAccess(ctx.user.id, input.tenantId);
      const order = await createOrder({
        ...input,
        cashierId: ctx.user.id,
        status: "open",
      });
      if (input.tableId) {
        await updateDiningTableStatus(input.tableId, input.tenantId, "occupied");
      }
      await createAuditLog({
        tenantId: input.tenantId,
        userId: ctx.user.id,
        action: "order.created",
        entity: "order",
        entityId: order?.id,
        meta: { orderType: input.orderType, tableId: input.tableId },
      });
      return order;
    }),

  getActive: protectedProcedure
    .input(z.object({ tenantId: z.number() }))
    .query(async ({ ctx, input }) => {
      await requireTenantAccess(ctx.user.id, input.tenantId);
      return getActiveOrders(input.tenantId);
    }),

  getWithItems: protectedProcedure
    .input(z.object({ orderId: z.number(), tenantId: z.number() }))
    .query(async ({ ctx, input }) => {
      await requireTenantAccess(ctx.user.id, input.tenantId);
      return getOrderWithItems(input.orderId, input.tenantId);
    }),

  addItem: protectedProcedure
    .input(
      z.object({
        tenantId: z.number(),
        orderId: z.number(),
        menuItemId: z.number().optional(),
        name: z.string(),
        unitPrice: z.string(),
        quantity: z.number().min(1),
        modifiers: z.array(z.object({
          groupName: z.string(),
          optionName: z.string(),
          priceDelta: z.string(),
        })).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await requireTenantAccess(ctx.user.id, input.tenantId);
      const modifierTotal = (input.modifiers ?? []).reduce(
        (sum, m) => sum + parseFloat(m.priceDelta),
        0
      );
      const unitPrice = parseFloat(input.unitPrice) + modifierTotal;
      const totalPrice = unitPrice * input.quantity;
      const item = await addOrderItem({
        tenantId: input.tenantId,
        orderId: input.orderId,
        menuItemId: input.menuItemId,
        name: input.name,
        unitPrice: unitPrice.toFixed(2),
        quantity: input.quantity,
        totalPrice: totalPrice.toFixed(2),
        modifiers: input.modifiers ?? null,
        notes: input.notes,
        status: "pending",
      });
      await recalculateOrderTotals(input.orderId, input.tenantId);
      return item;
    }),

  updateItemQty: protectedProcedure
    .input(
      z.object({
        itemId: z.number(),
        tenantId: z.number(),
        orderId: z.number(),
        quantity: z.number().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await requireTenantAccess(ctx.user.id, input.tenantId);
      const items = await getOrderWithItems(input.orderId, input.tenantId);
      const item = items?.items.find((i) => i.id === input.itemId);
      if (!item) throw new TRPCError({ code: "NOT_FOUND" });
      const newTotal = (parseFloat(String(item.unitPrice)) * input.quantity).toFixed(2);
      await updateOrderItem(input.itemId, input.tenantId, {
        quantity: input.quantity,
        totalPrice: newTotal,
      });
      await recalculateOrderTotals(input.orderId, input.tenantId);
    }),

  removeItem: protectedProcedure
    .input(z.object({ itemId: z.number(), tenantId: z.number(), orderId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await requireTenantAccess(ctx.user.id, input.tenantId);
      await voidOrderItem(input.itemId, input.tenantId);
      await recalculateOrderTotals(input.orderId, input.tenantId);
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        tenantId: z.number(),
        status: z.enum(["open", "in_progress", "ready", "completed", "voided", "refunded"]),
        voidReason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await requireTenantAccess(ctx.user.id, input.tenantId);
      const updateData: Record<string, unknown> = { status: input.status };
      if (input.status === "voided") {
        await requireRole(ctx.user.id, input.tenantId, ["admin", "manager"]);
        if (!input.voidReason) throw new TRPCError({ code: "BAD_REQUEST", message: "Void reason required." });
        updateData.voidReason = input.voidReason;
        updateData.voidedAt = new Date();
        updateData.voidedBy = ctx.user.id;
      }
      if (input.status === "completed") {
        updateData.completedAt = new Date();
      }
      await updateOrder(input.orderId, input.tenantId, updateData as any);
      await createAuditLog({
        tenantId: input.tenantId,
        userId: ctx.user.id,
        action: `order.${input.status}`,
        entity: "order",
        entityId: input.orderId,
        meta: { voidReason: input.voidReason },
      });
    }),

  applyDiscount: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        tenantId: z.number(),
        discountAmount: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await requireRole(ctx.user.id, input.tenantId, ["admin", "manager"]);
      const order = await getOrderById(input.orderId, input.tenantId);
      if (!order) throw new TRPCError({ code: "NOT_FOUND" });
      const subtotal = parseFloat(String(order.subtotal));
      const tax = parseFloat(String(order.taxAmount));
      const discount = parseFloat(input.discountAmount);
      const total = Math.max(0, subtotal + tax - discount).toFixed(2);
      await updateOrder(input.orderId, input.tenantId, {
        discountAmount: input.discountAmount,
        totalAmount: total,
      });
    }),

  getRecent: protectedProcedure
    .input(z.object({ tenantId: z.number(), limit: z.number().default(20) }))
    .query(async ({ ctx, input }) => {
      await requireTenantAccess(ctx.user.id, input.tenantId);
      return getRecentOrders(input.tenantId);
    }),
});

// ─────────────────────────────────────────────
// PAYMENTS ROUTER
// ─────────────────────────────────────────────
const paymentsRouter = router({
  process: protectedProcedure
    .input(
      z.object({
        tenantId: z.number(),
        orderId: z.number(),
        method: z.enum(["cash", "card", "gcash", "maya", "bank_transfer", "other"]),
        amount: z.string(),
        amountTendered: z.string().optional(),
        stripePaymentIntentId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await requireTenantAccess(ctx.user.id, input.tenantId);
      const order = await getOrderById(input.orderId, input.tenantId);
      if (!order) throw new TRPCError({ code: "NOT_FOUND", message: "Order not found." });
      if (order.status === "voided") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot process payment for a voided order." });
      }

      // Generate BIR receipt number
      const sequence = await incrementReceiptSequence(input.tenantId);
      const birReceiptNo = generateBirReceiptNo(input.tenantId, sequence);

      const amountTendered = input.amountTendered ? parseFloat(input.amountTendered) : null;
      const changeAmount =
        amountTendered !== null
          ? Math.max(0, amountTendered - parseFloat(input.amount)).toFixed(2)
          : null;

      const payment = await createPayment({
        tenantId: input.tenantId,
        orderId: input.orderId,
        cashierId: ctx.user.id,
        method: input.method,
        amount: input.amount,
        amountTendered: input.amountTendered,
        changeAmount: changeAmount ?? undefined,
        status: "completed",
        stripePaymentIntentId: input.stripePaymentIntentId,
        birReceiptNo,
        birIssuedAt: new Date(),
      });

      // Mark order as completed
      await updateOrder(input.orderId, input.tenantId, {
        status: "completed",
        completedAt: new Date(),
      });

      // Free up the table if dine-in
      if (order.tableId) {
        await updateDiningTableStatus(order.tableId, input.tenantId, "available");
      }

      await createAuditLog({
        tenantId: input.tenantId,
        userId: ctx.user.id,
        action: "payment.processed",
        entity: "payment",
        entityId: payment?.id,
        meta: {
          method: input.method,
          amount: input.amount,
          birReceiptNo,
          orderId: input.orderId,
        },
      });

      return { payment, birReceiptNo, changeAmount };
    }),

  getByOrder: protectedProcedure
    .input(z.object({ orderId: z.number(), tenantId: z.number() }))
    .query(async ({ ctx, input }) => {
      await requireTenantAccess(ctx.user.id, input.tenantId);
      return getPaymentsByOrder(input.orderId, input.tenantId);
    }),

  refund: protectedProcedure
    .input(
      z.object({
        paymentId: z.number(),
        tenantId: z.number(),
        reason: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await requireRole(ctx.user.id, input.tenantId, ["admin", "manager"]);
      await updatePayment(input.paymentId, input.tenantId, {
        status: "refunded",
        refundReason: input.reason,
        refundedAt: new Date(),
      });
      await createAuditLog({
        tenantId: input.tenantId,
        userId: ctx.user.id,
        action: "payment.refunded",
        entity: "payment",
        entityId: input.paymentId,
        meta: { reason: input.reason },
      });
    }),
});

// ─────────────────────────────────────────────
// REPORTS ROUTER
// ─────────────────────────────────────────────
const reportsRouter = router({
  dailySummary: protectedProcedure
    .input(z.object({ tenantId: z.number(), date: z.string() }))
    .query(async ({ ctx, input }) => {
      await requireRole(ctx.user.id, input.tenantId, ["admin", "manager"]);
      const date = new Date(input.date);
      return getDailySalesSummary(input.tenantId, date);
    }),

  topItems: protectedProcedure
    .input(
      z.object({
        tenantId: z.number(),
        from: z.string(),
        to: z.string(),
        limit: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      await requireRole(ctx.user.id, input.tenantId, ["admin", "manager"]);
      return getTopSellingItems(input.tenantId, new Date(input.from), new Date(input.to), input.limit);
    }),

  generateZReport: protectedProcedure
    .input(z.object({ tenantId: z.number(), date: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await requireRole(ctx.user.id, input.tenantId, ["admin", "manager"]);
      const date = new Date(input.date);
      const existing = await getZReportByDate(input.tenantId, date);
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "Z-Report already generated for this date." });
      }

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const dayPayments = await getPaymentsByDateRange(input.tenantId, startOfDay, endOfDay);
      const summary = await getDailySalesSummary(input.tenantId, date);

      const totalSales = dayPayments.reduce((s, p) => s + parseFloat(String(p.amount)), 0);
      const cashSales = dayPayments
        .filter((p) => p.method === "cash")
        .reduce((s, p) => s + parseFloat(String(p.amount)), 0);
      const cardSales = dayPayments
        .filter((p) => p.method === "card")
        .reduce((s, p) => s + parseFloat(String(p.amount)), 0);
      const otherSales = totalSales - cashSales - cardSales;
      const totalVat = totalSales - totalSales / 1.12;

      const tenant = await getTenantById(input.tenantId);
      const existingReports = await getZReports(input.tenantId, 1);
      const reportNo = `Z-${input.tenantId}-${String((existingReports.length ?? 0) + 1).padStart(5, "0")}`;

      await createZReport({
        tenantId: input.tenantId,
        generatedBy: ctx.user.id,
        reportDate: date,
        reportNo,
        totalTransactions: summary?.totalTransactions ?? 0,
        totalSales: totalSales.toFixed(2),
        totalVat: totalVat.toFixed(2),
        totalDiscount: "0.00",
        totalVoids: "0.00",
        totalRefunds: "0.00",
        cashSales: cashSales.toFixed(2),
        cardSales: cardSales.toFixed(2),
        otherSales: otherSales.toFixed(2),
        openingBalance: "0.00",
        closingBalance: cashSales.toFixed(2),
        reportData: { payments: dayPayments, tenant, summary },
      });

      await createAuditLog({
        tenantId: input.tenantId,
        userId: ctx.user.id,
        action: "z_report.generated",
        entity: "z_report",
        meta: { reportNo, date: input.date },
      });

      return { reportNo, totalSales, totalVat, cashSales, cardSales, otherSales };
    }),

  getZReports: protectedProcedure
    .input(z.object({ tenantId: z.number(), limit: z.number().default(30) }))
    .query(async ({ ctx, input }) => {
      await requireRole(ctx.user.id, input.tenantId, ["admin", "manager"]);
      return getZReports(input.tenantId, input.limit);
    }),

  auditLog: protectedProcedure
    .input(z.object({ tenantId: z.number(), limit: z.number().default(100), offset: z.number().default(0) }))
    .query(async ({ ctx, input }) => {
      await requireRole(ctx.user.id, input.tenantId, ["admin"]);
      return getAuditLogs(input.tenantId, input.limit, input.offset);
    }),
});

// ─────────────────────────────────────────────
// STAFF ROUTER
// ─────────────────────────────────────────────
const staffRouter = router({
  list: protectedProcedure
    .input(z.object({ tenantId: z.number() }))
    .query(async ({ ctx, input }) => {
      await requireRole(ctx.user.id, input.tenantId, ["admin", "manager"]);
      return getProfilesByTenant(input.tenantId);
    }),

  updateRole: protectedProcedure
    .input(
      z.object({
        profileId: z.number(),
        tenantId: z.number(),
        role: z.enum(["admin", "manager", "cashier"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await requireRole(ctx.user.id, input.tenantId, ["admin"]);
      await updateProfile(input.profileId, { role: input.role });
      await createAuditLog({
        tenantId: input.tenantId,
        userId: ctx.user.id,
        action: "staff.role_updated",
        entity: "profile",
        entityId: input.profileId,
        meta: { newRole: input.role },
      });
    }),

  deactivate: protectedProcedure
    .input(z.object({ profileId: z.number(), tenantId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await requireRole(ctx.user.id, input.tenantId, ["admin"]);
      await updateProfile(input.profileId, { isActive: false });
    }),
});

// ─────────────────────────────────────────────
// APP ROUTER
// ─────────────────────────────────────────────
export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  tenant: tenantRouter,
  menu: menuRouter,
  tables: tablesRouter,
  orders: ordersRouter,
  payments: paymentsRouter,
  reports: reportsRouter,
  staff: staffRouter,
});

export type AppRouter = typeof appRouter;
