// src/components/organisms/ContactSection/ContactSection.tsx
"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { ContactConfig } from "@/config/sections";
import { SectionHeader } from "@/components/molecules/SectionHeader/SectionHeader";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/cn";
import SuccessModal from "@/components/organisms/SuccessModal/SuccessModal";

interface Props {
  config: ContactConfig;
}

type Status = "idle" | "sending" | "error";

const FIELD_BASE =
  "peer w-full border-b border-white/15 bg-transparent py-3 " +
  "text-text-on-dark placeholder-transparent " +
  "font-body text-base md:text-lg tracking-[0.01em] " +
  "transition-colors duration-300 focus:border-accent focus:outline-none";

const LABEL_BASE =
  "pointer-events-none absolute left-0 origin-left " +
  "font-body tracking-[0.25em] uppercase " +
  "transition-all duration-300 " +
  // default (empty, unfocused): sit over the placeholder area
  "top-3 text-[0.9rem] text-white/40 " +
  // has a value: float up
  "peer-[&:not(:placeholder-shown)]:-top-3 peer-[&:not(:placeholder-shown)]:text-[0.7rem] peer-[&:not(:placeholder-shown)]:text-white/50 " +
  // focused: float up with accent tint (overrides has-value color)
  "peer-focus:-top-3 peer-focus:text-[0.7rem] peer-focus:text-accent";

export default function ContactSection({ config }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    type STInstance = { kill: () => void };
    let trigger: STInstance | undefined;

    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const leftChildren = el.querySelectorAll<HTMLElement>(
        ".contact-reveal-left",
      );
      const rightChildren = el.querySelectorAll<HTMLElement>(
        ".contact-reveal-right",
      );

      const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!motionOk) {
        gsap.set([...leftChildren, ...rightChildren], { opacity: 1, y: 0, x: 0 });
        return;
      }

      const tl = gsap.timeline({ paused: true });
      tl.from(leftChildren, {
        y: 60,
        opacity: 0,
        stagger: 0.1,
        duration: 0.9,
        ease: "power3.out",
      }).from(
        rightChildren,
        {
          x: 60,
          opacity: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.55",
      );

      trigger = ScrollTrigger.create({
        trigger: el,
        start: "top 80%",
        once: true,
        onEnter: () => tl.play(),
      });
    };

    init();
    return () => {
      trigger?.kill();
    };
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Request failed");

      form.reset();
      setStatus("idle");
      setShowModal(true);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <section
      ref={ref}
      id="contact"
      className="bg-bg-dark relative z-[30] w-full overflow-hidden"
    >
      {/* Subtle top divider that mirrors the scroll-section transitions */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"
      />
      {/* Fine dot-grid texture — full bleed, low opacity */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(rgba(240,237,232,0.08) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Drifting accent glow — GPU-only, matches the footer's motion vocabulary */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-1/3 left-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(200,169,126,0.12),transparent_65%)] blur-3xl"
        style={{ animation: "drift-a 26s ease-in-out infinite" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-1/3 -right-1/4 h-[60vmin] w-[60vmin] rounded-full bg-[radial-gradient(circle_at_center,rgba(120,160,220,0.08),transparent_65%)] blur-3xl"
        style={{ animation: "drift-b 32s ease-in-out infinite" }}
      />

      <div className="relative grid w-full grid-cols-1 gap-14 px-6 py-24 md:grid-cols-[1fr_1.1fr] md:gap-20 md:px-12 md:py-32 lg:px-20 lg:py-40 xl:px-28">
        {/* ── Left column ───────────────────────────────────────────────── */}
        <div className="flex flex-col">
          <div className="contact-reveal-left">
            <SectionHeader label={config.label} heading={config.heading} />
          </div>

          <Typography
            variant="body"
            className="contact-reveal-left mt-6 max-w-md"
          >
            {config.body}
          </Typography>

          <ul className="contact-reveal-left mt-12 flex flex-col gap-6">
            {config.info.map((item) => {
              const isExternal = /^https?:\/\//.test(item.href);
              return (
                <li key={item.label} className="flex flex-col gap-1">
                  <Typography variant="label" className="text-white/45">
                    {item.label}
                  </Typography>
                  <a
                    href={item.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noreferrer noopener" : undefined}
                    className={cn(
                      "font-display text-text-on-dark text-xl md:text-2xl lg:text-3xl",
                      "w-fit tracking-[0.01em] lowercase",
                      "border-b border-transparent transition-[color,border-color] duration-300",
                      "hover:text-accent hover:border-accent",
                    )}
                  >
                    {item.value}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="contact-reveal-left mt-14">
            <Typography variant="label" className="mb-4 block text-white/45">
              Follow
            </Typography>
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {config.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-body hover:text-accent text-sm tracking-[0.2em] text-white/75 uppercase transition-colors duration-200"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Right column / form ───────────────────────────────────────── */}
        <form
          onSubmit={onSubmit}
          noValidate
          className="flex flex-col gap-10 md:pt-4"
          aria-label="Contact form"
        >
          <div className="contact-reveal-right relative">
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              placeholder="Your name"
              autoComplete="name"
              className={FIELD_BASE}
            />
            <label htmlFor="contact-name" className={LABEL_BASE}>
              Name
            </label>
          </div>

          <div className="contact-reveal-right relative">
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              placeholder="you@company.com"
              autoComplete="email"
              className={FIELD_BASE}
            />
            <label htmlFor="contact-email" className={LABEL_BASE}>
              Email
            </label>
          </div>

          <div className="contact-reveal-right relative">
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              placeholder="+61 400 000 000"
              autoComplete="tel"
              className={FIELD_BASE}
            />
            <label htmlFor="contact-phone" className={LABEL_BASE}>
              Phone
            </label>
          </div>

          <div className="contact-reveal-right relative">
            <select
              id="contact-service"
              name="service"
              required
              defaultValue=""
              className={cn(
                FIELD_BASE,
                "appearance-none pr-8 [&>option]:bg-bg-dark",
              )}
            >
              <option value="" disabled>
                &nbsp;
              </option>
              {config.services.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <label htmlFor="contact-service" className={LABEL_BASE}>
              What do you help with?
            </label>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-4 right-0 text-white/50"
            >
              ↓
            </span>
          </div>

          <div className="contact-reveal-right relative">
            <textarea
              id="contact-message"
              name="message"
              rows={4}
              required
              placeholder="Tell us about the project"
              className={cn(FIELD_BASE, "resize-none")}
            />
            <label htmlFor="contact-message" className={LABEL_BASE}>
              Project brief
            </label>
          </div>

          <div className="contact-reveal-right flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <Button type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Connecting…" : "Connect"}
            </Button>

            <p
              role="status"
              aria-live="polite"
              className={cn(
                "font-body text-[0.75rem] tracking-[0.2em] uppercase transition-opacity duration-300",
                status === "error" ? "text-red-400 opacity-100" : "opacity-0",
              )}
            >
              Something went wrong — please try again.
            </p>
          </div>
        </form>
      </div>

      <SuccessModal open={showModal} onClose={() => setShowModal(false)} />
    </section>
  );
}
