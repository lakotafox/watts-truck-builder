# RideStyler Integration Notes — `/build-ridestyler`

A second, parallel "Build Your Own Truck" page powered by **RideStyler**'s real-time
vehicle visualization platform. Lives entirely in new files; touches nothing the other
team owns.

## Files added (only these)
- `src/app/build-ridestyler/page.tsx` — the page (Watts intro band + stats band).
- `src/components/configurator/RideStylerStage.tsx` — the client configurator.
- `RIDESTYLER_NOTES.md` — this file.

It compiles: `bun run build` passes and `/build-ridestyler` prerenders as a static route.

---

## How the embed actually works

RideStyler does **not** require an iframe or a heavy client SDK for the core experience.
Their platform exposes a **real-time render image endpoint**:

```
GET https://api.ridestyler.net/Vehicle/Render
      ?Key={accountKey}
      &VehicleConfiguration={configGUID}
      &Type=side|angle
      &PaintColor=%23283dc4         (URL-encoded hex)
      &Suspension={0..n}            (lift level; also SuspensionFront/SuspensionRear)
      &WheelFitment={wheelGUID}     (also WheelFitmentFront/Rear, WheelPartNumber, ...)
      &Width=1000&Height=620&IncludeShadow=true
```

It returns (302 → CDN) a composite **PNG** of that exact vehicle/paint/lift/wheel combo.
So the integration is literally:

```jsx
<img src={renderUrl} />
```

The browser follows the redirect to `cdn-api.ridestyler.net` automatically and the image
is CDN-cached by a `cacheKey`. No CORS needed for images. Our `RideStylerStage` builds
that URL from React state and swaps the `<img src>` on every change, with a spinner while
each render loads.

**Data lists (trims, wheels)** come from JSON endpoints, fetched client-side at runtime:
- `GET /Vehicle/GetDescriptions?Key=…&Search=Ford F-350 Super Duty&Count=N` → configurations
- `GET /Wheel/GetFitmentDescriptions?Key=…&VehicleConfiguration={cfg}&Count=N` → real
  aftermarket wheel catalog (brand + model + part number) that fits that truck.

CORS **is** enabled on `api.ridestyler.net` and reflects the request `Origin`
(`Access-Control-Allow-Origin: <your origin>`, methods `GET, POST, OPTIONS`), so the
runtime `fetch()` for the wheel picker works straight from the browser. The official
RideStyler "Vehicle Renderer" widget instead loads `…/js?DataType=jsonp` + `rsvr.js` and
calls `ridestyler.initialize({ Key })` then `new RideStylerViewport('#container')`; that
JSONP path is an alternative if you'd rather use their wrapper, but the raw render URL is
simpler, framework-agnostic, and what we used.

There is **also** a fully hosted, interactive showcase at
`https://visualizer.ridestyler.com/showcase` (and per-account showcase URLs like
`/{accountGUID}`) that can be dropped into an `<iframe>` if you want RideStyler's own
end-to-end vehicle picker UI instead of a Watts-branded one. We deliberately built the
custom render-based UI so it carries Watts cobalt/Roboto branding and is locked to the
F-350.

### Auth / the key
Every request carries an account `Key` (a 32-char hex token). We read
`process.env.NEXT_PUBLIC_RIDESTYLER_KEY` and fall back to RideStyler's **public demo key**
`c028c54cf0c447c594a862de6ac85d1a` (published in their official Vehicle Renderer widget
`readme.md` / `test.html`). That demo key renders **live today** — the page works out of
the box with real F-350 imagery, real paint, real lift, and a real wheel catalog. When no
env key is set, an on-screen "Developer preview" note explains this.

> Note: the demo key works for the *render* and *render-data* endpoints (key passed in the
> query string). The transactional/account endpoints (`/Auth/Start`, token-header calls)
> reject it — those need a licensed account. None of our page depends on them.

---

## What it takes to go live (production checklist)

