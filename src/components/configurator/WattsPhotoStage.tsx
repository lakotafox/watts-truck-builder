"use client";

import { useConfig, getSwatch } from "@/lib/configurator/store";

// Real Watts build photos, background-removed. Because the body is shot white,
// a `multiply` color layer clipped to the truck silhouette repaints the body to
// ANY color while the black wheels / grille / glass stay dark automatically
// (white×color = color, black×color = black). This is the Nike-By-You trick on
// a real, already-lifted, already-custom-wheeled truck.
const BUILD = {
  cut: "/builds/f350-starwhite_cut.png",
  ratio: 640 / 427,
  name: "2024 Ford F-350 Super Duty",
  spec: '8" Lift · 24" Forged · 37" Toyo M/T',
};

export default function WattsPhotoStage() {
  const { selection } = useConfig();
  const sw = getSwatch(selection["paint-body"]);
  const hex = sw?.hex ?? "#eceef0";
  const matte = sw?.finish === "matte" || sw?.finish === "satin";

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-[#f1f4f7] via-[#e6eaef] to-[#c9d0d8]">
      {/* soft studio floor */}
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/10 to-transparent" />

      <div className="absolute inset-0 flex items-center justify-center p-4 md:p-10">
        <div
          className="relative w-full max-w-4xl"
          style={{ aspectRatio: String(BUILD.ratio) }}
        >
          {/* contact shadow */}
          <div className="absolute left-1/2 bottom-[6%] -translate-x-1/2 w-[78%] h-[7%] bg-black/30 blur-xl rounded-[50%]" />

          {/* base photo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BUILD.cut}
            alt={BUILD.name}
            className="absolute inset-0 w-full h-full object-contain"
          />

          {/* recolor layer — clipped to the truck, multiplied over the white body */}
          <div
            className="absolute inset-0 w-full h-full pointer-events-none transition-colors duration-300"
            style={{
              backgroundColor: hex,
              mixBlendMode: "multiply",
              opacity: matte ? 0.92 : 1,
              WebkitMaskImage: `url(${BUILD.cut})`,
              maskImage: `url(${BUILD.cut})`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />

          {/* subtle gloss sheen for non-matte finishes */}
          {!matte && (
            <div
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{
                background:
                  "linear-gradient(105deg, rgba(255,255,255,0.18) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.10) 100%)",
                mixBlendMode: "screen",
                WebkitMaskImage: `url(${BUILD.cut})`,
                maskImage: `url(${BUILD.cut})`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />
          )}
        </div>
      </div>

      {/* build label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <p className="text-ink font-bold text-sm">{BUILD.name}</p>
        <p className="text-ink/50 text-[0.7rem] uppercase tracking-wide">{BUILD.spec}</p>
      </div>
    </div>
  );
}
