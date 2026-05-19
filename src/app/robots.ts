import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Explicit allow-list for AI answer engines so they can crawl, embed, and
// cite the site. Without naming these agents, some respect robots only when
// matched specifically (Google-Extended in particular). Order: AI bots
// first so the more specific rules win in conforming parsers.
const AI_USER_AGENTS = [
  "GPTBot", // OpenAI training crawler
  "OAI-SearchBot", // ChatGPT search browsing
  "ChatGPT-User", // ChatGPT user-initiated fetches
  "ClaudeBot", // Anthropic crawler
  "Claude-Web", // Anthropic browsing
  "anthropic-ai", // Anthropic legacy UA
  "PerplexityBot", // Perplexity index
  "Perplexity-User", // Perplexity on-demand
  "Google-Extended", // Gemini / AI Overviews opt-in token
  "Applebot-Extended", // Apple Intelligence training opt-in
  "Bytespider", // Doubao / ByteDance
  "Amazonbot", // Alexa / Rufus
  "CCBot", // Common Crawl (feeds many LLMs)
  "Meta-ExternalAgent",
  "FacebookBot",
  "DuckAssistBot",
  "YouBot",
  "Diffbot",
  "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Baseline — every crawler may index everything except /api and /hyper.
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/hyper"],
      },
      // AI engines: same access as baseline, listed explicitly so opt-in
      // tokens (Google-Extended, Applebot-Extended) are honored and so
      // operators can revoke per-bot access by editing one entry.
      {
        userAgent: AI_USER_AGENTS,
        allow: "/",
        disallow: ["/api/", "/hyper"],
      },
    ],
    sitemap: [`${SITE_URL}/sitemap.xml`],
    host: SITE_URL,
  };
}
