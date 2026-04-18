// src/app/(legal)/terms/page.tsx
import type { Metadata } from "next";
import LegalPageShell, {
  LegalSection,
} from "@/components/organisms/LegalPageShell/LegalPageShell";

export const metadata: Metadata = {
  title: "Terms · Vivid Geeks",
  description:
    "The terms that govern your use of the Vivid Geeks website and our working relationship.",
};

export default function TermsPage() {
  return (
    <LegalPageShell
      label="Legal · 02"
      heading="Terms of Service"
      effectiveDate="18 April 2026"
      intro="These terms govern your use of the Vivid Geeks website and the services we provide. By using the site or engaging us, you agree to them. Specific engagements are additionally governed by the statement of work we sign with you."
    >
      <LegalSection title="1. Who we are">
        <p>
          Vivid Geeks (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;)
          is an independent digital agency based in Sydney, Australia. You
          can reach us at{" "}
          <a
            href="mailto:hello@vividgeeks.com"
            className="text-text-primary hover:text-accent border-b border-black/20 transition-colors"
          >
            hello@vividgeeks.com
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. The website">
        <p>
          This website is provided for informational purposes. Content
          published here is our own view of the work we do and may change at
          any time without notice. You agree not to reproduce substantial
          portions of it, scrape it, or use it to train or fine-tune machine-
          learning systems without our written permission.
        </p>
      </LegalSection>

      <LegalSection title="3. Our services">
        <p>
          We offer search &amp; intelligence, growth &amp; performance,
          creative &amp; brand, digital infrastructure, and engagement &amp;
          retention work. The exact scope, deliverables, timeline, and fees
          for any engagement are defined in a separate statement of work
          (&ldquo;SOW&rdquo;) that both parties sign.
        </p>
      </LegalSection>

      <LegalSection title="4. Engagement & payment">
        <p>
          Most work is structured as a fixed-scope sprint followed by a
          monthly retainer. Unless the SOW says otherwise:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            An onboarding fee is due before we begin. Monthly fees are
            invoiced in advance.
          </li>
          <li>Invoices are payable within 14 days of the invoice date.</li>
          <li>
            Overdue amounts may accrue interest at the Reserve Bank of
            Australia cash rate plus 4% per annum.
          </li>
          <li>
            Third-party costs — ad spend, tooling, licenses — are billed at
            cost with no mark-up.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Intellectual property">
        <p>
          When you pay for work in full, you own it. Every deliverable — ad
          accounts, creative assets, source code, documentation, and the
          infrastructure we set up on your behalf — is assigned to you.
        </p>
        <p>
          We keep ownership of the underlying methodologies, playbooks, and
          reusable components we developed before (or outside of) your
          engagement, and a non-exclusive right to reference the work for
          case studies unless you ask us not to.
        </p>
      </LegalSection>

      <LegalSection title="6. Confidentiality">
        <p>
          Anything you share with us that is not already public — strategy,
          financials, customer data, product roadmaps — we keep confidential
          and use only for the purposes of the engagement. This obligation
          survives termination.
        </p>
      </LegalSection>

      <LegalSection title="7. Warranties & disclaimers">
        <p>
          We perform our work with the standard of care expected of a
          competent digital agency. We do not, however, guarantee specific
          business outcomes — growth, conversion rates, rankings, or revenue
          all depend on factors beyond any agency&apos;s control.
        </p>
        <p>
          The website is provided &ldquo;as is&rdquo;. To the maximum extent
          permitted by law, we disclaim all implied warranties of
          merchantability and fitness for a particular purpose.
        </p>
      </LegalSection>

      <LegalSection title="8. Limitation of liability">
        <p>
          To the fullest extent permitted by law, our total liability to you
          for any claim arising out of the engagement is limited to the fees
          you have paid us in the three months preceding the claim. We are
          not liable for indirect, incidental, consequential, or punitive
          damages, including lost profits or business interruption.
        </p>
        <p>
          Nothing in these terms limits rights that cannot be excluded under
          the Australian Consumer Law.
        </p>
      </LegalSection>

      <LegalSection title="9. Termination">
        <p>
          Either party may terminate an engagement with 30 days&apos; written
          notice, unless the SOW specifies a different period. Fees for work
          completed up to the termination date remain payable. On
          termination, we return your materials and hand over any accounts
          or assets we are holding on your behalf.
        </p>
      </LegalSection>

      <LegalSection title="10. Governing law">
        <p>
          These terms and any engagement are governed by the laws of New
          South Wales, Australia. Both parties submit to the exclusive
          jurisdiction of the courts of New South Wales for any dispute not
          resolved through good-faith discussion.
        </p>
      </LegalSection>

      <LegalSection title="11. Changes to these terms">
        <p>
          We may update these terms from time to time. The version in force
          is the one published at this URL on the effective date above. Any
          material changes that affect an active engagement will be agreed
          with you directly before they take effect.
        </p>
      </LegalSection>

      <LegalSection title="12. Contact">
        <p>
          Questions about these terms? Email{" "}
          <a
            href="mailto:hello@vividgeeks.com"
            className="text-text-primary hover:text-accent border-b border-black/20 transition-colors"
          >
            hello@vividgeeks.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
