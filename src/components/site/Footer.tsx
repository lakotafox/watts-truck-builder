import Link from "next/link";
import Logo from "./Logo";
import { site } from "@/lib/site";

const cols = [
  {
    title: "Inventory",
    links: [
      ["All Vehicles", "/inventory"],
      ["Lifted Ford", "/inventory?make=ford"],
      ["Lifted Ram", "/inventory?make=ram"],
      ["Lifted Diesel", "/inventory?fuel=diesel"],
      ["Build Your Truck", "/build"],
    ],
  },
  {
    title: "Service",
    links: [
      ["Lift Kits & Suspension", "/service"],
      ["Wheels & Tires", "/service"],
      ["Diesel Performance", "/service"],
      ["Bumpers & Accessories", "/service"],
      ["PPF & Ceramic Coating", "/service"],
    ],
  },
  {
    title: "Company",
    links: [
      ["Financing", "/financing"],
      ["Trade In", "/trade-in"],
      ["Dealership Info", "/dealership-info"],
      ["Contact Us", "/dealership-info"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-white/80 mt-0">
      <div className="mx-auto max-w-7xl px-4 py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo dark />
          <p className="mt-4 max-w-xs text-sm text-white/60 leading-relaxed">
            {site.tagline}. {site.blurb}
          </p>
          <div className="mt-5 space-y-1.5 text-sm">
            <a href={`tel:${site.phoneSales}`} className="block hover:text-brand">
              Sales: <span className="font-bold text-white">{site.phoneSales}</span>
            </a>
            <a href={`tel:${site.phoneService}`} className="block hover:text-brand">
              Service: <span className="font-bold text-white">{site.phoneService}</span>
            </a>
            <span className="block text-white/60">{site.address}</span>
          </div>
          <div className="mt-5 flex gap-3">
            {Object.entries(site.social).map(([k, href]) => (
              <a
                key={k}
                href={href}
                className="w-9 h-9 grid place-items-center bg-white/10 hover:bg-brand transition-colors rounded-sm"
                aria-label={k}
                target="_blank"
                rel="noreferrer"
              >
                <span className="text-xs font-bold uppercase">{k[0]}</span>
              </a>
            ))}
          </div>
        </div>

        {cols.map((col) => (
          <div key={col.title}>
            <h4 className="text-white font-bold uppercase tracking-wide text-sm mb-4">
              {col.title}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="hover:text-brand transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <span>© {new Date().getFullYear()} Watts Automotive. All rights reserved.</span>
          <div className="flex gap-5">
            <Link href="/dealership-info" className="hover:text-white">Terms of Use</Link>
            <Link href="/dealership-info" className="hover:text-white">Privacy Policy</Link>
            <Link href="/dealership-info" className="hover:text-white">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
