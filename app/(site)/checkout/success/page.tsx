"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/cart-store";

export default function CheckoutSuccessPage() {
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-20">
      <div className="card-kot max-w-md rounded-xl p-10 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--orange)]">
          Order Confirmed
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold uppercase text-[var(--cream)]">
          Thank You!
        </h1>
        <p className="mt-4 text-sm text-[var(--muted)]">
          Your syrup order is on its way. You&apos;ll receive a confirmation email
          shortly.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Button href="/shop">Continue Shopping</Button>
          <Link
            href="/"
            className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--orange)]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
