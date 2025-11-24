# YouTube Production Agent

Design Arena&apos;s autonomous assistant for strategizing, scripting, and packaging high-performing YouTube uploads.

## ✨ What It Does

- Maps niche trends, audience pain points, and competitor insights for the supplied topic.
- Generates a structured outline, full voiceover script, and visual direction tuned to the desired tone and runtime.
- Produces SEO-ready metadata (title, description, tags, chapters, hashtags).
- Assembles production checklists, asset requests, and timelines for the creative team.
- Crafts upload-ready collateral plus launch and amplification recommendations.

All output is deterministic — rerunning the same brief yields consistent blueprints for rapid iteration inside your workflow.

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` and feed the agent your topic, target audience, tone, keywords, and desired runtime.

## 📁 Notable Files

- `app/page.tsx` — Main interface housing the brief form and generated campaign output.
- `lib/generators.ts` — Deterministic generation logic for research intel, outlines, scripts, and metadata.
- `lib/data.ts` — Category heuristics used to adapt recommendations across niches.
- `app/globals.css` — Cinematic UI styling.

## 🧪 Scripts

- `npm run dev` — Launches the local development server.
- `npm run build` — Builds the production bundle.
- `npm run start` — Serves the production build.
- `npm run lint` — Runs Next.js ESLint rules.

## 📦 Deployment

Ready for instant Vercel deployment (`next build` compatible) and tuned for marketing & creative operations teams at Design Arena.
