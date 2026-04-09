import type { Metadata } from "next";
import Link from "next/link";
import { FacilityCard } from "@/components/FacilityCard";
import {
  getCanadaDirectoryIndex,
  getProvinceSummary,
} from "@/lib/canadaFacilities";
import {
  DEFAULT_MED_SPA_CARE_TYPES_SENTENCE,
  medSpaCategorySchemaThings,
} from "@/lib/careTypesProse";

const siteUrl = "https://medicalspadirectories.com";

type ProvincePageProps = {
  params: Promise<{ provinceSlug: string }>;
};

export async function generateMetadata({
  params,
}: ProvincePageProps): Promise<Metadata> {
  const { provinceSlug } = await params;
  const safeSlug = provinceSlug ?? "";
  const canonicalPath = `/canada/${safeSlug.toLowerCase()}`;

  const { provinceName, totalFacilities, cities } = await getProvinceSummary(
    safeSlug,
  );

  const title = `Medical Spas in ${provinceName}, Canada | Medical Spa Directories`;
  const descriptor = `Find ${totalFacilities.toLocaleString()} medical spa listings in ${provinceName}, Canada. Compare aesthetic treatments, laser services, and skin care. Verified listings with ratings and reviews.`;

  return {
    title,
    description: descriptor,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description: descriptor,
      url: canonicalPath,
      siteName: "MedicalSpaDirectories.com",
      type: "website",
      images: [
        {
          url: "/og-image.svg",
          width: 1200,
          height: 630,
          alt: `${provinceName} medical spa directory preview`,
        },
      ],
    },
  };
}

export async function generateStaticParams() {
  const directory = await getCanadaDirectoryIndex();
  return directory.map((item) => ({ provinceSlug: item.provinceSlug }));
}

