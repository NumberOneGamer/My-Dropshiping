"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";

export function CMSEditor({
  contents,
  banners,
}: {
  contents: { id: string; section: string; title?: string; subtitle?: string; isActive: boolean }[];
  banners: { id: string; title: string; subtitle?: string; ctaText?: string; order: number; isActive: boolean }[];
}) {
  const [heroTitle, setHeroTitle] = useState(
    contents.find((c) => c.section === "hero")?.title || ""
  );
  const [heroSubtitle, setHeroSubtitle] = useState(
    contents.find((c) => c.section === "hero")?.subtitle || ""
  );

  const handleSave = async (section: string) => {
    const title = section === "hero" ? heroTitle : "";
    const subtitle = section === "hero" ? heroSubtitle : "";

    const res = await fetch("/api/cms", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, title, subtitle }),
    });

    if (res.ok) {
      toast.success(`${section} section saved`);
    } else {
      toast.error("Failed to save");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              placeholder="Hero title"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Subtitle</label>
            <Textarea
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              placeholder="Hero subtitle"
            />
          </div>
          <Button onClick={() => handleSave("hero")}>Save Hero</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hero Banners</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {banners.length === 0 ? (
            <p className="text-sm text-muted-foreground">No banners yet</p>
          ) : (
            banners.map((banner) => (
              <div
                key={banner.id}
                className="flex items-center justify-between rounded-lg border border-border/50 p-3"
              >
                <div>
                  <p className="text-sm font-medium">{banner.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Order: {banner.order}
                  </p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
