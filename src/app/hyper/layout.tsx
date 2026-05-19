import type { Metadata } from "next";

// /hyper is an internal staging/preview route. Keep it out of indexes
// so it never competes with the canonical home page in search results.
export const metadata: Metadata = {
  title: "Hyper Preview",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  alternates: { canonical: undefined },
};

export default function HyperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
