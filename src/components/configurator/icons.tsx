// Small inline icon set keyed by the OptionGroup.icon field.
export function OptIcon({ name, className = "w-4 h-4" }: { name: string; className?: string }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<string, React.ReactNode> = {
    paint: <><path {...p} d="M5 3h11v5H5zM16 5h3v4a2 2 0 01-2 2h-5v3" /><path {...p} d="M10 14h2v6a1 1 0 01-1 1 1 1 0 01-1-1z" /></>,
    trim: <><rect {...p} x="3" y="8" width="18" height="8" rx="1" /><path {...p} d="M7 8v8M17 8v8" /></>,
    grille: <><rect {...p} x="4" y="6" width="16" height="12" rx="1" /><path {...p} d="M8 6v12M12 6v12M16 6v12" /></>,
    lift: <><path {...p} d="M12 3v18M8 7l4-4 4 4M8 17l4 4 4-4" /></>,
    wheel: <><circle {...p} cx="12" cy="12" r="8" /><circle {...p} cx="12" cy="12" r="3" /><path {...p} d="M12 4v3M12 17v3M4 12h3M17 12h3" /></>,
    wheelpaint: <><circle {...p} cx="12" cy="12" r="8" /><path {...p} d="M12 4a8 8 0 010 16" fill="currentColor" /></>,
    tire: <><circle {...p} cx="12" cy="12" r="9" /><circle {...p} cx="12" cy="12" r="4" /></>,
    bumper: <><path {...p} d="M3 14h18v3a1 1 0 01-1 1H4a1 1 0 01-1-1z" /><path {...p} d="M6 14v-2M18 14v-2" /></>,
    light: <><path {...p} d="M9 18h6M10 21h4" /><path {...p} d="M12 3a6 6 0 00-4 10.5V16h8v-2.5A6 6 0 0012 3z" /></>,
    perf: <><path {...p} d="M13 3L4 14h6l-1 7 9-11h-6z" /></>,
    interior: <><path {...p} d="M5 18v-6a3 3 0 013-3h2l1-3h2a3 3 0 013 3v9" /><path {...p} d="M5 18h14" /></>,
    shield: <><path {...p} d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" /><path {...p} d="M9 12l2 2 4-4" /></>,
    truck: <><path {...p} d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" /><circle {...p} cx="7" cy="17" r="1.6" /><circle {...p} cx="17" cy="17" r="1.6" /></>,
  };
  return <svg viewBox="0 0 24 24" className={className} aria-hidden>{paths[name] ?? paths.truck}</svg>;
}
