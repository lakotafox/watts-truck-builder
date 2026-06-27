import type { Metadata } from "next";
import Configurator from "@/components/configurator/Configurator";

export const metadata: Metadata = {
  title: "Build Your Own Truck | Watts Automotive Custom Truck Builder",
  description:
    "Design your custom lifted truck in real time — pick your model, lift, wheels, tires, paint down to the emblem, bumpers, lighting and more. Get an instant build price.",
};

export default function BuildPage() {
  return (
    <>
      <section className="bg-canvas border-b border-line">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center">
          <p className="text-xs uppercase tracking-widest text-brand font-bold">Buy ours, or build yours</p>
          <h1 className="display text-3xl md:text-5xl text-ink mt-1">Build Your Own Truck</h1>
          <p className="text-muted max-w-2xl mx-auto mt-3">
            The same custom builds Watts is known for — now configured by you in real time. Choose your
            platform, dial in lift and fitment, color it down to the emblem, then send us your spec for an
            exact quote. Over 15,000 trucks customized and counting.
          </p>
        </div>
      </section>
      <Configurator />
    </>
  );
}
