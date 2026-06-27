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
