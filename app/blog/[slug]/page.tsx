import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return { title: "Article not found" };
  }
  const title = post.title || slug;
  return {
    title,
    description: post.description || undefined,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: `${title} | MedicalSpaDirectories.com`,
      description: post.description || undefined,
      url: `/blog/${slug}`,
      siteName: "MedicalSpaDirectories.com",
      type: "article",
      publishedTime: post.date || undefined,
    },
  };
}

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

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <article>
        <header className="space-y-3 border-b border-teal/15 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
            Blog
          </p>
          <h1 className="text-3xl font-semibold text-navy sm:text-4xl">
            {post.title}
          </h1>
          {post.date ? (
            <p className="text-sm text-slate-500">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </p>
          ) : null}
          {post.description ? (
            <p className="max-w-3xl text-sm text-slate-600">{post.description}</p>
          ) : null}
        </header>

        <div
          className="blog-markdown pt-8"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>

      <div className="mt-12 flex flex-wrap gap-4 border-t border-teal/15 pt-8 text-sm text-slate-600">
        <Link href="/blog" className="text-teal hover:text-teal-soft">
          All articles
        </Link>
        <Link href="/" className="text-teal hover:text-teal-soft">
          Homepage
        </Link>
      </div>
    </main>
  );
}
