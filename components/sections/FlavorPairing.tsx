"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { getCocktailRecipe } from "@/lib/cocktail-pairings";
import { products } from "@/lib/products";
import { useCartStore } from "@/lib/cart-store";

const spirits = ["Gin", "Vodka", "Rum", "Tequila", "Whiskey", "Bourbon", "Prosecco"];

export function FlavorPairing() {
  const [spirit, setSpirit] = useState<string | null>(null);
  const [syrupId, setSyrupId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const recipe = useMemo(() => {
    if (!spirit || !syrupId) return null;
    return getCocktailRecipe(spirit, syrupId);
  }, [spirit, syrupId]);

  const selectedSyrup = products.find((p) => p.id === syrupId);

  function copyRecipe() {
    if (!recipe) return;
    const text = `${recipe.name}\n\n${recipe.ingredients.join("\n")}\n\n${recipe.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="border-y border-[var(--border)] bg-[var(--bg-elevated)] py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--orange)]">Interactive</p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold uppercase text-[var(--cream)] md:text-4xl">
            Build Your Pour
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--muted)]">
            Pick a spirit and syrup — get a full recipe card with ratios, ingredients, and steps.
          </p>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal delay={0.1}>
            <div className="card-kot rounded-xl p-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--yellow)]">
                Step 1 — Spirit
              </p>
              <div className="flex flex-wrap gap-2">
                {spirits.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpirit(s)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      spirit === s
                        ? "scale-105 border-[var(--orange)] bg-[var(--orange)] text-black"
                        : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--border-orange)] hover:text-[var(--cream)]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <p className="mb-3 mt-8 text-xs font-bold uppercase tracking-wider text-[var(--yellow)]">
                Step 2 — Syrup
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {products.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSyrupId(p.id)}
                    className={`rounded-lg border p-3 text-left transition-all duration-200 ${
                      syrupId === p.id
                        ? "scale-[1.02] border-[var(--yellow)] bg-[var(--yellow)]/10"
                        : "border-[var(--border)] hover:border-[var(--border-yellow)]"
                    }`}
                  >
                    <span className="text-sm font-semibold text-[var(--cream)]">{p.name}</span>
                    <span className="mt-0.5 block text-xs text-[var(--muted)]">{p.flavorProfile}</span>
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="card-kot relative min-h-[280px] overflow-hidden rounded-xl p-5 sm:min-h-[360px] sm:p-8">
              <div className="absolute inset-0 mesh-citrus opacity-50" />
              <AnimatePresence mode="wait">
                {recipe ? (
                  <motion.div
                    key={recipe.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35 }}
                    className="relative z-10"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Sparkles className="mb-2 h-6 w-6 text-[var(--yellow)]" />
                        <p className="text-xs font-bold uppercase tracking-wider text-[var(--orange)]">
                          Your Recipe Card
                        </p>
                        <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold uppercase text-gradient-citrus">
                          {recipe.name}
                        </h3>
                        <p className="mt-1 text-xs text-[var(--muted)]">
                          {spirit} · {selectedSyrup?.name} · Ratio {recipe.ratio}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={copyRecipe}
                        className="touch-target shrink-0 rounded-lg border border-[var(--border)] text-[var(--muted)] transition-colors hover:border-[var(--orange)] hover:text-[var(--orange)]"
                        aria-label="Copy recipe"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>

                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[var(--yellow)]">
                          Ingredients
                        </p>
                        <ul className="mt-2 space-y-1">
                          {recipe.ingredients.map((ing) => (
                            <li key={ing} className="text-sm text-[var(--cream)]">
                              · {ing}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[var(--yellow)]">
                          Method
                        </p>
                        <ol className="mt-2 space-y-1">
                          {recipe.steps.map((step, i) => (
                            <li key={step} className="text-sm text-[var(--muted)]">
                              {i + 1}. {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    {recipe.garnish && (
                      <p className="mt-4 text-xs text-[var(--orange)]">
                        Garnish: {recipe.garnish}
                      </p>
                    )}

                    {selectedSyrup && (
                      <div className="mt-6 flex flex-wrap gap-3">
                        <Button
                          size="sm"
                          onClick={() => addItem(selectedSyrup)}
                        >
                          Add Syrup to Cart
                        </Button>
                        <Button href="/shop" variant="outline" size="sm">
                          View Shop
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative z-10 flex h-full min-h-[320px] flex-col items-center justify-center text-center"
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-[var(--border)] text-2xl">
                      🍸
                    </div>
                    <p className="text-sm text-[var(--muted)]">
                      Select a spirit and syrup to reveal your full recipe card
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
