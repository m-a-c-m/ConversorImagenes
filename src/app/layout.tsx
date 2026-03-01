import type { Metadata } from "next";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://miguelacm.es/tools/image-converter";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Conversor de Imágenes Gratis Online",
    template: "%s | Image Converter",
  },
  description:
    "Convierte imágenes entre PNG, JPG, WebP, AVIF, BMP e ICO. Genera favicons con múltiples resoluciones. Sin registro, gratis, 100% en el navegador.",
  keywords: [
    "conversor de imágenes",
    "convertir png a jpg",
    "jpg a webp",
    "imagen a ico",
    "favicon generator",
    "convertir imagen online",
    "image converter free",
    "png to webp",
    "jpg to png online",
    "conversor ico online",
  ],
  authors: [{ name: "Miguel Ángel Colorado Marin", url: "https://miguelacm.es" }],
  creator: "Miguel Ángel Colorado Marin",
  openGraph: {
    title: "Conversor de Imágenes Gratis Online",
    description:
      "Convierte PNG, JPG, WebP, AVIF, BMP e ICO. Genera favicons. Sin registro, gratis. Por MACM.",
    url: SITE_URL,
    siteName: "Image Converter — MACM",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Conversor de Imágenes Gratis Online",
    description: "Convierte imágenes gratis. Sin registro. Por MACM · miguelacm.es",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="author" href="https://miguelacm.es" />
        <meta name="author" content="Miguel Ángel Colorado Marin" />
        <meta name="copyright" content="Miguel Ángel Colorado Marin — miguelacm.es" />
      </head>
      <body className="antialiased">
        {children}
        <footer className="pb-8 text-center text-xs text-text-muted/40">
          ⚡ por{" "}
          <a
            href="https://miguelacm.es"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted/60 transition-colors hover:text-text-muted underline-offset-2 hover:underline"
          >
            MACM · miguelacm.es
          </a>
          {" · "}
          <a
            href="https://github.com/m-a-c-m/ConversorImagenes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted/60 transition-colors hover:text-text-muted underline-offset-2 hover:underline"
          >
            Código abierto
          </a>
        </footer>
      </body>
    </html>
  );
}
