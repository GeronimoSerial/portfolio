import * as THREE from 'three';

// Textures that carry plate-aligned data into shaders.
// Rows follow plate v (row 0 at v = 0), and flipY stays off so row 0 is texture t = 0.

// Packs a 0..1 field into 8-bit RGBA (the value lives in every channel). Float textures
// need extensions that are not always filterable, so 8 bits is the portable choice.
export function encodeField(field: Float32Array, n: number): THREE.DataTexture {
  const bytes = new Uint8Array(n * n * 4);
  for (let i = 0; i < n * n; i++) {
    const v = Math.round(Math.min(1, Math.max(0, field[i])) * 255);
    bytes[i * 4] = v;
    bytes[i * 4 + 1] = v;
    bytes[i * 4 + 2] = v;
    bytes[i * 4 + 3] = 255;
  }
  const tex = new THREE.DataTexture(bytes, n, n, THREE.RGBAFormat, THREE.UnsignedByteType);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.needsUpdate = true;
  return tex;
}

export interface Canvas2D {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  texture: THREE.CanvasTexture;
}

// A canvas whose texture keeps row 0 at t = 0. Linear filtering gives the bilinear smoothing
// the precipitation and indicator surfaces need when a small grid is stretched over the plate.
export function createCanvas2D(width: number, height: number): Canvas2D {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('2D canvas context unavailable');
  const texture = new THREE.CanvasTexture(canvas);
  texture.flipY = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = THREE.NoColorSpace;
  return { canvas, ctx, texture };
}

// Footprint mask: white inside the province outline, black outside. Without an outline the
// whole plate is white, so shaders can always sample it.
export function footprintTexture(
  footprint: Array<[number, number]> | undefined,
  size: number,
): THREE.CanvasTexture {
  const { ctx, texture } = createCanvas2D(size, size);
  ctx.fillStyle = footprint ? '#000' : '#fff';
  ctx.fillRect(0, 0, size, size);
  if (footprint && footprint.length > 2) {
    ctx.beginPath();
    footprint.forEach(([u, v], i) => {
      if (i === 0) ctx.moveTo(u * size, v * size);
      else ctx.lineTo(u * size, v * size);
    });
    ctx.closePath();
    ctx.fillStyle = '#fff';
    ctx.fill();
  }
  texture.needsUpdate = true;
  return texture;
}
