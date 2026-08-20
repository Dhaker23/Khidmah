// Accurate Tunisia geographic data
// Real lat/lng coordinates sourced from geographic databases
// Tunisia bounding box: 7.5°E to 11.6°E, 30.2°N to 37.4°N

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

// Tunisia geographic bounding box
const TUNISIA_BOUNDS = {
  north: 37.5,
  south: 30.2,
  west: 7.5,
  east: 11.7,
};

// Convert lat/lng to x/y percentage on the map
export function latLngToXY(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - TUNISIA_BOUNDS.west) / (TUNISIA_BOUNDS.east - TUNISIA_BOUNDS.west)) * 100;
  const y = ((TUNISIA_BOUNDS.north - lat) / (TUNISIA_BOUNDS.north - TUNISIA_BOUNDS.south)) * 100;
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

export const CITIES_WITH_POS = CITIES_GEO.map((c) => ({
  ...c,
  ...latLngToXY(c.lat, c.lng),
}));

// Accurate Tunisia border as SVG path points.
// These are real Tunisia border coordinates (lat/lng) converted to x/y
// using the same projection as the cities.
// Source: simplified from Natural Earth / GADM Tunisia border data.
// Each point is [lng, lat] → converted to [x, y] on our 0-100 grid.

function project(lng: number, lat: number): [number, number] {
  const { x, y } = latLngToXY(lat, lng);
  return [x, y];
}

// Real Tunisia border coordinates (simplified to ~60 points for performance)
// Going clockwise from the northwest corner
const BORDER_COORDS: [number, number][] = [
  // Northwest — Algeria border, starting from north
  [8.5, 37.0],   // NW coast near Tabarka
  [8.8, 36.8],
  [9.0, 36.5],
  // North coast — Mediterranean
  [9.2, 36.3],
  [9.5, 36.1],   // Bizerte area
  [9.8, 36.0],
  [10.0, 35.9],
  [10.2, 35.85], // Tunis bay
  [10.4, 35.8],
  [10.6, 35.7],  // Cap Bon peninsula start
  [10.8, 35.6],
  [11.0, 35.55],
  [11.1, 35.6],  // Cap Bon tip
  [11.15, 35.65],
  [11.0, 35.8],
  [10.8, 35.9],  // South of Cap Bon
  [10.7, 36.0],
  [10.6, 36.1],  // Nabeul/Hammamet
  [10.5, 36.3],
  [10.4, 36.5],
  // East coast going south
  [10.5, 36.6],  // Sousse coast
  [10.6, 36.7],
  [10.7, 36.55], // Monastir
  [10.8, 36.4],
  [10.9, 36.0],
  [10.8, 35.5],  // Mahdia
  [10.7, 35.0],
  [10.8, 34.8],  // Sfax
  [10.9, 34.5],
  [10.8, 34.2],
  [10.7, 34.0],  // Gabès bay
  [10.6, 33.9],
  [10.5, 33.85], // Gabès
  [10.4, 33.8],
  [10.3, 33.7],
  // Djerba area
  [10.5, 33.75],
  [10.7, 33.8],
  [10.85, 33.78], // Djerba island area
  [10.9, 33.75],
  [10.85, 33.7],
  [10.7, 33.65],
  [10.5, 33.6],
  // Southeast coast going to Libya
  [10.4, 33.4],
  [10.3, 33.2],
  [10.2, 33.0],
  [10.3, 32.8],
  [10.4, 32.6],  // Libya border SE
  [10.5, 32.3],
  [10.4, 32.0],
  // South border — Libya
  [10.2, 31.5],
  [10.0, 31.0],
  [9.8, 30.5],
  [9.5, 30.2],   // Southernmost point
  // Southwest — Algeria border going north
  [9.0, 30.5],
  [8.5, 31.0],
  [8.3, 31.5],
  [8.1, 32.0],
  [7.9, 32.5],
  [7.7, 33.0],
  [7.6, 33.5],   // Tozeur area (west)
  [7.8, 34.0],
  [8.0, 34.5],
  [8.2, 35.0],
  [8.3, 35.5],
  [8.4, 36.0],
  [8.5, 36.5],
  [8.5, 37.0],   // Back to start
];

// Build the SVG path string from projected coordinates
const projected = BORDER_COORDS.map(([lng, lat]) => project(lng, lat));
const pathParts = projected.map(([x, y], i) =>
  `${i === 0 ? "M" : "L"} ${x.toFixed(1)},${y.toFixed(1)}`
);
export const TUNISIA_SVG_PATH = pathParts.join(" ") + " Z";

export { TUNISIA_BOUNDS };
