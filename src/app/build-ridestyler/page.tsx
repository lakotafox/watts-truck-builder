import type { Metadata } from "next";
import RideStylerStage from "@/components/configurator/RideStylerStage";

export const metadata: Metadata = {
  title: "Build Your Own Truck (RideStyler) | Watts Automotive",
  description:
    "Design your custom Ford F-350 Super Duty in real time — paint, lift and wheels rendered live by RideStyler. Configure your spec and send it to Watts for an exact quote.",
};

export default function BuildRideStylerPage() {
  return (
    <>
      {/* Watts-style intro band */}
      <section className="bg-canvas border-b border-line">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center">
          <p className="text-xs uppercase tracking-widest text-brand font-bold">
            Buy ours, or build yours · Live visualizer
          </p>
          <h1 className="display text-3xl md:text-5xl text-ink mt-1">Build Your Own Truck</h1>
          <p className="text-muted max-w-2xl mx-auto mt-3">
            Spec a custom rig the Watts way — pick your platform from Ford, Ram, GMC, Chevy, Toyota,
            Jeep and Nissan, then choose your paint, dial in the lift, bolt on a set of wheels and tap
            the truck to spin it. All rendered in real time. When it looks right, send us the build
            for an exact quote. Powered by the RideStyler visualization platform.
          </p>
        </div>
      </section>

      <RideStylerStage />

      {/* Reassurance band */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 grid sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="display text-3xl text-brand">25,000+</p>
            <p className="text-sm text-white/60 mt-1">Custom trucks built &amp; sold</p>
          </div>
          <div>
            <p className="display text-3xl text-brand">Real Fitment</p>
            <p className="text-sm text-white/60 mt-1">Lift &amp; wheels rendered to spec</p>
          </div>
          <div>
            <p className="display text-3xl text-brand">Made in UT</p>
            <p className="text-sm text-white/60 mt-1">American Fork, shipped 50 states</p>
          </div>
        </div>
      </section>
    </>
  );
}
