"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function BookAnchorScroll() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const hasPath = searchParams.get("path") === "quote" || searchParams.get("path") === "call";
    const hasHash = window.location.hash === "#book";

    if (!hasPath && !hasHash) return;

    const timer = window.setTimeout(() => {
      document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    return () => window.clearTimeout(timer);
  }, [searchParams]);

  return null;
}
