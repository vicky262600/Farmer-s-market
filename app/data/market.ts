export type StallStatus = "active" | "empty" | "deal";
export type Category = "Organic" | "Fruits & Vegetables" | "Dairy" | "Handmade goods" | "Bakery" | "Meat";

/**
 * Schematic grid: L-shaped **aisle** (walkway) with stalls on **both sides**.
 * - Vertical aisle: column 6, rows 1–8 (vendors on cols 5 and 7).
 * - Turns south then east: horizontal aisle row 9, columns 6–13 (vendors north on row 8, south on row 10).
 */
export const MARKET_GRID = { rows: 10, cols: 14 } as const;

export interface Stall {
  id: number;
  vendor: string | null;
  /** Sign / trading name shown on the stall front */
  brand?: string | null;
  category?: Category;
  sells?: string[];
  highlights?: { name: string; price: string; oldPrice?: string }[];
  status: StallStatus;
  description?: string;
  /** Position on the schematic map (1-based) */
  mapRow: number;
  mapCol: number;
}

/** Walkway cells forming the L (1-based row, col) */
export const AISLE_CELLS: { row: number; col: number }[] = [
  ...Array.from({ length: 8 }, (_, i) => ({ row: i + 1, col: 6 })),
  ...Array.from({ length: 8 }, (_, i) => ({ row: 9, col: i + 6 })),
];

const AISLE_KEYS = new Set(AISLE_CELLS.map((c) => `${c.row}-${c.col}`));

export function isAisleCell(row: number, col: number): boolean {
  return AISLE_KEYS.has(`${row}-${col}`);
}

/** Thirty stall footprints: west & east of vertical aisle, then north & south of horizontal aisle */
const STALL_SLOTS: { row: number; col: number }[] = [
  ...Array.from({ length: 8 }, (_, i) => ({ row: i + 1, col: 5 })),
  ...Array.from({ length: 8 }, (_, i) => ({ row: i + 1, col: 7 })),
  ...Array.from({ length: 6 }, (_, i) => ({ row: 8, col: i + 8 })),
  { row: 10, col: 5 },
  ...Array.from({ length: 7 }, (_, i) => ({ row: 10, col: i + 7 })),
];

type Seed = {
  vendor: string | null;
  brand?: string | null;
  category?: Category;
  sells?: string[];
  highlights?: { name: string; price: string; oldPrice?: string }[];
  status: StallStatus;
  description?: string;
};

