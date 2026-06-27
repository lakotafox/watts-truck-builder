// Central site configuration — Watts Automotive clone.
// Factual dealership details mirror the real business; marketing copy is original.

export const site = {
  name: "Watts Automotive",
  tagline: "The Global Standard for Custom Trucks",
  blurb: "Buy ours or we can build yours. Lifted trucks that perform as good as they look.",
  address: "716 S 500 E, American Fork, UT 84003",
  phoneSales: "801-893-9954",
  textSales: "801-687-8844",
  phoneService: "435-265-4313",
  emailSales: "sales@wattsautomotive.com",
  hoursSales: [
    ["Mon – Fri", "9:00 AM – 7:00 PM"],
    ["Saturday", "9:00 AM – 5:00 PM"],
    ["Sunday", "Closed"],
  ],
  stats: [
    ["2002", "Building custom trucks since"],
    ["25,000+", "Vehicles built & sold"],
    ["50", "States served"],
    ["30+", "Countries worldwide"],
  ],
  social: {
    facebook: "https://facebook.com/WattsAutomotive",
    instagram: "https://instagram.com/wattsauto",
    tiktok: "https://tiktok.com/@watts_auto",
    youtube: "https://youtube.com",
  },
};

export const mainNav = [
  { label: "Home", href: "/" },
  { label: "View Inventory", href: "/inventory" },
  { label: "Build Your Truck", href: "/build", highlight: true },
  { label: "Financing", href: "/financing" },
  { label: "Trade In", href: "/trade-in" },
  { label: "Service", href: "/service" },
  { label: "Dealership Info", href: "/dealership-info" },
];

// Quick-browse category tiles (mirror the real homepage grid)
export const categories = [
  { label: "Lifted Ford", slug: "ford", tone: "#1f3a5f" },
  { label: "Lifted Ram", slug: "ram", tone: "#5f1f1f" },
  { label: "Lifted Chevy", slug: "chevy", tone: "#3a3a3a" },
  { label: "Lifted GMC", slug: "gmc", tone: "#5f4a1f" },
  { label: "Lifted Toyota", slug: "toyota", tone: "#1f4f4a" },
  { label: "Lifted Diesel", slug: "diesel", tone: "#2a2a35" },
  { label: "Lifted SUV", slug: "suv", tone: "#3f2f4f" },
  { label: "Lifted Jeep", slug: "jeep", tone: "#2f4a2a" },
];
