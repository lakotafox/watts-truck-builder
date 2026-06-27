"use client";

import { useEffect, useMemo, useState } from "react";
import { useConfig } from "@/lib/configurator/store";
import {
  truckImageUrl,
  truckImaginConfigs,
  swatchToPaintDescription,
  ANGLES,
  IMAGIN_IS_DEMO,
} from "@/lib/configurator/imagin";

export default function TruckStage() {
  const { modelId, selection } = useConfig();
  const cfg = truckImaginConfigs[modelId] ?? truckImaginConfigs.f350;
  const [angleId, setAngleId] = useState<(typeof ANGLES)[number]["id"]>("front");
  const [loaded, setLoaded] = useState(false);

  const angle = ANGLES.find((a) => a.id === angleId)!.angle;
  const paintDescription =
    swatchToPaintDescription[selection["paint-body"]] ?? "white";

  const url = useMemo(
    () =>
      truckImageUrl({
        ...cfg,
        angle,
        paintDescription,
        width: 1400,
      }),
    [cfg, angle, paintDescription]
  );

  // reset the fade when the image source changes
  useEffect(() => {
    setLoaded(false);
  }, [url]);

  // warm the other angles so switching is instant
  useEffect(() => {
    ANGLES.forEach((a) => {
      const img = new Image();
      img.src = truckImageUrl({ ...cfg, angle: a.angle, paintDescription, width: 1400 });
    });
  }, [cfg, paintDescription]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-[#eef1f4] to-[#cfd5dc]">
      {/* studio floor sheen */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/10 to-transparent" />

      {/* base truck image */}
      <div className="absolute inset-0 flex items-center justify-center p-4 md:p-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={url}
          src={url}
          alt="Your custom Ford F-350 build"
          crossOrigin="anonymous"
          onLoad={() => setLoaded(true)}
          className={`max-h-full max-w-full object-contain drop-shadow-2xl transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {!loaded && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-ink/40 text-xs font-bold uppercase tracking-widest animate-pulse">
            Rendering your truck…
          </div>
        </div>
      )}

      {/* angle switcher */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 bg-white/70 backdrop-blur rounded-full p-1 shadow">
        {ANGLES.map((a) => (
          <button
            key={a.id}
            onClick={() => setAngleId(a.id)}
            className={`px-4 py-1.5 text-[0.7rem] font-bold uppercase tracking-wide rounded-full transition-colors ${
              angleId === a.id ? "bg-ink text-white" : "text-ink/60 hover:text-ink"
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      {IMAGIN_IS_DEMO && (
        <div className="absolute top-3 left-3 bg-black/55 text-white text-[0.6rem] font-bold uppercase tracking-wide px-2 py-1 rounded">
          Demo imagery · clean with licensed key
        </div>
      )}
    </div>
  );
}
