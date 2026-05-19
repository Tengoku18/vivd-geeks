// /llms-full.txt — expanded LLM-readable export. Same intent as llms.txt
// but includes full case-study bodies, metrics, testimonials, and FAQ so
// engines that pull this file have the entire substantive content of the
// site without needing to crawl every URL.

import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  COMPANY_EMAIL,
  COMPANY_PHONE,
  SOCIAL_PROFILES,
} from "@/lib/seo";
import {
  SECTIONS_CONFIG,
  FAQ_CONFIG,
  TESTIMONIALS_CONFIG,
  HERO_CONFIG,
} from "@/config/sections";
import { WORK_PROJECTS } from "@/config/work";

export const dynamic = "force-static";

function buildLlmsFullTxt(): string {
  const lines: string[] = [];

  lines.push(`# ${SITE_NAME}`);
  lines.push("");
  lines.push(`> ${SITE_TITLE}`);
  lines.push("");
  lines.push(SITE_DESCRIPTION);
  lines.push("");

  lines.push("## About");
  lines.push("");
  lines.push(HERO_CONFIG.tagline);
  lines.push("");
  lines.push(
    `${SITE_NAME} is headquartered in Sydney, Australia and serves clients across Australia and worldwide. We operate as embedded operators rather than advisors: a 4–6 week discovery and strategy sprint, followed by a retained monthly engagement.`,
  );
  lines.push("");
  lines.push(`- Email: ${COMPANY_EMAIL}`);
  lines.push(`- Phone: ${COMPANY_PHONE}`);
  for (const url of SOCIAL_PROFILES) {
    lines.push(`- Social: ${url}`);
  }
  lines.push("");

  lines.push("## Services");
  lines.push("");
  for (const section of SECTIONS_CONFIG) {
    if (section.type !== "content") continue;
    lines.push(`### ${section.heading}`);
    lines.push("");
    lines.push(section.body);
    lines.push("");
    if (section.details) {
      for (const d of section.details) {
        lines.push(`- **${d.name}**: ${d.description}`);
      }
      lines.push("");
    }
  }

  lines.push("## Case studies");
  lines.push("");
  for (const p of WORK_PROJECTS) {
    lines.push(`### ${p.title} — ${p.discipline}`);
    lines.push("");
    lines.push(`URL: ${SITE_URL}/work/${p.slug}`);
    lines.push(`Client: ${p.client}`);
    lines.push(`Year: ${p.year} (${p.season})`);
    lines.push("");
    lines.push(`Summary: ${p.summary}`);
    lines.push("");
    for (const para of p.body) {
      lines.push(para);
      lines.push("");
    }
    if (p.metrics.length) {
      lines.push("Results:");
      for (const m of p.metrics) {
        lines.push(`- ${m.label}: ${m.value}`);
      }
      lines.push("");
    }
  }

  lines.push("## Testimonials");
  lines.push("");
  for (const t of TESTIMONIALS_CONFIG.items) {
    lines.push(`> ${t.quote}`);
    lines.push("");
    lines.push(`— ${t.author}, ${t.role}${t.metric ? ` (${t.metric})` : ""}`);
    lines.push("");
  }

  lines.push("## FAQ");
  lines.push("");
  for (const item of FAQ_CONFIG.items) {
    lines.push(`### ${item.question}`);
    lines.push("");
    lines.push(item.answer);
    lines.push("");
  }

  lines.push("## Stats");
  lines.push("");
  const statsSection = SECTIONS_CONFIG.find((s) => s.type === "stats");
  if (statsSection && statsSection.type === "stats") {
    for (const s of statsSection.stats) {
      const formatted = s.decimals ? s.value.toFixed(s.decimals) : s.value;
      lines.push(`- ${s.label}: ${formatted}${s.suffix ?? ""}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

export function GET(): Response {
  return new Response(buildLlmsFullTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
