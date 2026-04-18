// src/app/(legal)/privacy/page.tsx
import type { Metadata } from "next";
import LegalPageShell, {
  LegalSection,
} from "@/components/organisms/LegalPageShell/LegalPageShell";

export const metadata: Metadata = {
  title: "Privacy · Vivid Geeks",
  description:
    "How Vivid Geeks collects, uses, and protects the information you share with us.",
};

export default function PrivacyPage() {
  return (
    <LegalPageShell
      label="Legal · 01"
      heading="Privacy Policy"
      effectiveDate="18 April 2026"
      intro="Vivid Geeks is an independent digital agency based in Sydney, Australia. This policy explains what information we collect when you contact us or book a call, how we use it, and the choices you have."
    >
      <LegalSection title="1. Who we are">
        <p>
          Vivid Geeks (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;)
          operates this website and the services described on it. If you have
          any privacy questions, the fastest way to reach us is
          {" "}
          <a
            href="mailto:hello@vividgeeks.com"
            className="text-text-primary hover:text-accent border-b border-black/20 transition-colors"
          >
            hello@vividgeeks.com
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. Information we collect">
        <p>
          We only collect information you give us directly. That includes:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-text-primary font-normal">
              Contact form submissions
            </strong>{" "}
            — your name, email, the service you&apos;re interested in, and the
            details of your brief.
          </li>
          <li>
            <strong className="text-text-primary font-normal">
              Intro-call bookings
            </strong>{" "}
            — when you schedule a call we use Calendly, which collects your
            name, email, time zone, and any notes you add. See Calendly&apos;s
            own privacy policy for their handling.
          </li>
          <li>
            <strong className="text-text-primary font-normal">
              Direct correspondence
            </strong>{" "}
            — anything you share in email or during a call.
          </li>
        </ul>
        <p>
          We do not run third-party analytics, advertising pixels, or tracking
          cookies on this site. No behavioural profile is built from your
          visit.
        </p>
      </LegalSection>

      <LegalSection title="3. How we use it">
        <p>We use the information you share with us to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Reply to your enquiry and scope potential work.</li>
          <li>
            Schedule, prepare for, and follow up on calls and meetings you
            have asked for.
          </li>
          <li>
            Send occasional updates about the engagement if we end up working
            together.
          </li>
        </ul>
        <p>
          We do not sell, rent, or trade your information. We will never share
          it with third parties for marketing purposes.
        </p>
      </LegalSection>

      <LegalSection title="4. Third-party services">
        <p>
          A small number of service providers help us run the business. Each
          of them only receives the information they need to do their job:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-text-primary font-normal">Calendly</strong>
            {" "}— to schedule intro calls.
          </li>
          <li>
            <strong className="text-text-primary font-normal">
              Email provider
            </strong>{" "}
            — to send and receive correspondence.
          </li>
          <li>
            <strong className="text-text-primary font-normal">
              Hosting / CDN
            </strong>{" "}
            — to deliver this website. Standard server logs (IP, user agent,
            request path) are kept briefly for security and diagnostics.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Cookies">
        <p>
          This site does not set marketing or analytics cookies. Essential
          technical cookies may be used by our host to keep the site working;
          these contain no personal data.
        </p>
      </LegalSection>

      <LegalSection title="6. Data retention">
        <p>
          We keep enquiry information for as long as is useful to continue the
          conversation, and then for the period required by our tax and
          business-record obligations under Australian law. Records that are
          no longer needed are deleted or anonymised.
        </p>
      </LegalSection>

      <LegalSection title="7. Your rights">
        <p>
          Under the Australian Privacy Act and the Australian Privacy
          Principles, you have the right to:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Request a copy of the information we hold about you.</li>
          <li>Ask us to correct information that is inaccurate.</li>
          <li>Ask us to delete your information, subject to legal limits.</li>
          <li>
            Withdraw consent for any communications you previously opted in
            to.
          </li>
        </ul>
        <p>
          Email{" "}
          <a
            href="mailto:hello@vividgeeks.com"
            className="text-text-primary hover:text-accent border-b border-black/20 transition-colors"
          >
            hello@vividgeeks.com
          </a>{" "}
          with the subject line &ldquo;Privacy request&rdquo; and we&apos;ll
          reply within a reasonable timeframe.
        </p>
      </LegalSection>

      <LegalSection title="8. Security">
        <p>
          We use current industry practice to protect the information you
          share — TLS on all traffic, access-controlled storage, and least-
          privilege handling. No system is perfect; if we ever become aware
          of a breach that affects you, we will notify you promptly and in
          line with our obligations under Australian law.
        </p>
      </LegalSection>

      <LegalSection title="9. Changes to this policy">
        <p>
          If we change this policy we will update the effective date above. For
          material changes that affect how we handle information you&apos;ve
          already shared, we will let you know directly.
        </p>
      </LegalSection>

      <LegalSection title="10. Contact">
        <p>
          Questions, complaints, or requests go to{" "}
          <a
            href="mailto:hello@vividgeeks.com"
            className="text-text-primary hover:text-accent border-b border-black/20 transition-colors"
          >
            hello@vividgeeks.com
          </a>
          . If you are not satisfied with our response, you may lodge a
          complaint with the Office of the Australian Information Commissioner
          at{" "}
          <a
            href="https://www.oaic.gov.au"
            target="_blank"
            rel="noreferrer noopener"
            className="text-text-primary hover:text-accent border-b border-black/20 transition-colors"
          >
            oaic.gov.au
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
