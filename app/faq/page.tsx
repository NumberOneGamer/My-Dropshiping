import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Kairo.",
};

const faqs = [
  {
    q: "How long does shipping take?",
    a: "Standard shipping takes 3-5 business days within the US. Express shipping is available for 1-2 business day delivery. International orders typically arrive within 7-14 business days.",
  },
  {
    q: "What is your return policy?",
    a: "We offer a 30-day no-questions-asked return policy. If you're not completely satisfied, simply return the item in its original condition for a full refund.",
  },
  {
    q: "How can I track my order?",
    a: "Once your order ships, you'll receive a tracking number via email. You can also track your order anytime by visiting your account dashboard.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, and Google Pay.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes, we ship to most countries worldwide. International shipping costs vary by destination and are calculated at checkout.",
  },
  {
    q: "How do I contact support?",
    a: "Our support team is available 24/7 via email at support@kairo.com. We typically respond within 2-4 hours.",
  },
];

export default function FaqPage() {
  return (
    <div className="py-20 sm:py-28">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">FAQ</h1>
        <div className="mt-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-sm font-medium">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}

export const runtime = "edge";
