# 🖼️ Conversor de Imágenes Online

**Free Online Image Converter.** Convert between PNG, JPG, WebP, AVIF, BMP and ICO directly in the browser. Generate multi-resolution ICO favicons. Quality control for JPG and WebP. Resize with locked aspect ratio. No sign-up, no ads, 100% client-side.

🌐 **Demo en vivo / Live demo:** [miguelacm.es/tools/image-converter](https://miguelacm.es/tools/image-converter)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## ✨ Features

- **6 formatos / 6 formats:** PNG, JPG, WebP, AVIF, BMP, ICO
- **Favicon generator:** ICO with multiple sizes in one file (16, 32, 48, 64, 128, 256 px)
- **Control de calidad / Quality slider:** 1–100 for JPG (default 85) and WebP (default 80)
- **Redimensionado / Resize:** Width + Height inputs with lockable aspect ratio
- **Comparativa de peso / File size diff:** Shows % difference vs original — green if smaller, red if larger
- **Drag & drop:** Drop your image directly onto the upload zone
- **Sin servidor / Zero server:** Canvas API — images never leave your browser
- **AVIF moderno:** Best compression available — requires Chrome 94+ / Edge 94+
- **Embebible / Embeddable:** Use it as an iframe on any website
- **Open source:** MIT license, use it freely

---

## 🚀 Quick start

```bash
git clone https://github.com/m-a-c-m/ConversorImagenes.git
cd ConversorImagenes
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables (optional)

```env
NEXT_PUBLIC_SITE_URL=https://miguelacm.es/tools/image-converter
NEXT_PUBLIC_EMBED_URL=https://miguelacm.es/embed/image-converter
```

---

## 📦 Embed on your website

### Iframe (plug & play)

```html
<iframe
  src="https://miguelacm.es/embed/image-converter"
  width="100%"
  height="700"
  style="border:none;border-radius:12px;"
  title="Conversor de Imágenes — miguelacm.es"
  loading="lazy"
></iframe>
```

### Link with attribution (recommended for backlink)

```html
<a href="https://miguelacm.es/tools/image-converter" target="_blank" rel="noopener">
  Conversor de imágenes gratis por MACM
</a>
```

> 💡 The link option generates a real backlink that benefits the project. Recommended if your platform supports custom HTML.

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org) | 16 | React framework + SSG |
| [TypeScript](https://www.typescriptlang.org) | 5 | Type safety |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Styling |
| [react-icons](https://react-icons.github.io/react-icons/) | 5 | Icons |
| Canvas API | Native | Image processing (no external deps) |

---

## 📄 License

MIT © [Miguel Ángel Colorado Marin (MACM)](https://miguelacm.es)

Built with ❤️ by **[MACM](https://miguelacm.es)** — Full Stack Developer & Cybersecurity Specialist from Guadalajara, Spain.

- 🌐 Portfolio: [miguelacm.es](https://miguelacm.es)
- 💼 LinkedIn: [linkedin.com/in/macm](https://www.linkedin.com/in/macm/)
- 🐙 GitHub: [github.com/m-a-c-m](https://github.com/m-a-c-m)
