import { db, siteSettings } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";
import { AdminSettings } from "@/components/admin/settings-form";

export default async function AdminSettingsPage() {
  await requireAdmin();

  let settings: any = null;
  try {
    const result = await db.select().from(siteSettings).limit(1);
    settings = result[0] ?? null;
  } catch {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Store configuration
        </p>
      </div>
      <AdminSettings settings={settings as any} />
    </div>
  );
}

export const runtime = 'edge';
