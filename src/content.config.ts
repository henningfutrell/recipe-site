import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const recipes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/recipes' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    ingredients: z.array(
      z.object({
        group: z.string().optional(),
        items: z.array(z.string())
      })
    ),
    steps: z.array(z.string()),
    prepTime: z.number(),
    cookTime: z.number(),
    totalTime: z.number(),
    servings: z.number(),
    categories: z.array(z.string()),
    tags: z.array(z.string()),
    image: z.string().optional(),
    dateAdded: z.coerce.date()
  })
});

export const collections = {
  recipes
};
