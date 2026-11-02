import { GLOBE_RADIUS, type FigureName, type Shape } from './shapes';
import { PORTRAIT_H } from './portrait-sampler';
import { MOBILE_BREAKPOINT } from '../motion/policy';

export type Tier = 'desktop' | 'mobile';
export type Pose = 'portrait' | 'field' | 'globe' | 'globe-north' | 'argentina' | 'usa' | 'icvm-logo' | 'none';
export type Framed = Exclude<Pose, 'none'>;
export type DispersePose = 'argentina' | 'icvm-logo';
export type ShapeKey = 'portrait' | 'field' | 'globe' | 'argentina' | 'usa' | 'icvm-logo' | FigureName;

export const isDispersePose = (pose: Pose): pose is DispersePose => pose === 'argentina' || pose === 'icvm-logo';
export const tierOf = (): Tier => (window.innerWidth < MOBILE_BREAKPOINT ? 'mobile' : 'desktop');

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
// Smoothstep: the dispersal and the title both ease in and out, so a wheel step never reads as a jump.
export const smoothstep = (x: number) => x * x * (3 - 2 * x);

// Framing values that a morph interpolates. A 'none' section has the framing of its neighbour, at opacity 0.
export interface Frame {
  x: number;
  oy: number;
  c: number;
  s: number;
  turnOut: number;
  tilt: number;
  yaw: number;
  roll: number;
  opacity: number;
  arc: number;
}

// Measured view and shape sizes that the poses are fitted to.
export interface Layout {
  visW: number;
  visH: number;
  baseY: number;
  fitGlobe: number;
  fitMap: number;
  fitUsa: number;
  mapW: number;
  mapH: number;
  usaW: number;
  usaH: number;
  fitLogo: number;
  logoW: number;
  logoH: number;
  logoX: number; // view widths, from the title's left edge
  logoOY: number; // view heights, from the title's first line
}

export const createLayout = (): Layout => ({
  visW: 1,
  visH: 1,
  baseY: 0,
  fitGlobe: 1,
  fitMap: 1,
  fitUsa: 1,
  mapW: 0,
  mapH: 0,
  usaW: 0,
  usaH: 0,
  fitLogo: 1,
  logoW: 0,
  logoH: 0,
  logoX: 0,
  logoOY: 0,
});

export const FIGURE_X = { desktop: 0.1, mobile: 0 }; // figure centre, in view widths (right of centre)
export const FIELD_OFFSET_Y = -0.22; // in view heights

// Globe and map poses. The figure sits right of centre on desktop and centres on mobile, where
// it drops below the heading. The cloud's centre is at PORTRAIT_H / 2 in portrait space.
const GLOBE_X = { desktop: 0.18, mobile: 0 }; // view widths
const GLOBE_OY = { desktop: 0, mobile: -0.1 }; // view heights
export const CLOUD_CENTER_Y = PORTRAIT_H / 2;
export const CENTERED_Y = -PORTRAIT_H / 2; // grp y that puts the cloud centre on the view centre
const FIT = 0.92; // share of the view width a scaled-down figure may fill
const GLOBE_TILT = -0.3; // rad around X, globe pose only; negative tilts the south toward the viewer
const GLOBE_FIT = { h: 0.78, w: 0.9 }; // globe diameter as a share of view height and of view width
// Arc midpoint (lat 6.7, lon -65.8) facing the viewer, so both endpoints sit on the front hemisphere.
// Same sign convention as the rest pose: positive yaw brings a western longitude to the front.
const NORTH = { yaw: 0.102, tilt: 0.117 }; // rad
const MAP_FIT_H = { desktop: 0.82, mobile: 0.5 }; // Argentina bbox height as a share of view height
const USA_FIT = { desktop: { w: 0.55, h: 0.82 }, mobile: { w: 0.75, h: 0.6 } }; // share of view width / height
const USA_X = { desktop: 0.15, mobile: 0 }; // view widths
const USA_OY = { desktop: 0, mobile: -0.12 }; // view heights
const MAP_OY = { desktop: 0, mobile: -0.12 }; // Argentina, view heights
// Dispersal per pose: wind direction and distance in shape heights at full progress.
// Argentina drifts NE; the logo rises and spreads out over the title.
export const DISPERSE = {
  argentina: { x: 0.8, y: 0.6, reach: 0.45 },
  'icvm-logo': { x: 0, y: 1, reach: 0.6 },
};

// Accordion figure: the open item's shape, fitted to the right of the desktop stage or above the list on mobile.
export const FIG = {
  fit: { desktop: { w: 0.42, h: 0.7 }, mobile: { w: 0.85, h: 0.38 } }, // share of view width / height
  x: { desktop: 0.22, mobile: 0 }, // view widths
  oy: { desktop: 0, mobile: 0.22 }, // view heights; positive is up
};
// City only: scale on FIG.fit and an offset on FIG.oy, so its full box fits between the header and the copy.
export const FIG_TURN = 0.35; // rad each way across an item, scrubbed by scroll
// Item 5 is the rocket, rolled to fly up and to the right. Its hold ignites the flame and straightens the yaw,
// then it travels up its nose axis with an ease-in that ends the slot still in view. After the scene it fades out.
export const ROCKET_KEY = 'performance';
export const ROCKET = {
  scale: { desktop: 0.85, mobile: 0.8 }, // share of the figure fit
  roll: -0.65, // rad about the view axis (negative is clockwise): the nose points about 37 degrees right of up
  travel: { desktop: 0.32, mobile: 0.2 }, // view heights from the start of the hold to its end, along the nose axis
  ignite: 0.15, // share of the hold for the flame to reach full brightness
  shake: 0.008, // view heights; decays across ignition progress
};
const ROCKET_NOSE = { x: -Math.sin(ROCKET.roll), y: Math.cos(ROCKET.roll) }; // unit nose direction, x right, y up

