import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatIngredient, type Ingredient } from './ingredients.ts';
import { formatMultiplier, parseMultiplier, scaledServings, stepMultiplier } from './scaler.ts';

test('parseMultiplier reads a typed multiplier', () => {
  assert.equal(parseMultiplier('2'), 2);
  assert.equal(parseMultiplier('1.5'), 1.5);
  assert.equal(parseMultiplier(' 3x '), 3);
});

test('parseMultiplier refuses zero, negative and non-numeric values', () => {
  assert.equal(parseMultiplier('0'), undefined);
  assert.equal(parseMultiplier('-1'), undefined);
  assert.equal(parseMultiplier('abc'), undefined);
  assert.equal(parseMultiplier(''), undefined);
});

test('stepMultiplier moves one half batch at a time', () => {
  assert.equal(stepMultiplier(1, 1), 1.5);
  assert.equal(stepMultiplier(1, -1), 0.5);
  assert.equal(stepMultiplier(2, 1), 2.5);
});

test('stepMultiplier never goes to zero', () => {
  assert.equal(stepMultiplier(0.5, -1), 0.5);
  assert.equal(stepMultiplier(0.25, -1), 0.25);
});

test('stepMultiplier moves a typed value to the next step', () => {
  assert.equal(stepMultiplier(1.2, 1), 1.5);
  assert.equal(stepMultiplier(1.2, -1), 1);
});

test('scaledServings multiplies a servings count', () => {
  assert.equal(scaledServings(4, 1), 4);
  assert.equal(scaledServings(4, 2), 8);
  assert.equal(scaledServings(4, 0.5), 2);
});

test('scaledServings gives no servings for a recipe with no servings count', () => {
  assert.equal(scaledServings(undefined, 1), undefined);
  assert.equal(scaledServings(undefined, 3), undefined);
});

test('formatMultiplier writes the multiplier for the input field', () => {
  assert.equal(formatMultiplier(1), '1');
  assert.equal(formatMultiplier(1.5), '1.5');
  assert.equal(formatMultiplier(1 / 3), '0.33');
});

test('a recipe with no servings count scales by the batch multiplier', () => {
  const wings: Ingredient = { quantity: 2.5, unit: 'lb', item: 'chicken wings' };
  const salt: Ingredient = { item: 'salt, to taste', fixed: true };
  assert.equal(formatIngredient(wings, 1), '2 1/2 lbs chicken wings');
  assert.equal(formatIngredient(wings, 2), '5 lbs chicken wings');
  assert.equal(formatIngredient(wings, 0.5), '1 1/4 lbs chicken wings');
  assert.equal(formatIngredient(salt, 3), 'salt, to taste');
});
