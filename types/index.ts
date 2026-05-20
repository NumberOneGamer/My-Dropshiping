import type { Prisma } from "@prisma/client";

export type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: { product: { include: { variants: true } } };
}>;

export type OrderWithItems = Prisma.OrderGetPayload<{
  include: { items: true; coupon: true };
}>;

export type ProductWithCategory = Prisma.ProductGetPayload<{
  include: { category: true; variants: true; reviews: true };
}>;

export type ReviewWithUser = Prisma.ReviewGetPayload<{
  include: { user: { select: { name: true; image: true } } };
}>;
