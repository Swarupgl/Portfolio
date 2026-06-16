## Swarup G L — Portfolio

Dark-first, glassmorphism portfolio built with Next.js, Tailwind CSS, Framer Motion, and React Three Fiber.

## Getting Started

Install deps and run the dev server:

```bash
npm install
npm run dev
```

Open http://localhost:3000

Main page: `src/app/page.tsx`

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## How to Host (Step-by-Step)

### Initialize (if starting from scratch)

```bash
npx create-next-app@latest portfolio
```

### Install libraries

```bash
npm install framer-motion three @react-three/fiber @react-three/drei clsx tailwind-merge
```

### Deploy to Vercel (recommended)

1. Push the repo to GitHub.
2. Go to Vercel, import the GitHub repo.
3. Vercel detects Next.js automatically and deploys with HTTPS.

This repo also includes a GitHub Actions workflow at `.github/workflows/deploy.yml` that can deploy to Vercel if you set these GitHub repo secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### Deploy to GitHub Pages (optional static export)

GitHub Pages needs a static export. The workflow supports that too:

1. Set GitHub repo variable `DEPLOY_TARGET` to `pages`.
2. Set GitHub repo variable `NEXT_PUBLIC_BASE_PATH` to your repo name (example: `/portfolio`).
3. Enable Pages in your repo settings (deploy from GitHub Actions).

Note: GitHub Pages export mode disables Next.js image optimization (`next/image` runs unoptimized). For best LCP, prefer Vercel.

## Production build

```bash
npm run build
npm run start
```
