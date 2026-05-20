import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Kairo terms of service.",
};

export default function TermsPage() {
  return (
    <div className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Terms of Service</h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            By using Kairo, you agree to these terms. We sell products online and
            reserve the right to update these terms at any time.
          </p>
          <p>
            All prices are listed in USD and are subject to change. We strive for
            accuracy but cannot guarantee that all product descriptions or images
            are error-free.
          </p>
          <p>
            We reserve the right to cancel any order if we suspect fraud or
            unauthorized activity.
          </p>
        </div>
      </div>
    </div>
  );
}

export const runtime = "edge";
