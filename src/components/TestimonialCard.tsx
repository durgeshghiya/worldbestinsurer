"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Data (clearly marked as illustrative)
// ---------------------------------------------------------------------------

interface Testimonial {
  name: string;
  city: string;
  rating: number;
  quote: string;
  category: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Rahul M.",
    city: "Mumbai",
    rating: 5,
    quote:
      "Comparing health insurance across 15+ insurers in one place saved me hours. Found a plan with better coverage at a lower premium.",
    category: "Health Insurance",
  },
  {
    name: "Priya S.",
    city: "Bangalore",
    rating: 5,
    quote:
      "The side-by-side comparison for term life plans was incredibly helpful. The detailed breakdowns made choosing straightforward.",
    category: "Term Life Insurance",
  },
  {
    name: "Amit K.",
    city: "Delhi",
    rating: 4,
    quote:
      "Renewed my car insurance through this platform. The transparent comparison and no hidden commissions gave me confidence.",
    category: "Motor Insurance",
  },
  {
    name: "Sarah L.",
    city: "Singapore",
    rating: 5,
    quote:
      "Planning travel insurance for a family trip became simple. The filter options helped narrow down exactly what we needed.",
    category: "Travel Insurance",
  },
  {
    name: "David R.",
    city: "Dubai",
    rating: 4,
    quote:
      "As an expat, finding the right health coverage was overwhelming. This platform made it easy to compare plans across insurers.",
    category: "Health Insurance",
  },
];

// ---------------------------------------------------------------------------
// Star rating component
// ---------------------------------------------------------------------------

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-3.5 h-3.5",
            i < rating
              ? "text-amber-400 fill-amber-400"
              : "text-border fill-transparent"
          )}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Single card
// ---------------------------------------------------------------------------

function TestimonialItem({ t }: { t: Testimonial }) {
  return (
    <div className="card-premium bg-surface rounded-2xl border border-border p-5 flex flex-col h-full">
      {/* Rating + category */}
      <div className="flex items-center justify-between mb-3">
        <StarRating rating={t.rating} />
        <span className="text-[10px] font-medium text-primary bg-primary-light px-2 py-0.5 rounded-full">
          {t.category}
        </span>
      </div>

      {/* Quote */}
      <p className="text-[13px] text-text-secondary leading-relaxed flex-1">
        &ldquo;{t.quote}&rdquo;
      </p>

      {/* Author */}
      <div className="mt-4 pt-3 border-t border-border flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white text-[12px] font-bold">
          {t.name.charAt(0)}
        </div>
        <div>
          <p className="text-[12px] font-semibold text-text-primary">
            {t.name}
          </p>
          <p className="text-[10px] text-text-tertiary">{t.city}</p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main section with carousel on mobile, grid on desktop
// ---------------------------------------------------------------------------

export default function TestimonialSection() {
  const [current, setCurrent] = useState(0);

  const prev = () =>
    setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () =>
    setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  return (
    <section className="py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-[22px] md:text-[28px] font-bold text-text-primary">
          What Our Users Say
        </h2>
        <p className="text-[13px] text-text-secondary mt-2 max-w-md mx-auto">
          Real feedback from people who used our platform to find the right
          insurance.
        </p>
      </div>

      {/* Desktop grid */}
      <div className="hidden md:grid md:grid-cols-3 gap-5 stagger-children">
        {testimonials.slice(0, 3).map((t) => (
          <TestimonialItem key={t.name} t={t} />
        ))}
      </div>
      <div className="hidden md:grid md:grid-cols-2 gap-5 mt-5 max-w-2xl mx-auto stagger-children">
        {testimonials.slice(3).map((t) => (
          <TestimonialItem key={t.name} t={t} />
        ))}
      </div>

      {/* Mobile carousel */}
      <div className="md:hidden">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {testimonials.map((t) => (
              <div key={t.name} className="w-full shrink-0 px-1">
                <TestimonialItem t={t} />
              </div>
            ))}
          </div>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center justify-center gap-4 mt-5">
          <button
            onClick={prev}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-text-tertiary hover:text-primary hover:border-primary/30 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-1.5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  i === current
                    ? "bg-primary w-5"
                    : "bg-border hover:bg-text-tertiary"
                )}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-text-tertiary hover:text-primary hover:border-primary/30 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 flex items-center justify-center gap-1.5 text-[10px] text-text-tertiary">
        <AlertCircle className="w-3 h-3" />
        Illustrative testimonials for demonstration purposes.
      </div>
    </section>
  );
}
