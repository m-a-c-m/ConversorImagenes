"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface Props {
  locale?: string;
}

type OutputFormat = "png" | "jpg" | "webp" | "avif" | "bmp" | "ico";

const ICO_SIZES = [16, 32, 48, 64, 128, 256] as const;

function buildIco(canvases: HTMLCanvasElement[]): Blob {
  const pngDataList: Uint8Array[] = canvases.map((canvas) => {
    const dataUrl = canvas.toDataURL("image/png");
    const base64 = dataUrl.split(",")[1];
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  });

  const count = pngDataList.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dataOffset = headerSize + dirEntrySize * count;

  let totalSize = dataOffset;
  pngDataList.forEach((d) => (totalSize += d.length));

  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  // ICONDIR
  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // type = 1 (ICO)
  view.setUint16(4, count, true);

  let currentOffset = dataOffset;
  pngDataList.forEach((png, i) => {
    const size = canvases[i].width;
    const dirBase = headerSize + i * dirEntrySize;

    // ICONDIRENTRY
    view.setUint8(dirBase + 0, size >= 256 ? 0 : size); // width (0 = 256)
    view.setUint8(dirBase + 1, size >= 256 ? 0 : size); // height
    view.setUint8(dirBase + 2, 0); // color count
    view.setUint8(dirBase + 3, 0); // reserved
    view.setUint16(dirBase + 4, 0, true); // color planes
    view.setUint16(dirBase + 6, 32, true); // bits per pixel
    view.setUint32(dirBase + 8, png.length, true); // size
    view.setUint32(dirBase + 12, currentOffset, true); // offset

    bytes.set(png, currentOffset);
    currentOffset += png.length;
  });

  return new Blob([buffer], { type: "image/x-icon" });
}

// Native canvas.toBlob("image/bmp") is not supported in most browsers.
// This encoder writes a valid 24-bit BMP (bottom-up, no compression).
function canvasToBmp(canvas: HTMLCanvasElement): Blob {
  const ctx = canvas.getContext("2d")!;
  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const rowSize = Math.floor((24 * width + 31) / 32) * 4; // padded to 4 bytes
  const pixelDataSize = rowSize * height;
  const buffer = new ArrayBuffer(54 + pixelDataSize);
  const view = new DataView(buffer);
  const px = new Uint8Array(buffer);

  // File header
  view.setUint8(0, 0x42); view.setUint8(1, 0x4d); // 'BM'
  view.setUint32(2, 54 + pixelDataSize, true);
  view.setUint32(10, 54, true); // pixel data offset

  // DIB header (BITMAPINFOHEADER)
  view.setUint32(14, 40, true);      // header size
  view.setInt32(18, width, true);
  view.setInt32(22, height, true);   // positive = bottom-up rows
  view.setUint16(26, 1, true);       // color planes
  view.setUint16(28, 24, true);      // 24 bpp
  view.setUint32(34, pixelDataSize, true);
  view.setInt32(38, 2835, true);     // ~72 DPI X
  view.setInt32(42, 2835, true);     // ~72 DPI Y

  // Pixel data — BGR, rows stored bottom-to-top
  for (let y = 0; y < height; y++) {
    const srcRow = height - 1 - y;
    for (let x = 0; x < width; x++) {
      const s = (srcRow * width + x) * 4;
      const d = 54 + y * rowSize + x * 3;
      px[d] = data[s + 2]; px[d + 1] = data[s + 1]; px[d + 2] = data[s];
    }
  }
  return new Blob([buffer], { type: "image/bmp" });
}

