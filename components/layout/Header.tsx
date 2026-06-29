"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/cart-store";
import { navLinks, siteConfig, bookHref } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { MiniCart } from "@/components/shop/MiniCart";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const openCart = useCartStore((s) => s.openCart);
  const [prevItems, setPrevItems] = useState(totalItems);
  const [badgePulse, setBadgePulse] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (totalItems > prevItems) {
      setBadgePulse(true);
      const t = setTimeout(() => setBadgePulse(false), 600);
      setPrevItems(totalItems);
      return () => clearTimeout(t);
    }
    setPrevItems(totalItems);
  }, [totalItems, prevItems]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b transition-all duration-300",
          scrolled
            ? "border-[var(--border)] bg-black/95 py-0 shadow-lg shadow-black/40 backdrop-blur-lg"
            : "border-transparent bg-black/70 backdrop-blur-md",
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300 sm:px-6 lg:px-8",
            scrolled ? "h-14" : "h-16",
          )}
        >
          <Link href="/" className="group flex items-center gap-2">
            <span className="font-[family-name:var(--font-display)] text-xl font-bold uppercase tracking-wider text-[var(--cream)] transition-colors group-hover:text-[var(--orange)]">
              {siteConfig.shortName}
            </span>
            <span className="hidden text-xs text-[var(--muted)] sm:inline">
              Bartending
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active ? "text-[var(--orange)]" : "text-[var(--muted)] hover:text-[var(--cream)]",
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-[var(--orange)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openCart}
              className="relative rounded-lg p-2 text-[var(--cream)] transition-colors hover:text-[var(--orange)]"
              aria-label={`Open cart, ${totalItems} items`}
            >
              <ShoppingBag className="h-5 w-5" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0 }}
                    animate={{ scale: badgePulse ? [1, 1.4, 1] : 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--orange)] text-[10px] font-bold text-black"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <Button href={bookHref} size="sm" className="hidden sm:inline-flex">
              Book Now
            </Button>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg p-2 text-[var(--cream)] md:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-[var(--border)] bg-black md:hidden"
              aria-label="Mobile navigation"
            >
              <div className="flex flex-col gap-1 px-4 py-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                        pathname === link.href
                          ? "bg-[var(--surface)] text-[var(--orange)]"
                          : "text-[var(--muted)] hover:text-[var(--cream)]",
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <Button
                  href={bookHref}
                  className="mt-2 w-full"
                  onClick={() => setMobileOpen(false)}
                >
                  Book Now
                </Button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
      <MiniCart />
    </>
  );
}
