// /llms.txt — concise, machine-readable index of the site for AI
// answer engines. Follows the llmstxt.org convention: H1 site title,
// blockquote summary, then markdown link lists grouped by section.
//
// Why a route handler instead of a static file in /public:
//   1. Single source of truth — service catalogue and case studies are
//      derived from src/config/* so the file can never drift.
//   2. Caches at build time via `force-static` and re-renders on rebuild.
//      No request-time work, same delivery cost as a static asset.

import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  COMPANY_EMAIL,
  COMPANY_PHONE,
} from "@/lib/seo";
import { SECTIONS_CONFIG, FAQ_CONFIG } from "@/config/sections";
import { WORK_PROJECTS } from "@/config/work";

export const dynamic = "force-static";

function buildLlmsTxt(): string {
  const services = SECTIONS_CONFIG.flatMap((s) =>
    s.type === "content" && s.details ? s.details : [],
  );

  const lines: string[] = [];

  lines.push(`# ${SITE_NAME}`);
  lines.push("");
  lines.push(`> ${SITE_TITLE}`);
  lines.push("");
  lines.push(SITE_DESCRIPTION);
  lines.push("");
  lines.push(
    `Sydney-based digital agency. Engagements: 4–6 week discovery sprint, then retained monthly work. Typical range $12k–$45k/month. Contact: ${COMPANY_EMAIL} · ${COMPANY_PHONE}.`,
  );
  lines.push("");

  lines.push("## Core pages");
  lines.push("");
  lines.push(`- [Home](${SITE_URL}/): overview of services, methodology, and outcomes`);
  lines.push(`- [Work](${SITE_URL}/work): selected case studies with measured results`);
  lines.push(`- [Privacy](${SITE_URL}/privacy): data handling and policy`);
  lines.push(`- [Terms](${SITE_URL}/terms): service terms`);
  lines.push("");

  lines.push("## Services");
  lines.push("");
  for (const svc of services) {
    lines.push(`- **${svc.name}** — ${svc.description}`);
  }
  lines.push("");

  lines.push("## Case studies");
  lines.push("");
  for (const p of WORK_PROJECTS) {
    lines.push(
      `- [${p.title} — ${p.discipline}](${SITE_URL}/work/${p.slug}): ${p.summary}`,
    );
  }
  lines.push("");

  lines.push("## FAQ");
  lines.push("");
  for (const item of FAQ_CONFIG.items) {
    lines.push(`### ${item.question}`);
    lines.push("");
    lines.push(item.answer);
    lines.push("");
  }

  lines.push("## Optional");
  lines.push("");
  lines.push(`- [Full content](${SITE_URL}/llms-full.txt): expanded version with case-study bodies and metrics`);
  lines.push(`- [Sitemap](${SITE_URL}/sitemap.xml): XML sitemap of indexable URLs`);
  lines.push("");

  return lines.join("\n");
}

export function GET(): Response {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
