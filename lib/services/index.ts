import { db, products as productsTable, productVariants, reviews, orders, orderItems, coupons, wishlistItems, cartItems, categories, users } from "@/lib/db";
import { eq, and, desc, asc, sql } from "drizzle-orm";

export const services = {
  products: {
    async getAll(params?: { featured?: boolean; categoryId?: string; search?: string; limit?: number; offset?: number }) {
      const conditions = [eq(productsTable.isActive, true), eq(productsTable.status, "PUBLISHED")];
      if (params?.featured) conditions.push(eq(productsTable.featured, true));
      if (params?.categoryId) conditions.push(eq(productsTable.categoryId, params.categoryId));
      if (params?.search) {
        const q = `%${params.search}%`;
        conditions.push(sql`(${productsTable.name} ILIKE ${q} OR ${productsTable.description} ILIKE ${q})`);
      }
      const rows = await db.select().from(productsTable)
        .leftJoin(categories, eq(productsTable.categoryId, categories.id))
        .where(and(...conditions))
        .orderBy(asc(productsTable.order))
        .limit(params?.limit || 20)
        .offset(params?.offset || 0);
      return rows.map((r) => ({ ...r.products, category: r.categories }));
    },

    async getBySlug(slug: string) {
      const [row] = await db.select().from(productsTable)
        .leftJoin(categories, eq(productsTable.categoryId, categories.id))
        .where(and(eq(productsTable.slug, slug), eq(productsTable.isActive, true), eq(productsTable.status, "PUBLISHED")))
        .limit(1);
      if (!row) return null;
      const allVariants = await db.select().from(productVariants)
        .where(and(eq(productVariants.productId, row.products.id), eq(productVariants.isActive, true)));
      const allReviews = await db.select().from(reviews)
        .leftJoin(users, eq(reviews.userId, users.id))
        .where(and(eq(reviews.productId, row.products.id), eq(reviews.isApproved, true)));
      return {
        ...row.products,
        category: row.categories,
        variants: allVariants,
        reviews: allReviews.map((r) => ({ ...r.reviews, user: r.users })),
      };
    },

    async getRelated(productId: string, categoryId?: string, limit = 4) {
      const conditions = [eq(productsTable.isActive, true), eq(productsTable.status, "PUBLISHED"), sql`${productsTable.id} != ${productId}`];
      if (categoryId) conditions.push(eq(productsTable.categoryId, categoryId));
      const rows = await db.select().from(productsTable).where(and(...conditions)).orderBy(desc(productsTable.createdAt)).limit(limit);
      return rows;
    },
  },

  orders: {
    async create(data: { userId?: string; email: string; items: { productId: string; name: string; image?: string; price: number; quantity: number }[]; subtotal: number; shippingCost: number; tax: number; discount: number; total: number; couponId?: string; shippingAddress?: any }) {
      const { generateOrderNumber } = await import("@/lib/utils/cn");
      const orderNumber = generateOrderNumber();
      const [order] = await db.insert(orders).values({
        orderNumber, userId: data.userId, email: data.email,
        subtotal: String(data.subtotal), shippingCost: String(data.shippingCost),
        tax: String(data.tax), discount: String(data.discount), total: String(data.total),
        couponId: data.couponId, shippingAddress: data.shippingAddress,
      }).returning();
      if (order && data.items.length > 0) {
        await db.insert(orderItems).values(data.items.map((item) => ({
          orderId: order.id, productId: item.productId, name: item.name,
          image: item.image, price: String(item.price), quantity: item.quantity,
          total: String(item.price * item.quantity),
        })));
      }
      return order;
    },

    async getByUser(userId: string) {
      const rows = await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
      return rows;
    },

    async getById(id: string) {
      const [row] = await db.select().from(orders).leftJoin(orderItems, eq(orders.id, orderItems.orderId)).where(eq(orders.id, id)).limit(1);
      if (!row) return null;
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
      return { ...row.orders, items };
    },
  },

  reviews: {
    async create(data: { productId: string; userId: string; rating: number; title?: string; comment?: string }) {
      const [review] = await db.insert(reviews).values(data).returning();
      return review;
    },

    async getByProduct(productId: string) {
      const rows = await db.select().from(reviews)
        .leftJoin(users, eq(reviews.userId, users.id))
        .where(and(eq(reviews.productId, productId), eq(reviews.isApproved, true)))
        .orderBy(desc(reviews.createdAt));
      return rows.map((r) => ({ ...r.reviews, user: { name: r.users?.name, image: r.users?.image } }));
    },
  },

  wishlist: {
    async toggle(userId: string, productId: string) {
      const existing = await db.select().from(wishlistItems)
        .where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, productId))).limit(1);
      if (existing.length > 0) {
        await db.delete(wishlistItems).where(eq(wishlistItems.id, existing[0].id));
        return false;
      }
      await db.insert(wishlistItems).values({ userId, productId });
      return true;
    },

    async getByUser(userId: string) {
      const rows = await db.select().from(wishlistItems)
        .leftJoin(productsTable, eq(wishlistItems.productId, productsTable.id))
        .where(eq(wishlistItems.userId, userId));
      return rows.map((r) => ({ ...r.wishlist_items, product: r.products }));
    },
  },

  cart: {
    async sync(userId: string, items: { productId: string; variantId?: string; quantity: number }[]) {
      await db.delete(cartItems).where(eq(cartItems.userId, userId));
      if (items.length > 0) {
        await db.insert(cartItems).values(items.map((item) => ({ ...item, userId })));
      }
    },

    async getByUser(userId: string) {
      const rows = await db.select().from(cartItems)
        .leftJoin(productsTable, eq(cartItems.productId, productsTable.id))
        .leftJoin(productVariants, eq(cartItems.variantId, productVariants.id))
        .where(eq(cartItems.userId, userId));
      return rows.map((r) => ({ ...r.cart_items, product: r.products, variant: r.product_variants }));
    },
  },
};
