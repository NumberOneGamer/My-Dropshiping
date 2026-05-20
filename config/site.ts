export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Dropship",
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    "Premium products delivered to your door",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/images/og.jpg",
  links: {
    twitter: "https://twitter.com/dropship",
    instagram: "https://instagram.com/dropship",
    tiktok: "https://tiktok.com/@dropship",
  },
};

export type SiteConfig = typeof siteConfig;
