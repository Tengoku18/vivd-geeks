// src/config/services.ts
//
// Long-form content for each service category page rendered at
// /services/[slug]. The slug matches the id of the corresponding
// section in SECTIONS_CONFIG (e.g. "search-intelligence") so the
// homepage "Learn More" CTA can derive its href directly from the
// section it sits inside.
//
// Each category page renders one hero block (category headline +
// tagline) followed by a stack of "detail" blocks (SEO, AEO, Google
// Ads, …) each with its own sub-headline, intro, body paragraphs and
// titled bullet lists.

export interface ServiceListBlock {
  title: string;
  items: string[];
}

export interface ServiceDetailContent {
  name: string;
  // In-page anchor slug — lets us deep-link to a specific detail
  // (e.g. /services/search-intelligence#aeo) from anywhere on the site.
  slug: string;
  headline: string;
  intro: string;
  body: string[];
  lists: ServiceListBlock[];
}

export interface ServiceCategoryContent {
  // Must equal the section id in SECTIONS_CONFIG so anchors round-trip.
  slug: string;
  category: string;
  // Kicker shown above the page H1 — matches the numbering on /.
  label: string;
  headline: string;
  tagline: string;
  // Optional path (under /public) to a hero background image. When set,
  // the service detail page renders it behind the headline with a
  // gradient scrim so text stays legible. Omit for a plain dark hero.
  heroImage?: string;
  heroImageAlt?: string;
  details: ServiceDetailContent[];
}

