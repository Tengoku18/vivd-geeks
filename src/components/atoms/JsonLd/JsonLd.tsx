// Renders one or more JSON-LD payloads as <script type="application/ld+json">
// tags. Server-only by design — emits raw markup with no client cost so
// crawlers can read structured data straight from the prerendered HTML.

import type { JsonLd as JsonLdPayload } from "@/lib/seo";

interface Props {
  data: JsonLdPayload | JsonLdPayload[];
}

export default function JsonLd({ data }: Props) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          // JSON.stringify escapes </ enough for inline JSON-LD — the
          // payload is built from typed constants, never user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
