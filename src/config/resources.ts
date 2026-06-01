// src/config/resources.ts
//
// Editorial content for /resources — the Vivid Geeks blog. Each post is
// rendered as a card on the index and as a long-form article at
// /resources/[slug]. Keep the order newest → oldest; the index renders
// them 1:1 in this order.
//
// Visual identity follows the same brand idiom as the rest of the site:
// every post carries a gradient `cover` (used behind the card + the
// article hero) and an `accent` colour for kickers and hover ink. No
// image assets required — the gradients keep the theme cohesive.

export interface BlogSection {
  // Optional sub-heading for the section. The opening section usually
  // omits it so the article eases in from the intro.
  heading?: string;
  paragraphs: string[];
  // Optional titled bullet list rendered after the paragraphs.
  list?: { title: string; items: string[] };
}

export interface BlogPost {
  slug: string;
  title: string;
  // One-line hook shown on the card and beneath the article H1.
  excerpt: string;
  // Topic label — mirrors a service category where it makes sense.
  category: string;
  // ISO date (YYYY-MM-DD). Drives the displayed date + article schema.
  date: string;
  readTime: string; // e.g. "7 min read"
  author: string;
  // Theme-consistent gradient + accent. `cover` is any valid CSS
  // `background` shorthand (fallback when no `image`); `accent` is a hex
  // used for kickers/hover.
  cover: string;
  accent: string;
  // Cover artwork. May be a /public path (e.g. "/assets/seo-header.avif")
  // or any absolute HTTPS URL — next.config.ts permits both. Rendered on
  // the index card and behind the article hero; the gradient `cover`
  // shows through as a fallback while it loads.
  image?: string;
  imageAlt?: string;
  // Long-form body — an ordered list of sections.
  body: BlogSection[];
  // Skimmable "what to take away" list shown alongside the article.
  takeaways: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "answer-engine-optimization",
    title: "Becoming The Answer: SEO Is Now AEO",
    excerpt:
      "Your customers have stopped scrolling and started asking. Here's how to make sure the machine recommends you by name.",
    category: "Search & Intelligence",
    date: "2026-05-18",
    readTime: "8 min read",
    author: "Vivid Geeks",
    cover:
      "radial-gradient(120% 120% at 15% 10%, #c8a97e 0%, #6e4f3a 38%, #0b1d35 82%)",
    accent: "#c8a97e",
    image: "/assets/seo-header.avif",
    imageAlt: "Search & Intelligence — editorial cover artwork",
    body: [
      {
        paragraphs: [
          "For two decades the goal was simple: rank on the first page of Google. Earn the blue link, win the click. That game still matters — but it is no longer the whole board. A growing share of buyers never see a page of results at all. They ask ChatGPT which CRM to buy, they ask Gemini for the best accountant in Sydney, they ask Siri to book the highest-rated plumber nearby. The answer arrives pre-chewed, and most of the ten links that used to fight for attention are simply never shown.",
          "Answer Engine Optimization — AEO — is the discipline of being the source those systems trust enough to quote. It is not a replacement for SEO. It is what SEO becomes when the interface stops being a list and starts being a sentence.",
        ],
      },
      {
        heading: "Why the loudest brand no longer wins",
        paragraphs: [
          "Traditional search rewarded authority and volume — more backlinks, more pages, more domain weight. Answer engines reward something subtly different: clarity. When a model assembles a recommendation, it favours content it can parse cleanly, attribute confidently, and defend. A small business with sharply structured, genuinely useful pages often gets referenced more often than a larger competitor hiding behind vague marketing copy.",
          "We have watched a local clinic with well-organised treatment explanations and honest FAQs get surfaced ahead of a national chain. The chain had more traffic. The clinic had more answers.",
        ],
      },
      {
        heading: "What AEO actually changes",
        paragraphs: [
          "The foundations of good SEO still hold — fast pages, clean architecture, real topical authority. AEO layers a second question on top of every page: could a machine lift this and be confident it is right? That pushes you toward explicit structure, conversational phrasing, and content that answers the question a human would actually voice out loud.",
        ],
        list: {
          title: "The AEO checklist",
          items: [
            "Structured data and schema so machines know what each block is",
            "Conversational headings that mirror how people ask, not how marketers write",
            "Entity clarity — make it unambiguous who you are and what you do",
            "FAQ and Q&A formatting that answer engines can quote verbatim",
            "Topical depth around a few subjects rather than thin coverage of many",
          ],
        },
      },
      {
        heading: "The honest caveat",
        paragraphs: [
          "Nobody can fully predict how answer engines will evolve — Google's own results keep shifting under everyone's feet. But the businesses adapting early are building an advantage that compounds, the same way the early SEO adopters did fifteen years ago. The downside of preparing for a future that arrives slightly differently is small. The downside of being invisible the day your category goes conversational is not.",
          "If your strategy still ends at \"rank for keywords,\" it is already a half-step behind the way your customers search today.",
        ],
      },
    ],
    takeaways: [
      "Answer engines summarise — fewer links get shown, so being cited matters more than ranking tenth.",
      "Clarity beats volume: clean structure and honest answers outperform vague authority.",
      "AEO extends SEO, it does not replace it — the technical foundations still apply.",
      "Start now; the compounding advantage goes to early adopters.",
    ],
  },
  {
    slug: "roas-attribution-truth",
    title: "Your ROAS Is Lying To You",
    excerpt:
      "In a cookieless, privacy-first world, the dashboard that looks healthiest is often the one hiding the most. Here's how to build attribution you can actually trust.",
    category: "Growth & Performance",
    date: "2026-04-29",
    readTime: "7 min read",
    author: "Vivid Geeks",
    cover:
      "linear-gradient(155deg, #0b1d35 0%, #1f3b5c 48%, #b8252a 110%)",
    accent: "#e0a96d",
    image: "/assets/growth-performancs.avif",
    imageAlt: "Growth & Performance — editorial cover artwork",
    body: [
      {
        paragraphs: [
          "Most agencies sell impressions. We sell outcomes — and the gap between those two things lives entirely inside your attribution. The uncomfortable truth is that the return-on-ad-spend number glowing on your dashboard is frequently fiction. Not because anyone is dishonest, but because the plumbing that produced it broke quietly while everyone was watching the headline figure.",
          "iOS privacy changes, third-party cookie deprecation, and consent-mode gaps have all chipped away at the clean click-to-conversion line we used to take for granted. What is left is a number that feels precise and is often wrong.",
        ],
      },
      {
        heading: "How a healthy-looking dashboard hides the rot",
        paragraphs: [
          "Platforms are incentivised to claim credit. When tracking degrades, ad networks fall back on modelled conversions — educated guesses dressed up as data. Two platforms will each confidently claim the same sale. Your blended numbers stop adding up, and the channel that reports the highest ROAS is often just the one best at over-claiming.",
          "The tell is simple: when your platform-reported revenue meaningfully exceeds the revenue in your actual bank account, your attribution is leaking and your budget decisions are being made on vapour.",
        ],
      },
      {
        heading: "Building attribution that survives",
        paragraphs: [
          "The fix is not a single tool — it is a posture. You stop trusting any one platform's self-graded report card and start triangulating from sources that have no reason to flatter you.",
        ],
        list: {
          title: "The trust stack",
          items: [
            "Server-side tracking to recapture events the browser now drops",
            "Blended ROAS measured against real revenue, not platform claims",
            "Incrementality testing — geo holdouts and spend pulses that prove causation",
            "First-party data as the source of truth your competitors can't borrow",
            "A single reconciled dashboard, not five conflicting ones",
          ],
        },
      },
      {
        heading: "Why this is the whole game",
        paragraphs: [
          "Optimisation is impossible without honest measurement. If you cannot tell which campaigns actually generated revenue, scaling is just guessing with a bigger budget. The brands that win the next few years will not be the ones with the cleverest creative — they will be the ones who know, to the dollar, what their marketing is worth. Everything profitable downstream depends on getting this one layer right.",
        ],
      },
    ],
    takeaways: [
      "Platform-reported ROAS over-claims — multiple channels take credit for the same sale.",
      "If platform revenue exceeds bank revenue, your attribution is leaking.",
      "Triangulate: server-side tracking, blended ROAS, incrementality tests, first-party data.",
      "Honest measurement is the prerequisite for profitable scaling — not an afterthought.",
    ],
  },
  {
    slug: "conversion-first-website",
    title: "Your Website Is A Salesperson, Not A Brochure",
    excerpt:
      "A site that wins design awards and loses customers is a liability. Designing for revenue means designing for behaviour first, beauty second.",
    category: "Digital Infrastructure",
    date: "2026-04-08",
    readTime: "6 min read",
    author: "Vivid Geeks",
    cover:
      "radial-gradient(120% 120% at 80% 0%, #f0ede8 0%, #8a8f99 30%, #0b1d35 85%)",
    accent: "#cdbfae",
    image: "/assets/digital-infrastructure.avif",
    imageAlt: "Digital Infrastructure — editorial cover artwork",
    body: [
      {
        paragraphs: [
          "There is a phrase we hear constantly: \"we just need a website.\" It is an honest request and a slightly outdated one. A website is no longer a digital brochure that sits politely in the corner of your marketing. In most cases it is the first real conversation a customer has with your business — and if it stumbles, it is also the last.",
          "When a page loads slowly, buries its value, or makes the visitor think too hard, people do not file a complaint. They leave. Quietly. No feedback, no second chance — just a lost opportunity that never shows up in any report.",
        ],
      },
      {
        heading: "Beautiful and useless is still useless",
        paragraphs: [
          "We have inherited sites that looked stunning in a portfolio and converted almost nobody. Striking hero animations that delayed the one button that mattered. Clever navigation that confused the very buyers it was meant to guide. Aesthetics are not the enemy — but beauty that fights behaviour is just expensive decoration.",
          "So we approach a build less like a visual project and more like engineering a conversion environment. The question is never only \"how does it look,\" it is \"how does it behave under real pressure, on a real phone, for someone who is mildly impatient and not paying full attention.\"",
        ],
      },
      {
        heading: "What a revenue-first site gets right",
        paragraphs: [
          "Most of the wins are unglamorous. Speed. Clarity. A single obvious next step on every screen. The interesting part is how often a small, dull change outperforms a dramatic redesign — tightening a headline, removing a form field, making the call-to-action impossible to miss.",
        ],
        list: {
          title: "The non-negotiables",
          items: [
            "Sub-second perceived load — speed is a conversion feature, not a nicety",
            "One clear primary action per screen, never three competing ones",
            "Value communicated above the fold in a single readable breath",
            "Mobile-first reality, because that is where most of the traffic actually is",
            "Friction audited relentlessly — every extra field costs you customers",
          ],
        },
      },
      {
        heading: "The mindset shift",
        paragraphs: [
          "Your website should be your hardest-working salesperson — awake at 3am, never off-message, closing while you sleep. Judge it the way you would judge a salesperson: not by how it looks in a frame, but by how many of the right conversations it turns into customers. Design for that, and the beauty tends to follow anyway.",
        ],
      },
    ],
    takeaways: [
      "A website is your first (and sometimes last) sales conversation — treat it like one.",
      "Beauty that fights behaviour is decoration; design for how people actually act.",
      "Small, unglamorous changes — speed, clarity, fewer fields — usually beat big redesigns.",
      "Measure the site by customers won, not awards won.",
    ],
  },
];

// Lookup helper for the detail route.
export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

// Shared date formatter so the index and the article render dates
// identically (and in en-AU, matching the rest of the site).
export function formatPostDate(iso: string): string {
  // Parse as UTC noon to dodge timezone-rollover off-by-one-day bugs.
  const d = new Date(`${iso}T12:00:00Z`);
  return d.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
