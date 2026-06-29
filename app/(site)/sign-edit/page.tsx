import { LedBarSign } from "@/components/sections/LedBarSign";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Layout Editor",
  robots: { index: false, follow: false },
};

export default function SignEditPage() {
  return (
    <div className="min-h-[80vh] bg-black py-10">
      <div className="mx-auto max-w-2xl px-4">
        <p className="mb-1 text-center text-xs font-bold uppercase tracking-widest text-[var(--orange)]">
          Dev tool
        </p>
        <h1 className="text-center font-[family-name:var(--font-display)] text-2xl font-bold uppercase text-[var(--cream)]">
          LED Sign Layout Editor
        </h1>
        <p className="mx-auto mt-3 max-w-md text-center text-sm text-[var(--muted)]">
          Drag the orange box to move the bottle. Drag the yellow box to move the pour stream independently.
        </p>
        <div className="mt-8">
          <LedBarSign forceEdit />
        </div>
      </div>
    </div>
  );
}
