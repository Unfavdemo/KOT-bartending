"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TiltCard } from "@/components/motion/TiltCard";
import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    addItem(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <TiltCard tiltAmount={6}>
      <Card className="flex h-full flex-col overflow-hidden p-0">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-[family-name:var(--font-display)] text-lg font-bold uppercase text-[var(--cream)]">
            {product.name}
          </h3>
          <p className="mt-1 text-lg font-semibold text-[var(--orange)]">
            {formatPrice(product.priceInCents)}
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">{product.description}</p>
          <p className="mt-3 text-xs text-[var(--yellow)]">
            <span className="font-semibold">Pairs with:</span>{" "}
            {product.spiritPairings.join(", ")}
          </p>
          <motion.div
            className="mt-auto pt-6"
            whileTap={{ scale: 0.97 }}
          >
            <Button
              className="relative w-full overflow-hidden"
              onClick={handleAdd}
              disabled={justAdded}
            >
              {justAdded ? (
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2"
                >
                  <Check className="h-4 w-4" /> Added!
                </motion.span>
              ) : (
                "Add to Cart"
              )}
            </Button>
          </motion.div>
        </div>
      </Card>
    </TiltCard>
  );
}
