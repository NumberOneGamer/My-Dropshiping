import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns",
  description: "Kairo return policy and instructions.",
};

export default function ReturnsPage() {
  return (
    <div className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Returns &amp; Exchanges</h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <div>
            <h2 className="mb-2 text-sm font-semibold text-foreground">30-Day Return Policy</h2>
            <p>If you&apos;re not completely satisfied, return within 30 days for a full refund. Items must be in original condition.</p>
          </div>
          <div>
            <h2 className="mb-2 text-sm font-semibold text-foreground">How to Return</h2>
            <p>Contact our support team at support@kairo.com to initiate a return. We&apos;ll provide a prepaid return label.</p>
          </div>
          <div>
            <h2 className="mb-2 text-sm font-semibold text-foreground">Refunds</h2>
            <p>Refunds are processed within 5-7 business days after we receive your return.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export const runtime = "edge";
