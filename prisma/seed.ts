import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const adminPassword = await hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@dropship.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@dropship.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("Admin created:", admin.email);

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "new-arrivals" },
      update: {},
      create: { name: "New Arrivals", slug: "new-arrivals", order: 1 },
    }),
    prisma.category.upsert({
      where: { slug: "best-sellers" },
      update: {},
      create: { name: "Best Sellers", slug: "best-sellers", order: 2 },
    }),
    prisma.category.upsert({
      where: { slug: "sale" },
      update: {},
      create: { name: "Sale", slug: "sale", order: 3 },
    }),
    prisma.category.upsert({
      where: { slug: "accessories" },
      update: {},
      create: { name: "Accessories", slug: "accessories", order: 4 },
    }),
  ]);
  console.log("Categories created:", categories.length);

  const products = [
    {
      name: "Premium Wireless Headphones",
      slug: "premium-wireless-headphones",
      description: "Experience crystal-clear audio with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and ultra-comfortable memory foam ear cushions.",
      shortDescription: "Premium sound with active noise cancellation",
      price: 149.99,
      comparePrice: 199.99,
      images: ["/images/placeholder.svg"],
      tags: ["audio", "wireless", "premium"],
      status: "PUBLISHED" as const,
      featured: true,
      categoryId: categories[1].id,
    },
    {
      name: "Minimalist Watch",
      slug: "minimalist-watch",
      description: "A sleek, minimalist timepiece crafted from aerospace-grade titanium. Sapphire crystal display, Japanese quartz movement, and interchangeable straps.",
      shortDescription: "Timeless elegance meets modern design",
      price: 89.99,
      comparePrice: 129.99,
      images: ["/images/placeholder.svg"],
      tags: ["watch", "minimalist", "accessories"],
      status: "PUBLISHED" as const,
      featured: true,
      categoryId: categories[3].id,
    },
    {
      name: "Smart Water Bottle",
      slug: "smart-water-bottle",
      description: "Stay hydrated with style. This smart water bottle tracks your water intake, glows to remind you to drink, and keeps your water cold for 24 hours.",
      shortDescription: "Track your hydration in style",
      price: 49.99,
      comparePrice: 69.99,
      images: ["/images/placeholder.svg"],
      tags: ["smart", "hydration", "lifestyle"],
      status: "PUBLISHED" as const,
      featured: true,
      categoryId: categories[0].id,
    },
    {
      name: "Organic Cotton Hoodie",
      slug: "organic-cotton-hoodie",
      description: "Made from 100% organic cotton with a brushed fleece interior. This hoodie combines comfort with sustainability. Available in five earth-toned colors.",
      shortDescription: "Sustainable comfort for everyday wear",
      price: 79.99,
      comparePrice: 99.99,
      images: ["/images/placeholder.svg"],
      tags: ["clothing", "sustainable", "cotton"],
      status: "PUBLISHED" as const,
      featured: true,
      categoryId: categories[0].id,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }
  console.log("Products created:", products.length);

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      siteName: "Dropship",
      description: "Premium products delivered to your door",
      announcementText: "Free shipping on orders over $50",
      announcementEnabled: true,
    },
  });
  console.log("Settings created");

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
