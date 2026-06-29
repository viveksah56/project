import Blog from "../models/blog.model.js";

export const generateSlug = async (title: string): Promise<string> => {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  let slug = base;
  let count = 1;

  while (await Blog.exists({ slug })) {
    slug = `${base}-${count++}`;
  }

  return slug;
};