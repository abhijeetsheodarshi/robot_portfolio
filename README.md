# Theseus Robotics Website Clone

Exact replica of [theseus.bot](https://theseus.bot/) with high-fidelity visual design, interactive canvas glow & physics-based grid wave on tap, smooth cursor shadow tracking, and all subpages.

## Pages Included
- **`/` (Home)**: Hero section, capabilities, interactive ShelfGlow canvas, shiny shimmer button, backed by YC badge, footer.
- **`/preview` (Private Preview Request)**: Interactive store format chips, stores dropdown, country datalist, inquiry message, Web3Forms integration with real-time submitting/success/error states.
- **`/imprint` (Legal Imprint)**: Full commercial register information for Theseus Robotics Group AG.
- **`/privacy` (Privacy Policy)**: Zero-tracking & no-cookie policy, Swiss nDSG data controller details.
- **`/404` (Not Found)**: Retail-themed 404 with interactive animated vector maze canvas.

## Features
- **Tap Wave**: Physics-based expanding grid wave on tap/click that illuminates the shelf dot matrix.
- **ShelfGlow Engine**: Vanilla 2D canvas particle reticle and aura lighting following cursor with spring damping.
- **Cursor Shadow Tracking**: 3D shadow coordinates `--cursor-shadow-x` / `y` calculated relative to cursor position on headers and text.
- **Authentic Assets**: Exact Navigo font woff2 files, favicon, manifest, Open Graph images.

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 3. Build for production
```bash
npm run build
```
The output will be generated in `dist/` with static routing ready for deployment to any host (Vercel, Netlify, Cloudflare Pages, GitHub Pages, etc.).

### 4. Preview production build
```bash
npm run preview
```
