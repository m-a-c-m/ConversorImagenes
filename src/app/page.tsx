import type { Metadata } from "next";
import ImageConverter from "@/components/ImageConverter";
import { MdImage } from "react-icons/md";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://miguelacm.es/tools/image-converter";
const EMBED_URL =
  process.env.NEXT_PUBLIC_EMBED_URL || "https://miguelacm.es/embed/image-converter";

export const metadata: Metadata = {
  title: "Conversor de Imágenes Gratis Online",
  description:
    "Convierte imágenes entre PNG, JPG, WebP, AVIF, BMP e ICO al instante. Genera favicons con múltiples resoluciones. Sin registro, gratis.",
  alternates: {
    canonical: SITE_URL,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Conversor de Imágenes Gratis Online",
  url: SITE_URL,
  description:
    "Convierte imágenes entre PNG, JPG, WebP, AVIF, BMP e ICO. Genera favicons ICO con múltiples resoluciones. Sin registro, 100% en el navegador.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Web",
  inLanguage: "es-ES",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  author: {
    "@type": "Person",
    name: "Miguel Ángel Colorado Marin",
    url: "https://miguelacm.es",
  },
  featureList: [
    "Conversión entre PNG, JPG, WebP, AVIF y BMP",
    "Generador de favicon ICO con múltiples tamaños (16, 32, 48, 64, 128, 256 px)",
    "Control de calidad para JPG y WebP (slider 1-100)",
    "Redimensionado con ratio de aspecto bloqueado",
    "100% client-side — sin servidores",
    "Sin registro",
    "Código abierto",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <MdImage className="text-base" />
              Herramienta gratuita · Código abierto
            </div>
            <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">
              Conversor de Imágenes
            </h1>
            <p className="mb-2 text-lg text-text-muted">
              Convierte entre PNG, JPG, WebP, AVIF, BMP e ICO. Genera favicons. Sin registro, sin servidor.
            </p>
            <p className="text-sm text-text-muted/60">
              Hecho por{" "}
              <a
                href="https://miguelacm.es"
                target="_blank"
                rel="noopener noreferrer"
                className="gradient-text font-medium hover:opacity-80 transition-opacity"
              >
                MACM
              </a>{" "}
              · Sin registro · Sin anuncios · 100% en el navegador
            </p>
          </div>

          {/* Tool */}
          <div className="glass rounded-2xl border border-border/20 p-6 md:p-8">
            <ImageConverter />
          </div>

          {/* How to use */}
          <div className="mt-12 glass rounded-2xl border border-border/20 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">
              ¿Cómo usar el conversor de imágenes?
            </h2>
            <ol className="space-y-5">
              {[
                {
                  n: "1",
                  t: "Sube tu imagen",
                  d: "Arrastra y suelta cualquier imagen sobre la zona de carga, o haz clic para abrir el explorador de archivos. Se aceptan PNG, JPG, WebP, AVIF, BMP y GIF. La imagen nunca sale de tu navegador.",
                },
                {
                  n: "2",
                  t: "Elige el formato de salida",
                  d: "Selecciona el formato al que quieres convertir: PNG para fondos transparentes, JPG para fotos, WebP o AVIF para máxima compresión en la web, BMP para compatibilidad máxima, o ICO para generar favicons para tu sitio.",
                },
                {
                  n: "3",
                  t: "Ajusta las opciones",
                  d: "Para JPG y WebP controla la calidad con el slider (1-100). Para ICO elige los tamaños que incluirá el archivo: 16, 32, 48, 64, 128 o 256 px. También puedes redimensionar la imagen manteniendo la proporción bloqueada.",
                },
                {
                  n: "4",
                  t: "Convierte y descarga",
                  d: "Pulsa Convertir y verás una previsualización junto al peso en KB y el porcentaje de diferencia respecto al original (verde si reduce, rojo si aumenta). Cuando estés satisfecho, pulsa Descargar.",
                },
              ].map((step) => (
                <li key={step.n} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {step.n}
                  </span>
                  <div>
                    <h3 className="mb-1 font-semibold text-white">{step.t}</h3>
                    <p className="text-sm leading-relaxed text-text-muted">{step.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* FAQ */}
          <div className="mt-8 glass rounded-2xl border border-border/20 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">Preguntas frecuentes</h2>
            <div className="space-y-6">
              {[
                {
                  q: "¿Cómo generar un favicon .ico con varias resoluciones?",
                  a: "Selecciona el formato ICO, elige los tamaños (recomendado: 16, 32 y 48 px para compatibilidad universal) y pulsa Convertir. El .ico resultante incluirá todas las resoluciones en un solo archivo, garantizando que tu favicon se vea nítido en cualquier navegador.",
                },
                {
                  q: "¿Cuál es la diferencia entre WebP y JPG?",
                  a: "WebP ofrece hasta un 30% menos de tamaño que JPG con calidad visual equivalente, y además soporta transparencia y animaciones. Es compatible con todos los navegadores modernos. JPG sigue siendo la opción más universal para fotografías.",
                },
                {
                  q: "¿AVIF funciona en todos los navegadores?",
                  a: "AVIF es el formato más moderno y con mejor compresión, pero la exportación desde Canvas requiere Chrome 94+ o Edge 94+. En Firefox, Safari y versiones antiguas puede fallar. Si ves el error, usa WebP como alternativa con compresión similar.",
                },
                {
                  q: "¿Las imágenes se envían a algún servidor?",
                  a: "No. Todo el procesamiento ocurre en tu navegador mediante la Canvas API. Ninguna imagen ni dato se transmite a servidores externos. Puedes usar esta herramienta con total privacidad, incluso con imágenes confidenciales.",
                },
                {
                  q: "¿Por qué convertir imágenes a WebP para Next.js?",
                  a: "El componente Image de Next.js optimiza automáticamente las imágenes, pero partir de un WebP ya optimizado reduce el trabajo del servidor y mejora los Core Web Vitals (LCP). Imágenes más ligeras significan páginas más rápidas y mejor SEO.",
                },
              ].map((item) => (
                <div key={item.q}>
                  <h3 className="mb-2 font-semibold text-white">{item.q}</h3>
                  <p className="text-sm leading-relaxed text-text-muted">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Embed section */}
          <div className="mt-8 glass rounded-2xl border border-border/20 p-8">
            <h2 className="mb-4 text-xl font-bold text-white">
              Incrusta el conversor en tu web
            </h2>
            <p className="mb-4 text-sm text-text-muted">
              Puedes integrar este conversor en cualquier página web con un simple iframe:
            </p>
            <pre className="overflow-x-auto rounded-lg bg-surface/80 p-4 text-xs text-text-muted">
              <code>{`<iframe\n  src="${EMBED_URL}"\n  width="100%"\n  height="700"\n  frameborder="0"\n  title="Conversor de Imágenes"\n></iframe>`}</code>
            </pre>
          </div>
        </div>
      </main>
    </>
  );
}
