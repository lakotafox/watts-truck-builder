"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";
import { mainNav, site } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Black utility bar */}
      <div className="bg-ink text-white text-xs">
        <div className="mx-auto max-w-7xl px-4 h-9 flex items-center justify-between">
          <span className="hidden sm:flex items-center gap-1.5 text-white/80">
            <PinIcon /> {site.address}
          </span>
          <div className="flex items-center gap-4 ml-auto">
            <a
              href={`tel:${site.phoneSales}`}
              className="flex items-center gap-1.5 hover:text-brand transition-colors"
            >
              <PhoneIcon /> <span className="font-bold">{site.phoneSales}</span>
              <span className="hidden md:inline text-white/60">Sales</span>
            </a>
            <a
              href={`sms:${site.textSales}`}
              className="hidden sm:flex items-center gap-1.5 hover:text-brand transition-colors"
            >
              <ChatIcon /> Text Us
            </a>
          </div>
        </div>
      </div>

      {/* Main nav bar */}
      <div className="bg-paper border-b border-line shadow-sm">
        <div className="mx-auto max-w-7xl px-4 h-[72px] flex items-center justify-between">
          <Link href="/" aria-label="Watts Automotive home">
            <Logo />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {mainNav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-[0.82rem] font-bold uppercase tracking-wide transition-colors ${
                    item.highlight
                      ? "bg-brand text-white hover:bg-brand-700 ml-1"
                      : active
                        ? "text-brand"
                        : "text-ink hover:text-brand"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            className="lg:hidden p-2 text-ink"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d={open ? "M6 6l12 12M6 18L18 6" : "M3 6h18M3 12h18M3 18h18"}
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <nav className="lg:hidden border-t border-line bg-paper">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block px-5 py-3 text-sm font-bold uppercase tracking-wide border-b border-line ${
                  item.highlight ? "text-brand" : "text-ink"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

function PhoneIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.24 11.4 11.4 0 003.5.56 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.4 11.4 0 00.56 3.5 1 1 0 01-.24 1z" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 4h16a1 1 0 011 1v11a1 1 0 01-1 1H8l-4 4V5a1 1 0 011-1z" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7zm0 9.5A2.5 2.5 0 1012 6.5a2.5 2.5 0 000 5z" />
    </svg>
  );
}
