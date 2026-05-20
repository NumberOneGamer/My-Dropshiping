import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { ReviewList } from "@/components/product/review-list";

export default async function AdminReviewsPage() {
  await requireAdmin();
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, image: true } },
      product: { select: { name: true, slug: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
        <p className="text-sm text-muted-foreground">
          Moderation ({reviews.length} total)
        </p>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-xl border border-border/50 p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{review.user.name || "Anonymous"}</p>
                <p className="text-xs text-muted-foreground">
                  on {review.product.name}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{review.comment}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Rating: {review.rating}/5
              </span>
              {!review.isApproved && (
                <span className="text-xs text-yellow-600">Pending</span>
              )}
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-sm text-muted-foreground">No reviews yet</p>
        )}
      </div>
    </div>
  );
}
