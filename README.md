# 🖼️ Conversor de Imágenes Online

**Free online image converter** · Convert PNG, JPG, WebP, AVIF, BMP and ICO in the browser, with no server and no sign-up.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**Demo:** [miguelacm.es/tools/image-converter](https://miguelacm.es/tools/image-converter)

---

## ✨ Features

| Format | Notes |
|--------|-------|
| **PNG** | Lossless, transparency support |
| **JPG** | Quality slider 1–100 (default 85) |
| **WebP** | Quality slider 1–100 (default 80), up to 30% smaller than JPG |
| **AVIF** | Best compression — Chrome 94+ / Edge 94+ required |
| **BMP** | Maximum compatibility |
| **ICO** | Multi-resolution favicon (16, 32, 48, 64, 128, 256 px in one file) |

- **Drag & drop** upload
- **Resize** with locked aspect ratio
- **File size comparison** — shows % difference vs original (green = smaller)
- **100% client-side** via Canvas API — images never leave the browser
- **Embeddable** via iframe

---

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Embed

```html
<iframe
  src="https://miguelacm.es/embed/image-converter"
  width="100%"
  height="700"
  frameborder="0"
  title="Image Converter"
></iframe>
```

---

## Tech stack

| Technology | Version |
|-----------|---------|
| Next.js | 16.1.6 |
| React | 19 |
| TypeScript | 5 |
| Tailwind CSS | v4 |
| Canvas API | Native |

No external image-processing dependencies — everything is built with the browser's native Canvas API.

---

## License

MIT © [Miguel Ángel Colorado Marin](https://miguelacm.es)
