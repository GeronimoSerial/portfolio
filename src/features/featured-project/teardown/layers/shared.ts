import * as THREE from 'three';
import type { GeoData } from '../data';
import { footprintTexture } from './fieldTexture';
import { buildHillshade } from './hillshade';

// Textures that every layer reads, built once per mount. The scene creates them, passes them
// through LayerContext and frees them in its own cleanup. Layers reference them but never dispose
// them: disposeLayer skips anything `owns` reports.

export interface SharedResources {
  // Hillshade generated from the heightmap. A layer may swap in a baked file for its own copy.
  hillshade: THREE.Texture;
  // Province footprint mask, sized by device tier.
  footprint: THREE.Texture;
  // Satellite imagery. A 1x1 placeholder until the file loads, then swapped in place: the one
  // uniform object is shared, so every material that holds it sees the swap.
  satellite: { value: THREE.Texture };
  // 1 once the satellite is in place, 0 before. Read as uHasSat by the shaders.
  satelliteReady: { value: number };
  owns(texture: THREE.Texture): boolean;
  dispose(): void;
}

// The satellite is loaded as its raw sRGB bytes, the same convention as the palette colours in the
// shaders. The placeholder colour is never sampled while satelliteReady is 0.
export function createSharedResources(data: GeoData, mobile: boolean): SharedResources {
  const owned = new Set<THREE.Texture>();
  let disposed = false;
  const own = <T extends THREE.Texture>(texture: T): T => {
    owned.add(texture);
    return texture;
  };

  const hillshade = own(buildHillshade(data).texture);
  const footprint = own(footprintTexture(data.footprint, mobile ? 256 : 512));
  const placeholder = own(new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1));
  placeholder.needsUpdate = true;
  const satellite = { value: placeholder as THREE.Texture };
  const satelliteReady = { value: 0 };

  if (data.satelliteUrl) {
    new THREE.TextureLoader().load(data.satelliteUrl, (tex) => {
      tex.flipY = false;
      tex.colorSpace = THREE.NoColorSpace;
      if (disposed) {
        tex.dispose();
        return;
      }
      owned.delete(placeholder);
      placeholder.dispose();
      owned.add(tex);
      satellite.value = tex;
      satelliteReady.value = 1;
    });
  }

  return {
    hillshade,
    footprint,
    satellite,
    satelliteReady,
    owns: (texture) => owned.has(texture),
    dispose: () => {
      disposed = true;
      for (const texture of owned) texture.dispose();
      owned.clear();
    },
  };
}
