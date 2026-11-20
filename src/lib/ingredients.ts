/**
 * One ingredient line of a recipe, as written in its frontmatter.
 *
 * `item` is the name and any notes, in the form used for a quantity of one or less.
 * `plural` is the form used for a quantity above one, for counted items ("large eggs").
 * `fixed` marks an amount that does not change with servings (a pinch, "to taste").
 */
export interface Ingredient {
  quantity?: number;
  unit?: string;
  item: string;
  plural?: string;
  fixed?: boolean;
}

export type UnitSystem = 'us' | 'metric';

const FRACTIONS: Array<[number, string]> = [
  [0, ''],
  [1 / 8, '1/8'],
  [1 / 4, '1/4'],
  [1 / 3, '1/3'],
  [3 / 8, '3/8'],
  [1 / 2, '1/2'],
  [5 / 8, '5/8'],
  [2 / 3, '2/3'],
  [3 / 4, '3/4'],
  [7 / 8, '7/8'],
  [1, '']
];

/** Rounds to the nearest kitchen fraction (eighths or thirds). */
function roundToKitchenFraction(value: number): { whole: number; fraction: string; value: number } {
  let whole = Math.floor(value);
  const rest = value - whole;
  let best = FRACTIONS[0];
  for (const candidate of FRACTIONS) {
    if (Math.abs(candidate[0] - rest) < Math.abs(best[0] - rest)) best = candidate;
  }
  if (best[0] === 1) {
    whole += 1;
    best = FRACTIONS[0];
  }
  if (whole === 0 && best[0] === 0 && value > 0) best = FRACTIONS[1];
  return { whole, fraction: best[1], value: whole + best[0] };
}

/** Writes an amount in the usual cooking style: "1 1/2", not "1.5". */
export function formatQuantity(value: number): string {
  const { whole, fraction } = roundToKitchenFraction(value);
  if (whole === 0) return fraction || '0';
  return fraction ? `${whole} ${fraction}` : `${whole}`;
}

function formatMetric(value: number): string {
  const rounded = value < 10 ? Math.round(value * 2) / 2 : Math.round(value);
  return String(rounded);
}

const UNIT_PLURALS: Record<string, string> = {
  cup: 'cups',
  tablespoon: 'tablespoons',
  teaspoon: 'teaspoons',
  lb: 'lbs',
  clove: 'cloves',
  pinch: 'pinches',
  stick: 'sticks'
};

const METRIC_UNITS = new Set(['ml', 'l', 'g', 'kg']);

/** Metric size of one US unit: millilitres for volume, grams for weight. */
const US_TO_METRIC: Record<string, { factor: number; unit: 'ml' | 'g' }> = {
  cup: { factor: 240, unit: 'ml' },
  tablespoon: { factor: 15, unit: 'ml' },
  teaspoon: { factor: 5, unit: 'ml' },
  lb: { factor: 453.59, unit: 'g' },
  oz: { factor: 28.35, unit: 'g' }
};

const METRIC_BASE: Record<string, { factor: number; unit: 'ml' | 'g' }> = {
  ml: { factor: 1, unit: 'ml' },
  l: { factor: 1000, unit: 'ml' },
  g: { factor: 1, unit: 'g' },
  kg: { factor: 1000, unit: 'g' }
};

/**
 * Converts an amount to the given unit system. Units with no conversion
 * (cloves, counted items) and amounts already in that system stay as they are.
 */
export function convertAmount(
  quantity: number,
  unit: string | undefined,
  system: UnitSystem
): { quantity: number; unit: string | undefined } {
  if (unit === undefined) return { quantity, unit };
  if (system === 'metric') {
    const to = US_TO_METRIC[unit];
    return to ? { quantity: Math.round(quantity * to.factor * 100) / 100, unit: to.unit } : { quantity, unit };
  }
  const base = METRIC_BASE[unit];
  if (!base) return { quantity, unit };
  const amount = quantity * base.factor;
  if (base.unit === 'ml') {
    if (amount >= 60) return { quantity: amount / 240, unit: 'cup' };
    if (amount >= 15) return { quantity: amount / 15, unit: 'tablespoon' };
    return { quantity: amount / 5, unit: 'teaspoon' };
  }
  if (amount >= 227) return { quantity: amount / 453.59, unit: 'lb' };
  return { quantity: amount / 28.35, unit: 'oz' };
}

/** Returns the ingredient with its quantity multiplied by the factor, unless it is fixed. */
export function scaleIngredient(ingredient: Ingredient, factor: number): Ingredient {
  if (ingredient.fixed || ingredient.quantity === undefined) return ingredient;
  return { ...ingredient, quantity: ingredient.quantity * factor };
}

/**
 * Writes one ingredient line, scaled by the factor. With a unit system, it converts
 * the amount to that system first; with none, it keeps the units the recipe uses.
 */
export function formatIngredient(ingredient: Ingredient, factor = 1, system?: UnitSystem): string {
  const scaled = scaleIngredient(ingredient, factor);
  if (scaled.quantity === undefined) return scaled.item;

  const { quantity, unit } = system
    ? convertAmount(scaled.quantity, scaled.unit, system)
    : { quantity: scaled.quantity, unit: scaled.unit };

  let amount: string;
  let many: boolean;
  if (unit !== undefined && METRIC_UNITS.has(unit)) {
    amount = formatMetric(quantity);
    many = Number(amount) > 1;
  } else {
    const rounded = roundToKitchenFraction(quantity);
    amount = formatQuantity(quantity);
    many = rounded.value > 1;
  }

  const unitText = unit === undefined ? '' : many ? (UNIT_PLURALS[unit] ?? unit) : unit;
  const item = many && scaled.plural ? scaled.plural : scaled.item;
  return [amount, unitText, item].filter(Boolean).join(' ');
}

/** Writes a servings count: whole numbers plainly, other values as kitchen fractions. */
export function formatServings(servings: number): string {
  return formatQuantity(servings);
}
