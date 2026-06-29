import { AboutPageContent } from "@/components/sections/AboutPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Experienced bartenders, innovative cocktails, better events. Meet Kitty on Top Bartending — mobile bar services, cocktail classes, and certified hospitality across Greater Philadelphia.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
