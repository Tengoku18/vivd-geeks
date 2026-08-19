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
      "From search engines to answer engines. Search has evolved. Customers don't just type into a bar, they're asking ChatGPT, Gemini and Siri for recommendations. Our strategy ensures that when they ask, your brand is the answer they receive.",
    heroImage: "/assets/seo-header.avif",
    heroImageAlt:
      "Search & Intelligence editorial header artwork",
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
          "SEO is not just about rankings; it is about attracting the right audience, increasing visibility, improving engagement and generating qualified leads consistently over time. Whether you are a local business looking to dominate regional searches or an enterprise brand aiming for national or international reach, our SEO strategies are tailored to deliver measurable growth, stronger online authority and sustainable digital success.",
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
          "Search is evolving. Customers no longer just type into Google; they're asking AI assistants and voice search devices for direct recommendations. Someone might ask, “What's the best accounting software for small businesses?” or “Which IT company in Melbourne handles enterprise cloud migration?” In many cases, users never even scroll through traditional search results anymore. That shift is where AEO (Answer Engine Optimization) starts to matter.",
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
          "At Vivid Geeks, we create high-performing ad campaigns focused on generating leads, calls, sales and measurable ROI, not wasted clicks. When customers are actively searching for your product or service, Google Ads puts your business directly in front of them at the perfect moment.",
        body: [
          "SEO builds momentum over time, but sometimes businesses need visibility immediately. That's usually where Google Ads becomes valuable. If someone searches “emergency plumber near me” or “cybersecurity consultant for healthcare company,” they're often ready to take action right away. Appearing in front of those users at the right moment can generate leads surprisingly fast when campaigns are managed properly.",
          "Our Google Ads strategy focuses less on simply increasing clicks and more on attracting the kind of traffic that's actually likely to convert. If no visitors contact your business, the numbers don't mean much; a campaign with thousands of cheap clicks may look impressive only in reports. So before scaling campaigns, we spend time understanding search intent, customer behavior, competitor positioning and conversion patterns to help you improve your response rate.",
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
  {
    slug: "growth-performance",
    category: "Growth & Performance",
    label: "002 / Growth & Performance",
    headline: "Profitable Scaling Through Data-Backed Customer Acquisition",
    tagline:
      "We at Vivid Geeks don't believe in \"brand awareness\" without a bank statement to back it up. We build data-driven performance engines that treat every dollar of your ad spend like an investment, not an expense.",
    heroImage: "/assets/growth-performancs.avif",
    heroImageAlt:
      "Growth & Performance editorial header artwork",
    details: [
      {
        name: "Performance Marketing",
        slug: "performance-marketing",
        headline: "Focusing On Revenue, Not Just Reach",
        intro:
          "Performance marketing has become one of the most important growth channels for modern businesses because it ties marketing activity directly to measurable outcomes. In simple terms, businesses want to know: \"What are we getting back for every dollar we spend?\" That question sounds obvious, yet many companies still struggle to answer it clearly.",
        body: [
          "Every campaign we launch is built around one goal: profitable growth. At Vivid Geeks, our performance marketing strategies ensure every marketing dollar works harder for your business through combined analytics, paid advertising, audience targeting and conversion optimization across the whole globe.",
          "We also focus heavily on tracking and attribution. Optimization becomes far more difficult when businesses run campaigns without accurate conversion tracking in place. Scaling becomes largely guesswork if you cannot clearly identify where leads are coming from or which campaigns are generating revenue.",
          "For businesses looking to grow across the global network, our performance marketing here at Vivid Geeks offers something increasingly valuable: accountability. Every campaign decision can be measured, analyzed, refined, and connected back to business outcomes.",
        ],
        lists: [
          {
            title: "Our Approach",
            items: [
              "Full-funnel campaign strategy",
              "Data-driven optimization",
              "Customer journey analysis",
              "Multi-platform advertising",
              "Conversion rate optimization",
              "ROI-focused scaling",
            ],
          },
          {
            title: "What You Gain",
            items: [
              "Higher conversion rates",
              "Better return on ad spend",
              "Lower customer acquisition costs",
              "Scalable revenue growth",
            ],
          },
        ],
      },
      {
        name: "Meta Ads",
        slug: "meta-ads",
        headline: "Turn Attention Into Customers",
        intro:
          "Not every customer begins their journey on Google. In many cases, people discover products, services and brands while scrolling through Instagram or Facebook long before they actively search for solutions. That's what makes Meta Ads such a powerful part of modern digital marketing.",
        body: [
          "Platforms like Facebook and Instagram remain highly effective because they allow businesses to reach audiences based on interests, behaviours, demographics, engagement patterns and intent signals, often before competitors even enter the conversation.",
          "We at Vivid Geeks create scroll-stopping ad campaigns that capture attention, build interest and drive conversions. We help brands maximize visibility and sales through Meta's advertising ecosystem, from creative development to audience targeting and retargeting.",
          "Meta advertising works particularly well for businesses focused on brand awareness, lead generation, eCommerce sales, event promotion, and service-based customer acquisition. Combined with SEO and Google Ads, it creates a broader visibility strategy that reaches customers across multiple stages of the buying journey.",
        ],
        lists: [
          {
            title: "Our Meta Ads Services",
            items: [
              "Facebook Ads",
              "Instagram Ads",
              "Retargeting campaigns",
              "Creative ad design",
              "Audience segmentation",
              "Campaign optimization",
              "Performance reporting",
            ],
          },
          {
            title: "Outcomes",
            items: [
              "Increased brand awareness",
              "More leads and purchases",
              "Better audience engagement",
              "Stronger social media presence",
            ],
          },
        ],
      },
      {
        name: "Lead Generation",
        slug: "lead-generation",
        headline: "Build A Predictable Pipeline Of Qualified Leads",
        intro:
          "For many businesses, the biggest challenge is not visibility alone; it's consistency. Generating random traffic isn't enough; you need qualified prospects who are genuinely interested in your services. Some months generate strong enquiry volumes. Other months slow down unexpectedly. Relying entirely on referrals, repeat customers or unpredictable traffic sources can make long-term growth difficult to forecast. That's why structured lead generation systems matter.",
        body: [
          "At Vivid Geeks, our lead generation systems combine optimized funnels, landing page optimization, paid advertising, SEO-driven traffic, audience targeting, targeted campaigns and conversion-focused strategies, all designed to attract, capture and nurture potential customers.",
          "Every stage is designed to reduce friction and improve conversion quality through automated follow-up strategies and remarketing campaigns.",
          "The businesses that tend to grow most consistently are usually the ones with predictable acquisition systems in place. Instead of relying purely on luck, referrals, or seasonal demand spikes, they create structured marketing pipelines that continuously generate opportunities.",
        ],
        lists: [
          {
            title: "What We Deliver",
            items: [
              "Lead generation campaigns",
              "Landing page optimization",
              "CRM integration",
              "Funnel strategy",
              "Lead nurturing systems",
              "Automated follow-ups",
            ],
          },
          {
            title: "Business Impact",
            items: [
              "Consistent inquiry flow",
              "Higher-quality leads",
              "Reduced sales friction",
              "Improved conversion rates",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "creative-brand",
    category: "Creative & Brand Identity",
    label: "003 / Creative & Brand",
    headline: "Stop Blending In. Start Leading.",
    tagline:
      "In a world of digital clones, authenticity is your greatest competitive advantage. We don't just design \"assets\"; we build the visual and narrative authority that makes your competition irrelevant across the globe.",
    heroImage: "/assets/creative-brand.avif",
    heroImageAlt:
      "Creative & Brand Identity editorial header artwork",
    details: [
      {
        name: "Logo & Graphic Design",
        slug: "logo-graphic-design",
        headline: "Build A Brand That Looks As Powerful As It Performs",
        intro:
          "A logo is often treated like a finishing touch, but in reality it's usually the first real signal people use to judge a business. Fair or not, people do make quick assumptions based on visual identity. That said, there's also a bit of misunderstanding in the industry here: a logo doesn't need to be overly complex or \"clever\" to work well. In fact, overly complicated designs often age poorly or feel disconnected from the actual business over time. Strong branding creates trust, recognition and credibility.",
        body: [
          "We at Vivid Geeks help design premium visual identities that help businesses stand out in competitive markets and leave lasting impressions.",
          "We've seen cases where businesses initially invested in visually striking designs that looked impressive in isolation but didn't translate well across websites, ads or mobile screens. That's usually where practicality matters more than creativity for its own sake.",
          "So our goal isn't just to \"design something premium.\" It's to build a visual system that actually works across real-world usage (websites, social media, pitch decks, ads, and everything in between) without losing consistency.",
        ],
        lists: [
          {
            title: "Design Services",
            items: [
              "Logo design",
              "Brand identity systems",
              "Marketing collateral",
              "Social media creatives",
              "Business presentations",
              "Advertising graphics",
            ],
          },
          {
            title: "Why It Matters",
            items: [
              "Stronger brand perception",
              "Improved customer trust",
              "Consistent visual identity",
              "Professional market positioning",
            ],
          },
        ],
      },
      {
        name: "Video Editing",
        slug: "video-editing",
        headline: "Storytelling That Captures Attention And Drives Action",
        intro:
          "Video is one of those areas where reality often doesn't match the desired expectations. On one hand, attention spans are shorter than ever. People scroll quickly. Most videos get evaluated within the first few seconds. And even when something does manage to hold attention, it's often because there's a clear story or emotional hook, not necessarily because the production is highly polished.",
        body: [
          "Our team at Vivid Geeks creates engaging, professionally edited video content that helps brands communicate clearly and connect emotionally with audiences. We usually focus on making videos that feel intentional but not overproduced. The aim is to hold attention long enough for the message to land, not to impress viewers with production complexity alone.",
          "And when it works, video becomes more than just content. It starts shaping perception. A well-told story can make a relatively unknown business feel far more established than it actually is.",
        ],
        lists: [
          {
            title: "Video Services",
            items: [
              "Promotional videos",
              "Social media reels",
              "Corporate videos",
              "Ad creatives",
              "Motion graphics",
              "Short-form content editing",
            ],
          },
          {
            title: "Benefits",
            items: [
              "Higher audience engagement",
              "Better retention rates",
              "Increased conversions",
              "Stronger brand storytelling",
            ],
          },
        ],
      },
      {
        name: "Content Creation",
        slug: "content-creation",
        headline: "Content That Builds Authority And Keeps Your Brand Relevant",
        intro:
          "Content creation is where many brands either slowly build authority or quietly burn out their audience. There's a balance that's often harder to strike than it looks. Post too rarely, and people forget you exist. Post too often without substance, and people start ignoring you. Post with too much sales pressure, and engagement drops even further.",
        body: [
          "So the real challenge isn't just \"creating content.\" It's figuring out what kind of content actually earns attention in the first place.",
          "Modern brands need consistent, high-quality and competitive content to stay visible. We at Vivid Geeks transform your brand identity by creating strategic content designed to educate, engage and help convert your audience across multiple platforms.",
        ],
        lists: [
          {
            title: "Our Content Services",
            items: [
              "Social media content",
              "SEO content writing",
              "Blog articles",
              "Website copywriting",
              "Ad copy",
              "Creative campaigns",
            ],
          },
          {
            title: "Results",
            items: [
              "Increased engagement",
              "Improved brand awareness",
              "Better SEO performance",
              "Stronger audience trust",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "digital-infrastructure",
    category: "Digital Infrastructure",
    label: "004 / Digital Infrastructure",
    headline:
      "The Digital Foundation That Turns Traffic Into Revenue And Never Sleeps",
    tagline:
      "Your website is your hardest-working salesperson, or at least it should be. We build high-speed, high-conversion infrastructures that don't just look premium but turn casual visitors into loyal customers through automated sales funnels.",
    heroImage: "/assets/digital-infrastructure.avif",
    heroImageAlt:
      "Digital Infrastructure editorial header artwork",
    details: [
      {
        name: "Web Design & Development",
        slug: "web-design-development",
        headline: "A Website Built To Convert Visitors Into Customers",
        intro:
          "There's a common phrase people still use: \"we just need a website.\" But that framing is a bit outdated now, especially in today's competitive markets. A website isn't just a digital brochure anymore. In most cases, it's the first real interaction a potential customer has with your business, and sometimes it's also the last.",
        body: [
          "If it loads slowly, feels confusing, or doesn't clearly communicate value within a few seconds, users don't usually stick around to \"figure it out.\" They just leave, quietly. No complaint, no feedback, just a lost opportunity.",
          "That's why we approach web design more like building a conversion environment rather than a visual project. Your website is your digital storefront; first impressions matter the most. We design and develop modern, responsive, and conversion-focused websites that combine aesthetics with performance.",
          "When we talk about web design at Vivid Geeks, it's less about \"how it looks\" and more about how it behaves under real conditions. A good site doesn't just represent your business; it actively supports it.",
        ],
        lists: [
          {
            title: "What We Build",
            items: [
              "Business websites",
              "E-commerce websites",
              "Landing pages",
              "Custom web solutions",
              "Mobile-responsive design",
              "SEO-optimized architecture",
            ],
          },
          {
            title: "Why Our Websites Perform",
            items: [
              "Fast loading speeds",
              "User-focused design",
              "Conversion optimization",
              "SEO-friendly structure",
              "Scalable development",
            ],
          },
        ],
      },
      {
        name: "CRM & Sales Funnels",
        slug: "crm-sales-funnels",
        headline: "Automate Your Sales Process And Scale Smarter",
        intro:
          "Most businesses don't struggle with generating interest; they struggle with what happens after. Someone fills out a form, downloads something, or clicks an ad… and then the follow-up process becomes inconsistent. Sometimes they get a reply quickly, sometimes hours later, sometimes not at all. And in many cases, there's no clear system tracking where that lead goes next.",
        body: [
          "That's usually where a CRM (Customer Relationship Management system) and structured sales funnel come in. A good CRM and funnel system should quietly support the sales process rather than dominate it. It should help teams respond faster, stay organised, and prioritise better opportunities, not replace thoughtful communication.",
          "Here at Vivid Geeks, we help businesses capture leads, track customer interactions through streamlined CRM systems and automated sales funnels built by our team, and close more deals efficiently.",
        ],
        lists: [
          {
            title: "Services Include",
            items: [
              "CRM setup and integration",
              "Automated workflows",
              "Lead tracking systems",
              "Funnel design and optimization",
              "Email automation",
              "Customer journey mapping",
            ],
          },
          {
            title: "Benefits",
            items: [
              "Improved sales efficiency",
              "Better customer management",
              "Increased conversions",
              "Automated lead nurturing",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "engagement-retention",
    category: "Engagement & Retention",
    label: "005 / Engagement & Retention",
    headline: "Don't Just Find Customers. Keep Them. The Loyalty Loop.",
    tagline:
      "The most expensive part of any business is acquiring a new customer. The most profitable part is keeping one. We move your brand beyond the \"one-off transaction\" and into the Loyalty Loop, combining direct-to-inbox storytelling with active community management so your brand stays top-of-mind and casual buyers become vocal advocates who drive repeat sales and massive lifetime value.",
    heroImage: "/assets/engagement.avif",
    heroImageAlt:
      "Engagement & Retention editorial header artwork",
    details: [
      {
        name: "Email Marketing",
        slug: "email-marketing",
        headline: "Turn Existing Customers Into Repeat Buyers",
        intro:
          "Email is one of those channels that never really \"dies,\" even though people keep predicting it will. In reality, it remains one of the most direct and controllable ways to communicate with your audience. To this day, email is one of the highest-ROI marketing channels available.",
        body: [
          "Unlike social media, where algorithms decide who sees your content, email gives you a more stable line of communication, assuming people have actually opted in and want to hear from you. That's an important detail. Email only works when there's trust. Otherwise it just becomes noise in an already crowded inbox.",
          "Email marketing, when done well, tends to quietly increase customer lifetime value without requiring constant ad spend. That alone makes it one of the more efficient channels in a long-term growth strategy.",
          "We at Vivid Geeks help create strategic email campaigns that nurture relationships, increase repeat purchases, and strengthen customer loyalty.",
        ],
        lists: [
          {
            title: "Email Marketing Services",
            items: [
              "Campaign strategy",
              "Email automation",
              "Newsletter design",
              "Customer segmentation",
              "Promotional campaigns",
              "Performance analytics",
            ],
          },
          {
            title: "Outcomes",
            items: [
              "Increased customer retention",
              "Higher lifetime value",
              "More repeat sales",
              "Stronger customer relationships",
            ],
          },
        ],
      },
      {
        name: "Social Media Management",
        slug: "social-media-management",
        headline: "Stay Active, Relevant, And Connected With Your Audience",
        intro:
          "Social media is a slightly different challenge. It's fast, crowded, and constantly shifting. One day a format works well, the next it feels like it barely reaches anyone. Algorithms change, audience behaviour shifts, and attention spans… well, they're not exactly getting longer.",
        body: [
          "So the goal of social media management isn't just to \"post content.\" That usually leads to inconsistency or burnout over time. The real objective is to maintain presence in a way that feels natural, consistent, and recognisable.",
          "Managing social media consistently takes time and strategy, but businesses don't have to worry any more. Here at Vivid Geeks, we handle your content, engagement and platform growth so you can focus on running your business.",
          "Social media management can become overwhelming for businesses trying to handle everything internally. Platforms move quickly, content demands are constant, and it's easy for posting to become inconsistent when other priorities take over. That's where we come in. Our structured management helps not just with posting content, but with maintaining tone, consistency, and timing so the brand presence doesn't drift over time.",
        ],
        lists: [
          {
            title: "What We Manage",
            items: [
              "Content planning",
              "Post scheduling",
              "Community management",
              "Audience engagement",
              "Platform optimization",
              "Analytics and reporting",
            ],
          },
          {
            title: "Why It Works",
            items: [
              "Stronger online presence",
              "Consistent brand communication",
              "Better audience engagement",
              "Increased customer loyalty",
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
