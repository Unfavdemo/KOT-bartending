"use client";

import Image from "next/image";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";

export function MiniCart() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } =
    useCartStore();
  const [checkingOut, setCheckingOut] = useState(false);

  async function handleCheckout() {
    if (items.length === 0) return;
    setCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setCheckingOut(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={closeCart}
            aria-hidden="true"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="safe-top fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-[var(--border)] bg-[var(--bg-elevated)] shadow-2xl"
            role="dialog"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[var(--orange)]" />
                <h2 className="font-[family-name:var(--font-display)] text-lg font-bold uppercase">
                  Your Cart
                </h2>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="touch-target rounded-lg text-[var(--muted)] hover:text-[var(--cream)]"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <p className="py-12 text-center text-sm text-[var(--muted)]">
                  Your cart is empty. Add some syrups!
                </p>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li
                      key={item.productId}
                      className="flex gap-4 border-b border-[var(--border)] pb-4"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--surface)]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <p className="text-sm font-semibold text-[var(--cream)]">
                          {item.name}
                        </p>
                        <p className="text-sm text-[var(--orange)]">
                          {formatPrice(item.priceInCents)}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            className="touch-target rounded border border-[var(--border)] hover:border-[var(--orange)]"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            className="touch-target rounded border border-[var(--border)] hover:border-[var(--orange)]"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId)}
                            className="ml-auto min-h-11 px-2 text-xs text-[var(--muted)] hover:text-red-400"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="safe-bottom border-t border-[var(--border)] px-6 py-4">
                <div className="mb-4 flex justify-between text-sm">
                  <span className="text-[var(--muted)]">Subtotal</span>
                  <span className="font-semibold text-[var(--cream)]">
                    {formatPrice(subtotal())}
                  </span>
                </div>
                <Button
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={checkingOut}
                >
                  {checkingOut ? "Redirecting..." : "Checkout"}
                </Button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
