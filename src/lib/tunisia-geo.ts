// Accurate Tunisia geographic data
// Using the user's actual Tunisia map image (1000x1000px)
// City positions calculated from real lat/lng coordinates projected
// onto the image using calibrated reference points.

export interface CityGeo {
  rank: number;
  name: string;
  count: number;
  lat: number;
  lng: number;
  cats: [string, string];
}

export const CITIES_GEO: CityGeo[] = [
  { rank: 1,  name: "Tunis",         count: 412, lat: 36.8065, lng: 10.1815, cats: ["Web Development", "Graphic Design"] },
  { rank: 2,  name: "Sfax",           count: 198, lat: 34.7406, lng: 10.7603, cats: ["Mobile Development", "Digital Marketing"] },
  { rank: 3,  name: "Sousse",        count: 156, lat: 35.8249, lng: 10.6346, cats: ["UI/UX Design", "Video Editing"] },
  { rank: 4,  name: "Monastir",      count: 124, lat: 35.7643, lng: 10.8113, cats: ["Voice Over", "Translation"] },
  { rank: 5,  name: "Nabeul",         count: 98,  lat: 36.4561, lng: 10.7376, cats: ["3D Modeling", "Photography"] },
  { rank: 6,  name: "Kairouan",       count: 76,  lat: 35.6781, lng: 10.0963, cats: ["Content Writing", "SEO"] },
  { rank: 7,  name: "Bizerte",        count: 54,  lat: 37.2744, lng: 9.8739,  cats: ["Photography", "Web Development"] },
  { rank: 8,  name: "Gabès",          count: 42,  lat: 33.8814, lng: 10.0985, cats: ["Translation", "Marketing"] },
  { rank: 9,  name: "Djerba",         count: 38,  lat: 33.8067, lng: 10.8456, cats: ["Tourism Content", "Photography"] },
  { rank: 10, name: "Sidi Bou Said",  count: 28,  lat: 36.8702, lng: 10.3417, cats: ["Photography", "Art Direction"] },
  { rank: 11, name: "Tozeur",         count: 18,  lat: 33.9197, lng: 8.1337,  cats: ["Travel Writing", "Photography"] },
  { rank: 12, name: "Tataouine",      count: 12,  lat: 32.9297, lng: 10.4459, cats: ["Travel Writing", "Videography"] },
];

// === Image-based projection ===
// The user's map image is 1000x1000px.
// The Tunisia shape occupies roughly x=290-710, y=48-953 in the image.
//
// Calibration using known reference points:
// - Tozeur (8.13°E) → x=290px in image (westernmost point of green area)
// - Cap Bon area (11.15°E) → x=705px in image (easternmost in north)
// - Northernmost (37.5°N) → y=48px
// - Southernmost (30.2°N) → y=953px
//
// X scale: (705-290)/(11.15-8.13) = 415/3.02 = 137.4 px/degree
// X offset: x = (lng * 137.4) + (290 - 8.13 * 137.4) = lng * 137.4 - 827.3
// Y scale: (953-48)/(37.5-30.2) = 905/7.3 = 124.0 px/degree
// Y offset: y = (37.5 - lat) * 124.0 + 48

const X_SCALE = 137.4;
const X_OFFSET = 290 - 8.13 * X_SCALE; // = -827.3
const Y_SCALE = 124.0;
const Y_OFFSET = 48;
const IMG_SIZE = 1000;

// Convert lat/lng to x/y percentage (0-100) on the map image
export function latLngToXY(lat: number, lng: number): { x: number; y: number } {
  const px = lng * X_SCALE + X_OFFSET;
  const py = (37.5 - lat) * Y_SCALE + Y_OFFSET;
  // Convert to percentage of the 1000px image
  const x = (px / IMG_SIZE) * 100;
  const y = (py / IMG_SIZE) * 100;
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

export const CITIES_WITH_POS = CITIES_GEO.map((c) => ({
  ...c,
  ...latLngToXY(c.lat, c.lng),
}));

// SVG path is no longer needed — we use the image directly
export const TUNISIA_SVG_PATH = "";

export const TUNISIA_MAP_IMAGE = "/services/tunisia-map-teal.png";
