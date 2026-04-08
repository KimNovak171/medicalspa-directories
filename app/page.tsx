import type { Metadata } from "next";
import Link from "next/link";
import { FacilityCard } from "@/components/FacilityCard";
import {
  getCanadaDirectoryIndex,
  getCanadaNationwideStats,
} from "@/lib/canadaFacilities";
import { getDirectoryIndex, getStateSummary, getGlobalStats } from "@/lib/stateFacilities";

export async function generateMetadata(): Promise<Metadata> {
  const stats = getGlobalStats();
  const total = stats.totalFacilities.toLocaleString();
  const title = `Hair Salon Directory USA & Canada | ${total} verified salons`;
  const description = `Browse ${total} verified hair salons and beauty businesses across the United States and Canada — all rated 3 stars or higher on Google Maps.`;

  return {
    title,
    description,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title,
      description,
      url: "/",
      siteName: "HairSalonDirectories.com",
      type: "website",
      images: [
        {
          url: "/og-image.svg",
          width: 1200,
          height: 630,
          alt: "HairSalonDirectories.com homepage preview",
        },
      ],
    },
  };
}

export default async function Home() {
  const [usDirectory, canadaDirectory] = await Promise.all([
    getDirectoryIndex(),
    getCanadaDirectoryIndex(),
  ]);
  const usStatesSorted = [...usDirectory].sort((a, b) =>
    a.stateName.localeCompare(b.stateName, "en", { sensitivity: "base" }),
  );
  const stateSummaries = await Promise.all(
    usDirectory.map((s) => getStateSummary(s.stateSlug)),
  );
  const globalStats = getGlobalStats();
  const canadaNationwide = getCanadaNationwideStats();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "HairSalonDirectories.com",
        item: "https://hairsalondirectories.com/",
      },
    ],
  };

  return (
    <div className="bg-surface-muted text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <section className="bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
          <div className="space-y-6 rounded-2xl bg-brand-gradient px-6 py-8 text-brand-ink shadow-sm sm:px-8 sm:py-10">
            <p className="inline-flex rounded-full border border-brand-ink/20 bg-white/35 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] backdrop-blur-sm">
              Hair Salon Directories
            </p>
            <h1 className="text-balance text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              Find Trusted Hair Salons — US States &amp; Canadian Provinces
            </h1>
            <p className="max-w-2xl text-balance text-sm sm:text-base text-brand-ink/85">
              Verified hair salons, beauty salons, and stylists across the United States and Canada—browse by
              state or province, then by city. Every listing rated 3★ or higher
              on Google Maps.
            </p>
          </div>

          <section className="w-full border-y-2 border-teal/30 bg-surface">
            <div
              className={`mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:px-8 ${
                canadaNationwide.totalFacilities > 0
                  ? "lg:grid-cols-5"
                  : "lg:grid-cols-4"
              }`}
            >
              <div className="rounded-xl border-2 border-teal/30 bg-surface p-4 text-center shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-teal">
                  Verified salons
                </p>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {globalStats.totalFacilities.toLocaleString()}
                </p>
                {canadaNationwide.totalFacilities > 0 && (
                  <p className="mt-1 text-xs text-foreground/70">
                    US + Canada combined
                  </p>
                )}
              </div>
              {canadaNationwide.totalFacilities > 0 && (
                <div className="rounded-xl border-2 border-teal/30 bg-surface p-4 text-center shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal">
                    Canadian salons
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    {canadaNationwide.totalFacilities.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-foreground/70">
                    {canadaNationwide.provinceCount.toLocaleString()} provinces
                    &amp; territories
                  </p>
                </div>
              )}
              <div className="rounded-xl border-2 border-teal/30 bg-surface p-4 text-center shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-teal">
                  Cities Covered
                </p>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {globalStats.totalCities.toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl border-2 border-teal/30 bg-surface p-4 text-center shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-teal">
                  Average Rating
                </p>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {globalStats.averageRating != null
                    ? `${globalStats.averageRating}★`
                    : "—"}
                </p>
              </div>
              <div className="rounded-xl border-2 border-teal/30 bg-surface p-4 text-center shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-teal">
                  Quality Standard
                </p>
                <p className="mt-2 text-2xl font-semibold text-foreground">3★ Minimum</p>
              </div>
            </div>
          </section>

          <div className="w-full rounded-2xl border-2 border-teal/40 bg-surface p-6 shadow-xl shadow-navy/20 ring-1 ring-teal/30">
            <h2 className="text-xl font-semibold text-foreground">
              Start with a state directory
            </h2>
            <p className="mt-2 text-sm text-foreground/90">
              Browse verified salons by state, then drill down by
              city to compare services and contact details.
            </p>

            <p className="mt-2 text-sm font-medium text-foreground">
              {usStatesSorted.map((s) => s.stateName).join(" • ")}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {usStatesSorted.map((state) => (
                <Link
                  key={state.stateSlug}
                  href={`/${state.stateSlug}`}
                  className="rounded-xl border-2 border-gold bg-surface-muted px-5 py-4 text-left text-navy transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <p className="text-lg font-semibold">{state.stateName}</p>
                  <p className="mt-1 text-sm text-gold-soft">
                    {state.stateName} — {state.totalFacilities.toLocaleString()} salons
                  </p>
                </Link>
              ))}
            </div>

            <p className="mt-4 text-sm font-medium text-foreground">
              Each state has its own dedicated directory — specific
              salons, specific cities, built for that state only.
            </p>
          </div>
        </div>
      </section>

      {canadaDirectory.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-navy">
            Canadian Hair Salon Directories
          </h2>
          <p className="mt-2 text-sm text-foreground/70">
            Browse verified salons by Canadian province. Same
            directory experience — province by province, then by city.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {canadaDirectory.map((item) => (
              <Link
                key={item.provinceSlug}
                href={`/canada/${item.provinceSlug}`}
                className="rounded-xl border-2 border-gold bg-surface px-5 py-4 text-left text-navy transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <p className="text-lg font-semibold">{item.provinceName}</p>
                <p className="mt-1 text-sm text-gold-soft">
                  {item.provinceName} — {item.totalFacilities.toLocaleString()} salons
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {(() => {
        const allFeatured = stateSummaries
          .flatMap((s) => s.facilities)
          .filter((f) => f.featured === true || f.premium === true)
          .slice(0, 6);
        if (allFeatured.length === 0) return null;
        return (
          <section className="mx-auto max-w-6xl rounded-2xl border-2 border-teal/20 bg-surface px-4 py-10 sm:px-6 lg:px-8">
            <h2 className="text-xl font-semibold text-foreground">
              Featured salons
            </h2>
            <p className="mt-1 text-sm text-foreground/70">
              Selected salons across our directories — verified listings for
              clients comparing hair salons, beauty salons, and stylists.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allFeatured.map((facility) => (
                <FacilityCard key={facility.id} facility={facility} />
              ))}
            </div>
          </section>
        );
      })()}

      <p className="mx-auto max-w-2xl rounded-lg border-2 border-teal/40 bg-surface px-4 py-3 text-center text-sm text-foreground/85">
        Salon owners: Get featured at the top of your city listing.{" "}
        <Link
          href="/advertise"
          className="font-medium text-teal underline underline-offset-2 hover:text-teal-soft"
        >
          Learn about featured salon placement
        </Link>{" "}
        or contact{" "}
        <a
          href="mailto:hello@directoriesnetwork.com"
          className="font-medium text-teal underline underline-offset-2 hover:text-teal-soft"
        >
          hello@directoriesnetwork.com
        </a>
        .
      </p>

      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-foreground border-b-2 border-teal/50 pb-2 inline-block">
            How It Works
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border-l-4 border-teal border border-surface-muted bg-surface p-5 shadow-sm">
              <p className="text-2xl" aria-hidden="true">
                1️⃣
              </p>
              <h3 className="mt-3 text-lg font-semibold text-foreground">
                Choose your state
              </h3>
              <p className="mt-2 text-sm text-foreground/70">
                Start with Florida or California to access complete state
                directories.
              </p>
            </div>
            <div className="rounded-xl border-l-4 border-teal border border-surface-muted bg-surface p-5 shadow-sm">
              <p className="text-2xl" aria-hidden="true">
                2️⃣
              </p>
              <h3 className="mt-3 text-lg font-semibold text-foreground">
                Browse by city
              </h3>
              <p className="mt-2 text-sm text-foreground/70">
                Compare local options by city with ratings, salon services,
                and contact details.
              </p>
            </div>
            <div className="rounded-xl border-l-4 border-teal border border-surface-muted bg-surface p-5 shadow-sm">
              <p className="text-2xl" aria-hidden="true">
                3️⃣
              </p>
              <h3 className="mt-3 text-lg font-semibold text-foreground">
                Contact salons directly
              </h3>
              <p className="mt-2 text-sm text-foreground/70">
                Use website and maps links to verify details and contact
                salons.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface border-y border-navy/10">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-foreground border-b-2 border-teal/50 pb-2 inline-block">
            Why Trust Us
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="rounded-xl border-l-4 border-navy border border-surface-muted bg-surface p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground">
                Google Verified Data
              </h3>
              <p className="mt-2 text-sm text-foreground/70">
                All listings sourced from Google Maps with real ratings and
                reviews.
              </p>
            </article>
            <article className="rounded-xl border-l-4 border-navy border border-surface-muted bg-surface p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground">
                Quality Filtered
              </h3>
              <p className="mt-2 text-sm text-foreground/70">
                Minimum 3-star rating, irrelevant businesses removed.
              </p>
            </article>
            <article className="rounded-xl border-l-4 border-navy border border-surface-muted bg-surface p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground">
                Always Free to Browse
              </h3>
              <p className="mt-2 text-sm text-foreground/70">
                No signup required, no spam, just helpful information for
                anyone booking a cut, color, or style.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gold/50 bg-surface p-6 text-foreground ring-1 ring-gold/30">
            <h2 className="text-2xl font-semibold text-foreground">
              Are You a Salon Owner?
            </h2>
            <p className="mt-3 max-w-3xl text-sm text-foreground/90">
              Get your salon seen by clients actively searching for hair salons,
              stylists, and beauty services in your city. Featured listings available.
            </p>
            <div className="mt-5">
              <Link
                href="/advertise"
                className="inline-flex items-center justify-center rounded-full border border-brand-ink/15 bg-navy px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-navy-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Learn About Featured Listings
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
