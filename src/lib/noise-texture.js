/**
 * Generate a reusable noise texture Data URL.
 * Options:
 * - size: base tile size (default 128)
 * - opacity: 0..1 alpha applied per pixel
 * - monochrome: boolean (if false, random subtle RGB color noise)
 * - colorVariance: 0..1 intensity of color channel variance when monochrome=false
 * - seed: optional seed for deterministic noise
 */
export function generateNoiseDataUrl({ size = 128, opacity = 0.3, monochrome = true, colorVariance = 0.15, seed } = {}) {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(size, size);

  let rng = Math.random;
  if (typeof seed === 'number') {
    let s = seed >>> 0;
    rng = () => {
      // xorshift32
      s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return (s >>> 0) / 4294967295;
    };
  }

  const a = Math.round(Math.min(1, Math.max(0, opacity)) * 255);
  for (let i = 0; i < img.data.length; i += 4) {
    const base = rng() * 255;
    if (monochrome) {
      img.data[i] = base;
      img.data[i + 1] = base;
      img.data[i + 2] = base;
    } else {
      const variance = 255 * colorVariance;
      img.data[i] = Math.min(255, Math.max(0, base + (rng() * 2 - 1) * variance));
      img.data[i + 1] = Math.min(255, Math.max(0, base + (rng() * 2 - 1) * variance));
      img.data[i + 2] = Math.min(255, Math.max(0, base + (rng() * 2 - 1) * variance));
    }
    img.data[i + 3] = a;
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL();
}
