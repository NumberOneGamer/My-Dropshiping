import { db, reviews as reviewsTable, users, products } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";
import { ReviewList } from "@/components/product/review-list";
import { desc, inArray } from "drizzle-orm";

export default async function AdminReviewsPage() {
  await requireAdmin();

  let reviews: any[] = [];
  try {
    const reviewsData = await db.select().from(reviewsTable).orderBy(desc(reviewsTable.createdAt));

    const userIds = [...new Set(reviewsData.map(r => r.userId))];
    const productIds = [...new Set(reviewsData.map(r => r.productId))];

    const usersData = await db.select({ id: users.id, name: users.name, image: users.image })
      .from(users).where(inArray(users.id, userIds));
    const productsData = await db.select({ id: products.id, name: products.name, slug: products.slug })
      .from(products).where(inArray(products.id, productIds));

    const userMap = new Map(usersData.map(u => [u.id, u]));
    const productMap = new Map(productsData.map(p => [p.id, p]));

    reviews = reviewsData.map(r => ({
      ...r,
      user: userMap.get(r.userId) ?? { name: "Anonymous", image: null },
      product: productMap.get(r.productId) ?? { name: "Unknown", slug: "" },
    }));
  } catch {}

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

export const runtime = 'edge';
