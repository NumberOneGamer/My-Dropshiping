"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";

export function AdminSettings({ settings }: { settings: any }) {
  const [form, setForm] = useState({
    siteName: settings?.siteName || "Dropship",
    description: settings?.description || "",
    announcementText: settings?.announcementText || "",
    announcementEnabled: settings?.announcementEnabled || false,
    shippingInfo: settings?.shippingInfo || "",
    returnPolicy: settings?.returnPolicy || "",
  });

  const handleSave = async () => {
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success("Settings saved");
    } else {
      toast.error("Failed to save settings");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Site Name</label>
            <Input
              value={form.siteName}
              onChange={(e) => setForm({ ...form, siteName: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Announcement Bar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.announcementEnabled}
              onChange={(e) =>
                setForm({ ...form, announcementEnabled: e.target.checked })
              }
              id="announcement-enabled"
            />
            <label htmlFor="announcement-enabled" className="text-sm">
              Enable announcement bar
            </label>
          </div>
          <Input
            value={form.announcementText}
            onChange={(e) => setForm({ ...form, announcementText: e.target.value })}
            placeholder="Free shipping on orders over $50"
          />
        </CardContent>
      </Card>

      <Button onClick={handleSave} size="lg">
        Save Settings
      </Button>
    </div>
  );
}
