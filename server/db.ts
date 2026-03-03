import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  auditLogs,
  diningTables,
  InsertAuditLog,
  InsertDiningTable,
  InsertMenuCategory,
  InsertMenuItem,
  InsertOrder,
  InsertOrderItem,
  InsertPayment,
  InsertProfile,
  InsertTenant,
  InsertUser,
  menuCategories,
  menuItems,
  modifierGroups,
  modifierOptions,
  orderItems,
  orders,
  payments,
  profiles,
  tenants,
  users,
  zReports,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};

  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    const value = user[field];
    if (value === undefined) continue;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  }

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }

  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}

// ─────────────────────────────────────────────
// TENANTS
// ─────────────────────────────────────────────
export async function createTenant(data: InsertTenant) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(tenants).values(data);
  return result[0];
}

export async function getTenantById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(tenants).where(eq(tenants.id, id)).limit(1);
  return result[0];
}

export async function getTenantBySubdomain(subdomain: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(tenants).where(eq(tenants.subdomain, subdomain)).limit(1);
  return result[0];
}

export async function updateTenant(id: number, data: Partial<InsertTenant>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(tenants).set(data).where(eq(tenants.id, id));
}

export async function getAllTenants() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tenants).orderBy(desc(tenants.createdAt));
}

export async function incrementReceiptSequence(tenantId: number): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(tenants)
    .set({ receiptSequence: sql`${tenants.receiptSequence} + 1` })
    .where(eq(tenants.id, tenantId));
  const result = await db
    .select({ seq: tenants.receiptSequence })
    .from(tenants)
    .where(eq(tenants.id, tenantId))
    .limit(1);
  return result[0]?.seq ?? 0;
}

// ─────────────────────────────────────────────
// PROFILES
// ─────────────────────────────────────────────
export async function createProfile(data: InsertProfile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(profiles).values(data);
}

export async function getProfileByUserAndTenant(userId: number, tenantId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(profiles)
    .where(and(eq(profiles.userId, userId), eq(profiles.tenantId, tenantId)))
    .limit(1);
  return result[0];
}

export async function getProfilesByTenant(tenantId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      profile: profiles,
      user: users,
    })
    .from(profiles)
    .innerJoin(users, eq(profiles.userId, users.id))
    .where(eq(profiles.tenantId, tenantId))
    .orderBy(profiles.role);
}

export async function getProfilesByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({ profile: profiles, tenant: tenants })
    .from(profiles)
    .innerJoin(tenants, eq(profiles.tenantId, tenants.id))
    .where(and(eq(profiles.userId, userId), eq(profiles.isActive, true)));
}

export async function updateProfile(id: number, data: Partial<InsertProfile>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(profiles).set(data).where(eq(profiles.id, id));
}

// ─────────────────────────────────────────────
// MENU CATEGORIES
// ─────────────────────────────────────────────
export async function getMenuCategories(tenantId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(menuCategories)
    .where(and(eq(menuCategories.tenantId, tenantId), eq(menuCategories.isActive, true)))
    .orderBy(menuCategories.sortOrder, menuCategories.name);
}

export async function createMenuCategory(data: InsertMenuCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(menuCategories).values(data);
  return result[0];
}

export async function updateMenuCategory(id: number, tenantId: number, data: Partial<InsertMenuCategory>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(menuCategories)
    .set(data)
    .where(and(eq(menuCategories.id, id), eq(menuCategories.tenantId, tenantId)));
}

export async function deleteMenuCategory(id: number, tenantId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(menuCategories)
    .set({ isActive: false })
    .where(and(eq(menuCategories.id, id), eq(menuCategories.tenantId, tenantId)));
}

// ─────────────────────────────────────────────
// MENU ITEMS
// ─────────────────────────────────────────────
export async function getMenuItems(tenantId: number, categoryId?: number) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(menuItems.tenantId, tenantId)];
  if (categoryId) conditions.push(eq(menuItems.categoryId, categoryId));
  return db
    .select()
    .from(menuItems)
    .where(and(...conditions))
    .orderBy(menuItems.sortOrder, menuItems.name);
}

export async function getMenuItemById(id: number, tenantId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(menuItems)
    .where(and(eq(menuItems.id, id), eq(menuItems.tenantId, tenantId)))
    .limit(1);
  return result[0];
}

export async function createMenuItem(data: InsertMenuItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(menuItems).values(data);
  return result[0];
}

export async function updateMenuItem(id: number, tenantId: number, data: Partial<InsertMenuItem>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(menuItems)
    .set(data)
    .where(and(eq(menuItems.id, id), eq(menuItems.tenantId, tenantId)));
}

export async function deleteMenuItem(id: number, tenantId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(menuItems)
    .set({ isAvailable: false })
    .where(and(eq(menuItems.id, id), eq(menuItems.tenantId, tenantId)));
}

