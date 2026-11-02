// Constants shared by the school marker layers (access and risk). Marker geometry and colour
// ramps stay with each layer; these are the values both layers must agree on.

// Height of the markers above the plate, in world units.
export const MARKER_Y = 0.02;

// Phones draw markers at 70 percent of their desktop size.
export const MOBILE_SCALE = 0.7;

// Rim gain per theme. Below 1 darkens the rim on the dark theme; above 1 lightens it on the light
// theme, so the rim separates from the surface either way.
export const MARKER_RIM: { readonly dark: number; readonly light: number } = { dark: 0.45, light: 1.2 };
