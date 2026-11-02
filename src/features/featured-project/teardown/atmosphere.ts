import * as THREE from 'three';
import { createClouds, type Clouds, type CloudRegion, type CloudTones } from './clouds';
import type { Env, Palette } from './layers/types';
import { createMist, type Mist, type MistRegion } from './mist';
import type { Model } from './model';
import { createWeather, type Weather, type WeatherTones } from './weather';

// Wetness follows the storm with this rate (1/s): the ground is mostly wet ~2.5 s after the rain.
const WET_RATE = 1.2;
// Canvas brightness lost at the height of the storm. Subtle on purpose: no strobe, no flash.
const DARKEN = 0.18;

// The light theme is the one whose page ground is bright.
const isLight = (p: Palette): boolean => (p.base.r + p.base.g + p.base.b) / 3 > 0.5;

// Rain sits halfway between ground and ink on the dark theme. On the light theme that mix reads as
// black specks, so the streaks take a soft mid-grey instead.
const weatherTones = (p: Palette): WeatherTones => ({
  rain: isLight(p) ? p.base.clone().lerp(p.ink, 0.32) : p.base.clone().lerp(p.ink, 0.5),
});

// Clouds are neutral greys: a lit top and a darker underside. On a dark theme the top is lifted
// towards ink. On the light theme the deck is a light grey (body near #B9B8BE): a lighter top and
// a soft darker underside.
const cloudTones = (p: Palette): CloudTones =>
  isLight(p)
    ? { lit: new THREE.Color('#CFCED4'), shadow: new THREE.Color('#A4A3AA') }
    : { lit: p.base.clone().lerp(p.ink, 0.5), shadow: p.base.clone().lerp(p.ink, 0.18) };

export interface Atmosphere {
  // Clouds and mist need the built stack, so they join the scene once the data resolves.
  attachDeck(cloudRegion: CloudRegion, mistRegion: MistRegion): void;
  // Copies the storm into the shared env and advances the time-dependent values.
  advance(env: Env, storm: number, dt: number, model: Model | null): void;
  // Weather, mist and canvas darkening, once the layers have been ticked.
  step(dt: number, env: Env, rainNorm: number): void;
  resize(pixelHeight: number, fovDeg: number): void;
  setPalette(palette: Palette): void;
  dispose(): void;
}

interface AtmosphereOptions {
  scene: THREE.Scene;
  canvasWrap: HTMLElement;
  mobile: boolean;
  pinned: boolean;
  palette: Palette;
}

// Weather is in the scene from the start; clouds and mist follow with the stack.
export function createAtmosphere(options: AtmosphereOptions): Atmosphere {
  const { scene, canvasWrap, mobile, pinned } = options;
  let palette = options.palette;
  const weather: Weather = createWeather(mobile, weatherTones(palette));
  scene.add(weather.group);
  let clouds: Clouds | null = null;
  let mist: Mist | null = null;
  let filterShown = '';

  // Darkening follows the storm through a CSS filter on the canvas wrapper; written only on change.
  // Light theme: no filter. On a light page the filter greys the whole canvas rectangle, so the
  // storm there is carried by the weather tones alone.
  // Quantized to 0.02 steps: a 3-decimal value changes on almost every scroll frame, and each write
  // repaints the large masked canvas. The filter now changes only when the visible step does.
  function applyDarkening(storm: number): void {
    const level = Math.round((1 - DARKEN * storm) / 0.02) * 0.02;
    const value = isLight(palette) ? 'none' : `brightness(${level.toFixed(2)})`;
    if (value === filterShown) return;
    filterShown = value;
    canvasWrap.style.filter = value;
  }

  return {
    attachDeck(cloudRegion, mistRegion) {
      clouds = createClouds(cloudRegion, mobile, cloudTones(palette), pinned);
      scene.add(clouds.group);
      mist = createMist(mistRegion, mobile, cloudTones(palette));
      scene.add(mist.group);
    },

    // Wetness lags the storm with a frame-rate independent step; a static frame snaps to it.
    advance(env, storm, dt, model) {
      env.storm = storm;
      env.wet =
        dt > 0 ? env.wet + (env.storm - env.wet) * (1 - Math.exp(-WET_RATE * dt)) : env.storm;
      env.water = model ? model.waterLevel(env.storm) : 0;
      env.time += dt;
      env.lightning = clouds ? clouds.step(dt, env.storm) : 0;
    },

    step(dt, env, rainNorm) {
      weather.step(dt, env.storm, rainNorm);
      mist?.step(dt, env.wet);
      applyDarkening(env.storm);
    },

    resize(pixelHeight, fovDeg) {
      weather.resize(pixelHeight, fovDeg);
    },

    setPalette(next) {
      palette = next;
      weather.setTones(weatherTones(palette));
      clouds?.setTones(cloudTones(palette));
      mist?.setTones(cloudTones(palette));
    },

    dispose() {
      if (clouds) {
        scene.remove(clouds.group);
        clouds.dispose();
      }
      if (mist) {
        scene.remove(mist.group);
        mist.dispose();
      }
      scene.remove(weather.group);
      weather.dispose();
    },
  };
}
