import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  convertAmount,
  formatIngredient,
  formatQuantity,
  scaleIngredient,
  type Ingredient
} from './ingredients.ts';

test('formatQuantity writes whole numbers plainly', () => {
  assert.equal(formatQuantity(2), '2');
  assert.equal(formatQuantity(24), '24');
});

test('formatQuantity writes halves, thirds and quarters as fractions', () => {
  assert.equal(formatQuantity(0.5), '1/2');
  assert.equal(formatQuantity(1 / 3), '1/3');
  assert.equal(formatQuantity(2 / 3), '2/3');
  assert.equal(formatQuantity(0.25), '1/4');
  assert.equal(formatQuantity(0.75), '3/4');
  assert.equal(formatQuantity(0.125), '1/8');
});

test('formatQuantity writes mixed numbers', () => {
  assert.equal(formatQuantity(1.5), '1 1/2');
  assert.equal(formatQuantity(2.25), '2 1/4');
  assert.equal(formatQuantity(3 + 2 / 3), '3 2/3');
});

test('formatQuantity rounds to the nearest kitchen fraction', () => {
  assert.equal(formatQuantity(0.33), '1/3');
  assert.equal(formatQuantity(1.49), '1 1/2');
  assert.equal(formatQuantity(1.98), '2');
});

test('formatQuantity never rounds a small amount down to zero', () => {
  assert.equal(formatQuantity(0.03), '1/8');
});

test('scaleIngredient multiplies the quantity by the factor', () => {
  const flour: Ingredient = { quantity: 2.25, unit: 'cup', item: 'all-purpose flour' };
  assert.equal(scaleIngredient(flour, 2).quantity, 4.5);
  assert.equal(scaleIngredient(flour, 0.5).quantity, 1.125);
});

test('scaleIngredient does not change a fixed line', () => {
  const salt: Ingredient = { quantity: 1, unit: 'pinch', item: 'salt', fixed: true };
  assert.equal(scaleIngredient(salt, 3).quantity, 1);
});

test('scaleIngredient keeps a line with no quantity', () => {
  const rice: Ingredient = { item: 'Cooked rice or noodles' };
  assert.deepEqual(scaleIngredient(rice, 2), rice);
});

test('formatIngredient writes quantity, unit and item', () => {
  assert.equal(
    formatIngredient({ quantity: 2.25, unit: 'cup', item: 'all-purpose flour' }),
    '2 1/4 cups all-purpose flour'
  );
  assert.equal(
    formatIngredient({ quantity: 0.5, unit: 'teaspoon', item: 'salt' }),
    '1/2 teaspoon salt'
  );
});

test('formatIngredient uses the singular unit for one or less', () => {
  assert.equal(formatIngredient({ quantity: 1, unit: 'tablespoon', item: 'honey' }), '1 tablespoon honey');
  assert.equal(formatIngredient({ quantity: 2, unit: 'tablespoon', item: 'honey' }), '2 tablespoons honey');
  assert.equal(formatIngredient({ quantity: 3, unit: 'lb', item: 'chicken' }), '3 lbs chicken');
});

test('formatIngredient uses the plural item for counted items above one', () => {
  const egg: Ingredient = { quantity: 2, item: 'large egg', plural: 'large eggs' };
  assert.equal(formatIngredient(egg), '2 large eggs');
  assert.equal(formatIngredient(egg, 0.5), '1 large egg');
  assert.equal(formatIngredient(egg, 0.75), '1 1/2 large eggs');
});

test('formatIngredient scales by the factor', () => {
  assert.equal(
    formatIngredient({ quantity: 1.5, unit: 'lb', item: 'chicken breast' }, 2),
    '3 lbs chicken breast'
  );
  assert.equal(
    formatIngredient({ quantity: 0.25, unit: 'cup', item: 'soy sauce' }, 3),
    '3/4 cup soy sauce'
  );
});

test('formatIngredient keeps a fixed line at its written amount', () => {
  assert.equal(
    formatIngredient({ quantity: 1, unit: 'pinch', item: 'salt', fixed: true }, 3),
    '1 pinch salt'
  );
});

test('formatIngredient writes a line with no quantity as the item only', () => {
  assert.equal(formatIngredient({ item: 'Salt to taste', fixed: true }, 2), 'Salt to taste');
});

test('convertAmount changes US volume to metric', () => {
  assert.deepEqual(convertAmount(1, 'cup', 'metric'), { quantity: 240, unit: 'ml' });
  assert.deepEqual(convertAmount(1, 'lb', 'metric'), { quantity: 453.59, unit: 'g' });
});

test('convertAmount keeps units with no conversion', () => {
  assert.deepEqual(convertAmount(3, 'clove', 'metric'), { quantity: 3, unit: 'clove' });
  assert.deepEqual(convertAmount(2, undefined, 'metric'), { quantity: 2, unit: undefined });
  assert.deepEqual(convertAmount(2, 'cup', 'us'), { quantity: 2, unit: 'cup' });
});

test('convertAmount changes metric to US', () => {
  assert.deepEqual(convertAmount(240, 'ml', 'us'), { quantity: 1, unit: 'cup' });
  assert.deepEqual(convertAmount(15, 'ml', 'us'), { quantity: 1, unit: 'tablespoon' });
  assert.equal(formatIngredient({ quantity: 454, unit: 'g', item: 'chicken' }, 1, 'us'), '1 lb chicken');
  assert.equal(formatIngredient({ quantity: 1, unit: 'l', item: 'stock' }, 1, 'us'), '4 1/8 cups stock');
});

test('formatIngredient writes metric amounts as whole numbers', () => {
  assert.equal(
    formatIngredient({ quantity: 2.25, unit: 'cup', item: 'all-purpose flour' }, 1, 'metric'),
    '540 ml all-purpose flour'
  );
  assert.equal(
    formatIngredient({ quantity: 0.5, unit: 'teaspoon', item: 'salt' }, 1, 'metric'),
    '2.5 ml salt'
  );
});
