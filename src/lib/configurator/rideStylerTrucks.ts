// RideStyler truck catalog — Ford F-Series, Ram, GMC, Chevy, Toyota, Jeep, Nissan.
// AUTO-COLLECTED + VERIFIED against the live RideStyler API (demo key) on 2026-06-27.
//
// Enumerated via the public vehicle search endpoint:
//   GET https://api.ridestyler.net/Vehicle/GetDescriptions?Key=<key>&Search=<make+model>&Count=N
// then EVERY entry was confirmed to return a real composite PNG (not the JSON
// "no image" placeholder) via:
//   GET https://api.ridestyler.net/Vehicle/Render?Key=<key>&VehicleConfiguration=<id>&Type=side|angle
// The `views` array lists the camera angles RideStyler actually renders for that
// configuration (drives tap-to-rotate). ConfigurationIDs come from the demo dataset.

export type RideStylerView = "side" | "angle";

export type RideStylerTruck = {
  id: string; // VehicleConfigurationID
  make: string;
  model: string;
  year: number;
  label: string;
  views: RideStylerView[];
};

export const rideStylerTrucks: RideStylerTruck[] = [
  { id: "04ef47cc-5463-4af4-89bd-16d0d3d48385", make: "Ford", model: "Bronco", year: 2026, label: "2026 Ford Bronco", views: ["side", "angle"] },
  { id: "d7ec589e-b16b-4c55-a7ed-16432755d901", make: "Ford", model: "Expedition", year: 2026, label: "2026 Ford Expedition", views: ["side", "angle"] },
  { id: "580420a2-6592-4d0d-bbde-c61fda43884b", make: "Ford", model: "F-250 Super Duty", year: 2010, label: "2010 Ford F-250 Super Duty", views: ["side", "angle"] },
  { id: "9449b8a5-00fc-4cb8-9991-c7a1897348b0", make: "Ford", model: "F-350 Super Duty", year: 2010, label: "2010 Ford F-350 Super Duty", views: ["side", "angle"] },
  { id: "0101ba2c-47fe-4afb-b0c0-2a8d795e81df", make: "Ram", model: "1500", year: 2006, label: "2006 Ram 1500", views: ["side", "angle"] },
  { id: "b7d45002-31a4-42d7-b53e-9fefdd7d0f39", make: "Ram", model: "2500", year: 2006, label: "2006 Ram 2500", views: ["side"] },
  { id: "46c19413-a745-459d-8b37-d876001c62f0", make: "Ram", model: "3500", year: 2010, label: "2010 Ram 3500", views: ["side", "angle"] },
  { id: "2ba7ccdb-c6c6-4244-b1d8-f9505fb8a43c", make: "GMC", model: "Canyon", year: 2026, label: "2026 GMC Canyon", views: ["angle"] },
  { id: "5fcb526d-6a97-45c4-a0b6-4ebe5dec9725", make: "GMC", model: "Sierra 1500", year: 2026, label: "2026 GMC Sierra 1500", views: ["side"] },
  { id: "1bbd87cd-202d-4d34-9fd0-e94856a3f0bd", make: "GMC", model: "Sierra 2500", year: 2026, label: "2026 GMC Sierra 2500", views: ["side", "angle"] },
  { id: "4cf41974-2067-45f1-8c36-cc0ff5ccebe2", make: "GMC", model: "Sierra 3500", year: 2026, label: "2026 GMC Sierra 3500", views: ["side", "angle"] },
  { id: "3c536ede-f434-4fdd-8fd6-b49bff48c600", make: "GMC", model: "Yukon", year: 2026, label: "2026 GMC Yukon", views: ["side"] },
  { id: "ce1b02e3-5d01-4f33-889f-0c933e62667e", make: "Chevrolet", model: "Colorado", year: 2020, label: "2020 Chevrolet Colorado", views: ["side", "angle"] },
  { id: "47fd2487-8765-4c14-8c2c-d8c66f95c7ba", make: "Chevrolet", model: "Silverado 1500", year: 2005, label: "2005 Chevrolet Silverado 1500", views: ["side", "angle"] },
  { id: "b8b55d94-871f-481a-a1ad-66ad3ce4d017", make: "Chevrolet", model: "Silverado 2500", year: 2005, label: "2005 Chevrolet Silverado 2500", views: ["side", "angle"] },
  { id: "c1affec4-5bdc-4ce9-9584-744cb15fdb85", make: "Chevrolet", model: "Silverado 3500", year: 2026, label: "2026 Chevrolet Silverado 3500", views: ["side", "angle"] },
  { id: "0051efad-f29c-4cf3-a238-110a58268998", make: "Chevrolet", model: "Suburban", year: 2026, label: "2026 Chevrolet Suburban", views: ["side", "angle"] },
  { id: "54cf759a-baec-45ac-8681-ca0bf3b98acd", make: "Chevrolet", model: "Tahoe", year: 2026, label: "2026 Chevrolet Tahoe", views: ["side"] },
  { id: "0553277c-d42d-4b1e-86b7-0016a900b665", make: "Toyota", model: "4Runner", year: 2023, label: "2023 Toyota 4Runner", views: ["side", "angle"] },
  { id: "2ffd22f7-a77e-4369-8321-521894a07a80", make: "Toyota", model: "Sequoia", year: 2026, label: "2026 Toyota Sequoia", views: ["side", "angle"] },
  { id: "6dd2cf5f-3a59-40a7-8c03-0167a5bf37c1", make: "Toyota", model: "Tacoma", year: 2014, label: "2014 Toyota Tacoma", views: ["side"] },
  { id: "f55c9ac0-24f4-4b56-83f5-adcbbaf9163e", make: "Toyota", model: "Tundra", year: 2025, label: "2025 Toyota Tundra", views: ["side", "angle"] },
  { id: "7a130085-60b2-49f6-9c57-bd66115d242d", make: "Jeep", model: "Gladiator", year: 2026, label: "2026 Jeep Gladiator", views: ["side", "angle"] },
  { id: "83d9c149-d20d-4c1f-bbfd-01692aeecdb2", make: "Jeep", model: "Wrangler", year: 2023, label: "2023 Jeep Wrangler", views: ["side", "angle"] },
  { id: "10c81200-0bfb-485a-9b4a-29316e77267c", make: "Nissan", model: "Frontier", year: 2024, label: "2024 Nissan Frontier", views: ["side"] },
  { id: "ec07594b-c6ff-492a-8ac3-08b0c2195e5b", make: "Nissan", model: "Titan", year: 2010, label: "2010 Nissan Titan", views: ["side", "angle"] },
];

// Distinct makes in catalog order, for grouping the picker UI.
export const rideStylerMakes: string[] = Array.from(
  new Set(rideStylerTrucks.map((t) => t.make)),
);
