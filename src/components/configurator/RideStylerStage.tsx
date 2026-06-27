"use client";

/**
 * RideStylerStage
 * ----------------
 * A Watts-branded "Build Your Own Truck" configurator powered live by RideStyler's
 * real-time vehicle render API. Pick from a catalog of trucks/SUVs, then dial in paint,
 * lift, wheels and camera angle — all rendered on the fly by RideStyler.
 *
 * How it works (no iframe, no client SDK required):
 *   RideStyler exposes an image endpoint — GET https://api.ridestyler.net/Vehicle/Render
 *   — that returns a composite PNG given query parameters (paint color, suspension/lift,
 *   wheel fitment, view angle, etc.). We point an <img> at a URL we build from the user's
 *   selections; the API 302-redirects to a CDN-cached PNG the browser follows.
 *
 *   PaintColor accepts ARBITRARY hex (verified live). Suspension is a continuous numeric
 *   lift offset (no dataset clamp; exposed 0–12). There is NO trim/secondary-color param,
 *   so two-tone/blackout is not natively supported (see RIDESTYLER_NOTES.md).
 *
 * Catalog: src/lib/configurator/rideStylerTrucks.ts — every entry was verified to return
 *   a real render (not the "no image" placeholder) before inclusion.
 *
 * Performance: we cache-warm the browser HTTP cache by background-prefetching the render
 *   URLs for adjacent choices (all wheels, all camera angles, all colors) the moment a
 *   truck is selected and whenever the truck/lift/color changes — concurrency-capped at 6,
 *   de-duped by URL (URLs embed the truck id, so re-selecting a truck never refetches).
 *   Clicks then swap to an already-cached image. The visible <img> never blanks.
 *
 * Auth: every request carries an account Key, read from NEXT_PUBLIC_RIDESTYLER_KEY with a
 *   public demo-key fallback so the page renders live out of the box.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  rideStylerTrucks,
  rideStylerMakes,
  type RideStylerTruck,
  type RideStylerView,
} from "@/lib/configurator/rideStylerTrucks";

const API_BASE = "https://api.ridestyler.net";

// RideStyler's public developer/demo key (from their official Vehicle Renderer widget
// readme + test.html). Renders live but is shared/rate-limited — replace for production.
const DEMO_KEY = "c028c54cf0c447c594a862de6ac85d1a";

const RIDESTYLER_KEY = process.env.NEXT_PUBLIC_RIDESTYLER_KEY || DEMO_KEY;
const USING_DEMO_KEY = !process.env.NEXT_PUBLIC_RIDESTYLER_KEY;

const DEFAULT_TRUCK_ID =
  rideStylerTrucks.find((t) => t.model === "F-350 Super Duty")?.id ??
  rideStylerTrucks[0].id;

// Ford/Watts-style paint palette. Every hex renders correctly (PaintColor takes arbitrary
// hex — confirmed live). Cobalt leads (the Watts accent).
const PAINTS = [
  { name: "Oxford White", hex: "#e9eaec" },
  { name: "Star White", hex: "#eef0ee" },
  { name: "Avalanche", hex: "#d9dde0" },
  { name: "Iconic Silver", hex: "#9aa0a8" },
  { name: "Carbonized Gray", hex: "#4b4f54" },
  { name: "Gunmetal", hex: "#2b2f36" },
  { name: "Agate Black", hex: "#15171c" },
  { name: "Watts Cobalt", hex: "#283dc4" },
  { name: "Antimatter Blue", hex: "#27396b" },
  { name: "Velocity Blue", hex: "#1f5fbf" },
  { name: "Rapid Red", hex: "#7c1620" },
  { name: "Race Red", hex: "#c01622" },
  { name: "Forged Green", hex: "#3b4632" },
  { name: "Desert Sand", hex: "#c8b289" },
  { name: "Burnished Copper", hex: "#8a4b2c" },
];

// Suspension is a continuous numeric lift; we expose every integer step 0..12.
const LIFT_MAX = 12;
const LIFT_INCHES = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16]; // index = Suspension value
function liftLabel(v: number): string {
  if (v <= 0) return "Stock";
  const inch = LIFT_INCHES[v] ?? v;
  return `${inch}" Lift`;
}

const VIEW_LABEL: Record<RideStylerView, string> = { side: "Side", angle: "3/4 View" };

type Wheel = {
  WheelFitmentID: string;
  WheelBrandName?: string;
  WheelModelName?: string;
  WheelFitmentPartNumber?: string;
};

const FALLBACK_WHEELS: Wheel[] = [
  { WheelFitmentID: "56dda7cf-a32c-49aa-9392-0d433a65cad7", WheelBrandName: "Moto Metal", WheelModelName: "MO970" },
  { WheelFitmentID: "84c314dc-e8bb-4810-b999-1222f7db5415", WheelBrandName: "ATX Series", WheelModelName: "AX203" },
  { WheelFitmentID: "097f7a29-2cf2-46b2-be8a-174166f3dd19", WheelBrandName: "American Racing", WheelModelName: "AR62 Outlaw II" },
];

const RENDER_W = 1000;
const RENDER_H = 620;

type Spec = {
  truckId: string;
  paint: string;
  lift: number;
  wheelId: string;
  view: RideStylerView;
};

function buildRenderUrl(s: Spec): string {
  const p = new URLSearchParams();
  p.set("Key", RIDESTYLER_KEY);
  p.set("Type", s.view);
  p.set("VehicleConfiguration", s.truckId);
  p.set("PaintColor", s.paint);
  p.set("Width", String(RENDER_W));
  p.set("Height", String(RENDER_H));
  p.set("IncludeShadow", "true");
  if (s.lift > 0) p.set("Suspension", String(s.lift));
  if (s.wheelId) p.set("WheelFitment", s.wheelId);
  return `${API_BASE}/Vehicle/Render?${p.toString()}`;
}

function RotateIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 12a9 9 0 1 0 3-6.7M3 4v4h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function RideStylerStage() {
  const [truckId, setTruckId] = useState(DEFAULT_TRUCK_ID);
  const [paint, setPaint] = useState("#283dc4"); // Watts Cobalt
  const [lift, setLift] = useState(4);
  const [wheelId, setWheelId] = useState<string>(""); // "" = factory wheels
  const [view, setView] = useState<RideStylerView>("angle");
  const [activeMake, setActiveMake] = useState(
    rideStylerTrucks.find((t) => t.id === DEFAULT_TRUCK_ID)?.make ?? rideStylerMakes[0],
  );

  const [wheels, setWheels] = useState<Wheel[]>(FALLBACK_WHEELS);

  // Smooth swap: the visible image always shows the last fully-loaded URL.
  const [displayedUrl, setDisplayedUrl] = useState<string>("");
  const [imgError, setImgError] = useState(false);

  const truck: RideStylerTruck =
    rideStylerTrucks.find((t) => t.id === truckId) ?? rideStylerTrucks[0];

  // Keep the view valid for the selected truck (each config supports a subset of angles).
  useEffect(() => {
    if (!truck.views.includes(view)) setView(truck.views[0]);
  }, [truck, view]);

  // Pull a real wheel list for the selected truck at runtime.
  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({
      Key: RIDESTYLER_KEY,
      VehicleConfiguration: truckId,
      Count: "12",
    });
    setWheelId(""); // reset to factory when the truck changes
    fetch(`${API_BASE}/Wheel/GetFitmentDescriptions?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const list: Wheel[] = data?.Fitments ?? [];
        if (list.length) {
          const seen = new Set<string>();
          const clean = list.filter((w) => {
            const k = `${w.WheelBrandName}|${w.WheelModelName}`;
            if (seen.has(k)) return false;
            seen.add(k);
            return true;
          });
          setWheels(clean.slice(0, 9));
        } else {
          setWheels(FALLBACK_WHEELS);
        }
      })
      .catch(() => setWheels(FALLBACK_WHEELS));
    return () => {
      cancelled = true;
    };
  }, [truckId]);

  const safeView: RideStylerView = truck.views.includes(view) ? view : truck.views[0];
  const spec: Spec = useMemo(
    () => ({ truckId, paint, lift, wheelId, view: safeView }),
    [truckId, paint, lift, wheelId, safeView],
  );
  const renderUrl = useMemo(() => buildRenderUrl(spec), [spec]);

  useEffect(() => {
    setImgError(false);
  }, [renderUrl]);

  // ---- Cache-warming prefetch (concurrency-capped) ----
  const prefetched = useRef<Set<string>>(new Set());
  const queue = useRef<string[]>([]);
  const active = useRef(0);
  const MAX_CONCURRENCY = 6;

  const pump = useCallback(() => {
    while (active.current < MAX_CONCURRENCY && queue.current.length) {
      const url = queue.current.shift()!;
      if (prefetched.current.has(url)) continue;
      prefetched.current.add(url);
      active.current++;
      const img = new window.Image();
      const done = () => {
        active.current--;
        pump();
      };
      img.onload = done;
      img.onerror = done;
      img.src = url;
    }
  }, []);

  const enqueue = useCallback(
    (urls: string[]) => {
      for (const u of urls) {
        if (!prefetched.current.has(u) && !queue.current.includes(u)) queue.current.push(u);
      }
      pump();
    },
    [pump],
  );

  // Warm the moment a truck is selected (and on lift/color change): all wheels, all of THIS
  // truck's angles, and all colors at the current lift/wheel/angle.
  useEffect(() => {
    const urls: string[] = [];
    for (const w of ["", ...wheels.map((x) => x.WheelFitmentID)]) {
      urls.push(buildRenderUrl({ ...spec, wheelId: w }));
    }
    for (const v of truck.views) {
      urls.push(buildRenderUrl({ ...spec, view: v }));
    }
    for (const c of PAINTS) {
      urls.push(buildRenderUrl({ ...spec, paint: c.hex }));
    }
    enqueue(urls);
  }, [spec, wheels, truck, enqueue]);

  const updating = displayedUrl !== renderUrl && !imgError;
  const firstLoad = displayedUrl === "";

  const canRotate = truck.views.length > 1;
  const rotate = useCallback(() => {
    if (!canRotate) return;
    const i = truck.views.indexOf(safeView);
    setView(truck.views[(i + 1) % truck.views.length]);
  }, [truck, safeView, canRotate]);

  const activePaint = PAINTS.find((p) => p.hex === paint)?.name ?? "Custom";
  const activeLift = liftLabel(lift);
  const activeWheel = wheelId
    ? (() => {
        const w = wheels.find((x) => x.WheelFitmentID === wheelId);
        return w ? `${w.WheelBrandName ?? ""} ${w.WheelModelName ?? ""}`.trim() : "Custom";
      })()
    : "Factory";

  const trucksForMake = rideStylerTrucks.filter((t) => t.make === activeMake);

  return (
    <section className="bg-canvas">
      <div className="mx-auto max-w-7xl px-4 py-6 lg:py-10">
        {/* ---------------- Truck / model picker ---------------- */}
        <div className="mb-6">
          <p className="text-[11px] uppercase tracking-widest font-bold text-muted mb-2">
            Choose your platform · {rideStylerTrucks.length} models
          </p>
          {/* Make tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
            {rideStylerMakes.map((mk) => (
              <button
                key={mk}
                onClick={() => setActiveMake(mk)}
                className={`shrink-0 px-4 min-h-[40px] text-xs font-bold uppercase tracking-wider border transition-colors ${
                  activeMake === mk
                    ? "bg-ink text-white border-ink"
                    : "bg-white text-ink border-line hover:border-brand"
                }`}
              >
                {mk}
              </button>
            ))}
          </div>
          {/* Trucks for active make */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 mt-2 pb-1">
            {trucksForMake.map((t) => {
              const selected = t.id === truckId;
              return (
                <button
                  key={t.id}
                  onClick={() => setTruckId(t.id)}
                  className={`shrink-0 px-4 py-2 min-h-[44px] text-left border transition-colors ${
                    selected
                      ? "bg-brand text-white border-brand"
                      : "bg-white text-ink border-line hover:border-brand"
                  }`}
                >
                  <span className="block text-sm font-bold leading-tight whitespace-nowrap">
                    {t.model}
                  </span>
                  <span
                    className={`block text-[11px] ${selected ? "text-white/70" : "text-muted"}`}
                  >
                    {t.year}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ---------------- Stage + controls ---------------- */}
        <div className="grid lg:grid-cols-[1.55fr_1fr] gap-6">
          {/* Stage */}
          <div className="bg-white border border-line shadow-card overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-line gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="inline-block w-2 h-2 rounded-full bg-brand shrink-0" />
                <span className="text-xs uppercase tracking-widest font-bold text-ink truncate">
                  {truck.label}
                </span>
              </div>
              {canRotate && (
                <div className="inline-flex border border-line shrink-0">
                  {truck.views.map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className={`px-3 min-h-[36px] text-xs uppercase tracking-wider font-bold transition-colors ${
                        safeView === v ? "bg-brand text-white" : "bg-white text-muted hover:text-ink"
                      }`}
                    >
                      {VIEW_LABEL[v]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div
              className={`relative flex-1 flex items-center justify-center select-none ${
                canRotate ? "cursor-pointer" : ""
              }`}
              style={{
                minHeight: 300,
                background:
                  "radial-gradient(120% 90% at 50% 35%, #ffffff 0%, #f1f1f1 55%, #e2e2e2 100%)",
              }}
              onClick={rotate}
              role={canRotate ? "button" : undefined}
              aria-label={canRotate ? "Tap to rotate the vehicle" : undefined}
            >
              {/* Hidden loader drives the smooth swap (promote on load → no blank flash). */}
              {!imgError && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={renderUrl}
                  src={renderUrl}
                  alt=""
                  aria-hidden="true"
                  className="hidden"
                  onLoad={() => setDisplayedUrl(renderUrl)}
                  onError={() => setImgError(true)}
                />
              )}

              {firstLoad && !imgError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 border-2 border-line border-t-brand rounded-full animate-spin" />
                </div>
              )}

              {imgError ? (
                <div className="text-center px-6 py-12">
                  <p className="text-sm text-muted">
                    Couldn&apos;t reach the RideStyler render service for this combination.
                    Try another paint, wheel or angle.
                  </p>
                </div>
              ) : (
                displayedUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={displayedUrl}
                    alt={`${truck.label} in ${activePaint} with ${activeLift} and ${activeWheel} wheels`}
                    className="w-full max-w-full h-auto max-h-[58vh] object-contain pointer-events-none"
                  />
                )
              )}

              {/* Tap-to-rotate affordance */}
              {canRotate && !firstLoad && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-ink/85 text-white px-3 py-1.5 text-[10px] uppercase tracking-widest pointer-events-none">
                  <RotateIcon className="w-3.5 h-3.5" />
                  Tap to rotate
                </div>
              )}

              {updating && !firstLoad && (
                <div className="absolute top-3 left-3 flex items-center gap-2 bg-white/85 px-2.5 py-1 text-[10px] uppercase tracking-widest text-muted pointer-events-none">
                  <span className="h-3 w-3 border-2 border-line border-t-brand rounded-full animate-spin" />
                  Updating
                </div>
              )}

              <div className="absolute bottom-3 right-3 text-[10px] uppercase tracking-widest text-muted/70 pointer-events-none">
                Live render · RideStyler
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-5">
            {/* Spec summary */}
            <div className="bg-ink text-white p-5">
              <p className="text-[11px] uppercase tracking-widest text-white/50">Your build</p>
              <h2 className="display text-2xl mt-1">{truck.make} {truck.model}</h2>
              <dl className="mt-4 grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                <dt className="text-white/50">Paint</dt>
                <dd className="text-right font-semibold">{activePaint}</dd>
                <dt className="text-white/50">Lift</dt>
                <dd className="text-right font-semibold">{activeLift}</dd>
                <dt className="text-white/50">Wheels</dt>
                <dd className="text-right font-semibold truncate">{activeWheel}</dd>
              </dl>
              <a
                href={`mailto:sales@wattsautomotive.com?subject=${encodeURIComponent(
                  `Custom ${truck.make} ${truck.model} build request`,
                )}&body=${encodeURIComponent(
                  `I'd like a quote on this build:\n\nVehicle: ${truck.label}\nPaint: ${activePaint}\nLift: ${activeLift}\nWheels: ${activeWheel}\n`,
                )}`}
                className="btn btn-brand w-full mt-5"
              >
                Request This Build
              </a>
            </div>

            {/* Paint */}
            <Field label={`Paint · ${activePaint}`}>
              <div className="flex flex-wrap gap-2.5">
                {PAINTS.map((p) => (
                  <button
                    key={p.hex}
                    title={p.name}
                    onClick={() => setPaint(p.hex)}
                    className={`w-10 h-10 rounded-full border transition-transform ${
                      paint === p.hex
                        ? "ring-2 ring-brand ring-offset-2 ring-offset-canvas scale-110"
                        : "border-line active:scale-105 hover:scale-105"
                    }`}
                    style={{ background: p.hex }}
                    aria-label={p.name}
                  />
                ))}
              </div>
            </Field>

            {/* Lift — full ladder via slider (every level 0..12) */}
            <Field label={`Suspension · ${activeLift}`}>
              <input
                type="range"
                min={0}
                max={LIFT_MAX}
                step={1}
                value={lift}
                onChange={(e) => setLift(Number(e.target.value))}
                className="w-full h-2 accent-brand cursor-pointer"
                aria-label="Lift height"
              />
              <div className="flex justify-between mt-1 text-[10px] uppercase tracking-wider text-muted">
                <span>Stock</span>
                <span>{liftLabel(Math.round(LIFT_MAX / 2))}</span>
                <span>{liftLabel(LIFT_MAX)}</span>
              </div>
            </Field>

            {/* Wheels */}
            <Field label={`Wheels · ${activeWheel}`}>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => setWheelId("")}
                  className={`px-3 py-2 min-h-[44px] text-xs font-semibold text-left border transition-colors ${
                    wheelId === ""
                      ? "bg-brand text-white border-brand"
                      : "bg-white text-ink border-line hover:border-brand"
                  }`}
                >
                  Factory wheels
                </button>
                {wheels.map((w) => (
                  <button
                    key={w.WheelFitmentID}
                    onClick={() => setWheelId(w.WheelFitmentID)}
                    className={`px-3 py-2 min-h-[44px] text-xs font-semibold text-left border transition-colors ${
                      wheelId === w.WheelFitmentID
                        ? "bg-brand text-white border-brand"
                        : "bg-white text-ink border-line hover:border-brand"
                    }`}
                  >
                    <span className="block truncate">{w.WheelBrandName}</span>
                    <span className="block truncate opacity-70">{w.WheelModelName}</span>
                  </button>
                ))}
              </div>
            </Field>

            {USING_DEMO_KEY && (
              <p className="text-[11px] leading-relaxed text-muted border-l-2 border-brand pl-3">
                Developer preview — rendering through RideStyler&apos;s shared public demo key.
                For production, set <code className="text-ink">NEXT_PUBLIC_RIDESTYLER_KEY</code> to a
                licensed Watts Automotive account key. The embed is otherwise complete.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-widest font-bold text-muted mb-2">{label}</p>
      {children}
    </div>
  );
}
