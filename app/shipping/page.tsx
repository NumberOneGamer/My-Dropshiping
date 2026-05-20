import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Info",
  description: "Kairo shipping policies and delivery information.",
};

export default function ShippingPage() {
  return (
    <div className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Shipping Information</h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <div>
            <h2 className="mb-2 text-sm font-semibold text-foreground">Shipping Rates</h2>
            <p>Free standard shipping on all orders over $50. Orders under $50 ship for a flat rate of $9.99.</p>
          </div>
          <div>
            <h2 className="mb-2 text-sm font-semibold text-foreground">Delivery Times</h2>
            <p>Standard: 3-5 business days (US). Express: 1-2 business days. International: 7-14 business days.</p>
          </div>
          <div>
            <h2 className="mb-2 text-sm font-semibold text-foreground">Tracking</h2>
            <p>You will receive a tracking number via email once your order ships.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export const runtime = "edge";
