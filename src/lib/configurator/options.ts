// ─────────────────────────────────────────────────────────────────────────
// Build-Your-Own-Truck option catalog — MVP scoped to the F-350.
// Every group here maps to something the real GLB can show: per-zone paint
// (body / trim / grille / wheel), wheel-style swap, tire size, lift stance,
// and a roof light bar. Pricing carries through to the quote.
// Architected so more trucks/options slot in later.
// ─────────────────────────────────────────────────────────────────────────

export type PaintZone = "body" | "accent" | "grille" | "wheel";

export interface Swatch {
  id: string;
  name: string;
  hex: string;
  finish: "gloss" | "metallic" | "matte" | "satin";
  price: number;
}

export interface BaseModel {
  id: string;
  make: string;
  model: string;
  trim: string;
  basePrice: number;
  dually: boolean;
  fuel: "Diesel" | "Gas";
  blurb: string;
}

export interface Choice {
  id: string;
  name: string;
  brand?: string;
  price: number;
  liftIn?: number;
  tireIn?: number;
  wheelStyle?: "stock" | "forged8" | "mesh" | "classic6";
  part?: string;
  desc?: string;
}

export interface OptionGroup {
  id: string;
  label: string;
  icon: string;
  type: "single" | "paint";
  zone?: PaintZone;
  choices?: Choice[];
  swatches?: Swatch[];
  defaultId: string;
}

// ── Base model (MVP = the one truck) ────────────────────────────────────────
export const baseModels: BaseModel[] = [
  {
    id: "f350",
    make: "Ford",
    model: "F-350 Super Duty",
    trim: "Lariat Crew Cab",
    basePrice: 82900,
    dually: false,
    fuel: "Diesel",
    blurb: "7.3L · Crew Cab · 4WD · Built by Watts",
  },
];

// ── Paint palette ───────────────────────────────────────────────────────────
const palette: Swatch[] = [
  { id: "oxford-white", name: "Oxford White", hex: "#eceef0", finish: "gloss", price: 0 },
  { id: "agate-black", name: "Agate Black", hex: "#111316", finish: "gloss", price: 0 },
  { id: "carbonized-gray", name: "Carbonized Gray", hex: "#565b63", finish: "metallic", price: 395 },
  { id: "iconic-silver", name: "Iconic Silver", hex: "#9aa0a6", finish: "metallic", price: 395 },
  { id: "antimatter-blue", name: "Antimatter Blue", hex: "#27396b", finish: "metallic", price: 495 },
  { id: "velocity-blue", name: "Velocity Blue", hex: "#1f5fd0", finish: "gloss", price: 495 },
  { id: "rapid-red", name: "Rapid Red", hex: "#86131f", finish: "metallic", price: 595 },
  { id: "race-red", name: "Race Red", hex: "#c11f24", finish: "gloss", price: 495 },
  { id: "forged-green", name: "Forged Green", hex: "#3b4632", finish: "matte", price: 795 },
  { id: "desert-sand", name: "Desert Sand", hex: "#b59a6e", finish: "matte", price: 795 },
  { id: "copper", name: "Burnished Copper", hex: "#8a4b2c", finish: "satin", price: 695 },
  { id: "chrome", name: "Chrome / Bright", hex: "#cdd2d8", finish: "metallic", price: 0 },
  { id: "blackout", name: "Blackout (Satin)", hex: "#15171a", finish: "satin", price: 0 },
  { id: "gunmetal", name: "Gunmetal", hex: "#3a3f47", finish: "metallic", price: 0 },
];

const swatchSet = (ids: string[]) =>
  ids.map((id) => palette.find((s) => s.id === id)!).filter(Boolean);

