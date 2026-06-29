export interface Product {
  id: string;
  name: string;
  description: string;
  flavorProfile: string;
  spiritPairings: string[];
  priceInCents: number;
  image: string;
  stripePriceId: string;
}

export const products: Product[] = [
  {
    id: "lavender-honey",
    name: "Lavender Honey Syrup",
    description: "Floral and silky with a gentle honey finish.",
    flavorProfile: "Lavender, wildflower honey, subtle citrus",
    spiritPairings: ["Gin", "Vodka", "Champagne"],
    priceInCents: 1800,
    image: "/images/products/lavender-honey.svg",
    stripePriceId: process.env.STRIPE_PRICE_LAVENDER || "price_lavender_placeholder",
  },
  {
    id: "ginger-lime",
    name: "Ginger Lime Syrup",
    description: "Bright, spicy, and impossibly refreshing.",
    flavorProfile: "Fresh ginger, key lime, raw cane",
    spiritPairings: ["Rum", "Tequila", "Whiskey"],
    priceInCents: 1600,
    image: "/images/products/ginger-lime.svg",
    stripePriceId: process.env.STRIPE_PRICE_GINGER || "price_ginger_placeholder",
  },
  {
    id: "hibiscus-rose",
    name: "Hibiscus Rose Syrup",
    description: "Tart, romantic, and beautifully crimson.",
    flavorProfile: "Hibiscus, rose water, pomegranate",
    spiritPairings: ["Vodka", "Gin", "Prosecco"],
    priceInCents: 1800,
    image: "/images/products/hibiscus-rose.svg",
    stripePriceId: process.env.STRIPE_PRICE_HIBISCUS || "price_hibiscus_placeholder",
  },
  {
    id: "madagascar-vanilla",
    name: "Madagascar Vanilla Syrup",
    description: "Rich, warm, and endlessly versatile.",
    flavorProfile: "Madagascar vanilla bean, brown sugar",
    spiritPairings: ["Bourbon", "Rum", "Espresso Martinis"],
    priceInCents: 1700,
    image: "/images/products/madagascar-vanilla.svg",
    stripePriceId: process.env.STRIPE_PRICE_VANILLA || "price_vanilla_placeholder",
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
