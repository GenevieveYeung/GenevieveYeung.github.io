"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect } from "react";

type SectionDeckProps = { children: ReactNode };
type SectionDeckShellProps = { children: ReactNode; index: number; name: string };

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function SectionDeckShell({ children, index, name }: SectionDeckShellProps) {
  const style = {
    "--deck-index": index,
    "--deck-stack-offset": `${index * 12}px`,
  } as CSSProperties;

  return (
    <div className="section-deck-shell" data-deck-shell data-deck-name={name} style={style}>
      <div className="section-deck-content" data-deck-panel>
        <div className="section-deck-entrance" data-deck-entrance>{children}</div>
      </div>
    </div>
  );
}

export default function SectionDeck({ children }: SectionDeckProps) {
  return <div className="section-deck">{children}</div>;
}

export function SectionDeckObserver() {
  useEffect(() => {
    const ids = ["work", "projects", "education", "beyond-work-journal", "contact"];
    const sections = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const entrances = sections.map(section => section.parentElement).filter(Boolean) as HTMLElement[];
    const panels = entrances.map(entrance => entrance.parentElement).filter(Boolean) as HTMLElement[];
    const shells = panels.map(panel => panel.parentElement).filter(Boolean) as HTMLElement[];
    const deck = sections[0]?.closest<HTMLElement>(".section-deck");
    if (!deck || sections.length !== ids.length || entrances.length !== sections.length || panels.length !== sections.length || shells.length !== panels.length) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");

    const internalAnchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
    const documentTop = (element: HTMLElement) => {
      let top = 0;
      let current: HTMLElement | null = element;
      while (current) {
        top += current.offsetTop;
        current = current.offsetParent instanceof HTMLElement ? current.offsetParent : null;
      }
      return top;
    };
    const handleInternalAnchor = (event: Event) => {
      const anchor = event.currentTarget as HTMLAnchorElement;
      const hash = anchor.hash;
      const target = hash ? document.getElementById(hash.slice(1)) : null;
      if (!target) return;
      event.preventDefault();
      const header = document.querySelector<HTMLElement>(".nav-shell");
      const offset = (header?.getBoundingClientRect().height || 64) + 20;
      window.scrollTo({ top: Math.max(0, documentTop(target) - offset), behavior: reducedMotion.matches ? "auto" : "smooth" });
      window.history.replaceState(null, "", hash);
    };
    internalAnchors.forEach(anchor => anchor.addEventListener("click", handleInternalAnchor));

    let frame = 0;
    const entranceElements = entrances;

    panels.forEach((panel, index) => {
      panel.classList.add("section-deck-panel");
      panel.dataset.deckIndex = String(index);
      panel.dataset.deckName = ids[index];
      panel.style.setProperty("--deck-index", String(index));
    });
    deck.classList.add("section-deck-root");

    const setMotionState = () => {
      deck.dataset.deckMotion = reducedMotion.matches || coarsePointer.matches ? "off" : "on";
      if (reducedMotion.matches) {
        entranceElements.forEach(entrance => { entrance.dataset.deckEntered = "true"; });
      }
    };

    entranceElements.forEach(entrance => {
      entrance.dataset.deckEntered = reducedMotion.matches ? "true" : "false";
    });

    const entranceObserver = reducedMotion.matches ? null : new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const entrance = entry.target as HTMLElement;
        entrance.dataset.deckEntered = "true";
        entranceObserver?.unobserve(entrance);
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -12% 0px" });

    entranceElements.forEach(entrance => entranceObserver?.observe(entrance));

    const update = () => {
      frame = 0;
      if (document.hidden) return;

      const header = document.querySelector<HTMLElement>(".nav-shell");
      const baseTop = Math.round((header?.getBoundingClientRect().height || 64) + 12);
      const approachBand = Math.min(260, Math.max(180, window.innerHeight * 0.28));
      deck.style.setProperty("--deck-sticky-base", `${baseTop}px`);

      if (reducedMotion.matches || coarsePointer.matches || window.matchMedia("(max-width: 700px)").matches) {
        panels.forEach(panel => {
          panel.style.setProperty("--deck-panel-y", "0px");
          panel.style.setProperty("--deck-panel-scale", "1");
          panel.style.setProperty("--deck-panel-opacity", "1");
        });
        return;
      }

      panels.forEach((panel, index) => {
        const shell = shells[index];
        const shellTop = shell.getBoundingClientRect().top + parseFloat(window.getComputedStyle(shell).paddingTop || "0");
        const stickyTop = baseTop + index * 12;
        const ownProgress = clamp(1 - (shellTop - stickyTop) / approachBand);
        const next = shells[index + 1];
        const nextTop = next ? next.getBoundingClientRect().top + parseFloat(window.getComputedStyle(next).paddingTop || "0") : Number.POSITIVE_INFINITY;
        const nextStickyTop = baseTop + (index + 1) * 12;
        const approachProgress = next ? clamp(1 - (nextTop - nextStickyTop) / approachBand) : 0;

        panel.style.setProperty("--deck-panel-y", `${((1 - ownProgress) * 18 - approachProgress * 4).toFixed(2)}px`);
        panel.style.setProperty("--deck-panel-scale", (0.995 + ownProgress * 0.005 - approachProgress * 0.01).toFixed(4));
        panel.style.setProperty("--deck-panel-opacity", (0.94 + ownProgress * 0.06 - approachProgress * 0.07).toFixed(3));
        panel.dataset.deckActive = ownProgress > 0.72 ? "true" : "false";
        panel.dataset.deckApproaching = approachProgress > 0.04 ? "true" : "false";
      });
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };
    const handleMotionChange = () => { setMotionState(); schedule(); };
    const handleVisibilityChange = () => { if (!document.hidden) schedule(); };

    setMotionState();
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reducedMotion.addEventListener("change", handleMotionChange);
    coarsePointer.addEventListener("change", handleMotionChange);

    return () => {
      entranceObserver?.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotion.removeEventListener("change", handleMotionChange);
      coarsePointer.removeEventListener("change", handleMotionChange);
      internalAnchors.forEach(anchor => anchor.removeEventListener("click", handleInternalAnchor));
      panels.forEach(panel => {
        panel.classList.remove("section-deck-panel");
        delete panel.dataset.deckIndex;
        delete panel.dataset.deckName;
        delete panel.dataset.deckActive;
        delete panel.dataset.deckApproaching;
        panel.style.removeProperty("--deck-index");
        panel.style.removeProperty("--deck-panel-y");
        panel.style.removeProperty("--deck-panel-scale");
        panel.style.removeProperty("--deck-panel-opacity");
      });
      entranceElements.forEach(entrance => { delete entrance.dataset.deckEntered; });
      deck.classList.remove("section-deck-root");
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
