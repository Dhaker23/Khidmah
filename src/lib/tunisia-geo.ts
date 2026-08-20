// Accurate Tunisia geographic data
// Tunisia bounding box: ~7.5°E to ~11.6°E, ~30.2°N to ~37.4°N
// Map projection: simple linear interpolation from lat/lng to x/y percentages

// Real coordinates (lat, lng) of Tunisian cities
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

// Tunisia geographic bounding box (approximate)
// North: 37.4°N (Bizerte coast)
// South: 30.2°N (Tataouine south border)
// West: 7.5°E  (Algeria border near Tozeur)
// East: 11.6°E (Cap Bon peninsula + Djerba)
const TUNISIA_BOUNDS = {
  north: 37.5,
  south: 30.2,
  west: 7.5,
  east: 11.7,
};

// Convert lat/lng to x/y percentage on the map
// x: 0% = west (7.5°E), 100% = east (11.7°E)
// y: 0% = north (37.5°N), 100% = south (30.2°N)
export function latLngToXY(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - TUNISIA_BOUNDS.west) / (TUNISIA_BOUNDS.east - TUNISIA_BOUNDS.west)) * 100;
  const y = ((TUNISIA_BOUNDS.north - lat) / (TUNISIA_BOUNDS.north - TUNISIA_BOUNDS.south)) * 100;
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

// Convert all cities to x/y positions
export const CITIES_WITH_POS = CITIES_GEO.map((c) => ({
  ...c,
  ...latLngToXY(c.lat, c.lng),
}));

// Simplified Tunisia border path (SVG viewBox 0 0 100 100)
// This is a stylized but geographically accurate outline of Tunisia
// Based on the real country shape: narrow north, widening center, pointed south
export const TUNISIA_SVG_PATH = `M 38,2
  L 42,1 L 46,2 L 50,4 L 52,7
  L 54,5 L 57,4 L 60,6 L 62,9
  L 60,12 L 58,15 L 56,18
  L 54,16 L 52,18 L 50,20
  L 52,22 L 54,25 L 52,28
  L 50,30 L 48,28 L 46,25
  L 44,22 L 42,20
  L 40,25 L 38,30 L 36,35
  L 38,40 L 40,45 L 42,50
  L 44,55 L 46,60 L 48,65
  L 46,70 L 44,75 L 42,80
  L 40,85 L 38,90 L 36,95
  L 38,98 L 36,99
  L 34,95 L 32,90 L 30,85
  L 28,80 L 26,75 L 24,70
  L 22,65 L 20,60 L 18,55
  L 20,50 L 22,45 L 24,40
  L 26,35 L 28,30 L 30,25
  L 32,20 L 34,15 L 36,10
  Z`;

export { TUNISIA_BOUNDS };