export const SERVICE_CATEGORIES: ServiceCategoryContent[] = [
  {
    slug: "search-intelligence",
    category: "Search & Intelligence",
    label: "001 / Search & Intelligence",
    headline: "Own The Moment Your Customer Is Looking For A Solution",
    tagline:
      "From search engines to answer engines. Search has evolved — customers don't just type into a bar, they're asking ChatGPT, Gemini and Siri for recommendations. Our strategy ensures that when they ask, your brand is the answer they receive.",
    heroImage: "/assets/seo-header.avif",
    heroImageAlt:
      "Search & Intelligence — editorial header artwork",
    details: [
      {
        name: "Strategic SEO",
        slug: "seo",
        headline: "Become The Top Result On Google",
        intro:
          "At Vivid Geeks, we help position your brand at the top of search engine results through SEO strategies designed to improve your rankings and increase organic traffic. We help your website attract high-intent customers consistently by combining technical SEO, content optimization, keyword strategy, on-page enhancements and authority building.",
        body: [
          "We do in-depth keyword and competitor research, technical audits, on-page optimization, structured data implementation, content optimization, internal linking strategies, mobile performance improvements, Core Web Vitals optimization and local SEO enhancements to strengthen your digital presence and ranking.",
          "We help create search-focused website structures that improve crawlability and indexing while ensuring your content aligns with search intent and modern ranking algorithms. By building topical authority and publishing high quality, helpful content, we have helped brands across the globe establish themselves as trusted industry leaders that search engines prioritize.",
          "SEO is not just about rankings — it is about attracting the right audience, increasing visibility, improving engagement and generating qualified leads consistently over time. Whether you are a local business looking to dominate regional searches or an enterprise brand aiming for national or international reach, our SEO strategies are tailored to deliver measurable growth, stronger online authority and sustainable digital success.",
        ],
        lists: [
          {
            title: "What's Included",
            items: [
              "Technical SEO optimization",
              "Keyword and competitor research",
              "On-page SEO improvements",
              "Content strategy and optimization",
              "Local SEO and Google Business Profile optimization",
              "Link building and authority growth",
              "Core Web Vitals optimization",
              "AI and voice-search optimization",
            ],
          },
          {
            title: "Results You Can Expect",
            items: [
              "Higher Google rankings",
              "Increased organic traffic",
              "Better lead quality",
              "Long-term online visibility",
              "Sustainable business growth",
            ],
          },
        ],
      },
      {
        name: "Answer Engine Optimization",
        slug: "aeo",
        headline: "Become The Recommended Answer In AI & Voice Search",
        intro:
          "Search is evolving. Customers no longer just type into Google; they're asking AI assistants and voice search devices for direct recommendations. Someone might ask, “What's the best accounting software for small businesses?” or “Which IT company in Melbourne handles enterprise cloud migration?” In many cases, users never even scroll through traditional search results anymore. That shift is where AEO — Answer Engine Optimization — starts to matter.",
        body: [
          "At Vivid Geeks, our team designs AEO strategies to help position your brand as the trusted answer across AI-powered search platforms, voice assistants and next-generation search experiences. We help optimize your content structure, schema markup, FAQs and topical authority so your business becomes the preferred answer when people ask questions related to your industry.",
          "The idea behind AEO is fairly straightforward: structure your website and content in a way that makes AI systems more likely to understand, trust and reference your business when generating answers. That may involve improving semantic relevance, organizing information clearly, implementing schema markup, building authority around specific topics and creating content that directly answers real customer questions in natural language.",
          "What's interesting is that AI systems don't always reward the loudest brands. Smaller businesses with highly focused, well-structured content sometimes appear more useful than larger competitors with vague marketing copy. A local dental clinic with clear treatment explanations and well-organized FAQs may end up being referenced more often than a bigger brand relying on generic content.",
          "We also avoid the mistake many agencies make by treating AEO as a completely separate strategy from SEO. In practice, the two overlap heavily. Strong technical SEO, clear site structure, topical authority and genuinely helpful content still form the foundation. The difference is that AEO leans more toward conversational relevance and machine readability rather than just rankings alone.",
          "No one can fully predict how AI-driven search will evolve over the next few years. Even Google's own search experience keeps shifting. But businesses that start adapting early are likely to have a stronger advantage as answer engines become more integrated into how people discover products and services online.",
        ],
        lists: [
          {
            title: "What's Included",
            items: [
              "AI search optimization",
              "Structured data and schema implementation",
              "Conversational content strategy",
              "Voice search optimization",
              "Featured snippet targeting",
              "FAQ and semantic SEO enhancement",
              "Entity-based optimization",
            ],
          },
          {
            title: "Benefits",
            items: [
              "Increased brand authority",
              "Better visibility in AI-driven search",
              "More qualified traffic",
              "Future-proof search presence",
            ],
          },
        ],
      },
      {
        name: "Google Ads",
        slug: "google-ads",
        headline: "Reach Ready-To-Buy Customers Instantly",
        intro:
          "At Vivid Geeks, we create high-performing ad campaigns focused on generating leads, calls, sales and measurable ROI — not wasted clicks. When customers are actively searching for your product or service, Google Ads puts your business directly in front of them at the perfect moment.",
        body: [
          "SEO builds momentum over time, but sometimes businesses need visibility immediately. That's usually where Google Ads becomes valuable. If someone searches “emergency plumber near me” or “cybersecurity consultant for healthcare company,” they're often ready to take action right away. Appearing in front of those users at the right moment can generate leads surprisingly fast when campaigns are managed properly.",
          "Our Google Ads strategy focuses less on simply increasing clicks and more on attracting the kind of traffic that's actually likely to convert. If no visitors contact your business, the numbers don't mean much — a campaign with thousands of cheap clicks may look impressive only in reports. So before scaling campaigns, we spend time understanding search intent, customer behavior, competitor positioning and conversion patterns to help you improve your response rate.",
          "That process usually includes keyword research, audience targeting, landing page recommendations, ad copy testing, conversion tracking and ongoing bid optimization. Sometimes small adjustments like changing headline wording or simplifying a contact form can improve performance. We've seen campaigns reduce cost-per-lead significantly just by improving the landing page experience rather than increasing ad spend.",
          "There's also a balance to maintain. Paid advertising can drive fast growth but relying entirely on ads may become expensive over time, especially in competitive industries where click costs keep rising. That's why we often see the strongest results when Google Ads works alongside SEO rather than replacing it. One generates immediate visibility; the other builds long-term authority and sustainable traffic.",
          "Google Ads can be incredibly effective, though it's not a “set and forget” channel. Campaigns need continuous monitoring, testing and refinement because customer behavior changes constantly. What worked six months ago may already be underperforming today. The businesses that usually get the best results are the ones willing to adapt, test new approaches, and pay attention to the actual data instead of vanity metrics.",
        ],
        lists: [
          {
            title: "Our Google Ads Services",
            items: [
              "Search Ads",
              "Display Advertising",
              "YouTube Ads",
              "Shopping Ads",
              "Remarketing Campaigns",
              "Conversion Tracking Setup",
              "Landing Page Optimization",
            ],
          },
          {
            title: "Why Businesses Choose Our Google Ads Strategy",
            items: [
              "Faster customer acquisition",
              "Highly targeted traffic",
              "Transparent performance tracking",
              "Optimized cost-per-conversion",
              "Scalable growth campaigns",
            ],
          },
        ],
      },
    ],
  },
];

// Lookup helper used by ScrollSection to decide whether a section
// should render a "Learn More" button.
export function getServiceCategoryBySlug(
  slug: string,
): ServiceCategoryContent | undefined {
  return SERVICE_CATEGORIES.find((c) => c.slug === slug);
}
