import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guides and articles about medical spas, treatments, safety, and choosing a provider.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog | MedicalSpaDirectories.com",
    url: "/blog",
    siteName: "MedicalSpaDirectories.com",
    type: "website",
  },
};

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
          Blog
        </p>
        <h1 className="text-3xl font-semibold text-navy sm:text-4xl">
          Medical spa guides &amp; articles
        </h1>
        <p className="max-w-3xl text-sm text-slate-600">
          Practical guides on treatments, what to expect, and how to choose a
          reputable medical spa.
        </p>
      </header>

      <ul className="mt-10 divide-y divide-teal/15 border-t border-teal/15">
        {posts.map((post) => (
          <li key={post.slug} className="py-6">
            <article className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
              <div className="min-w-0 flex-1 space-y-2">
                <h2 className="text-lg font-semibold text-navy">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-navy transition-colors hover:text-teal-soft"
                  >
                    {post.title || post.slug}
                  </Link>
                </h2>
                {post.description ? (
                  <p className="text-sm text-slate-600">{post.description}</p>
                ) : null}
              </div>
              {post.date ? (
                <time
                  dateTime={post.date}
                  className="shrink-0 text-xs text-slate-500 sm:text-right"
                >
                  {formatDate(post.date)}
                </time>
              ) : null}
            </article>
          </li>
        ))}
      </ul>

      {posts.length === 0 ? (
        <p className="mt-10 text-sm text-slate-600">No articles yet.</p>
      ) : null}

      <div className="mt-10 text-sm text-slate-600">
        <Link href="/" className="text-teal hover:text-teal-soft">
          Back to homepage
        </Link>
      </div>
    </main>
  );
}
