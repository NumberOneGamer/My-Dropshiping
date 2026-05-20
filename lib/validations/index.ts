import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  comparePrice: z.coerce.number().optional(),
  costPrice: z.coerce.number().optional(),
  images: z.array(z.string()).default([]),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  weight: z.coerce.number().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().optional(),
  order: z.coerce.number().default(0),
});

export const couponSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters"),
  description: z.string().optional(),
  type: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
  value: z.coerce.number().positive("Value must be positive"),
  minOrderAmount: z.coerce.number().optional(),
  maxDiscount: z.coerce.number().optional(),
  usageLimit: z.coerce.number().optional(),
  startsAt: z.string().optional(),
  expiresAt: z.string().optional(),
});

export const reviewSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(10, "Review must be at least 10 characters"),
});

export const checkoutSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().optional(),
  zip: z.string().min(3),
  country: z.string().default("US"),
  phone: z.string().optional(),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

export const cmsSectionSchema = z.object({
  section: z.string(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  content: z.any().optional(),
  isActive: z.boolean().default(true),
});

export const heroBannerSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  image: z.string().optional(),
  mobileImage: z.string().optional(),
  order: z.coerce.number().default(0),
  bgColor: z.string().optional(),
});

export const settingsSchema = z.object({
  siteName: z.string().min(1),
  description: z.string().optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
  currency: z.string().default("USD"),
  announcementText: z.string().optional(),
  announcementEnabled: z.boolean().default(false),
  shippingInfo: z.string().optional(),
  returnPolicy: z.string().optional(),
  socialLinks: z.any().optional(),
  seoDefaults: z.any().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type CouponInput = z.infer<typeof couponSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CMSContentInput = z.infer<typeof cmsSectionSchema>;
export type HeroBannerInput = z.infer<typeof heroBannerSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
