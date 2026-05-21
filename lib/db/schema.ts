import { pgTable, text, timestamp, integer, decimal, boolean, jsonb, uniqueIndex, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  role: text("role").default("CUSTOMER").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  expiresAt: integer("expires_at"),
  tokenType: text("token_type"),
  scope: text("scope"),
  idToken: text("id_token"),
  sessionState: text("session_state"),
}, (table) => [uniqueIndex().on(table.provider, table.providerAccountId)]);

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionToken: text("session_token").notNull().unique(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull().unique(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
}, (table) => [uniqueIndex().on(table.identifier, table.token)]);

export const categories = pgTable("categories", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
  parentId: text("parent_id"),
  order: integer("order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => [index().on(table.parentId), index().on(table.slug)]);

export const products = pgTable("products", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  shortDescription: text("short_description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  comparePrice: decimal("compare_price", { precision: 10, scale: 2 }),
  costPrice: decimal("cost_price", { precision: 10, scale: 2 }),
  status: text("status").default("DRAFT").notNull(),
  featured: boolean("featured").default(false).notNull(),
  images: text("images").array().default(sql`'{}'`),
  weight: decimal("weight", { precision: 8, scale: 2 }),
  tags: text("tags").array().default(sql`'{}'`),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  isActive: boolean("is_active").default(true).notNull(),
  order: integer("order").default(0).notNull(),
  categoryId: text("category_id"),
  supplier: text("supplier"),
  supplierProductId: text("supplier_product_id"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => [
  index().on(table.slug),
  index().on(table.categoryId),
  index().on(table.status),
  index().on(table.featured),
  index().on(table.isActive, table.status),
]);

export const productVariants = pgTable("product_variants", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  sku: text("sku").unique(),
  price: decimal("price", { precision: 10, scale: 2 }),
  stock: integer("stock").default(0).notNull(),
  images: text("images").array().default(sql`'{}'`),
  options: jsonb("options"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => [index().on(table.productId), index().on(table.sku)]);

export const reviews = pgTable("reviews", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  title: text("title"),
  comment: text("comment"),
  isApproved: boolean("is_approved").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex().on(table.productId, table.userId),
  index().on(table.productId, table.isApproved),
  index().on(table.productId),
  index().on(table.userId),
  index().on(table.isApproved),
]);

export const orders = pgTable("orders", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: text("order_number").notNull().unique(),
  userId: text("user_id"),
  email: text("email").notNull(),
  status: text("status").default("PENDING").notNull(),
  paymentStatus: text("paymentStatus").default("PENDING").notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }).default("0").notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0").notNull(),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  couponId: text("coupon_id"),
  shippingAddress: jsonb("shippingAddress"),
  billingAddress: jsonb("billingAddress"),
  stripeSessionId: text("stripe_session_id"),
  stripePaymentId: text("stripe_payment_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => [
  index().on(table.orderNumber),
  index().on(table.userId),
  index().on(table.stripeSessionId),
  index().on(table.status),
  index().on(table.createdAt),
]);

export const orderItems = pgTable("order_items", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull().references(() => products.id),
  variantId: text("variant_id"),
  name: text("name").notNull(),
  image: text("image"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
}, (table) => [index().on(table.orderId), index().on(table.productId)]);

export const addresses = pgTable("addresses", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  label: text("label"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  line1: text("line1").notNull(),
  line2: text("line2"),
  city: text("city").notNull(),
  state: text("state"),
  zip: text("zip_code").notNull(),
  country: text("country").default("US").notNull(),
  phone: text("phone"),
  isDefault: boolean("is_default").default(false).notNull(),
}, (table) => [index().on(table.userId)]);

export const coupons = pgTable("coupons", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  description: text("description"),
  type: text("type").default("PERCENTAGE").notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  minOrderAmount: decimal("min_order_amount", { precision: 10, scale: 2 }),
  maxDiscount: decimal("max_discount", { precision: 10, scale: 2 }),
  usageLimit: integer("usage_limit"),
  usedCount: integer("used_count").default(0).notNull(),
  startsAt: timestamp("starts_at", { mode: "date" }),
  expiresAt: timestamp("expires_at", { mode: "date" }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => [index().on(table.code)]);

export const wishlistItems = pgTable("wishlist_items", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex().on(table.userId, table.productId),
  index().on(table.userId),
]);

export const cartItems = pgTable("cart_items", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  variantId: text("variant_id"),
  quantity: integer("quantity").default(1).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex().on(table.userId, table.productId, table.variantId),
  index().on(table.userId),
  index().on(table.productId),
  index().on(table.variantId),
]);

export const cmsContents = pgTable("cms_contents", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  section: text("section").notNull().unique(),
  title: text("title"),
  subtitle: text("subtitle"),
  content: jsonb("content"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const heroBanners = pgTable("hero_banners", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  ctaText: text("cta_text"),
  ctaLink: text("cta_link"),
  image: text("image"),
  mobileImage: text("mobile_image"),
  order: integer("order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  bgColor: text("bg_color"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey().default("default"),
  siteName: text("site_name").default("KAIRO").notNull(),
  description: text("description"),
  logo: text("logo"),
  favicon: text("favicon"),
  currency: text("currency").default("USD").notNull(),
  announcementText: text("announcement_text"),
  announcementEnabled: boolean("announcement_enabled").default(false).notNull(),
  shippingInfo: text("shipping_info"),
  returnPolicy: text("return_policy"),
  socialLinks: jsonb("social_links"),
  seoDefaults: jsonb("seo_defaults"),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const supplierProducts = pgTable("supplier_products", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  supplier: text("supplier").notNull(),
  supplierProductId: text("supplier_product_id").notNull(),
  supplierUrl: text("supplier_url"),
  title: text("title").notNull(),
  description: text("description"),
  images: text("images").array().default(sql`'{}'`),
  price: decimal("price", { precision: 10, scale: 2 }),
  comparePrice: decimal("compare_price", { precision: 10, scale: 2 }),
  costPrice: decimal("cost_price", { precision: 10, scale: 2 }),
  currency: text("currency").default("USD"),
  variants: jsonb("variants"),
  categoryId: text("category_id").references(() => categories.id),
  tags: text("tags").array().default(sql`'{}'`),
  weight: decimal("weight", { precision: 8, scale: 2 }),
  sku: text("sku"),
  stock: integer("stock").default(0),
  attributes: jsonb("attributes"),
  mappedProductId: text("mapped_product_id").references(() => products.id),
  status: text("status").default("PENDING"),
  error: text("error"),
  rawData: jsonb("raw_data"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => [
  index().on(table.supplier),
  index().on(table.status),
  uniqueIndex().on(table.supplierProductId, table.supplier),
  index().on(table.mappedProductId),
]);

export const supplierMappings = pgTable("supplier_mappings", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  supplierProductId: text("supplier_product_id").notNull(),
  supplier: text("supplier").notNull(),
  supplierUrl: text("supplier_url"),
  variantMapping: jsonb("variant_mapping"),
  costPrice: decimal("cost_price", { precision: 10, scale: 2 }),
  supplierSku: text("supplier_sku"),
  isActive: boolean("is_active").default(true).notNull(),
  lastSyncedAt: timestamp("last_synced_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => [
  index().on(table.productId),
  uniqueIndex().on(table.supplier, table.supplierProductId),
  index().on(table.isActive),
]);

export const syncJobs = pgTable("sync_jobs", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  status: text("status").default("PENDING"),
  supplier: text("supplier"),
  totalItems: integer("total_items").default(0),
  processedItems: integer("processed_items").default(0),
  failedItems: integer("failed_items").default(0),
  result: jsonb("result"),
  error: text("error"),
  startedAt: timestamp("started_at", { mode: "date" }),
  completedAt: timestamp("completed_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => [
  index().on(table.type),
  index().on(table.status),
  index().on(table.createdAt),
]);

export const fulfillmentJobs = pgTable("fulfillment_jobs", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  orderItemId: text("order_item_id").references(() => orderItems.id),
  supplier: text("supplier").notNull(),
  supplierOrderId: text("supplier_order_id"),
  status: text("status").default("PENDING"),
  trackingNumber: text("tracking_number"),
  trackingUrl: text("tracking_url"),
  carrier: text("carrier"),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  currency: text("currency").default("USD"),
  shippingMethod: text("shipping_method"),
  estimatedDelivery: timestamp("estimated_delivery", { mode: "date" }),
  shippedAt: timestamp("shipped_at", { mode: "date" }),
  deliveredAt: timestamp("delivered_at", { mode: "date" }),
  error: text("error"),
  rawResponse: jsonb("raw_response"),
  retryCount: integer("retry_count").default(0),
  maxRetries: integer("max_retries").default(3),
  lastRetryAt: timestamp("last_retry_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => [
  index().on(table.orderId),
  index().on(table.supplierOrderId),
  index().on(table.status),
  index().on(table.supplier, table.status),
]);

export const trackingUpdates = pgTable("tracking_updates", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  fulfillmentJobId: text("fulfillment_job_id").notNull().references(() => fulfillmentJobs.id, { onDelete: "cascade" }),
  status: text("status").notNull(),
  location: text("location"),
  description: text("description").notNull(),
  timestamp: timestamp("timestamp", { mode: "date" }).defaultNow().notNull(),
  rawData: jsonb("raw_data"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => [
  index().on(table.fulfillmentJobId),
  index().on(table.timestamp),
]);

export const contactMessages = pgTable("contact_messages", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => [index().on(table.createdAt)]);

export const automationLogs = pgTable("automation_logs", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  action: text("action").notNull(),
  status: text("status").default("SUCCESS"),
  message: text("message"),
  metadata: jsonb("metadata"),
  duration: integer("duration"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => [
  index().on(table.type),
  index().on(table.status),
  index().on(table.createdAt),
  index().on(table.type, table.status),
]);
