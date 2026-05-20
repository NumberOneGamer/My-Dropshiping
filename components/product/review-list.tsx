"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import toast from "react-hot-toast";

interface ReviewListProps {
  reviews: {
    id: string;
    rating: number;
    title: string | null;
    comment: string | null;
    createdAt: string;
    user: { name: string | null; image: string | null };
  }[];
  productId: string;
}

export function ReviewList({ reviews, productId }: ReviewListProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error("Please sign in to leave a review");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    setSubmitting(true);
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      });
      toast.success("Review submitted for approval!");
      setRating(0);
      setComment("");
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {reviews.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No reviews yet. Be the first!
        </p>
      )}

      {reviews.map((review) => (
        <div key={review.id} className="border-b border-border/30 pb-4 last:border-0">
          <div className="mb-2 flex items-center gap-3">
            <Avatar fallback={review.user.name || "U"} className="h-8 w-8 text-[10px]" />
            <div>
              <p className="text-sm font-medium">{review.user.name || "Anonymous"}</p>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < review.rating
                        ? "fill-foreground/70 text-foreground/70"
                        : "text-muted-foreground/20"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          {review.title && (
            <p className="mb-1 text-sm font-medium">{review.title}</p>
          )}
          {review.comment && (
            <p className="text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
          )}
        </div>
      ))}

      {session?.user && (
        <form onSubmit={handleSubmit} className="space-y-3 pt-4">
          <p className="text-sm font-medium">Write a Review</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
              >
                <Star
                  className={`h-5 w-5 transition-colors ${
                    star <= rating
                      ? "fill-foreground/70 text-foreground/70"
                      : "text-muted-foreground/30 hover:text-muted-foreground/50"
                  }`}
                />
              </button>
            ))}
          </div>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            rows={3}
          />
          <Button type="submit" disabled={submitting} size="sm">
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      )}
    </div>
  );
}