export async function getMenuWithModifiers(tenantId: number) {
  const db = await getDb();
  if (!db) return [];
  const categories = await getMenuCategories(tenantId);
  const items = await db
    .select()
    .from(menuItems)
    .where(and(eq(menuItems.tenantId, tenantId), eq(menuItems.isAvailable, true)))
    .orderBy(menuItems.sortOrder);
  const groups = await db
    .select()
    .from(modifierGroups)
    .where(eq(modifierGroups.tenantId, tenantId))
    .orderBy(modifierGroups.sortOrder);
  const options = await db
    .select()
    .from(modifierOptions)
    .where(eq(modifierOptions.tenantId, tenantId))
    .orderBy(modifierOptions.sortOrder);

  return categories.map((cat) => ({
    ...cat,
    items: items
      .filter((item) => item.categoryId === cat.id)
      .map((item) => ({
        ...item,
        modifierGroups: groups
          .filter((g) => g.menuItemId === item.id)
          .map((g) => ({
            ...g,
            options: options.filter((o) => o.groupId === g.id),
          })),
      })),
  }));
}

// ─────────────────────────────────────────────
// MODIFIER GROUPS & OPTIONS
// ─────────────────────────────────────────────
export async function getModifierGroupsByItem(menuItemId: number, tenantId: number) {
  const db = await getDb();
  if (!db) return [];
  const groups = await db
    .select()
    .from(modifierGroups)
    .where(and(eq(modifierGroups.menuItemId, menuItemId), eq(modifierGroups.tenantId, tenantId)));
  const options = await db
    .select()
    .from(modifierOptions)
    .where(eq(modifierOptions.tenantId, tenantId));
  return groups.map((g) => ({
    ...g,
    options: options.filter((o) => o.groupId === g.id),
  }));
}

export async function createModifierGroup(data: {
  tenantId: number;
  menuItemId: number;
  name: string;
  isRequired: boolean;
  allowMultiple: boolean;
  sortOrder: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(modifierGroups).values(data);
}

export async function createModifierOption(data: {
  tenantId: number;
  groupId: number;
  name: string;
  priceDelta: string;
  isDefault: boolean;
  sortOrder: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(modifierOptions).values(data);
}

// ─────────────────────────────────────────────
// DINING TABLES
// ─────────────────────────────────────────────
export async function getDiningTables(tenantId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(diningTables)
    .where(and(eq(diningTables.tenantId, tenantId), eq(diningTables.isActive, true)))
    .orderBy(diningTables.sortOrder, diningTables.name);
}

export async function createDiningTable(data: InsertDiningTable) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(diningTables).values(data);
}

export async function updateDiningTableStatus(
  id: number,
  tenantId: number,
  status: "available" | "occupied" | "reserved" | "cleaning"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(diningTables)
    .set({ status })
    .where(and(eq(diningTables.id, id), eq(diningTables.tenantId, tenantId)));
}

export async function updateDiningTable(id: number, tenantId: number, data: Partial<InsertDiningTable>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(diningTables)
    .set(data)
    .where(and(eq(diningTables.id, id), eq(diningTables.tenantId, tenantId)));
}

// ─────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────
export async function createOrder(data: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(orders).values(data);
  const insertId = (result[0] as any).insertId as number;
  const created = await db.select().from(orders).where(eq(orders.id, insertId)).limit(1);
  return created[0];
}

export async function getOrderById(id: number, tenantId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, id), eq(orders.tenantId, tenantId)))
    .limit(1);
  return result[0];
}

export async function getActiveOrders(tenantId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.tenantId, tenantId),
        sql`${orders.status} IN ('open', 'in_progress', 'ready')`
      )
    )
    .orderBy(desc(orders.createdAt));
}

export async function getOrderWithItems(orderId: number, tenantId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const order = await getOrderById(orderId, tenantId);
  if (!order) return undefined;
  const items = await db
    .select()
    .from(orderItems)
    .where(and(eq(orderItems.orderId, orderId), eq(orderItems.tenantId, tenantId)));
  return { ...order, items };
}

export async function updateOrder(id: number, tenantId: number, data: Partial<InsertOrder>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(orders)
    .set(data)
    .where(and(eq(orders.id, id), eq(orders.tenantId, tenantId)));
}

export async function recalculateOrderTotals(orderId: number, tenantId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const items = await db
    .select()
    .from(orderItems)
    .where(
      and(
        eq(orderItems.orderId, orderId),
        eq(orderItems.tenantId, tenantId),
        sql`${orderItems.status} != 'voided'`
      )
    );
  const subtotal = items.reduce((sum, item) => sum + parseFloat(String(item.totalPrice)), 0);
  const taxAmount = subtotal * 0.12; // 12% VAT
  const totalAmount = subtotal + taxAmount;
  await db
    .update(orders)
    .set({
      subtotal: subtotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
    })
    .where(and(eq(orders.id, orderId), eq(orders.tenantId, tenantId)));
  return { subtotal, taxAmount, totalAmount };
}

