"use client";

import { useState, useEffect } from "react";
import { Star, ChevronDown, Loader2, CheckCircle2 } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  title: string;
  body: string;
  authorName: string;
  verified: boolean;
  helpful: number;
  createdAt: string;
}

interface ReviewData {
  aggregate: { average: number; count: number };
  distribution: { star: number; count: number }[];
  reviews: Review[];
}

export default function ReviewSection({ productId }: { productId: string }) {
  const [data, setData] = useState<ReviewData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success">("idle");

  // Form state
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [authorName, setAuthorName] = useState("");

  useEffect(() => {
    fetch(`/api/reviews?productId=${productId}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, [productId, formStatus]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormStatus("loading");
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, title, body, authorName }),
      });
      setFormStatus("success");
      setTitle("");
      setBody("");
      setAuthorName("");
    } catch {
      setFormStatus("idle");
    }
  }

  const avg = data?.aggregate.average ?? 0;
  const count = data?.aggregate.count ?? 0;
  const distribution = data?.distribution ?? [];
  const reviews = data?.reviews ?? [];
  const displayReviews = showAll ? reviews : reviews.slice(0, 3);

  return (
    <div className="mt-10">
      <h2 className="text-[18px] font-bold text-text-primary mb-5">
        Reviews {count > 0 && <span className="text-text-tertiary font-normal">({count})</span>}
      </h2>

      {/* Aggregate rating */}
      {count > 0 && (
        <div className="flex items-start gap-6 mb-6 p-4 bg-surface-sunken/50 rounded-xl">
          <div className="text-center">
            <p className="text-[36px] font-bold text-text-primary leading-none">{avg}</p>
            <div className="flex items-center gap-0.5 mt-1 justify-center">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${s <= Math.round(avg) ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
                />
              ))}
            </div>
            <p className="text-[11px] text-text-tertiary mt-1">{count} reviews</p>
          </div>
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const starCount = distribution.find((d) => d.star === star)?.count ?? 0;
              const pct = count > 0 ? (starCount / count) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-[11px] text-text-tertiary w-3">{star}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[10px] text-text-tertiary w-6 text-right">{starCount}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Review cards */}
      {displayReviews.length > 0 && (
        <div className="space-y-3 mb-4">
          {displayReviews.map((review) => (
            <div key={review.id} className="p-4 bg-surface rounded-xl border border-border">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3 h-3 ${s <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
                    />
                  ))}
                </div>
                <span className="text-[12px] font-semibold text-text-primary">{review.title}</span>
              </div>
              <p className="text-[12px] text-text-secondary leading-relaxed mb-2">{review.body}</p>
              <div className="flex items-center gap-3 text-[10px] text-text-tertiary">
                <span>{review.authorName}</span>
                {review.verified && (
                  <span className="flex items-center gap-0.5 text-success">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                )}
                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {reviews.length > 3 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="flex items-center gap-1 text-[12px] text-primary font-medium hover:underline mb-4"
        >
          Show all {reviews.length} reviews <ChevronDown className="w-3 h-3" />
        </button>
      )}

      {/* Write review */}
      {!showForm && formStatus !== "success" && (
        <button
          onClick={() => setShowForm(true)}
          className="text-[12px] font-medium text-primary hover:underline"
        >
          Write a review
        </button>
      )}

      {formStatus === "success" && (
        <p className="text-[12px] text-success font-medium">
          Thank you! Your review has been submitted for moderation.
        </p>
      )}

      {showForm && formStatus !== "success" && (
        <form onSubmit={handleSubmit} className="mt-4 p-4 bg-surface rounded-xl border border-border space-y-3">
          <p className="text-[13px] font-semibold text-text-primary">Write a Review</p>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                className="p-0.5"
              >
                <Star
                  className={`w-6 h-6 ${s <= rating ? "text-amber-400 fill-amber-400" : "text-gray-200"} hover:text-amber-300 transition-colors`}
                />
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Review title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-[13px] bg-surface-sunken border border-border rounded-lg outline-none focus:border-primary/30 text-text-primary"
          />
          <textarea
            placeholder="Your experience with this plan..."
            required
            minLength={10}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 text-[13px] bg-surface-sunken border border-border rounded-lg outline-none focus:border-primary/30 text-text-primary resize-none"
          />
          <input
            type="text"
            placeholder="Your name"
            required
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full px-3 py-2 text-[13px] bg-surface-sunken border border-border rounded-lg outline-none focus:border-primary/30 text-text-primary"
          />
          <button
            type="submit"
            disabled={formStatus === "loading"}
            className="px-5 py-2 text-[12px] font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {formStatus === "loading" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            Submit Review
          </button>
        </form>
      )}
    </div>
  );
}
