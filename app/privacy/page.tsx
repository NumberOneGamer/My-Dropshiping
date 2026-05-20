import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Kairo privacy policy.",
};

export default function PrivacyPage() {
  return (
    <div className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Privacy Policy</h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            We respect your privacy. We only collect information necessary to process
            your orders and improve your shopping experience. We never sell or share
            your personal data with third parties for marketing purposes.
          </p>
          <p>
            Your payment information is processed securely by Stripe. We never store
            full credit card numbers on our servers.
          </p>
          <p>
            By using our site, you agree to the collection and use of information in
            accordance with this policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export const runtime = "edge";
