"use client";

// TEMPORARY calibration store. Lets us dial in the truck's ground height, the
// wheel size/position, and the light-bar transform with live sliders + arrow
// keys, then Export the numbers. Once baked into truckConfigs we delete this.

import { create } from "zustand";

export type CalibTarget = "truck" | "wheels" | "lightbar";

export interface CalibState {
  enabled: boolean;
  target: CalibTarget;

  // truck vertical fine-tune (added to auto-seat); negative = down
  truckY: number;

  // procedural wheels
  wheelScale: number; // overall tire/rim size multiplier
  wheelTrack: number; // +/- left-right spacing
  wheelHubY: number; // hub height
  wheelFrontZ: number; // front axle Z (model space)
  wheelRearZ: number; // rear axle Z

  // light bar transform (model-local, inside the truck root)
  lbX: number;
  lbY: number;
  lbZ: number;
  lbRotX: number;
  lbRotY: number;
  lbRotZ: number;
  lbScale: number;

  toggle: () => void;
  setTarget: (t: CalibTarget) => void;
  set: (key: keyof CalibState, value: number) => void;
  nudge: (axis: "x" | "y" | "z", delta: number) => void;
}

// defaults seeded from the GLB inspection (hub nodes were ±0.86 X, 0.94 Y,
// front Z -2.21 / rear Z +1.84 in model space).
export const useCalib = create<CalibState>((setState, get) => ({
  enabled: false,
  target: "truck",

  truckY: 0,

  wheelScale: 1,
  wheelTrack: 0.86,
  wheelHubY: 0.94,
  wheelFrontZ: -2.21,
  wheelRearZ: 1.84,

  lbX: 0,
  lbY: 0.0,
  lbZ: -0.3,
  lbRotX: 0,
  lbRotY: 0,
  lbRotZ: 0,
  lbScale: 1,

  toggle: () => setState((s) => ({ enabled: !s.enabled })),
  setTarget: (t) => setState({ target: t }),
  set: (key, value) => setState({ [key]: value } as Partial<CalibState>),

  nudge: (axis, delta) => {
    const s = get();
    if (s.target === "truck") {
      if (axis === "y") setState({ truckY: +(s.truckY + delta).toFixed(3) });
    } else if (s.target === "wheels") {
      if (axis === "x") setState({ wheelTrack: +(s.wheelTrack + delta).toFixed(3) });
      if (axis === "y") setState({ wheelHubY: +(s.wheelHubY + delta).toFixed(3) });
      if (axis === "z") setState({ wheelFrontZ: +(s.wheelFrontZ + delta).toFixed(3), wheelRearZ: +(s.wheelRearZ - delta).toFixed(3) });
    } else {
      if (axis === "x") setState({ lbX: +(s.lbX + delta).toFixed(3) });
      if (axis === "y") setState({ lbY: +(s.lbY + delta).toFixed(3) });
      if (axis === "z") setState({ lbZ: +(s.lbZ + delta).toFixed(3) });
    }
  },
}));

export function calibExport(s: CalibState) {
  return {
    truckY: s.truckY,
    wheels: {
      scale: s.wheelScale,
      track: s.wheelTrack,
      hubY: s.wheelHubY,
      frontZ: s.wheelFrontZ,
      rearZ: s.wheelRearZ,
    },
    lightbar: {
      position: [s.lbX, s.lbY, s.lbZ],
      rotation: [s.lbRotX, s.lbRotY, s.lbRotZ],
      scale: s.lbScale,
    },
  };
}