// ─────────────────────────────────────────────
// ORDER ITEMS
// ─────────────────────────────────────────────
export async function addOrderItem(data: InsertOrderItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(orderItems).values(data);
  const insertId = (result[0] as any).insertId as number;
  const created = await db.select().from(orderItems).where(eq(orderItems.id, insertId)).limit(1);
  return created[0];
}

export async function updateOrderItem(id: number, tenantId: number, data: Partial<InsertOrderItem>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(orderItems)
    .set(data)
    .where(and(eq(orderItems.id, id), eq(orderItems.tenantId, tenantId)));
}

export async function voidOrderItem(id: number, tenantId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(orderItems)
    .set({ status: "voided" })
    .where(and(eq(orderItems.id, id), eq(orderItems.tenantId, tenantId)));
}

// ─────────────────────────────────────────────
// PAYMENTS
// ─────────────────────────────────────────────
export async function createPayment(data: InsertPayment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(payments).values(data);
  const insertId = (result[0] as any).insertId as number;
  const created = await db.select().from(payments).where(eq(payments.id, insertId)).limit(1);
  return created[0];
}

export async function getPaymentsByOrder(orderId: number, tenantId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(payments)
    .where(and(eq(payments.orderId, orderId), eq(payments.tenantId, tenantId)));
}

export async function updatePayment(id: number, tenantId: number, data: Partial<InsertPayment>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(payments)
    .set(data)
    .where(and(eq(payments.id, id), eq(payments.tenantId, tenantId)));
}

export async function getPaymentsByDateRange(tenantId: number, from: Date, to: Date) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(payments)
    .where(
      and(
        eq(payments.tenantId, tenantId),
        eq(payments.status, "completed"),
        gte(payments.createdAt, from),
        lte(payments.createdAt, to)
      )
    )
    .orderBy(desc(payments.createdAt));
}

// ─────────────────────────────────────────────
// Z-REPORTS
// ─────────────────────────────────────────────
export async function createZReport(data: typeof zReports.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(zReports).values(data);
}

export async function getZReports(tenantId: number, limit = 30) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(zReports)
    .where(eq(zReports.tenantId, tenantId))
    .orderBy(desc(zReports.reportDate))
    .limit(limit);
}

export async function getZReportByDate(tenantId: number, date: Date) {
  const db = await getDb();
  if (!db) return undefined;
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  const result = await db
    .select()
    .from(zReports)
    .where(
      and(
        eq(zReports.tenantId, tenantId),
        gte(zReports.reportDate, startOfDay),
        lte(zReports.reportDate, endOfDay)
      )
    )
    .limit(1);
  return result[0];
}

// ─────────────────────────────────────────────
// AUDIT LOGS
// ─────────────────────────────────────────────
export async function createAuditLog(data: InsertAuditLog) {
  const db = await getDb();
  if (!db) return;
  try {
    await db.insert(auditLogs).values(data);
  } catch (e) {
    console.error("[AuditLog] Failed to write:", e);
  }
}

export async function getAuditLogs(tenantId: number, limit = 100, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(auditLogs)
    .where(eq(auditLogs.tenantId, tenantId))
    .orderBy(desc(auditLogs.createdAt))
    .limit(limit)
    .offset(offset);
}

// ─────────────────────────────────────────────
// ANALYTICS
// ─────────────────────────────────────────────
export async function getDailySalesSummary(tenantId: number, date: Date) {
  const db = await getDb();
  if (!db) return null;
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const result = await db
    .select({
      totalTransactions: sql<number>`COUNT(*)`,
      totalSales: sql<string>`COALESCE(SUM(${payments.amount}), 0)`,
      cashSales: sql<string>`COALESCE(SUM(CASE WHEN ${payments.method} = 'cash' THEN ${payments.amount} ELSE 0 END), 0)`,
      cardSales: sql<string>`COALESCE(SUM(CASE WHEN ${payments.method} = 'card' THEN ${payments.amount} ELSE 0 END), 0)`,
    })
    .from(payments)
    .where(
      and(
        eq(payments.tenantId, tenantId),
        eq(payments.status, "completed"),
        gte(payments.createdAt, startOfDay),
        lte(payments.createdAt, endOfDay)
      )
    );
  return result[0];
}

export async function getTopSellingItems(tenantId: number, from: Date, to: Date, limit = 10) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      name: orderItems.name,
      totalQuantity: sql<number>`SUM(${orderItems.quantity})`,
      totalRevenue: sql<string>`SUM(${orderItems.totalPrice})`,
    })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(
      and(
        eq(orderItems.tenantId, tenantId),
        sql`${orderItems.status} != 'voided'`,
        gte(orders.createdAt, from),
        lte(orders.createdAt, to)
      )
    )
    .groupBy(orderItems.name)
    .orderBy(sql`SUM(${orderItems.quantity}) DESC`)
    .limit(limit);
}

export async function getRecentOrders(tenantId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(orders)
    .where(eq(orders.tenantId, tenantId))
    .orderBy(desc(orders.createdAt))
    .limit(limit);
}
