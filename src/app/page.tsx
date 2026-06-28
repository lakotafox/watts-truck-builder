import Link from "next/link";
import { site, categories } from "@/lib/site";

// Map each lifted category to its real Watts photo in /public/home.
const categoryImages: Record<string, string> = {
  ford: "/home/cat-ford.jpg",
  ram: "/home/cat-ram.jpg",
  chevy: "/home/cat-chevy.jpg",
  gmc: "/home/cat-gmc.jpg",
  toyota: "/home/cat-toyota.jpg",
  diesel: "/home/cat-diesel.jpg",
  suv: "/home/cat-suv.jpg",
  jeep: "/home/cat-jeep.jpg",
};

const featured = [
  {
    img: "/home/slide-109240.jpg",
    badge: "Built by Watts",
    title: "F-350 Super Duty Platinum",
    spec: "Desert Sand · 8\" Lift · 24\" Forged Wheels",
  },
  {
    img: "/home/slide-108855.jpg",
    badge: "Dually",
    title: "F-450 Limited Dually",
    spec: "Avalanche Gray · Leveled Stance · 22\" Black",
  },
  {
    img: "/home/slide-109181.jpg",
    badge: "Matching Pair",
    title: "Star White F-350 & Raptor R",
    spec: "Color-Matched Build · Premium Off-Road Package",
  },
];

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* Scoped, dependency-free entrance + Ken-Burns animations */}
      <style>{`
        @keyframes wa-zoom { from { transform: scale(1.12); } to { transform: scale(1); } }
        @keyframes wa-up { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .wa-zoom { animation: wa-zoom 14s ease-out forwards; }
        .wa-up { opacity: 0; animation: wa-up 0.8s cubic-bezier(.2,.7,.2,1) forwards; }
        .wa-d1 { animation-delay: .1s; }
        .wa-d2 { animation-delay: .25s; }
        .wa-d3 { animation-delay: .4s; }
        .wa-d4 { animation-delay: .55s; }
        @media (prefers-reduced-motion: reduce) {
          .wa-zoom, .wa-up { animation: none; opacity: 1; }
        }
      `}</style>

      {/* ============ 1. HERO ============ */}
      <section className="relative min-h-[88vh] flex items-end overflow-hidden bg-ink">
        <img
          src="/home/slide-109354.jpg"
          alt="Lifted Ford F-350 Super Duty by Watts Automotive"
          className="wa-zoom absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        {/* gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/20 to-transparent" />

        <div className="relative mx-auto max-w-7xl w-full px-4 pb-16 sm:pb-24 pt-32">
          <p className="wa-up wa-d1 text-white/80 text-xs sm:text-sm font-bold uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
            <span className="h-px w-8 bg-brand inline-block" />
            American Fork, Utah · Since 2002
          </p>
          <h1 className="wa-up wa-d2 display text-white text-5xl sm:text-7xl lg:text-8xl max-w-4xl">
            The Global Standard
            <span className="block text-brand">For Custom Trucks</span>
          </h1>
          <p className="wa-up wa-d3 mt-6 max-w-xl text-base sm:text-lg text-white/80 leading-relaxed">
            Buy ours or we build yours. Premium lifted trucks engineered to perform
            as good as they look — delivered to all 50 states and 30+ countries.
          </p>
          <div className="wa-up wa-d4 mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link href="/build-ridestyler" className="btn btn-brand text-sm px-7 py-4">
              Build Your Truck
            </Link>
            <Link href="/inventory" className="btn btn-ghost text-sm px-7 py-4">
              View Inventory
            </Link>
          </div>
        </div>
      </section>

      {/* ============ 2. TRUST / STAT BAND ============ */}
      <section className="bg-ink border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4">
          {site.stats.map(([num, label], i) => (
            <div
              key={label}
              className={`wa-up text-center md:border-r md:border-white/10 md:last:border-r-0`}
              style={{ animationDelay: `${0.08 * i}s` }}
            >
              <p className="display text-brand text-4xl sm:text-5xl">{num}</p>
              <p className="mt-2 text-xs sm:text-sm text-white/60 uppercase tracking-wide px-2">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ 3. BUILD YOUR OWN (flagship feature) ============ */}
      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:py-28 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative">
            <div className="overflow-hidden shadow-card group">
              <img
                src="/home/slide-109330.jpg"
                alt="Custom lifted GMC Sierra configured at Watts Automotive"
                className="w-full aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            {/* floating accent stat */}
            <div className="hidden sm:block absolute -bottom-6 -right-2 lg:-right-6 bg-brand text-white px-6 py-4 shadow-xl">
              <p className="display text-3xl leading-none">15,000+</p>
              <p className="text-[0.7rem] uppercase tracking-widest mt-1 text-white/80">
                Trucks customized
              </p>
            </div>
          </div>

          <div>
            <p className="text-brand text-xs font-bold uppercase tracking-[0.25em] mb-3">
              The Watts Configurator
            </p>
            <h2 className="display text-ink text-4xl sm:text-5xl h-rule">
              Build Your Own Truck
            </h2>
            <p className="mt-6 text-muted text-base sm:text-lg leading-relaxed">
              Design your rig in real time. Choose your platform, dial in the lift,
              swap paint, and roll real forged wheels onto the truck — rendered live,
              to spec. When it looks right, send the build straight to our team for an
              exact quote.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Live paint, lift & wheel rendering",
                "True fitment — see it before we build it",
                "Send your spec to Watts for a real quote",
              ].map((t) => (
                <li key={t} className="flex items-center gap-3 text-ink">
                  <CheckIcon />
                  <span className="font-medium">{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/build-ridestyler" className="btn btn-brand px-7 py-4">
                Start Building
              </Link>
              <a href={`tel:${site.phoneSales}`} className="btn btn-dark px-7 py-4">
                Call {site.phoneSales}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 4. CATEGORY GRID ============ */}
      <section className="bg-canvas border-t border-line">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:py-24">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p className="text-brand text-xs font-bold uppercase tracking-[0.25em] mb-3">
                Shop By Build
              </p>
              <h2 className="display text-ink text-4xl sm:text-5xl">Find Your Lift</h2>
            </div>
            <Link
              href="/inventory"
              className="text-sm font-bold uppercase tracking-wide text-ink hover:text-brand transition-colors flex items-center gap-2"
            >
              View All Inventory <ArrowIcon />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href="/inventory"
                className="group relative aspect-[4/3] overflow-hidden bg-ink"
              >
                <img
                  src={categoryImages[cat.slug]}
                  alt={cat.label}
                  className="absolute inset-0 h-full w-full object-cover opacity-90 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 flex items-center justify-between">
                  <span className="text-white font-bold uppercase tracking-wide text-sm sm:text-base">
                    {cat.label}
                  </span>
                  <span className="text-white/0 group-hover:text-brand transition-all -translate-x-2 group-hover:translate-x-0">
                    <ArrowIcon />
                  </span>
                </div>
                <span className="absolute bottom-0 left-0 h-1 w-0 bg-brand transition-all duration-500 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 5. FEATURED BUILDS ============ */}
      <section className="bg-paper border-t border-line">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:py-24">
          <div className="text-center mb-12">
            <p className="text-brand text-xs font-bold uppercase tracking-[0.25em] mb-3">
              Off The Lot
            </p>
            <h2 className="display text-ink text-4xl sm:text-5xl h-rule center inline-block">
              Featured Builds
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featured.map((f) => (
              <Link
                key={f.title}
                href="/inventory"
                className="group block bg-paper border border-line shadow-card overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-ink">
                  <img
                    src={f.img}
                    alt={f.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 bg-brand text-white text-[0.65rem] font-bold uppercase tracking-widest px-2.5 py-1">
                    {f.badge}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-ink text-lg leading-tight">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted">{f.spec}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brand">
                    View Details <ArrowIcon />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 6. CUSTOM / SERVICE + FINANCING ============ */}
      <section className="relative bg-ink overflow-hidden">
        <img
          src="/home/slide-108828.jpg"
          alt="Watts Automotive lifted trucks ready for nationwide delivery"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/40" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:py-28">
          <div className="max-w-2xl">
            <p className="text-brand text-xs font-bold uppercase tracking-[0.25em] mb-3">
              Built, Not Bought
            </p>
            <h2 className="display text-white text-4xl sm:text-5xl">
              We Don&apos;t Just Sell Trucks. We Build Them.
            </h2>
            <p className="mt-6 text-white/75 text-base sm:text-lg leading-relaxed">
              Every Watts truck is built in-house in American Fork with name-brand parts,
              an honest process, and a 30-day warranty behind it. Financing, trade-ins,
              and nationwide delivery make it easy — wherever you are.
            </p>
          </div>

          <div className="mt-10 grid sm:grid-cols-3 gap-px bg-white/10 border border-white/10">
            {[
              ["Financing", "Competitive rates and quick approvals for every credit situation.", "/financing"],
              ["Trade-In", "Get top value for your current vehicle toward your next build.", "/trade-in"],
              ["Service", "Lift installs, maintenance, and upgrades by our in-house techs.", "/service"],
            ].map(([title, copy, href]) => (
              <Link
                key={title}
                href={href}
                className="group bg-ink/80 p-6 transition-colors hover:bg-brand"
              >
                <h3 className="font-bold uppercase tracking-wide text-white flex items-center justify-between">
                  {title}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowIcon />
                  </span>
                </h3>
                <p className="mt-2 text-sm text-white/65 group-hover:text-white/90 transition-colors">
                  {copy}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 7. CLOSING CTA ============ */}
      <section className="bg-brand">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:py-24 text-center">
          <h2 className="display text-white text-4xl sm:text-6xl">
            Ready To Build Your Truck?
          </h2>
          <p className="mt-5 text-white/85 text-base sm:text-lg max-w-2xl mx-auto">
            Start your custom build online, or talk to the Watts team today.
            We&apos;ll help you spec it, finance it, and get it to your door.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/build-ridestyler"
              className="btn bg-white text-ink hover:bg-ink hover:text-white px-8 py-4"
            >
              Build Your Truck
            </Link>
            <a
              href={`tel:${site.phoneSales}`}
              className="btn btn-ghost px-8 py-4"
            >
              Call {site.phoneSales}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- inline icons ---------- */
function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function CheckIcon() {
  return (
    <span className="flex-shrink-0 inline-flex items-center justify-center h-6 w-6 bg-brand/10 text-brand rounded-full">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M5 13l4 4L19 7"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
