export const services = {
  products: {
    async getAll(params?: {
      featured?: boolean;
      categoryId?: string;
      search?: string;
      limit?: number;
      offset?: number;
    }) {
      const { prisma } = await import("@/lib/db/prisma");
      return prisma.product.findMany({
        where: {
          isActive: true,
          status: "PUBLISHED",
          ...(params?.featured && { featured: true }),
          ...(params?.categoryId && { categoryId: params.categoryId }),
          ...(params?.search && {
            OR: [
              { name: { contains: params.search, mode: "insensitive" } },
              { description: { contains: params.search, mode: "insensitive" } },
            ],
          }),
        },
        include: { category: true, variants: true },
        orderBy: { order: "asc" },
        take: params?.limit || 20,
        skip: params?.offset || 0,
      });
    },

    async getBySlug(slug: string) {
      const { prisma } = await import("@/lib/db/prisma");
      return prisma.product.findUnique({
        where: { slug, isActive: true, status: "PUBLISHED" },
        include: {
          category: true,
          variants: { where: { isActive: true } },
          reviews: {
            where: { isApproved: true },
            include: { user: { select: { name: true, image: true } } },
          },
        },
      });
    },

    async getRelated(productId: string, categoryId?: string, limit = 4) {
      const { prisma } = await import("@/lib/db/prisma");
      return prisma.product.findMany({
        where: {
          isActive: true,
          status: "PUBLISHED",
          id: { not: productId },
          ...(categoryId && { categoryId }),
        },
        take: limit,
        orderBy: { createdAt: "desc" },
      });
    },
  },

  orders: {
    async create(data: {
      userId?: string;
      email: string;
      items: { productId: string; name: string; image?: string; price: number; quantity: number }[];
      subtotal: number;
      shippingCost: number;
      tax: number;
      discount: number;
      total: number;
      couponId?: string;
      shippingAddress?: any;
    }) {
      const { prisma, generateOrderNumber } = await Promise.all([
        import("@/lib/db/prisma"),
        import("@/lib/utils/cn"),
      ]);
      const orderNumber = generateOrderNumber.generateOrderNumber();

      return prisma.prisma.order.create({
        data: {
          orderNumber,
          userId: data.userId,
          email: data.email,
          subtotal: data.subtotal,
          shippingCost: data.shippingCost,
          tax: data.tax,
          discount: data.discount,
          total: data.total,
          couponId: data.couponId,
          shippingAddress: data.shippingAddress,
          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              name: item.name,
              image: item.image,
              price: item.price,
              quantity: item.quantity,
              total: item.price * item.quantity,
            })),
          },
        },
        include: { items: true },
      });
    },

    async getByUser(userId: string) {
      const { prisma } = await import("@/lib/db/prisma");
      return prisma.order.findMany({
        where: { userId },
        include: { items: true },
        orderBy: { createdAt: "desc" },
      });
    },

    async getById(id: string) {
      const { prisma } = await import("@/lib/db/prisma");
      return prisma.order.findUnique({
        where: { id },
        include: { items: { include: { product: true } } },
      });
    },
  },

  reviews: {
    async create(data: { productId: string; userId: string; rating: number; title?: string; comment?: string }) {
      const { prisma } = await import("@/lib/db/prisma");
      return prisma.review.create({ data });
    },

    async getByProduct(productId: string) {
      const { prisma } = await import("@/lib/db/prisma");
      return prisma.review.findMany({
        where: { productId, isApproved: true },
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      });
    },
  },

  wishlist: {
    async toggle(userId: string, productId: string) {
      const { prisma } = await import("@/lib/db/prisma");
      const existing = await prisma.wishlistItem.findUnique({
        where: { userId_productId: { userId, productId } },
      });
      if (existing) {
        await prisma.wishlistItem.delete({ where: { id: existing.id } });
        return false;
      }
      await prisma.wishlistItem.create({ data: { userId, productId } });
      return true;
    },

    async getByUser(userId: string) {
      const { prisma } = await import("@/lib/db/prisma");
      return prisma.wishlistItem.findMany({
        where: { userId },
        include: { product: true },
      });
    },
  },

  cart: {
    async sync(userId: string, items: { productId: string; variantId?: string; quantity: number }[]) {
      const { prisma } = await import("@/lib/db/prisma");
      await prisma.cartItem.deleteMany({ where: { userId } });
      if (items.length > 0) {
        await prisma.cartItem.createMany({
          data: items.map((item) => ({ ...item, userId })),
        });
      }
    },

    async getByUser(userId: string) {
      const { prisma } = await import("@/lib/db/prisma");
      return prisma.cartItem.findMany({
        where: { userId },
        include: { product: { include: { variants: true } } },
      });
    },
  },
};