// ── Option groups ───────────────────────────────────────────────────────────
export const optionGroups: OptionGroup[] = [
  {
    id: "paint-body",
    label: "Body Color",
    icon: "paint",
    type: "paint",
    zone: "body",
    defaultId: "oxford-white",
    swatches: swatchSet([
      "oxford-white", "agate-black", "carbonized-gray", "iconic-silver",
      "antimatter-blue", "velocity-blue", "rapid-red", "race-red",
      "forged-green", "desert-sand", "copper",
    ]),
  },
  {
    id: "paint-accent",
    label: "Trim & Accents",
    icon: "trim",
    type: "paint",
    zone: "accent",
    defaultId: "blackout",
    swatches: swatchSet([
      "blackout", "chrome", "gunmetal", "agate-black",
      "oxford-white", "desert-sand", "copper",
    ]),
  },
  {
    id: "paint-grille",
    label: "Grille",
    icon: "grille",
    type: "paint",
    zone: "grille",
    defaultId: "blackout",
    swatches: swatchSet([
      "blackout", "chrome", "gunmetal", "agate-black",
      "oxford-white", "race-red", "velocity-blue",
    ]),
  },
  {
    id: "lift",
    label: "Lift & Stance",
    icon: "lift",
    type: "single",
    defaultId: "lift6",
    choices: [
      { id: "stock", name: "Factory Height", price: 0, liftIn: 0, desc: "As-delivered ride height" },
      { id: "level", name: "Leveling Kit (2\")", brand: "ReadyLift", price: 1295, liftIn: 2, desc: "Levels the factory rake" },
      { id: "lift4", name: '4" Lift System', brand: "BDS Suspension", price: 4850, liftIn: 4, desc: "Daily-friendly 4\" lift" },
      { id: "lift6", name: '6" Lift System', brand: "Fabtech", price: 6900, liftIn: 6, desc: "Aggressive stance, clears 37s" },
      { id: "lift8", name: '8" Lift System', brand: "BDS Suspension", price: 9400, liftIn: 8, desc: "Show-truck height" },
    ],
  },
  {
    id: "wheels",
    label: "Wheels",
    icon: "wheel",
    type: "single",
    defaultId: "forged8",
    choices: [
      { id: "stock-wheel", name: "Factory Wheel", price: 0, wheelStyle: "stock", desc: "OE alloy" },
      { id: "forged8", name: '22" 8-Spoke Forged', brand: "American Force", price: 4200, wheelStyle: "forged8", desc: "Polished forged 8-spoke" },
      { id: "mesh", name: '22" Concave Mesh', brand: "Fuel Offroad", price: 3850, wheelStyle: "mesh", desc: "Matte black mesh" },
      { id: "classic6", name: '24" 6-Spoke', brand: "Hostile", price: 6400, wheelStyle: "classic6", desc: "24\" forged 6-spoke" },
    ],
  },
  {
    id: "paint-wheel",
    label: "Wheel Finish",
    icon: "wheelpaint",
    type: "paint",
    zone: "wheel",
    defaultId: "blackout",
    swatches: swatchSet([
      "blackout", "chrome", "gunmetal", "agate-black", "copper", "race-red",
    ]),
  },
  {
    id: "tires",
    label: "Tires",
    icon: "tire",
    type: "single",
    defaultId: "toyo37",
    choices: [
      { id: "stock-tire", name: '33" All-Terrain', price: 0, tireIn: 33, desc: "Factory size A/T" },
      { id: "amp35", name: '35" Mud-Terrain', brand: "AMP", price: 1650, tireIn: 35, desc: "Aggressive M/T" },
      { id: "toyo37", name: '37" Toyo M/T', brand: "Toyo", price: 2450, tireIn: 37, desc: "Open Country M/T" },
      { id: "nitto40", name: '40" Nitto Trail Grappler', brand: "Nitto", price: 3650, tireIn: 40, desc: "Maximum presence" },
    ],
  },
  {
    id: "lightbar",
    label: "Roof Light Bar",
    icon: "light",
    type: "single",
    defaultId: "none-light",
    choices: [
      { id: "none-light", name: "No Light Bar", price: 0, part: "none", desc: "Factory roofline" },
      { id: "bar50", name: '50" Curved LED Bar', brand: "Rigid Industries", price: 1450, part: "bar", desc: "Roof-mounted light bar" },
    ],
  },
];

export const swatchById = (id: string) => palette.find((s) => s.id === id);
export const paletteAll = palette;
