import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Kairo support.",
};

export default function ContactPage() {
  return (
    <div className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Contact Us</h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            Have a question or need help? Our support team is available 24/7.
          </p>
          <div className="space-y-4 rounded-lg border border-border/40 p-6">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Email</h2>
              <p className="mt-1">support@kairo.com</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Response Time</h2>
              <p className="mt-1">We typically respond within 2-4 hours during business hours.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const runtime = "edge";
