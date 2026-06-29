import { Suspense } from "react";
import { BookPageClient } from "@/components/booking/BookPageClient";
import { BookAnchorScroll } from "@/components/booking/BookAnchorScroll";
import { BookPageHeader } from "@/components/booking/BookPageHeader";
import { BookContactBar } from "@/components/booking/BookContactBar";
import { BookProcessStrip } from "@/components/booking/BookProcessStrip";
import { BookFitSection } from "@/components/booking/BookFitSection";
import { BookFaqSection } from "@/components/booking/BookFaqSection";

export function ServicesBookSection() {
  return (
    <section
      id="book"
      className="book-blueprint scroll-mt-24 border-t border-[var(--border)] bg-[var(--bg-elevated)]"
      aria-labelledby="book-section-title"
    >
      <Suspense fallback={null}>
        <BookAnchorScroll />
      </Suspense>

      <BookPageHeader />

      <div className="mx-auto max-w-7xl px-4 pb-20 md:pb-28 sm:px-6 lg:px-8">
        <BookContactBar />

        <div className="mx-auto mt-10 max-w-3xl">
          <div className="card-kot rounded-2xl p-8 md:p-10 lg:p-12">
            <Suspense
              fallback={
                <p className="py-16 text-center text-sm text-[var(--muted)]">
                  Loading intake form…
                </p>
              }
            >
              <BookPageClient />
            </Suspense>
          </div>
        </div>

        <BookProcessStrip />
        <BookFitSection />
        <BookFaqSection />
      </div>
    </section>
  );
}
