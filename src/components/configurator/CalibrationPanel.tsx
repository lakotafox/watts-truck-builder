"use client";

import { useEffect, useState } from "react";
import { useCalib, calibExport, type CalibState } from "@/lib/configurator/calibration";

interface Field {
  key: keyof CalibState;
  label: string;
  min: number;
  max: number;
  step: number;
}

const FIELDS: Record<string, Field[]> = {
  truck: [{ key: "truckY", label: "Ride height (Y)", min: -2, max: 2, step: 0.01 }],
  wheels: [
    { key: "wheelScale", label: "Wheel/Tire size", min: 0.4, max: 2.2, step: 0.01 },
    { key: "wheelTrack", label: "Track width (±X)", min: 0.3, max: 1.6, step: 0.01 },
    { key: "wheelHubY", label: "Hub height (Y)", min: 0.2, max: 2, step: 0.01 },
    { key: "wheelFrontZ", label: "Front axle (Z)", min: -4, max: 0, step: 0.01 },
    { key: "wheelRearZ", label: "Rear axle (Z)", min: 0, max: 4, step: 0.01 },
  ],
  lightbar: [
    { key: "lbX", label: "Position X", min: -2, max: 2, step: 0.01 },
    { key: "lbY", label: "Position Y (vs roof)", min: -2, max: 2, step: 0.01 },
    { key: "lbZ", label: "Position Z", min: -3, max: 3, step: 0.01 },
    { key: "lbRotX", label: "Rotate X", min: -3.2, max: 3.2, step: 0.02 },
    { key: "lbRotY", label: "Rotate Y", min: -3.2, max: 3.2, step: 0.02 },
    { key: "lbRotZ", label: "Rotate Z", min: -3.2, max: 3.2, step: 0.02 },
    { key: "lbScale", label: "Scale", min: 0.2, max: 3, step: 0.01 },
  ],
};

export default function CalibrationPanel() {
  const calib = useCalib();
  const [copied, setCopied] = useState(false);
  const [json, setJson] = useState("");

  // arrow-key nudging of the active target
  useEffect(() => {
    if (!calib.enabled) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const big = e.shiftKey;
      const d = big ? 0.1 : 0.02;
      let handled = true;
      switch (e.key) {
        case "ArrowLeft": calib.nudge("x", -d); break;
        case "ArrowRight": calib.nudge("x", d); break;
        case "ArrowUp": big ? calib.nudge("y", d) : calib.nudge("z", -d); break;
        case "ArrowDown": big ? calib.nudge("y", -d) : calib.nudge("z", d); break;
        default: handled = false;
      }
      if (handled) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [calib]);

  if (!calib.enabled) {
    return (
      <button
        onClick={calib.toggle}
        className="absolute bottom-4 left-4 z-20 bg-white/10 hover:bg-white/20 backdrop-blur text-white text-[0.68rem] font-bold uppercase tracking-wide px-3 py-2"
      >
        ⚙ Calibrate
      </button>
    );
  }

  const doExport = () => {
    const data = JSON.stringify(calibExport(calib), null, 2);
    setJson(data);
    navigator.clipboard?.writeText(data).then(
      () => { setCopied(true); setTimeout(() => setCopied(false), 1800); },
      () => {}
    );
  };

  const fields = FIELDS[calib.target];

  return (
    <div className="absolute bottom-4 left-4 z-30 w-[330px] max-h-[80%] overflow-y-auto bg-ink/95 backdrop-blur border border-white/15 text-white shadow-2xl">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <span className="text-xs font-bold uppercase tracking-widest text-brand">Calibration</span>
        <button onClick={calib.toggle} className="text-white/60 hover:text-white text-sm">✕</button>
      </div>

      {/* target tabs */}
      <div className="flex border-b border-white/10">
        {(["truck", "wheels", "lightbar"] as const).map((t) => (
          <button
            key={t}
            onClick={() => calib.setTarget(t)}
            className={`flex-1 py-2 text-[0.68rem] font-bold uppercase tracking-wide ${
              calib.target === t ? "bg-brand text-white" : "text-white/60 hover:text-white"
            }`}
          >
            {t === "lightbar" ? "Light Bar" : t}
          </button>
        ))}
      </div>

      <div className="p-3 space-y-3">
        {fields.map((f) => {
          const val = calib[f.key] as number;
          return (
            <div key={f.key as string}>
              <div className="flex justify-between text-[0.7rem] mb-1">
                <span className="text-white/70">{f.label}</span>
                <span className="font-mono text-brand">{val.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={f.min}
                max={f.max}
                step={f.step}
                value={val}
                onChange={(e) => calib.set(f.key, parseFloat(e.target.value))}
                className="w-full accent-[var(--color-brand)]"
              />
            </div>
          );
        })}

        <p className="text-[0.62rem] text-white/40 leading-relaxed pt-1">
          Arrow keys nudge the active target: ←/→ = X · ↑/↓ = Z · Shift+↑/↓ = Y. Hold Shift for bigger steps.
        </p>

        <button onClick={doExport} className="btn btn-brand w-full !py-2 !text-[0.7rem]">
          {copied ? "Copied to clipboard ✓" : "Export values"}
        </button>

        {json && (
          <textarea
            readOnly
            value={json}
            onFocusCapture={(e) => e.currentTarget.select()}
            className="w-full h-40 text-[0.62rem] font-mono bg-black/40 border border-white/10 p-2 text-white/80"
          />
        )}
      </div>
    </div>
  );
}
