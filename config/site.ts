export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "KAIRO",
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    "Premium products, curated for you",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/images/og.jpg",
  links: {
    twitter: "https://twitter.com/kairo",
    instagram: "https://instagram.com/kairo",
    tiktok: "https://tiktok.com/@kairo",
  },
};

export type SiteConfig = typeof siteConfig;
