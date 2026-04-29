import type { Stall } from "@/data/market";

/**
 * Match vendor listing search: vendor, brand, products, stall id / "stall 03" / "#3", etc.
 */
export function stallMatchesVendorSearch(stall: Stall, raw: string): boolean {
  const q = raw.trim().toLowerCase();
  if (!q) return true;

  const idPad = String(stall.id).padStart(2, "0");
  const haystack = [
    stall.vendor,
    stall.brand,
    stall.description,
    ...(stall.sells ?? []),
    String(stall.id),
    idPad,
    `stall ${idPad}`,
    `stall ${stall.id}`,
    `#${idPad}`,
    `#${stall.id}`,
  ]
    .filter((s): s is string => Boolean(s))
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
}

/** Max edit distance we allow for a query word of this length */
function maxDistForQuery(word: string): number {
  const n = word.length;
  if (n <= 2) return 0;
  if (n <= 4) return 1;
  if (n <= 7) return 2;
  return 3;
}

function splitWords(s: string): string[] {
  return s
    .toLowerCase()
    .split(/[\s/·,–—&+]+/)
    .map((w) => w.replace(/^[^a-z0-9]+|[^a-z0-9]+$/gi, ""))
    .filter((w) => w.length >= 2);
}

/** Tokens we compare with edit distance (names, products, stall labels) */
function fuzzyTokensForStall(stall: Stall): string[] {
  const out: string[] = [];
  if (stall.vendor) {
    out.push(stall.vendor.toLowerCase());
    out.push(...splitWords(stall.vendor));
  }
  if (stall.brand) {
    out.push(stall.brand.toLowerCase());
    out.push(...splitWords(stall.brand));
  }
  for (const item of stall.sells ?? []) {
    const t = item.toLowerCase();
    out.push(t);
    out.push(...splitWords(item));
  }
  if (stall.description) {
    out.push(...splitWords(stall.description).filter((w) => w.length >= 3));
  }
  const idPad = String(stall.id).padStart(2, "0");
  out.push(String(stall.id), idPad, `stall${idPad}`, `stall${stall.id}`);

  return [...new Set(out.filter(Boolean))];
}

/**
 * Levenshtein distance with early exit when already above `max`.
 * Returns `max + 1` when distance exceeds `max`.
 */
function levenshtein(a: string, b: string, max: number): number {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (Math.abs(m - n) > max) return max + 1;

  const row = new Array<number>(n + 1);
  for (let j = 0; j <= n; j++) row[j] = j;

  for (let i = 1; i <= m; i++) {
    let prev = row[0]!;
    row[0] = i;
    let rowMin = row[0];
    for (let j = 1; j <= n; j++) {
      const temp = row[j]!;
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j]! + 1, row[j - 1]! + 1, prev + cost);
      prev = temp;
      rowMin = Math.min(rowMin, row[j]!);
    }
    if (rowMin > max) return max + 1;
  }
  const d = row[n]!;
  return d > max ? max + 1 : d;
}

/** Best (lowest) edit distance from `word` to any fuzzy token on this stall */
function bestFuzzyScore(stall: Stall, word: string): number {
  const w = word.toLowerCase();
  const max = maxDistForQuery(w);
  let best = max + 1;
  for (const t of fuzzyTokensForStall(stall)) {
    if (Math.abs(t.length - w.length) > max + 1) continue;
    const d = levenshtein(w, t, max);
    if (d < best) best = d;
    if (best === 0) break;
  }
  return best;
}

/**
 * When every query word is within edit-distance budget against some token on the stall.
 * Returns a sort key (sum of per-word best distances), or null if no match.
 */
function fuzzyMatchStall(stall: Stall, raw: string): number | null {
  const q = raw.trim().toLowerCase();
  if (!q) return null;
  const words = q.split(/\s+/).map((x) => x.trim()).filter((x) => x.length >= 2);
  const queryWords = words.length > 0 ? words : q.length >= 2 ? [q] : [];
  if (queryWords.length === 0) return null;

  let sum = 0;
  for (const word of queryWords) {
    const d = bestFuzzyScore(stall, word);
    const cap = maxDistForQuery(word);
    if (d > cap) return null;
    sum += d;
  }
  return sum;
}

/** Vendors with closest fuzzy match to the query (after exact search failed) */
export function closestVendorStalls(stalls: Stall[], raw: string, limit = 9): Stall[] {
  const q = raw.trim();
  if (q.length < 2) return [];

  const withVendor = stalls.filter((s) => s.vendor);
  const scored = withVendor
    .map((s) => {
      const score = fuzzyMatchStall(s, q);
      return score === null ? null : { s, score };
    })
    .filter((x): x is { s: Stall; score: number } => x !== null)
    .sort((a, b) => a.score - b.score || a.s.id - b.s.id)
    .slice(0, limit)
    .map((x) => x.s);

  return scored;
}

/** Single best correction token (for “Did you mean …”) when fuzzy fallback is used */
export function suggestNearestToken(raw: string, stalls: Stall[]): string | null {
  const q = raw.trim().toLowerCase();
  if (q.length < 3) return null;
  const max = maxDistForQuery(q);
  let best: { token: string; d: number } | null = null;

  for (const s of stalls) {
    if (!s.vendor) continue;
    for (const t of fuzzyTokensForStall(s)) {
      if (t.length < 3) continue;
      if (Math.abs(t.length - q.length) > max + 2) continue;
      const d = levenshtein(q, t, max);
      if (d === 0 || d > max) continue;
      if (!best || d < best.d || (d === best.d && t.length < best.token.length)) {
        best = { token: t, d };
      }
    }
  }
  if (!best) return null;
  const pretty = best.token
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return pretty;
}
