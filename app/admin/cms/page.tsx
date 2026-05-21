import { db, cmsContents, heroBanners } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";
import { CMSEditor } from "@/components/admin/cms-editor";
import { asc } from "drizzle-orm";

export default async function AdminCMSPage() {
  await requireAdmin();

  let contents: any[] = [];
  let banners: any[] = [];
  try {
    contents = await db.select().from(cmsContents).orderBy(asc(cmsContents.section));
    banners = await db.select().from(heroBanners).orderBy(asc(heroBanners.order));
  } catch {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">CMS</h1>
        <p className="text-sm text-muted-foreground">
          Manage homepage content
        </p>
      </div>
      <CMSEditor contents={contents as any} banners={banners as any} />
    </div>
  );
}

export const runtime = 'edge';
