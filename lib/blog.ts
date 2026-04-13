import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

const blogDirectory = path.join(process.cwd(), "content/blog");

export type BlogPostMeta = {
  slug: string;
  title: string;
  date: string;
  description: string;
};

export type BlogPost = BlogPostMeta & {
  contentHtml: string;
};

function readFrontmatter(data: Record<string, unknown>): {
  title: string;
  date: string;
  description: string;
} {
  return {
    title: typeof data.title === "string" ? data.title : "",
    date: typeof data.date === "string" ? data.date : "",
    description:
      typeof data.description === "string" ? data.description : "",
  };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(blogDirectory)) {
    return [];
  }
  return fs
    .readdirSync(blogDirectory)
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""));
}

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(blogDirectory)) {
    return [];
  }
  const posts = getAllSlugs().map((slug) => {
    const fullPath = path.join(blogDirectory, `${slug}.md`);
    const source = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(source);
    const { title, date, description } = readFrontmatter(
      data as Record<string, unknown>,
    );
    return { slug, title, date, description };
  });
  return posts.sort((a, b) => {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return a.title.localeCompare(b.title);
  });
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const fullPath = path.join(blogDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  const source = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(source);
  const { title, date, description } = readFrontmatter(
    data as Record<string, unknown>,
  );
  const processed = await remark().use(remarkHtml).process(content);
  const contentHtml = processed.toString();
  return { slug, title, date, description, contentHtml };
}