export default function ImageConverter({ locale }: Props) {
  const isEs = locale !== "en";

  const [srcDataUrl, setSrcDataUrl] = useState<string | null>(null);
  const [srcInfo, setSrcInfo] = useState<{ w: number; h: number; size: number; name: string } | null>(null);
  const [format, setFormat] = useState<OutputFormat>("webp");
  const [quality, setQuality] = useState(80);
  const [icoSizes, setIcoSizes] = useState<number[]>([16, 32, 48]);
  const [resizeEnabled, setResizeEnabled] = useState(false);
  const [resizeW, setResizeW] = useState(0);
  const [resizeH, setResizeH] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [ratioLocked, setRatioLocked] = useState(true);
  const [resultDataUrl, setResultDataUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultInfo, setResultInfo] = useState<{ w: number; h: number; size: number; format: string } | null>(null);
  const [converting, setConverting] = useState(false);
  const [avifUnsupported, setAvifUnsupported] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function clearResult() {
    setResultDataUrl(null);
    setResultBlob(null);
    setResultInfo(null);
    setAvifUnsupported(false);
  }

  const loadFile = useCallback((f: File) => {
    clearResult();
    setSrcDataUrl(null);
    setSrcInfo(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setSrcDataUrl(url);
      const img = new Image();
      img.onload = () => {
        setSrcInfo({ w: img.width, h: img.height, size: f.size, name: f.name });
        setResizeW(img.width);
        setResizeH(img.height);
        setAspectRatio(img.width / img.height);
      };
      img.src = url;
    };
    reader.readAsDataURL(f);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const file = Array.from(e.clipboardData?.items ?? [])
        .find((i) => i.type.startsWith("image/"))
        ?.getAsFile();
      if (file) loadFile(file);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [loadFile]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f && f.type.startsWith("image/")) loadFile(f);
    },
    [loadFile]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) loadFile(f);
  };

  const handleWidthChange = (val: number) => {
    setResizeW(val);
    if (ratioLocked && val > 0) setResizeH(Math.round(val / aspectRatio));
    clearResult();
  };

  const handleHeightChange = (val: number) => {
    setResizeH(val);
    if (ratioLocked && val > 0) setResizeW(Math.round(val * aspectRatio));
    clearResult();
  };

  const toggleIcoSize = (size: number) => {
    setIcoSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size].sort((a, b) => a - b)
    );
    clearResult();
  };

  const selectFormat = (f: OutputFormat) => {
    setFormat(f);
    if (f === "jpg") setQuality(85);
    else if (f === "webp") setQuality(80);
    clearResult();
  };

  const convert = async () => {
    if (!srcDataUrl || !srcInfo) return;
    setConverting(true);
    try {
      const img = new Image();
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = rej;
        img.src = srcDataUrl;
      });

      const outW = resizeEnabled && resizeW > 0 ? resizeW : srcInfo.w;
      const outH = resizeEnabled && resizeH > 0 ? resizeH : srcInfo.h;

      if (format === "ico") {
        const sizes = icoSizes.length > 0 ? icoSizes : [32];
        const canvases: HTMLCanvasElement[] = sizes.map((size) => {
          const c = document.createElement("canvas");
          c.width = size;
          c.height = size;
          const ctx = c.getContext("2d")!;
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          // Letterbox: fit inside square maintaining aspect ratio
          const scale = Math.min(size / img.width, size / img.height);
          const dw = Math.round(img.width * scale);
          const dh = Math.round(img.height * scale);
          ctx.drawImage(img, Math.round((size - dw) / 2), Math.round((size - dh) / 2), dw, dh);
          return c;
        });

        const blob = buildIco(canvases);
        const url = URL.createObjectURL(blob);
        setResultDataUrl(url);
        setResultBlob(blob);
        setResultInfo({ w: sizes[sizes.length - 1], h: sizes[sizes.length - 1], size: blob.size, format: "ICO" });
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      if (format === "jpg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, outW, outH);
      }
      ctx.drawImage(img, 0, 0, outW, outH);

      // BMP: canvas.toBlob doesn't support image/bmp — use custom encoder
      if (format === "bmp") {
        const blob = canvasToBmp(canvas);
        const url = URL.createObjectURL(blob);
        setResultDataUrl(url);
        setResultBlob(blob);
        setResultInfo({ w: outW, h: outH, size: blob.size, format: "BMP" });
        return;
      }

      const mimeMap: Record<OutputFormat, string> = {
        png: "image/png",
        jpg: "image/jpeg",
        webp: "image/webp",
        avif: "image/avif",
        bmp: "image/bmp",
        ico: "image/x-icon",
      };

      const q = format === "jpg" || format === "webp" ? quality / 100 : undefined;

      const blob = await new Promise<Blob | null>((res) =>
        canvas.toBlob((b) => res(b), mimeMap[format], q)
      );

      if (!blob) {
        setAvifUnsupported(true);
        return;
      }

      if (format === "avif" && blob.type !== "image/avif") {
        setAvifUnsupported(true);
        return;
      }

      const url = URL.createObjectURL(blob);
      setResultDataUrl(url);
      setResultBlob(blob);
      setResultInfo({ w: outW, h: outH, size: blob.size, format: format.toUpperCase() });
    } catch {
      if (format === "avif") setAvifUnsupported(true);
    } finally {
      setConverting(false);
    }
  };

  const download = () => {
    if (!resultBlob || !srcInfo) return;
    const ext = format === "jpg" ? "jpg" : format;
    const baseName = srcInfo.name.replace(/\.[^.]+$/, "");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(resultBlob);
    a.download = `${baseName}.${ext}`;
    a.click();
  };

  const reset = () => {
    setSrcDataUrl(null);
    setSrcInfo(null);
    clearResult();
    setResizeEnabled(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sizeDiff =
    resultInfo && srcInfo
      ? Math.round(((resultInfo.size - srcInfo.size) / srcInfo.size) * 100)
      : null;

  const FORMATS: OutputFormat[] = ["png", "jpg", "webp", "avif", "bmp", "ico"];

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      {!srcDataUrl && (
        <div
          className={`flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-12 text-center transition-colors cursor-pointer ${
            dragOver
              ? "border-primary bg-primary/10"
              : "border-border/40 hover:border-primary/50 hover:bg-primary/5"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-5xl opacity-60">🖼️</div>
          <div>
            <p className="text-lg font-medium text-white">
              {isEs ? "Arrastra tu imagen aquí" : "Drop your image here"}
            </p>
            <p className="mt-1 text-sm text-text-muted">
              {isEs
                ? "o haz clic para seleccionar · o pega con Ctrl+V"
                : "or click to select · or paste with Ctrl+V"}
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}

      {/* Loaded state */}
      {srcDataUrl && srcInfo && (
        <div className="space-y-6">
          {/* Previews */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 rounded-xl border border-border/20 bg-surface/40 p-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">
                {isEs ? "Original" : "Original"}
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={srcDataUrl}
                alt="original"
                className="mx-auto max-h-48 w-auto rounded-lg object-contain"
              />
              <div className="mt-3 space-y-0.5 text-xs text-text-muted">
                <p className="truncate font-medium text-white">{srcInfo.name}</p>
                <p>
                  {srcInfo.w} × {srcInfo.h} px · {(srcInfo.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>

            {resultDataUrl && resultInfo && (
              <div className="flex-1 rounded-xl border border-primary/20 bg-primary/5 p-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-primary">
                  {isEs ? "Resultado" : "Result"}
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resultDataUrl}
                  alt="result"
                  className="mx-auto max-h-48 w-auto rounded-lg object-contain"
                />
                <div className="mt-3 space-y-0.5 text-xs text-text-muted">
                  <p className="font-medium text-white">{resultInfo.format}</p>
                  <p>
                    {resultInfo.w} × {resultInfo.h} px · {(resultInfo.size / 1024).toFixed(1)} KB
                  </p>
                  {sizeDiff !== null && (
                    <p className={sizeDiff <= 0 ? "text-green-400" : "text-red-400"}>
                      {sizeDiff > 0 ? "+" : ""}
                      {sizeDiff}%{" "}
                      {isEs ? "respecto al original" : "vs original"}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Format selector */}
          <div>
            <p className="mb-2 text-sm font-medium text-white">
              {isEs ? "Formato de salida" : "Output format"}
            </p>
            <div className="flex flex-wrap gap-2">
              {FORMATS.map((f) => (
                <button
                  key={f}
                  onClick={() => selectFormat(f)}
                  className={`flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                    format === f
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/30 text-text-muted hover:border-primary/30 hover:text-white"
                  }`}
                >
                  {f === "jpg" ? "JPG" : f.toUpperCase()}
                  {f === "avif" && (
                    <span className="rounded-full bg-purple-500/20 px-1.5 py-0.5 text-[10px] text-purple-400">
                      {isEs ? "Moderno" : "Modern"}
                    </span>
                  )}
                </button>
              ))}
            </div>
            {avifUnsupported && (
              <p className="mt-2 text-xs text-red-400">
                {isEs
                  ? "Tu navegador no soporta exportar AVIF. Prueba con Chrome 94+ o Edge 94+."
                  : "Your browser does not support exporting AVIF. Try Chrome 94+ or Edge 94+."}
              </p>
            )}
          </div>

          {/* Quality slider */}
          {(format === "jpg" || format === "webp") && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-white">
                  {isEs ? "Calidad" : "Quality"}
                </p>
                <span className="text-sm font-bold text-primary">{quality}%</span>
              </div>
              <input
                type="range"
                min={1}
                max={100}
                value={quality}
                onChange={(e) => { setQuality(Number(e.target.value)); clearResult(); }}
                className="w-full accent-primary"
              />
              <div className="mt-1 flex justify-between text-xs text-text-muted/60">
                <span>{isEs ? "Menor peso" : "Smaller file"}</span>
                <span>{isEs ? "Mayor calidad" : "Higher quality"}</span>
              </div>
            </div>
          )}

          {/* ICO sizes */}
          {format === "ico" && (
            <div>
              <p className="mb-2 text-sm font-medium text-white">
                {isEs ? "Tamaños ICO" : "ICO sizes"}
              </p>
              <div className="flex flex-wrap gap-2">
                {ICO_SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleIcoSize(size)}
                    className={`rounded-lg border px-3 py-1.5 text-sm transition-all ${
                      icoSizes.includes(size)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/30 text-text-muted hover:border-primary/30 hover:text-white"
                    }`}
                  >
                    {size}×{size}
                  </button>
                ))}
              </div>
              <p className="mt-1 text-xs text-text-muted/60">
                {isEs
                  ? "El .ico contendrá todas las resoluciones seleccionadas."
                  : "The .ico file will contain all selected resolutions."}
              </p>
            </div>
          )}

          {/* Resize */}
          <div>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={resizeEnabled}
                onChange={(e) => { setResizeEnabled(e.target.checked); clearResult(); }}
                className="accent-primary"
              />
              <span className="text-sm font-medium text-white">
                {isEs ? "Redimensionar" : "Resize"}
              </span>
            </label>
            {resizeEnabled && (
              <div className="mt-3 flex flex-wrap items-end gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-text-muted">Width (px)</label>
                  <input
                    type="number"
                    min={1}
                    value={resizeW}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="w-24 rounded-lg border border-border/30 bg-surface/60 px-3 py-1.5 text-sm text-white outline-none focus:border-primary/50"
                  />
                </div>
                <button
                  onClick={() => setRatioLocked((p) => !p)}
                  className="mb-1 text-xl"
                  title={isEs ? "Bloquear proporción" : "Lock ratio"}
                >
                  {ratioLocked ? "🔒" : "🔓"}
                </button>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-text-muted">Height (px)</label>
                  <input
                    type="number"
                    min={1}
                    value={resizeH}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className="w-24 rounded-lg border border-border/30 bg-surface/60 px-3 py-1.5 text-sm text-white outline-none focus:border-primary/50"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={convert}
              disabled={converting || (format === "ico" && icoSizes.length === 0)}
              className="flex-1 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-background transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {converting
                ? isEs ? "Convirtiendo…" : "Converting…"
                : isEs ? "Convertir" : "Convert"}
            </button>
            {resultBlob && (
              <button
                onClick={download}
                className="flex-1 rounded-xl border border-primary/40 bg-primary/10 px-6 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary/20"
              >
                {isEs ? "Descargar" : "Download"}
              </button>
            )}
            <button
              onClick={reset}
              className="rounded-xl border border-border/30 px-6 py-3 text-sm text-text-muted transition-all hover:border-border/60 hover:text-white"
            >
              {isEs ? "Nueva imagen" : "New image"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
