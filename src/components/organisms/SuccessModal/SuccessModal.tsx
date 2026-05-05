"use client";
import { useEffect } from "react";
import { cn } from "@/lib/cn";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SuccessModal({ open, onClose }: Props) {
  // Lock body scroll while open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Message sent"
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center px-6",
        "transition-opacity duration-300 ease-out",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      )}
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "relative z-10 w-full max-w-md",
          "bg-bg-dark border border-white/10",
          "px-10 py-12 flex flex-col items-center text-center gap-6",
          "transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4",
        )}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 text-white/30 hover:text-text-on-dark transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Checkmark */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M6 14.5l5.5 5.5L22 8"
              stroke="#c8a97e"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Heading */}
        <p className="font-display text-text-on-dark text-2xl tracking-[0.05em] uppercase">
          Message Sent
        </p>

        {/* Body */}
        <p className="font-body text-white/60 text-sm leading-relaxed tracking-[0.03em]">
          Thanks for reaching out. We&apos;ll review your brief and get back to you within 24 hours.
        </p>

        {/* Divider */}
        <div className="w-full h-px bg-white/10" />

        {/* Close CTA */}
        <button
          onClick={onClose}
          className={cn(
            "font-body text-[0.75rem] tracking-[0.25em] uppercase",
            "text-text-on-dark border border-white/15 px-7 py-4 min-w-[10rem]",
            "transition-colors duration-300 hover:border-accent hover:text-accent",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          )}
        >
          Close
        </button>
      </div>
    </div>
  );
}
