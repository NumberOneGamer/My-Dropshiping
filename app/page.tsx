import { HeroSection } from "@/components/home/hero-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { BenefitsGrid } from "@/components/home/benefits-grid";
import { Testimonials } from "@/components/home/testimonials";
import { ComparisonSection } from "@/components/home/comparison-section";
import { FaqSection } from "@/components/home/faq-section";
import { EmailCapture } from "@/components/home/email-capture";
import { StickyCta } from "@/components/shared/sticky-cta";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <BenefitsGrid />
      <Testimonials />
      <ComparisonSection />
      <FaqSection />
      <EmailCapture />
      <StickyCta />
    </>
  );
}