export const POSE_KEYS: Pose[] = ['portrait', 'field', 'globe', 'globe-north', 'argentina', 'usa', 'icvm-logo', 'none'];
export const SHAPE_OF: Record<Framed, ShapeKey> = {
  portrait: 'portrait',
  field: 'field',
  globe: 'globe',
  'globe-north': 'globe',
  argentina: 'argentina',
  usa: 'usa',
  'icvm-logo': 'icvm-logo',
};

// Scale factors that fit the globe, map and USA map to the view (see the fit constants).
export function fitLayout(layout: Layout, t: Tier) {
  layout.fitGlobe = Math.min(GLOBE_FIT.h * layout.visH, GLOBE_FIT.w * layout.visW) / (2 * GLOBE_RADIUS);
  layout.fitMap = layout.mapH
    ? Math.min((MAP_FIT_H[t] * layout.visH) / layout.mapH, (FIT * layout.visW) / layout.mapW)
    : 1;
  layout.fitUsa = layout.usaH
    ? Math.min((USA_FIT[t].h * layout.visH) / layout.usaH, (USA_FIT[t].w * layout.visW) / layout.usaW)
    : 1;
}

export function frameOf(pose: Framed, t: Tier, layout: Layout): Frame {
  const base: Frame = { x: FIGURE_X[t], oy: 0, c: 0, s: 1, turnOut: 1, tilt: 0, yaw: 0, roll: 0, opacity: 1, arc: 0 };
  switch (pose) {
    case 'portrait':
      return base;
    case 'field':
      return { ...base, oy: FIELD_OFFSET_Y, turnOut: 0 };
    case 'globe':
      return { ...base, c: 1, x: GLOBE_X[t], oy: GLOBE_OY[t], s: layout.fitGlobe, turnOut: 0, tilt: GLOBE_TILT };
    case 'globe-north':
      return {
        ...base,
        c: 1,
        x: GLOBE_X[t],
        oy: GLOBE_OY[t],
        s: layout.fitGlobe,
        turnOut: 0,
        tilt: NORTH.tilt,
        yaw: NORTH.yaw,
        arc: 1,
      };
    case 'argentina':
      return { ...base, c: 1, x: GLOBE_X[t], oy: MAP_OY[t], s: layout.fitMap, turnOut: 0 };
    case 'usa':
      return { ...base, c: 1, x: USA_X[t], oy: USA_OY[t], s: layout.fitUsa, turnOut: 0 };
    case 'icvm-logo':
      return { ...base, c: 1, x: layout.logoX, oy: layout.logoOY, s: layout.fitLogo, turnOut: 0 };
  }
}

// A 'none' side borrows its neighbour's framing and fades with opacity 0.
export function frameFor(pose: Pose, other: Pose, t: Tier, layout: Layout): Frame {
  if (pose !== 'none') return frameOf(pose, t, layout);
  return { ...frameOf(other === 'none' ? 'portrait' : other, t, layout), opacity: 0 };
}

export function shapeKeyOf(pose: Pose, other: Pose): ShapeKey | null {
  if (pose !== 'none') return SHAPE_OF[pose];
  return other !== 'none' ? SHAPE_OF[other] : null;
}

export function lerpFrame(a: Frame, b: Frame, p: number): Frame {
  const out = { ...a };
  (Object.keys(a) as (keyof Frame)[]).forEach((key) => {
    out[key] = a[key] + (b[key] - a[key]) * p;
  });
  return out;
}

// lift: 0 to 1 along the rocket's travel, from the lower left (0) to the upper right (1); only the rocket moves.
export function figureFrame(key: ShapeKey, shape: Shape, t: Tier, layout: Layout, yaw = 0, lift = 0): Frame {
  const fit = FIG.fit[t];
  const rocket = key === ROCKET_KEY;
  const scale = rocket ? ROCKET.scale[t] : 1;
  const s = scale * Math.min((fit.w * layout.visW) / shape.width, (fit.h * layout.visH) / shape.height);
  const along = rocket ? (lift - 0.5) * ROCKET.travel[t] : 0; // view heights, centred on the figure
  return {
    x: FIG.x[t] + (along * ROCKET_NOSE.x * layout.visH) / layout.visW,
    oy: FIG.oy[t] + along * ROCKET_NOSE.y,
    c: 1,
    s,
    turnOut: 0,
    tilt: 0,
    yaw,
    roll: rocket ? ROCKET.roll : 0,
    opacity: 1,
    arc: 0,
  };
}
