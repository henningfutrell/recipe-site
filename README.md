# Recipe Site

A personal recipe website built with Astro, Tailwind CSS, and Pagefind, deployed on Cloudflare Pages.

## Features

- 📝 **Markdown-based recipes** with structured metadata
- 🔍 **Fast client-side search** powered by Pagefind
- 🎨 **Beautiful, responsive design** with Tailwind CSS
- 🖨️ **Print-friendly recipe pages** with schema.org JSON-LD
- 🏷️ **Categories and tags** for easy recipe organization
- ⚡ **Static site generation** for maximum performance

## Getting Started

### Prerequisites

- Node.js 22.23.4 or higher (see `.nvmrc`)
- npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd recipe-site
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The site will be available at http://localhost:4321

## Adding a Recipe

Recipes are stored as Markdown files in `src/content/recipes/`. Each recipe requires frontmatter with structured metadata.

### Recipe Template

Create a new `.md` file in `src/content/recipes/` with the following structure:

```markdown
---
title: Your Recipe Title
description: A brief description of the recipe
prepTime: 15
cookTime: 30
totalTime: 45
servings: 4
categories: [Category1, Category2]
tags: [tag1, tag2, tag3]
dateAdded: 2026-11-16T12:00:00Z
ingredients:
  - group: Main Ingredients
    items:
      - 2 cups flour
      - 1 cup sugar
  - group: Optional Toppings
    items:
      - Chocolate chips
      - Whipped cream
steps:
  - Preheat oven to 350°F.
  - Mix dry ingredients in a large bowl.
  - Add wet ingredients and stir until combined.
  - Bake for 30 minutes or until golden brown.
---

Additional notes or story about the recipe go here in the body.
This content appears at the bottom of the recipe page.
```

### Recipe Schema Fields

- **title** (string, required): Recipe name
- **description** (string, required): Brief description
- **prepTime** (number, required): Prep time in minutes
- **cookTime** (number, required): Cook time in minutes
- **totalTime** (number, required): Total time in minutes
- **servings** (number, required): Number of servings
- **categories** (array, required): List of categories (e.g., Breakfast, Dinner, Dessert)
- **tags** (array, required): List of tags for filtering
- **ingredients** (array, required): Grouped ingredients
  - **group** (string, optional): Group heading (leave empty `""` if no groups)
  - **items** (array): List of ingredient strings
- **steps** (array, required): Ordered list of instruction steps
- **image** (string, optional): Image filename (not yet implemented)
- **dateAdded** (date, required): ISO 8601 date when recipe was added

### Filename Convention

Use lowercase with hyphens for filenames: `your-recipe-title.md`

The filename becomes the URL slug: `/recipes/your-recipe-title`

## Building

Build the site for production:

```bash
npm run build
```

This command:
1. Runs `astro build` to generate static files in `dist/`
2. Runs `pagefind` to build the search index

Preview the production build locally:

```bash
npm run preview
```

## Deployment

### Cloudflare Pages

This site is configured for Cloudflare Pages deployment. See [CLOUDFLARE.md](./CLOUDFLARE.md) for detailed setup instructions.

**Quick setup:**

1. Push your code to GitHub
2. Connect your repository in Cloudflare Pages
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy!

The Node version is automatically detected from `.nvmrc`.

### Other Platforms

This is a standard static Astro site and can be deployed to any static hosting platform:

- **Netlify:** Build command `npm run build`, publish directory `dist`
- **Vercel:** Build command `npm run build`, output directory `dist`
- **GitHub Pages:** Use the Astro GitHub Pages adapter

## Project Structure

```
├── public/             # Static assets
├── src/
│   ├── content/
│   │   ├── config.ts   # Content collection schema
│   │   └── recipes/    # Recipe markdown files
│   ├── components/     # Reusable Astro components
│   ├── layouts/        # Page layouts
│   ├── pages/          # Route pages
│   │   ├── index.astro              # Home page
│   │   ├── recipes/
│   │   │   ├── index.astro          # Recipe listing with search
│   │   │   └── [slug].astro         # Individual recipe pages
│   │   ├── categories/[category].astro
│   │   ├── tags/[tag].astro
│   │   └── about.astro
│   └── styles/
│       └── global.css  # Global styles with Tailwind
├── .github/
│   └── workflows/
│       └── ci.yml      # GitHub Actions CI workflow
├── astro.config.mjs    # Astro configuration
├── package.json        # Dependencies and scripts
├── tailwind.config.js  # Tailwind configuration
└── tsconfig.json       # TypeScript configuration
```

## Content Collections

Recipes use Astro's Content Collections API with Zod schema validation. The schema is defined in `src/content/config.ts` and ensures all recipes have consistent, type-safe metadata.

## Search

Search is powered by [Pagefind](https://pagefind.app/), which provides:
- Fast, client-side full-text search
- Zero runtime dependencies
- Automatic indexing of all recipe content
- No external search service required

The search index is built during `npm run build` and served statically alongside your content.

## Continuous Integration

The GitHub Actions workflow (`.github/workflows/ci.yml`) automatically:
- Installs dependencies
- Builds the site
- Runs Pagefind indexing
- Verifies build output
- Uploads build artifacts

CI runs on every push and pull request to ensure the site builds successfully.

## Tech Stack

- **[Astro](https://astro.build)** - Static site framework
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS
- **[Pagefind](https://pagefind.app)** - Client-side search
- **[Cloudflare Pages](https://pages.cloudflare.com)** - Hosting

## License

Personal project - all rights reserved.
