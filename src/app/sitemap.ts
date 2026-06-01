import type { MetadataRoute } from "next";
import { WORK_PROJECTS } from "@/config/work";
import { BLOG_POSTS } from "@/config/resources";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/work`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/resources`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const workRoutes: MetadataRoute.Sitemap = WORK_PROJECTS.map((p) => ({
    url: `${SITE_URL}/work/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const resourceRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((p) => ({
    url: `${SITE_URL}/resources/${p.slug}`,
    lastModified: new Date(`${p.date}T12:00:00Z`),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...workRoutes, ...resourceRoutes];
}
