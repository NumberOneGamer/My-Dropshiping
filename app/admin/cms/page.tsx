import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { CMSEditor } from "@/components/admin/cms-editor";

export default async function AdminCMSPage() {
  await requireAdmin();
  const contents = await prisma.cMSContent.findMany({ orderBy: { section: "asc" } });
  const banners = await prisma.heroBanner.findMany({ orderBy: { order: "asc" } });

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
