"use client";

import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.documentElement.classList.add("reveal-ready");

    if (reduceMotion) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return () => document.documentElement.classList.remove("reveal-ready");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: .14, rootMargin: "0px 0px -7% 0px" },
    );

    const frame = requestAnimationFrame(() => elements.forEach((element) => observer.observe(element)));
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.documentElement.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
