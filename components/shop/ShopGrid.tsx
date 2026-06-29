"use client";

import { ProductCard } from "@/components/shop/ProductCard";
import { StaggerReveal, StaggerItem } from "@/components/motion/Reveal";
import type { Product } from "@/lib/products";

interface ShopGridProps {
  products: Product[];
}

export function ShopGrid({ products }: ShopGridProps) {
  return (
    <StaggerReveal className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <StaggerItem key={product.id}>
          <ProductCard product={product} />
        </StaggerItem>
      ))}
    </StaggerReveal>
  );
}
