# Cloudflare Pages Deployment

This site is configured for deployment on Cloudflare Pages.

## Setup Instructions

1. **Connect Your Repository**
   - Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Go to Workers & Pages → Create application → Pages → Connect to Git
   - Select your GitHub repository

2. **Build Configuration**
   
   Set the following build settings in Cloudflare Pages:
   
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** Detected automatically from `.nvmrc` (22.23.4)

3. **Environment Variables**
   
   No environment variables are required for this static site.

4. **Deploy**
   
   Once configured, Cloudflare Pages will automatically deploy on every push to your main branch.

## Build Process

The build command `npm run build` does the following:
1. Runs `astro build` to generate the static site in the `dist` directory
2. Runs `npx pagefind --site dist` to build the search index

## Node Version

The site requires Node.js 22.23.4 or higher, as specified in:
- `.nvmrc` (for nvm users)
- `.node-version` (for Cloudflare Pages and other tools)
- `package.json` engines field

## Local Testing

To test the production build locally:

```bash
npm run build
npm run preview
```

This will serve the built site at http://localhost:4321
