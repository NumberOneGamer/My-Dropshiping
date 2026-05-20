import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Kairo - premium products, curated for you.",
};

export default function AboutPage() {
  return (
    <div className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">About Kairo</h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            Kairo was founded with a simple mission: deliver premium products that enhance
            modern living. We believe that quality should never be compromised, and that
            great design should be accessible to everyone.
          </p>
          <p>
            Every product in our catalog is carefully curated and tested to meet our
            exacting standards. From materials and craftsmanship to packaging and delivery,
            we obsess over every detail so you don&apos;t have to.
          </p>
          <p>
            We partner directly with manufacturers to ensure fair pricing, ethical
            production, and consistent quality. By cutting out middlemen, we pass the
            savings on to you.
          </p>
        </div>
      </div>
    </div>
  );
}

export const runtime = "edge";