const SEEDS: Seed[] = [
  { vendor: "Morgan Ellis", brand: "Green Acres", category: "Organic", status: "active", sells: ["Kale", "Carrots", "Beets"], highlights: [{ name: "Organic kale bunch", price: "$3.50" }], description: "Family-run organic farm since 1998." },
  { vendor: "The Chen Family", brand: "Sunny Orchard", category: "Fruits & Vegetables", status: "deal", sells: ["Apples", "Pears", "Plums"], highlights: [{ name: "Honeycrisp / lb", price: "$1.99", oldPrice: "$2.99" }], description: "Heirloom apples, hand-picked." },
  { vendor: null, brand: null, status: "empty", description: "Stall available for rent." },
  { vendor: "Rita Kowalski", brand: "Meadow Dairy", category: "Dairy", status: "active", sells: ["Cheese", "Yogurt", "Butter"], highlights: [{ name: "Aged cheddar 250g", price: "$8.00" }], description: "Grass-fed small-batch cheese." },
  { vendor: "Leo Park", brand: "Hearth & Loaf", category: "Bakery", status: "deal", sells: ["Sourdough", "Croissants"], highlights: [{ name: "Country sourdough", price: "$5.50", oldPrice: "$7.00" }], description: "Wood-fired bread at dawn." },
  { vendor: "Sam & Jordan Lee", brand: "Wildflower Honey", category: "Organic", status: "active", sells: ["Raw honey", "Beeswax"], highlights: [{ name: "Wildflower 500g", price: "$12.00" }], description: "Local hive honey." },
  { vendor: null, brand: null, status: "empty", description: "Reserved for guest vendor." },
  { vendor: "Ava Moreno", brand: "Riverstone Pottery", category: "Handmade goods", status: "active", sells: ["Mugs", "Bowls", "Vases"], highlights: [{ name: "Stoneware mug", price: "$22.00" }], description: "Hand-thrown stoneware." },
  { vendor: "Chris & Dana Frost", brand: "Berry Patch", category: "Fruits & Vegetables", status: "deal", sells: ["Strawberries", "Blueberries"], highlights: [{ name: "Strawberry pint", price: "$4.00", oldPrice: "$6.00" }], description: "Berries picked this morning." },
  { vendor: "Nina Rossi", brand: "Olive Grove", category: "Organic", status: "active", sells: ["Olive oil", "Olives"], highlights: [{ name: "EVOO 500ml", price: "$18.00" }], description: "Single-estate olive oil." },
  { vendor: "Pat Kim", brand: "Soap Cottage", category: "Handmade goods", status: "active", sells: ["Soap bars", "Lotions"], highlights: [{ name: "Lavender bar", price: "$7.00" }], description: "Cold-process botanical soaps." },
  { vendor: null, brand: null, status: "empty", description: "Pop-up stall — next week: maple syrup." },
  { vendor: "Marcus Webb", brand: "Heritage Meats", category: "Meat", status: "active", sells: ["Beef", "Pork", "Sausage"], highlights: [{ name: "Smoked sausage", price: "$9.00" }], description: "Pasture-raised meats." },
  { vendor: "Yuki Tanaka", brand: "Garden Greens", category: "Fruits & Vegetables", status: "active", sells: ["Lettuce", "Herbs", "Tomatoes"], highlights: [{ name: "Heirloom tomato / lb", price: "$3.50" }], description: "Hydroponic greens." },
  { vendor: "Ben Carter", brand: "Maple & Oak", category: "Handmade goods", status: "deal", sells: ["Cutting boards", "Spoons"], highlights: [{ name: "Walnut board", price: "$28.00", oldPrice: "$40.00" }], description: "Wooden kitchenware." },
  { vendor: "Sofia Alvarez", brand: "Cocoa & Co.", category: "Bakery", status: "active", sells: ["Chocolate", "Truffles"], highlights: [{ name: "Dark bar 70%", price: "$6.00" }], description: "Bean-to-bar chocolate." },
  { vendor: "River Co-op", brand: "Riverbend Coffee", category: "Bakery", status: "active", sells: ["Espresso", "Beans", "Pastries"], highlights: [{ name: "Pour-over", price: "$4.00" }], description: "Fair-trade roast on site." },
  { vendor: "Tessa Bloom", brand: "Wild Roots", category: "Organic", status: "active", sells: ["Microgreens", "Sprouts"], highlights: [{ name: "Pea shoots", price: "$4.50" }], description: "Indoor-grown microgreens." },
  { vendor: "Omar Haddad", brand: "Spice Trail", category: "Handmade goods", status: "active", sells: ["Spice blends", "Teas"], highlights: [{ name: "Ras el hanout", price: "$8.50" }], description: "Small-batch spice mixes." },
  { vendor: "Grace O'Brien", brand: "Emerald Isle", category: "Dairy", status: "active", sells: ["Butter", "Cream", "Soda bread"], highlights: [{ name: "Irish butter", price: "$5.00" }], description: "Imports & local creamery." },
  { vendor: "The Nguyens", brand: "Lotus Kitchen", category: "Meat", status: "deal", sells: ["Dumplings", "Spring rolls"], highlights: [{ name: "Pork dumplings 6pc", price: "$7.00", oldPrice: "$9.00" }], description: "Made fresh at the stall." },
  { vendor: "Felix Hart", brand: "Ironwood Forge", category: "Handmade goods", status: "active", sells: ["Knives", "Garden tools"], highlights: [{ name: "Herb snips", price: "$24.00" }], description: "Hand-forged steel tools." },
  { vendor: "Dr. Amara Wells", brand: "Roots Apothecary", category: "Organic", status: "active", sells: ["Tinctures", "Teas", "Salves"], highlights: [{ name: "Elderberry syrup", price: "$14.00" }], description: "Herbal remedies & tonics." },
  { vendor: "Tom & Evie", brand: "Sunny Side Eggs", category: "Dairy", status: "active", sells: ["Eggs", "Quiche"], highlights: [{ name: "Dozen pasture eggs", price: "$6.50" }], description: "Free-range local eggs." },
  { vendor: "Priya Shah", brand: "Masala Basket", category: "Handmade goods", status: "active", sells: ["Chutneys", "Pickles", "Naan"], highlights: [{ name: "Mango chutney", price: "$5.50" }], description: "Family recipes." },
  { vendor: "Hank Mueller", brand: "Oak Barrel Kraut", category: "Organic", status: "active", sells: ["Sauerkraut", "Kimchi"], highlights: [{ name: "Classic kraut", price: "$4.00" }], description: "Fermented in oak barrels." },
  { vendor: "Lily & Rose", brand: "Petal & Stem", category: "Fruits & Vegetables", status: "deal", sells: ["Cut flowers", "Dried bouquets"], highlights: [{ name: "Market bouquet", price: "$12.00", oldPrice: "$16.00" }], description: "Seasonal local blooms." },
  { vendor: "Diego Santos", brand: "Coastal Catch", category: "Meat", status: "active", sells: ["Smoked fish", "Pâté"], highlights: [{ name: "Smoked trout", price: "$11.00" }], description: "Sustainable seafood." },
  { vendor: "Emma Clarke", brand: "Little Lamb Fibres", category: "Handmade goods", status: "active", sells: ["Yarn", "Wool", "Knits"], highlights: [{ name: "Merino skein", price: "$18.00" }], description: "Local wool & hand knits." },
  { vendor: "Jules Martin", brand: "Fromage & Friends", category: "Dairy", status: "active", sells: ["Goat cheese", "Crackers"], highlights: [{ name: "Chèvre log", price: "$9.00" }], description: "Artisan cheese pairings." },
];

export const stalls: Stall[] = STALL_SLOTS.map((cell, i) => {
  const seed = SEEDS[i]!;
  return {
    id: i + 1,
    mapRow: cell.row,
    mapCol: cell.col,
    ...seed,
  };
});

export const announcements = [
  { id: 1, title: "Live folk music in the courtyard", time: "Today · 2:00 PM", body: "Local trio Whistle & Pine performs by the central oak." },
  { id: 2, title: "Free apple tasting at Stall 2", time: "Today · 11:00 AM", body: "Try 6 heirloom varieties from Sunny Orchard." },
  { id: 3, title: "Kids' planting workshop", time: "Saturday · 10:00 AM", body: "Free seedlings for every child. Sign up at the info desk." },
  { id: 4, title: "Market closed for harvest festival", time: "Sept 21", body: "Join us at the riverside park instead — full lineup announced soon." },
];

export const categories: Category[] = ["Organic", "Fruits & Vegetables", "Dairy", "Handmade goods", "Bakery", "Meat"];
