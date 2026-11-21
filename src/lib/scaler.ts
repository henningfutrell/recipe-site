/**
 * Batch-multiplier scaling. One batch is the recipe as written, so the scaler
 * works for every recipe, with or without a servings count.
 */

/** The amount that `+` and `-` add to or take from the multiplier. */
export const BATCH_STEP = 0.5;

/** Reads a typed multiplier. Returns undefined when it is not a positive number. */
export function parseMultiplier(text: string): number | undefined {
  const value = Number(text.trim().replace(/x$/i, ''));
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

/**
 * Moves the multiplier one step up or down. A value between steps goes to the
 * next step in that direction. The multiplier never goes to zero or below.
 */
export function stepMultiplier(multiplier: number, direction: 1 | -1): number {
  const steps = multiplier / BATCH_STEP;
  const nearest = Math.round(steps);
  const onStep = Math.abs(steps - nearest) < 1e-9;
  const next = direction === 1 ? (onStep ? nearest + 1 : Math.ceil(steps)) : onStep ? nearest - 1 : Math.floor(steps);
  return next > 0 ? next * BATCH_STEP : multiplier;
}

/** The servings that the multiplier makes, or undefined when the recipe has no servings count. */
export function scaledServings(servings: number | undefined, multiplier: number): number | undefined {
  return servings === undefined ? undefined : servings * multiplier;
}

/** Writes a multiplier for the input field: "1", "1.5", "0.33". */
export function formatMultiplier(multiplier: number): string {
  return String(Math.round(multiplier * 100) / 100);
}
