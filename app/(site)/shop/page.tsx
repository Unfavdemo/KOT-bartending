import { ShopGrid } from "@/components/shop/ShopGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { products } from "@/lib/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Simple Syrups",
  description:
    "Hand-crafted simple syrups by Kitty on Top Bartending. Lavender honey, ginger lime, hibiscus rose, and more.",
};

export default function ShopPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12">
          <SectionHeading
            eyebrow="The Shop"
            title="House-Made Simple Syrups"
            description="Hand-crafted in small batches with real ingredients. Elevate your home bar or gift the perfect pour."
          />
        </Reveal>

        <ShopGrid products={products} />
      </div>
    </div>
  );
}