export default async function ProvincePage({ params }: ProvincePageProps) {
  const { provinceSlug } = await params;
  const {
    provinceName,
    provinceSlug: resolvedProvinceSlug,
    totalFacilities,
    cities,
    facilities,
    averageRating,
    careTypes,
  } = await getProvinceSummary(provinceSlug ?? "");

  const medSpaFocusText =
    "medical spas, medi spas, aesthetic clinics, laser treatments, injectables, and skin care";
  const majorCities = [...cities]
    .sort((a, b) => b.facilityCount - a.facilityCount)
    .slice(0, 6)
    .map((c) => c.cityName);
  const majorCitiesText = majorCities.slice(0, 4).join(", ");

  const hasRating = typeof averageRating === "number";
  const topCareTypes = careTypes.slice(0, 6);
  const careTypesSentence =
    topCareTypes.length > 0
      ? topCareTypes.join(", ")
      : DEFAULT_MED_SPA_CARE_TYPES_SENTENCE;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "MedicalSpaDirectories.com",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Canada",
        item: `${siteUrl}/canada`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: provinceName,
        item: `${siteUrl}/canada/${resolvedProvinceSlug}`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How many medical spas are in ${provinceName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Our directory lists ${totalFacilities.toLocaleString()} verified facilities across ${cities.length.toLocaleString()} cities.`,
        },
      },
      {
        "@type": "Question",
        name: `What types of aesthetic and medical spa services are available in ${provinceName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${careTypesSentence}.`,
        },
      },
      {
        "@type": "Question",
        name: "How are listings selected for this directory?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "All listings are sourced from Google Maps, verified, and must have a minimum 3-star rating.",
        },
      },
    ],
  };

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Medical Spas in ${provinceName}, Canada`,
    url: `${siteUrl}/canada/${resolvedProvinceSlug}`,
    isPartOf: {
      "@type": "WebSite",
      name: "MedicalSpaDirectories.com",
      url: `${siteUrl}/`,
    },
    about: [
      { "@type": "Thing", name: `${provinceName} medical spa listings` },
      ...medSpaCategorySchemaThings(),
    ],
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "main p"],
    },
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
      />
      <nav className="mb-4" aria-label="Breadcrumb">
        <Link
          href="/canada"
          className="text-sm font-medium text-teal hover:text-teal-soft hover:underline"
        >
          ← Back to Canada directory
        </Link>
      </nav>
      <Link
        href="/advertise"
        className="mb-4 flex items-center justify-center gap-2 rounded-full bg-teal px-5 py-3 text-center text-sm font-semibold text-white shadow-md transition hover:bg-teal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
        aria-label="View featured listing pricing and benefits"
      >
        Get your practice featured — view pricing &amp; benefits →
      </Link>
      <section className="rounded-2xl bg-surface-muted px-5 py-6 text-foreground shadow-lg shadow-navy/10 ring-1 ring-gold/40 sm:px-8 sm:py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-soft">
          Province overview
        </p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
          Medical Spas in {provinceName}, Canada
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-foreground/80">
          Explore {medSpaFocusText} across {provinceName}, including major
          city areas such as {majorCitiesText}. Use this page to find listings by
          city.
        </p>

        <div className="mt-5 grid gap-4 text-sm sm:grid-cols-3">
          <div className="rounded-xl bg-surface p-4 ring-1 ring-navy/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-soft">
              Listings
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {totalFacilities.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl bg-surface p-4 ring-1 ring-navy/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-soft">
              Cities covered
            </p>
            <p className="mt-1 text-2xl font-semibold">{cities.length}</p>
          </div>
          <div className="rounded-xl bg-surface p-4 ring-1 ring-navy/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-soft">
              Average rating
            </p>
            <p className="mt-1 flex items-baseline gap-2 text-2xl font-semibold">
              {hasRating ? averageRating?.toFixed(1) : "—"}
              {hasRating && (
                <span className="text-xs font-medium text-gold-soft">
                  / 5 stars
                </span>
              )}
            </p>
          </div>
        </div>
      </section>

      {(() => {
        const featuredFacilities = facilities
          .filter((f) => f.featured === true || f.premium === true)
          .slice(0, 3);
        if (featuredFacilities.length === 0) return null;
        return (
          <section className="mt-8 rounded-2xl border-2 border-teal/20 bg-teal/5 p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-teal border-b border-teal/40 pb-1 inline-block">
              Top Picks in {provinceName}
            </h2>
            <p className="text-sm text-slate-600">
              Featured medical spas in {provinceName} — verified listings with
              priority placement.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {featuredFacilities.map((facility) => (
                <FacilityCard key={facility.id} facility={facility} />
              ))}
            </div>
          </section>
        );
      })()}

      <section className="mt-8 rounded-2xl border-2 border-navy/20 bg-background p-6 space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-navy border-b-2 border-teal/50 pb-1 inline-block">
              Medical Spas by City in {provinceName}
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Choose a city to browse medical spas, medi spas, and aesthetic clinics in{" "}
              {provinceName}, including laser treatments, injectables, and skin care services.
            </p>
          </div>
          <div className="text-xs text-slate-500">
            <Link href="/canada" className="text-teal hover:text-teal-soft">
              Back to Canada directory
            </Link>
          </div>
        </div>

        {cities.length === 0 ? (
          <p className="text-sm text-slate-600">
            We don&apos;t have listings for {provinceName} yet. As new data
            becomes available, cities and listings will appear here.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {cities.map((city) => (
              <Link
                key={city.citySlug}
                href={`/canada/${resolvedProvinceSlug}/${city.citySlug}`}
                className="group flex items-center justify-between rounded-lg border border-surface-muted border-l-[3px] border-l-navy bg-surface px-3 py-2 text-sm text-navy shadow-sm transition hover:border-teal hover:bg-surface-muted hover:text-navy"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{city.cityName}</span>
                  <span className="text-xs text-slate-600 group-hover:text-navy/85">
                    {city.facilityCount.toLocaleString()}{" "}
                    {city.facilityCount === 1 ? "listing" : "listings"}
                  </span>
                </div>
                {city.averageRating ? (
                  <span className="rounded-full bg-teal px-2.5 py-1 text-xs font-bold text-white">
                    {city.averageRating.toFixed(1)}★
                  </span>
                ) : (
                  <span className="rounded-full bg-teal px-2.5 py-1 text-xs font-bold text-white">
                    N/A
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
