// IMAGIN.studio image API — the proven photoreal vehicle-image source that powers
// OEM/dealer "build & price" tools. We use it for the base truck photo and recolor
// it by paint param; wheels/lift are our own overlays on top (the AutoSync model).
//
// DEV: the public demo key `img` returns real, model-accurate images but WATERMARKED.
// PROD: set NEXT_PUBLIC_IMAGIN_KEY to the dealership's own (clean, licensed) key.

export const IMAGIN_KEY =
  process.env.NEXT_PUBLIC_IMAGIN_KEY?.trim() || "img";

export const IMAGIN_IS_DEMO = IMAGIN_KEY === "img";

export interface TruckImageParams {
  make: string;
  modelFamily: string;
  modelYear: string | number;
  /** IMAGIN angle index: 01–33 static views, 200–231 = 32-frame 360 spin */
  angle: string | number;
  /** plain color word IMAGIN understands: white, black, red, blue, silver, grey, green… */
  paintDescription?: string;
  /** OEM paint product code (preferred when known) */
  paintId?: string;
  width?: number;
  zoomType?: "fullscreen" | "relative";
}

export function truckImageUrl(p: TruckImageParams): string {
  const q = new URLSearchParams({
    customer: IMAGIN_KEY,
    make: p.make,
    modelFamily: p.modelFamily,
    modelYear: String(p.modelYear),
    angle: String(p.angle),
    zoomType: p.zoomType ?? "fullscreen",
    fileType: "png",
  });
  if (p.width) q.set("width", String(p.width));
  if (p.paintId) q.set("paintId", p.paintId);
  if (p.paintDescription) q.set("paintDescription", p.paintDescription);
  return `https://cdn.imagin.studio/getImage?${q.toString()}`;
}

// The three hero angles the pros expose (driver front-¾, side profile, rear-¾).
export const ANGLES = [
  { id: "front", label: "Front ¾", angle: 23 },
  { id: "side", label: "Side", angle: 17 },
  { id: "rear", label: "Rear ¾", angle: 9 },
] as const;

// Per-truck IMAGIN identity. Adding Ram/GMC/Tundra later = one more entry.
export interface TruckImaginConfig {
  make: string;
  modelFamily: string;
  modelYear: number;
}

export const truckImaginConfigs: Record<string, TruckImaginConfig> = {
  f350: { make: "ford", modelFamily: "f-350", modelYear: 2023 },
};

// Our body-paint swatch id -> IMAGIN paintDescription word (it maps to the nearest
// real OEM paint). The base truck image is re-rendered in this color by the API —
// exactly how the pros recolor (whole-image swap, not a CSS tint).
export const swatchToPaintDescription: Record<string, string> = {
  "oxford-white": "white",
  "agate-black": "black",
  "carbonized-gray": "grey",
  "iconic-silver": "silver",
  "antimatter-blue": "blue",
  "velocity-blue": "blue",
  "rapid-red": "red",
  "race-red": "red",
  "forged-green": "green",
  "desert-sand": "beige",
  copper: "orange",
};

