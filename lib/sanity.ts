import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2024-01-01";

export const isSanityConfigured = Boolean(projectId);

export const sanityClient = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  useCdn: true,
});

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}

// GROQ queries
export const eventsQuery = `*[_type == "event"] | order(date asc) {
  _id, title, date, venue, externalLink, image
}`;

export const recipesQuery = `*[_type == "recipe"] | order(_createdAt desc) [0...6] {
  _id, title, ingredients, steps, spiritPairings, image
}`;

export const shoutOutsQuery = `*[_type == "shoutOut"] | order(_createdAt desc) [0...8] {
  _id, clientName, eventType, quote, image
}`;

export const menuOptionsQuery = `*[_type == "seasonalMenuOption"] | order(_createdAt asc) {
  _id, name, description, image
}`;

// Fallback seed data when Sanity is not configured
export const fallbackEvents = [
  {
    _id: "evt-1",
    title: "Summer Sip & Shake",
    date: "2026-07-15",
    venue: "Glenside Farmers Market",
    externalLink: null,
    image: null,
  },
  {
    _id: "evt-2",
    title: "Cocktail Class: Classics Reimagined",
    date: "2026-08-02",
    venue: "KOT Studio, Glenside PA",
    externalLink: null,
    image: null,
  },
];

export const fallbackRecipes = [
  {
    _id: "rec-1",
    title: "Citrus Grove Spritz",
    ingredients: ["2oz gin", "1oz hibiscus rose syrup", "3oz prosecco", "Orange peel"],
    steps: ["Build over ice", "Top with prosecco", "Express orange peel"],
    spiritPairings: ["Gin", "Prosecco"],
    image: null,
  },
  {
    _id: "rec-2",
    title: "Golden Hour Mule",
    ingredients: ["2oz vodka", "0.75oz ginger lime syrup", "4oz ginger beer", "Lime wedge"],
    steps: ["Muddle lime in copper mug", "Add vodka and syrup", "Top with ginger beer"],
    spiritPairings: ["Vodka"],
    image: null,
  },
];

export const fallbackShoutOuts = [
  {
    _id: "so-1",
    clientName: "Sarah M.",
    eventType: "Engagement Party",
    quote: "The bartenders made our night unforgettable — every detail was perfect!",
    image: null,
  },
];

export const fallbackMenuOptions = [
  { _id: "menu-1", name: "Spiced Pear Old Fashioned", description: "Warm autumn spices meet bourbon elegance.", image: null },
  { _id: "menu-2", name: "Cranberry Rosemary Fizz", description: "Festive, bright, and herbaceous.", image: null },
  { _id: "menu-3", name: "Maple Bourbon Sour", description: "Rich maple with a citrus snap.", image: null },
];
