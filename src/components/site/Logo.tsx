// Original SVG rendering of a Watts-style wordmark: Utah silhouette + "WA" badge
// alongside a heavy condensed two-line uppercase wordmark.
export default function Logo({
  className = "",
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  const fg = dark ? "#ffffff" : "#16181d";
  const sub = dark ? "#c9ccd3" : "#3a3a3a";
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg width="46" height="46" viewBox="0 0 46 46" aria-hidden>
        {/* Utah state silhouette */}
        <path
          d="M5 4 H30 V14 H41 V42 H5 Z"
          fill="none"
          stroke={sub}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* WA monogram badge */}
        <circle cx="22" cy="24" r="12" fill="var(--color-brand)" />
        <text
          x="22"
          y="29"
          textAnchor="middle"
          fontSize="13"
          fontWeight="900"
          fill="#fff"
          fontFamily="var(--font-roboto)"
          letterSpacing="-0.5"
        >
          WA
        </text>
      </svg>
      <span className="leading-[0.82]">
        <span
          className="block display text-[1.35rem] md:text-[1.6rem]"
          style={{ color: fg }}
        >
          Watts
        </span>
        <span
          className="block display text-[1.05rem] md:text-[1.25rem] tracking-[0.18em]"
          style={{ color: sub }}
        >
          Automotive
        </span>
      </span>
    </span>
  );
}
