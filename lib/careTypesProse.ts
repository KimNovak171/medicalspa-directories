/**
 * Turn raw Google-style category labels into short, natural phrases for prose
 * (e.g. city page intros). Omits entries that do not look medical-spa-related.
 */

const EXACT_PHRASE: Record<string, string> = {
  "medical spa": "medical spas",
  "medi spa": "medi spas",
  "med spa": "med spas",
  medspa: "medical spas",
  "aesthetic clinic": "aesthetic clinics",
  "medical aesthetics": "medical aesthetics",
};

const MED_SPA_LIKE =
  /medical\s*spa|medi\s*spa|med\s*spa|medspa|aesthetic|injectable|botox|filler|laser|skin\s*care|microneedling|coolsculpt|dermal|iv\s*drip|hydrafacial|peel|wellness\s*clinic/i;

/** Labels that match common noise but are not medical spa services. */
const NON_MED_SPA =
  /auto\s+repair|collision|transmission|student\s+dormitory|orthodox\s+church|storage\s+facility|insurance\s+agency|urolog/i;

function normalizeKey(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Fallback: lowercase prose, light plural / phrasing for service-style labels. */
function humanizeFallback(raw: string): string {
  const s = raw.trim().toLowerCase();
  if (!s) return "";
  if (s.endsWith(" service")) {
    return `${s.slice(0, -" service".length)} services`;
  }
  if (s.endsWith(" clinic")) {
    return s.replace(/ clinic$/, " clinics");
  }
  if (s.endsWith(" center")) {
    return s.replace(/ center$/, " centers");
  }
  if (s.endsWith("ist") && !/aesthetician$/.test(s)) {
    return `${s}s`;
  }
  if (!s.endsWith("s")) {
    return `${s}s`;
  }
  return s;
}

function phraseForLabel(raw: string): string | null {
  const key = normalizeKey(raw);
  if (!key) return null;
  if (NON_MED_SPA.test(key)) return null;
  if (EXACT_PHRASE[key]) return EXACT_PHRASE[key];
  if (!MED_SPA_LIKE.test(raw)) return null;
  return humanizeFallback(raw);
}

function oxfordJoin(items: string[]): string {
  if (items.length === 1) return items[0]!;
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

/**
 * @param careTypes Raw labels from listings (dedupe before calling if needed).
 * @param maxItems Cap how many categories appear in the sentence (default 5).
 * @returns Clause starting with "including …" or a neutral fallback (no leading "including" duplicate in caller).
 */
export function formatCareTypesClause(
  careTypes: string[],
  maxItems = 5,
): string {
  const seen = new Set<string>();
  const phrases: string[] = [];
  for (const raw of careTypes) {
    const p = phraseForLabel(raw);
    if (!p || seen.has(p)) continue;
    seen.add(p);
    phrases.push(p);
    if (phrases.length >= maxItems) break;
  }
  if (phrases.length === 0) {
    return "including medical spas, aesthetic treatments, laser treatments, injectables, and skin care";
  }
  return `including ${oxfordJoin(phrases)}`;
}

/** Schema.org `Thing` entries for primary medical spa categories on this directory. */
export function medSpaCategorySchemaThings(): {
  "@type": "Thing";
  name: string;
}[] {
  return [
    { "@type": "Thing", name: "Medical Spa" },
    { "@type": "Thing", name: "Medi Spa" },
    { "@type": "Thing", name: "Aesthetic Clinic" },
    { "@type": "Thing", name: "Medical Aesthetics" },
  ];
}

/** Default sentence when no care-type stats exist (FAQ answers, etc.). */
export const DEFAULT_MED_SPA_CARE_TYPES_SENTENCE =
  "Medical Spa, Medi Spa, Aesthetic Clinic, Medical Aesthetics";