1. **Get a licensed RideStyler account / Visualizer subscription.**
   Contact RideStyler sales (sales@ridestyler.com, +1 844-394-8994, or
   https://www.ridestyler.com/contact/). RideStyler is a paid B2B SaaS aimed at dealers,
   wheel/tire shops, and e-commerce. They do **not** publish prices — it's a sales-quoted
   subscription (data + visualization + optional e-commerce tiers). Budget for a monthly
   SaaS fee; expect tiered pricing by traffic/render volume and feature set.
2. **Receive your production account Key** (and confirm your domain is whitelisted —
   their CORS reflects origins, and licensed keys are typically locked to your domains).
3. Set the env var in the Next.js host (Vercel/etc.):
   ```
   NEXT_PUBLIC_RIDESTYLER_KEY=your_watts_account_key
   ```
   The "Developer preview" note disappears automatically and all renders bill to Watts.
4. **Confirm the F-350 ConfigurationIDs** with your account's dataset (the GUIDs we
   hardcoded come from the shared demo dataset; a licensed account may expose newer model
   years / body styles you'll want to surface). Optionally swap our static trim list for a
   live `GetDescriptions` fetch so it always reflects the current catalog.
5. (Optional) If you want the full interactive picker instead, embed the hosted showcase
   iframe pointed at your account's showcase GUID.
6. (Recommended) Add `width`/`height` and `loading="lazy"` tuning, and consider proxying
   render URLs through your own domain if you don't want the account key visible in
   client-side image URLs (it's a `NEXT_PUBLIC_` key, so it is exposed by design — confirm
   with RideStyler that domain-locking is sufficient for your security posture, or front it
   with a thin server route that injects the key).

---

## Live-API verification (follow-up findings)

All tested against `api.ridestyler.net` with the demo key on the F-350 config
`a26dc2e9-2e0d-49cd-82c3-64647e2a6722`.

### 1. PaintColor — arbitrary hex CONFIRMED
`PaintColor` accepts any `#RRGGBB`. Tested `#7c1620` (rapid red), `#3b4632` (forged
green), `#8a4b2c` (copper), `#27396b` (antimatter blue) — each returned a distinct,
correctly-painted render (HTTP 200, ~53 KB PNGs), **not** a fallback/default color. The
palette in `RideStylerStage.tsx` is now 15 Ford/Watts-style colors with real hex values
(Oxford White, Star White, Avalanche, Iconic Silver, Carbonized Gray, Gunmetal, Agate
Black, Watts Cobalt, Antimatter Blue, Velocity Blue, Rapid Red, Race Red, Forged Green,
Desert Sand, Burnished Copper). There is also an OEM endpoint —
`GET /Vehicle/GetPaintSchemeDescriptions` — that returns this truck's factory color list
(e.g. "Blue Jeans" `#173C66`, "Tuxedo Black") with RGB/HSB/Hex if you'd rather drive the
swatches from the real factory palette.

### 2. Suspension / LIFT — continuous, no dataset clamp
There is **no** suspension-enumeration endpoint (`GetSuspensionDescriptions` /
`GetSuspensions` both 404; the action map only exposes getdescriptions, gettireoptions,
gettireoptiondetails, getpaintschemedescriptions, countreferences, getreferences,
canberendered). The `Suspension` render param is a **continuous integer lift offset**, not
an index into a fixed kit list: an md5 sweep of `Suspension=0…40` produced a *distinct*
render at every value — it never repeats/clamps. So the "max" is practical, not API-
imposed. Visually it reads as a real lift up to ~8 (great), is an extreme show-lift around
10–12, and the body starts floating off the tires past ~12. The UI now exposes **every
integer level 0–12** via a slider (Stock → ~16" show lift), which is as high as it still
looks like a truck.

### 3. Trim / two-tone / blackout color — NOT natively supported
Clear **NO**. Evidence:
- The render contract (`VehicleRenderInstructions`) has exactly **one** body color param,
  `PaintColor`. There is no `TrimColor`, `SecondaryColor`, `AccentColor`, `GrilleColor`,
  or accessory-overlay parameter anywhere in the render instructions.
- No vehicle accessory/option/package endpoint exists for this purpose:
  `Vehicle/GetAccessories`, `Vehicle/GetOptions`, `Vehicle/GetPackages` all return 404.
  The only "Accessory" models in the SDK (`WheelAccessoryDescriptionModel`) are **wheel**
  accessories (lug kits / center caps), not vehicle trim.
- The data model does carry OEM two-tone metadata (`VehiclePaintScheme` has a `Type` and a
  `Colors[]` array with a `Position` per color), but that only describes factory schemes;
  the render endpoint still applies a single user color and gives no control over a
  grille/trim color independently.

Conclusion: a "Chrome vs. Blackout" or independent grille/trim recolor cannot be done
through RideStyler's render and was **not** added (not faked). The F-350's chrome/trim is
baked into the base vehicle photo. To offer blackout you'd need custom image compositing on
your side, or RideStyler dataset configurations that ship separate blackout vehicles.

### 4. Performance — cache-warming added
`RideStylerStage.tsx` now background-prefetches render URLs (`new Image(); img.src = url`)
through a concurrency-capped queue (**max 6 in flight**) with a de-dupe `Set`, re-warming
on every spec change for: (a) all wheel options, (b) both view angles, and (c) all 15
colors at the current lift/wheel/angle. Option clicks then swap to an already-cached image.
The visible `<img>` never blanks — a hidden loader image promotes the new URL to the
visible element only on `onLoad`, so the previous render stays up until the next is ready
(with a small "Updating" badge), avoiding a flash-to-blank.

### 5. Multi-truck catalog, tap-to-rotate, mobile
- **Catalog (`src/lib/configurator/rideStylerTrucks.ts`): 26 verified vehicles** across 7
  makes — Ford (Bronco, Expedition, F-250 SD, F-350 SD), Ram (1500, 2500, 3500), GMC
  (Canyon, Sierra 1500/2500/3500, Yukon), Chevrolet (Colorado, Silverado 1500/2500/3500,
  Suburban, Tahoe), Toyota (4Runner, Sequoia, Tacoma, Tundra), Jeep (Gladiator, Wrangler),
  Nissan (Frontier, Titan). Enumerated with:
  `GET https://api.ridestyler.net/Vehicle/GetDescriptions?Key=<key>&Search=<make+model>&Count=N`,
  filtered to configs that report `HasSideImage`/`HasAngledImage`, then **every** survivor
  was confirmed to return a real composite PNG (vs. the JSON "no image" placeholder, whose
  signature md5 we captured from bogus GUIDs) via `Vehicle/Render`. Configs that only
  returned the placeholder were dropped — notably most 2020-2026 recent-model configs and
  Ford F-450 (not in the demo dataset; Ram appears under the legacy "Dodge Ram" make and is
  normalized to "Ram"). Each entry stores the camera angles it actually renders (`views`).
- **Tap-to-rotate:** clicking/tapping the render cycles to the next camera angle in that
  truck's `views` (side ↔ 3/4); a "Tap to rotate" badge + pointer cursor signals it, and the
  explicit angle toggle buttons remain. Because both angles are cache-warmed, the swap is
  instant. Only shown for trucks with >1 view.
- **Desktop (lg+):** unchanged — truck picker on top, render card + side controls (the
  "Your build" card, paint swatch grid, lift slider, wheel grid) below in a 2-up grid.

### 6. Mobile UX — guided step-by-step builder (<lg)
The mobile experience is a separate, purpose-built tree (`lg:hidden`); desktop (`hidden
lg:block`) is untouched. Verified live at 375–390px width. User feedback ("too much at
once") drove this redesign:
- **Step flow before any truck is shown.** Step 1 "Choose your platform" = seven big
  tappable make tiles (with model counts). Step 2 "Select your {make}" = a clean card list
  of that make's models/years with a "‹ All platforms" back link. The full configurator is
  only revealed once a truck is locked in.
- **Collapsed picker.** After selection the big picker disappears; it's replaced by a slim
  bar overlaid on the render: the truck name (top-left) + a "Change" link (top-right) that
  reopens the step flow.
- **No page intro band.** The marketing intro band was removed from `page.tsx` entirely
  (all breakpoints) so the page goes straight into the step-flow / builder with no gap.
- **Info overlaid on the render, no separate "Your build" card.** Truck name + a "Change"
  link sit in a slim bar at the TOP; the live spec summary (paint dot · paint · lift ·
  wheels, plus a small "↻ Rotate" affordance) sits in a slim bar at the BOTTOM. The render
  is **inset vertically** (`padClassName="py-12"` on the stage canvas) so the full vehicle
  (roof to tires + shadow) sits *between* the bars and is never clipped. Compact "Request
  this build" CTA below.
- **Compact color & wheel pickers.** The 15 paint swatches AND the wheel options are each a
  single horizontal-scroll row of `shrink-0` chips (`overflow-x-auto .no-scrollbar`) instead
  of wrapping grids — wheel chips show brand (top) + model (bottom), tap to select, cobalt
  selected state. Saves vertical space and keeps the truck high on screen.
- **Truck stays visible while adjusting lift.** The render sits up top with the two
  live-preview controls (compact color row + lift slider) directly beneath, so the truck,
  the swatches and the slider all fit in one viewport — dragging the slider updates the
  truck live without scrolling it out of view (confirmed: 5"→12" lift updated in place).
  Note: we deliberately did **not** use `position: sticky` for the render — the site shell
  already has a sticky top header, and a tall pinned render would both collide with it and
  cover the controls scrolling underneath. Placing the live controls adjacent achieves the
  same goal robustly.
- **Tap-to-rotate** works on touch (the image cycles camera angles); 40px swatches and
  ≥44px tap targets with `active:` states throughout; no horizontal overflow at 375px.

### 7. Tire size — what RideStyler actually supports (investigated live)
The render's tire levers (from `VehicleRenderInstructions`) are `VehicleTireOption` and
`TireFitment`/`TireFitmentFront`/`TireFitmentRear`. Tested against the live API:
- **`VehicleTireOption` works and changes the rendered tire** — but it selects one of the
  vehicle's **factory** tire/fitment *packages*, and these are all stock sizes. The F-350
  exposes exactly **two** (`GetTireOptionDetails`): 33.2" on an 18" wheel and 34.1" on a 20"
  wheel — confirmed they produce different renders (md5-diff). Sampled other trucks: Sierra
  1500 = 3 options (32–33"), Jeep Wrangler = 1 (31.5"), Tundra = 1 (32.5"). **No truck
  exposes aftermarket 35/37/40" off-road sizes.**
- **`TireFitment` (arbitrary aftermarket tire) does NOT render bigger tires.** Passing a
  large tire fitment returns `{"Message":"Sizes conflict for specified wheel or tire."}` —
  the tire must precisely match the selected wheel's width/diameter. The legitimate
  plus-size flow (`Tire/GetFitments` with a `Recommend.OutsideDiameterTargetWhole`) needs a
  POST body, which the **public demo key rejects** (`Code 151 Invalid authentication token`
  — the demo key only authenticates as a GET query param); the GET variant returned the same
  tires regardless of target diameter and didn't render larger. So there is **no reliable,
  independently-selectable tire-diameter param** for 35/37/40" with the available key/data.
- **`VehicleTireOption` is ignored once an aftermarket `WheelFitment` is set** (verified:
  identical md5 across tire options when a wheel is selected) — an aftermarket wheel carries
  its own tire. So tire size and aftermarket wheels are mutually exclusive levers.
- **A bigger lift does not unlock bigger tires** — `Suspension` only raises the body; it's
  independent of the tire-option list.

**What was implemented (honest, not faked):** a compact **Tire size** control driven by the
real factory `VehicleTireOption` packages — chips labeled with the actual outside diameter +
rim (e.g. `33" / 18" wheel`, `34" / 20" wheel`), shown only when a truck has ≥2 options.
Mobile = horizontal-scroll chip row (like paint/wheels); desktop = a side-controls Field plus
a "Tires" row in the build summary. Wired into `buildRenderUrl` (`VehicleTireOption`, only
when on factory wheels), the spec, the prefetch cache-warming, and the spec-strip label
(`… · 34" tires · …`). Picking a tire size resets to factory wheels so it actually applies;
the control dims when an aftermarket wheel is selected (since the wheel then governs the
tire). Verified live: switching 33"→34" changes the render and the spec strip. **No fake
35/37/40" sizes were added** — those aren't renderable; the dominant "aggressive stance"
lever remains LIFT, which is already a prominent control.

---

## Honest assessment of quality

**Suspension / LIFT visualization — genuinely good.** Stepping the `Suspension` parameter
produces a properly lifted truck: the body rides higher, the wheel-gap opens up, and the
geometry stays believable rather than just scaling the image. On the F-350 a level-4 lift
read clearly as a real lift kit, not a hack. It's parametric *levels*, not exact inch-by-
inch kit selection, and it composites a stock vehicle photo rather than rendering a true
3D model — so it's a convincing 2.5D approximation, not a physically-simulated suspension.
For a dealer "what would this look like lifted" tool it's more than good enough and looks
clean against a light background with a real drop shadow. Caveat: lift + a specific
oversized tire/wheel combo can occasionally look slightly off because it's photo
compositing, but for the common cases it's solid.

**Custom-wheel visualization — strong, and the catalog is the real selling point.**
`GetFitmentDescriptions` returns an actual, fitment-filtered aftermarket catalog for the
selected truck — real brands (Moto Metal, ATX Series, American Racing, etc.) with part
numbers — and the chosen wheel composites onto the vehicle accurately at the right
diameter/offset. Because fitment is filtered to the configuration, you're only ever
showing wheels that physically fit, which is exactly what a dealer wants. The wheels sit
correctly in the well and rotate with the view angle (side vs. 3/4). It is photo-based
compositing, so it won't have free-camera 3D, but the wheel realism is high.

**Overall:** RideStyler is the strongest off-the-shelf option for a dealer-grade truck
configurator focused on **paint + lift + real wheel fitment**. Its weakness vs. a custom
3D/Three.js build (like the other `/build` page) is that it's 2.5D photo compositing with
a fixed set of camera angles and parametric lift levels rather than continuous, free-orbit
3D — but in exchange you get a massive, accurate, continuously-maintained fitment + imagery
dataset that would be enormously expensive to build and keep current yourself. For a
production "Build Your Own Truck" page where fitment accuracy and breadth matter more than
cinematic camera control, it's an excellent, low-effort, high-credibility choice.
