import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

interface RecipeCardProps {
  title: string;
  ingredients: string[];
  steps: string[];
  spiritPairings?: string[];
}

export function RecipeCard({
  title,
  ingredients,
  steps,
  spiritPairings,
}: RecipeCardProps) {
  return (
    <Card accent="yellow">
      <h3 className="font-[family-name:var(--font-display)] text-lg font-bold uppercase text-[var(--cream)]">
        {title}
      </h3>
      {spiritPairings && spiritPairings.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {spiritPairings.map((spirit) => (
            <Badge key={spirit} variant="yellow">
              {spirit}
            </Badge>
          ))}
        </div>
      )}
      <div className="mt-4 space-y-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--yellow)]">
            Ingredients
          </p>
          <ul className="mt-1 list-inside list-disc text-sm text-[var(--muted)]">
            {ingredients.map((ing) => (
              <li key={ing}>{ing}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--yellow)]">
            Steps
          </p>
          <ol className="mt-1 list-inside list-decimal text-sm text-[var(--muted)]">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </Card>
  );
}
