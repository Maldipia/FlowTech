import {
  boolean,
  decimal,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

// ─────────────────────────────────────────────
// CORE AUTH TABLE (required by template)
// ─────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─────────────────────────────────────────────
// TENANTS — Each F&B business is a tenant
// ─────────────────────────────────────────────
export const tenants = mysqlTable("tenants", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  subdomain: varchar("subdomain", { length: 100 }).notNull().unique(),
  businessType: mysqlEnum("businessType", [
    "RESTAURANT",
    "CAFE",
    "BAR",
    "FOOD_TRUCK",
    "BAKERY",
    "FASTFOOD",
    "OTHER",
  ]).default("RESTAURANT").notNull(),
  addressStreet: text("addressStreet"),
  addressCity: varchar("addressCity", { length: 100 }),
  addressProvince: varchar("addressProvince", { length: 100 }),
  addressPostalCode: varchar("addressPostalCode", { length: 10 }),
  contactEmail: varchar("contactEmail", { length: 320 }),
  contactPhone: varchar("contactPhone", { length: 30 }),
  currency: varchar("currency", { length: 3 }).default("PHP").notNull(),
  timezone: varchar("timezone", { length: 50 }).default("Asia/Manila").notNull(),
  // BIR compliance fields
  birTin: varchar("birTin", { length: 20 }),
  birRegisteredName: varchar("birRegisteredName", { length: 255 }),
  birAddress: text("birAddress"),
  birPermitNo: varchar("birPermitNo", { length: 50 }),
  birAccreditationNo: varchar("birAccreditationNo", { length: 50 }),
  birAccreditationDate: timestamp("birAccreditationDate"),
  birAccreditationExpiry: timestamp("birAccreditationExpiry"),
  // Billing
  plan: mysqlEnum("plan", ["starter", "professional", "enterprise"]).default("starter").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  // Receipt sequence counter (per tenant, immutable after increment)
  receiptSequence: int("receiptSequence").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Tenant = typeof tenants.$inferSelect;
export type InsertTenant = typeof tenants.$inferInsert;

// ─────────────────────────────────────────────
// PROFILES — Links a user to a tenant with a role
// ─────────────────────────────────────────────
export const profiles = mysqlTable("profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  tenantId: int("tenantId").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  role: mysqlEnum("role", ["admin", "manager", "cashier"]).default("cashier").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;

// ─────────────────────────────────────────────
// MENU CATEGORIES
// ─────────────────────────────────────────────
export const menuCategories = mysqlTable("menu_categories", {
  id: int("id").autoincrement().primaryKey(),
  tenantId: int("tenantId").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  sortOrder: int("sortOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MenuCategory = typeof menuCategories.$inferSelect;
export type InsertMenuCategory = typeof menuCategories.$inferInsert;

// ─────────────────────────────────────────────
// MENU ITEMS
// ─────────────────────────────────────────────
export const menuItems = mysqlTable("menu_items", {
  id: int("id").autoincrement().primaryKey(),
  tenantId: int("tenantId").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  categoryId: int("categoryId").notNull().references(() => menuCategories.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("imageUrl"),
  isAvailable: boolean("isAvailable").default(true).notNull(),
  isTaxable: boolean("isTaxable").default(true).notNull(),
  taxRate: decimal("taxRate", { precision: 5, scale: 2 }).default("12.00"), // 12% VAT Philippines
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = typeof menuItems.$inferInsert;

// ─────────────────────────────────────────────
// MODIFIER GROUPS (e.g., "Size", "Add-ons")
// ─────────────────────────────────────────────
export const modifierGroups = mysqlTable("modifier_groups", {
  id: int("id").autoincrement().primaryKey(),
  tenantId: int("tenantId").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  menuItemId: int("menuItemId").notNull().references(() => menuItems.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(), // e.g., "Size", "Temperature"
  isRequired: boolean("isRequired").default(false).notNull(),
  allowMultiple: boolean("allowMultiple").default(false).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ModifierGroup = typeof modifierGroups.$inferSelect;

// ─────────────────────────────────────────────
// MODIFIER OPTIONS (e.g., "Large +₱20")
// ─────────────────────────────────────────────
export const modifierOptions = mysqlTable("modifier_options", {
  id: int("id").autoincrement().primaryKey(),
  tenantId: int("tenantId").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  groupId: int("groupId").notNull().references(() => modifierGroups.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(), // e.g., "Large"
  priceDelta: decimal("priceDelta", { precision: 10, scale: 2 }).default("0.00").notNull(),
  isDefault: boolean("isDefault").default(false).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ModifierOption = typeof modifierOptions.$inferSelect;

// ─────────────────────────────────────────────
// DINING TABLES
// ─────────────────────────────────────────────
export const diningTables = mysqlTable("dining_tables", {
  id: int("id").autoincrement().primaryKey(),
  tenantId: int("tenantId").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 50 }).notNull(), // e.g., "Table 1", "Bar 3"
  capacity: int("capacity").default(4).notNull(),
  section: varchar("section", { length: 100 }), // e.g., "Main Hall", "Outdoor"
  status: mysqlEnum("status", ["available", "occupied", "reserved", "cleaning"]).default("available").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DiningTable = typeof diningTables.$inferSelect;
export type InsertDiningTable = typeof diningTables.$inferInsert;

// ─────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  tenantId: int("tenantId").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  tableId: int("tableId").references(() => diningTables.id, { onDelete: "set null" }),
  cashierId: int("cashierId").references(() => users.id, { onDelete: "set null" }),
  orderType: mysqlEnum("orderType", ["dine_in", "takeout", "delivery"]).default("dine_in").notNull(),
  status: mysqlEnum("status", [
    "open",
    "in_progress",
    "ready",
    "completed",
    "voided",
    "refunded",
  ]).default("open").notNull(),
  customerName: varchar("customerName", { length: 200 }),
  customerCount: int("customerCount").default(1),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).default("0.00").notNull(),
  taxAmount: decimal("taxAmount", { precision: 10, scale: 2 }).default("0.00").notNull(),
  discountAmount: decimal("discountAmount", { precision: 10, scale: 2 }).default("0.00").notNull(),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).default("0.00").notNull(),
  notes: text("notes"),
  voidReason: text("voidReason"),
  voidedAt: timestamp("voidedAt"),
  voidedBy: int("voidedBy").references(() => users.id, { onDelete: "set null" }),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

// ─────────────────────────────────────────────
// ORDER ITEMS
// ─────────────────────────────────────────────
export const orderItems = mysqlTable("order_items", {
  id: int("id").autoincrement().primaryKey(),
  tenantId: int("tenantId").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  orderId: int("orderId").notNull().references(() => orders.id, { onDelete: "cascade" }),
  menuItemId: int("menuItemId").references(() => menuItems.id, { onDelete: "set null" }),
  name: varchar("name", { length: 200 }).notNull(), // snapshot at time of order
  unitPrice: decimal("unitPrice", { precision: 10, scale: 2 }).notNull(),
  quantity: int("quantity").default(1).notNull(),
  totalPrice: decimal("totalPrice", { precision: 10, scale: 2 }).notNull(),
  modifiers: json("modifiers"), // snapshot: [{groupName, optionName, priceDelta}]
  notes: text("notes"),
  status: mysqlEnum("status", ["pending", "preparing", "ready", "served", "voided"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

// ─────────────────────────────────────────────
// PAYMENTS
// ─────────────────────────────────────────────
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  tenantId: int("tenantId").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  orderId: int("orderId").notNull().references(() => orders.id, { onDelete: "cascade" }),
  cashierId: int("cashierId").references(() => users.id, { onDelete: "set null" }),
  method: mysqlEnum("method", ["cash", "card", "gcash", "maya", "bank_transfer", "other"]).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  amountTendered: decimal("amountTendered", { precision: 10, scale: 2 }), // for cash payments
  changeAmount: decimal("changeAmount", { precision: 10, scale: 2 }), // for cash payments
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  // Stripe fields
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  stripeChargeId: varchar("stripeChargeId", { length: 255 }),
  // BIR receipt fields (immutable once issued)
  birReceiptNo: varchar("birReceiptNo", { length: 50 }),
  birIssuedAt: timestamp("birIssuedAt"),
  refundReason: text("refundReason"),
  refundedAt: timestamp("refundedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

// ─────────────────────────────────────────────
// Z-REPORTS (End-of-Day BIR Reports)
// ─────────────────────────────────────────────
export const zReports = mysqlTable("z_reports", {
  id: int("id").autoincrement().primaryKey(),
  tenantId: int("tenantId").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  generatedBy: int("generatedBy").references(() => users.id, { onDelete: "set null" }),
  reportDate: timestamp("reportDate").notNull(),
  reportNo: varchar("reportNo", { length: 50 }).notNull(), // sequential per tenant
  totalTransactions: int("totalTransactions").default(0).notNull(),
  totalSales: decimal("totalSales", { precision: 12, scale: 2 }).default("0.00").notNull(),
  totalVat: decimal("totalVat", { precision: 12, scale: 2 }).default("0.00").notNull(),
  totalDiscount: decimal("totalDiscount", { precision: 12, scale: 2 }).default("0.00").notNull(),
  totalVoids: decimal("totalVoids", { precision: 12, scale: 2 }).default("0.00").notNull(),
  totalRefunds: decimal("totalRefunds", { precision: 12, scale: 2 }).default("0.00").notNull(),
  cashSales: decimal("cashSales", { precision: 12, scale: 2 }).default("0.00").notNull(),
  cardSales: decimal("cardSales", { precision: 12, scale: 2 }).default("0.00").notNull(),
  otherSales: decimal("otherSales", { precision: 12, scale: 2 }).default("0.00").notNull(),
  openingBalance: decimal("openingBalance", { precision: 12, scale: 2 }).default("0.00").notNull(),
  closingBalance: decimal("closingBalance", { precision: 12, scale: 2 }).default("0.00").notNull(),
  reportData: json("reportData"), // full snapshot for archival
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ZReport = typeof zReports.$inferSelect;

// ─────────────────────────────────────────────
// AUDIT LOGS — Immutable, tenant-scoped
// ─────────────────────────────────────────────
export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  tenantId: int("tenantId").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  userId: int("userId").references(() => users.id, { onDelete: "set null" }),
  action: varchar("action", { length: 100 }).notNull(), // e.g., "order.created", "payment.processed"
  entity: varchar("entity", { length: 50 }).notNull(), // e.g., "order", "payment", "menu_item"
  entityId: int("entityId"),
  meta: json("meta"), // additional context (before/after values, IP, etc.)
  ipAddress: varchar("ipAddress", { length: 45 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;
