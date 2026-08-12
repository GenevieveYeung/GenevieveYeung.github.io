"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { links } from "@/data/portfolio";

type Artwork = {
  title: string;
  season: string;
  src: string;
  width: number;
  height: number;
};

const artworks: Artwork[] = [
  { title: "Under Golden Eaves", season: "Autumn · Beijing", src: "/photography/under-golden-eaves.png", width: 1024, height: 1536 },
  { title: "Between Blue Ridges", season: "Mountain light · open air", src: "/photography/between-blue-ridges.png", width: 1024, height: 1536 },
  { title: "A Window of Gold", season: "Autumn · skyward", src: "/photography/a-window-of-gold.jpg", width: 1024, height: 1536 },
  { title: "A Field of Gold", season: "Summer · gardens", src: "/photography/a-field-of-gold.jpg", width: 1024, height: 1536 },
  { title: "Green Slopes, Quiet Pines", season: "Green slopes · quiet pines", src: "/photography/green-slopes-quiet-pines.png", width: 1024, height: 1536 },
  { title: "Winter Light, Bare Branches", season: "Winter light · bare branches", src: "/photography/winter-light-bare-branches.png", width: 1024, height: 1536 },
  { title: "Petals Along the Line", season: "Spring petals · Beijing", src: "/photography/petals-along-the-line.jpg", width: 1024, height: 1536 },
  { title: "Where Water Meets Snow", season: "Snow line · open water", src: "/photography/where-water-meets-snow.png", width: 1024, height: 1536 },
];

export default function PhotographyJournal() {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const railViewportRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const viewerOpenRef = useRef(false);
  const viewerDialogRef = useRef<HTMLDivElement | null>(null);
  const viewerCloseRef = useRef<HTMLButtonElement | null>(null);
  const viewerOpenerRef = useRef<HTMLElement | null>(null);
  const stopAutoScrollRef = useRef<() => void>(() => undefined);
  const viewerArtwork = viewerIndex === null ? artworks[0] : artworks[viewerIndex];
  const isViewerOpen = viewerIndex !== null;
  viewerOpenRef.current = isViewerOpen;

  useEffect(() => {
    const viewport = railViewportRef.current;
    const rail = railRef.current;
    if (!viewport || !rail || !window.matchMedia("(pointer: fine) and (hover: hover)").matches) return;

    let frameId = 0;
    let lastTime = 0;
    let targetVelocity = 0;
    let actualVelocity = 0;
    let isVisible = true;

    const cancelFrame = () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = 0;
      lastTime = 0;
    };

    const hardStop = () => {
      targetVelocity = 0;
      actualVelocity = 0;
      cancelFrame();
    };

    stopAutoScrollRef.current = hardStop;

    const getTargetVelocity = (clientX: number) => {
      const bounds = viewport.getBoundingClientRect();
      const position = Math.max(0, Math.min(1, (clientX - bounds.left) / bounds.width));
      const leftBoundary = 0.28;
      const rightBoundary = 0.72;
      const maxSpeed = 320;

      if (position < leftBoundary) {
        const intensity = Math.pow((leftBoundary - position) / leftBoundary, 1.15);
        return -maxSpeed * intensity;
      }
      if (position > rightBoundary) {
        const intensity = Math.pow((position - rightBoundary) / (1 - rightBoundary), 1.15);
        return maxSpeed * intensity;
      }
      return 0;
    };

    const render = (timestamp: number) => {
      frameId = 0;
      if (!isVisible || viewerOpenRef.current) {
        hardStop();
        return;
      }

      const delta = lastTime ? Math.min(0.05, (timestamp - lastTime) / 1000) : 0;
      lastTime = timestamp;
      actualVelocity += (targetVelocity - actualVelocity) * Math.min(1, delta * 7.5);

      if (Math.abs(actualVelocity) > 0.05) {
        const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
        const nextScrollLeft = Math.max(0, Math.min(maxScroll, rail.scrollLeft + actualVelocity * delta));
        rail.scrollLeft = nextScrollLeft;
        if ((nextScrollLeft <= 0 && actualVelocity < 0) || (nextScrollLeft >= maxScroll && actualVelocity > 0)) {
          targetVelocity = 0;
          actualVelocity = 0;
        }
      }

      if (Math.abs(actualVelocity) > 0.05 || Math.abs(targetVelocity) > 0.05) {
        frameId = window.requestAnimationFrame(render);
      } else {
        lastTime = 0;
      }
    };

    const requestRender = () => {
      if (!frameId && isVisible && !viewerOpenRef.current) frameId = window.requestAnimationFrame(render);
    };

    const handlePointerEnter = (event: PointerEvent) => {
      targetVelocity = getTargetVelocity(event.clientX);
      requestRender();
    };

    const handlePointerMove = (event: PointerEvent) => {
      targetVelocity = getTargetVelocity(event.clientX);
      requestRender();
    };

    const handlePointerLeave = () => {
      targetVelocity = 0;
      requestRender();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) hardStop();
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (!isVisible) hardStop();
    }, { threshold: 0.04 });

    observer.observe(viewport);
    viewport.addEventListener("pointerenter", handlePointerEnter, { passive: true });
    viewport.addEventListener("pointermove", handlePointerMove, { passive: true });
    viewport.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      observer.disconnect();
      viewport.removeEventListener("pointerenter", handlePointerEnter);
      viewport.removeEventListener("pointermove", handlePointerMove);
      viewport.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopAutoScrollRef.current = () => undefined;
      hardStop();
    };
  }, []);

  const openViewer = (index: number, trigger?: HTMLElement) => {
    stopAutoScrollRef.current();
    viewerOpenerRef.current = trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    setViewerIndex(index);
  };

  useEffect(() => {
    if (!isViewerOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const computedPaddingRight = Number.parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${computedPaddingRight + scrollbarWidth}px`;

    const getFocusable = () => Array.from(
      viewerDialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    );

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setViewerIndex(null);
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setViewerIndex((index) => Math.max(0, (index ?? 0) - 1));
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setViewerIndex((index) => Math.min(artworks.length - 1, (index ?? 0) + 1));
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = getFocusable();
      if (focusable.length === 0) {
        event.preventDefault();
        viewerDialogRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const focusFrame = window.requestAnimationFrame(() => {
      viewerCloseRef.current?.focus();
    });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      window.removeEventListener("keydown", onKeyDown);
      viewerOpenerRef.current?.focus({ preventScroll: true });
    };
  }, [isViewerOpen]);

  return (
    <section className="photography-journal-section" id="beyond-work-journal" data-testid="beyond-work-section">
      <div className="section-wrap photography-journal-intro">
        <div className="eyebrow">BEYOND WORK</div>
        <h2>Portrait photography &amp; visual stories.</h2>
        <p>I create portrait photography content around people, atmosphere and city life. Travel photographs become a separate visual diary: small studies to keep from the road.</p>
        <div className="photography-journal-creator-line">
          <strong>Photography Content Creator</strong>
          <span>3.5K+ followers · 74K+ likes &amp; saves</span>
          <a href={links.xiaohongshu} target="_blank" rel="noopener noreferrer">View photography profile ↗</a>
        </div>
      </div>

      <div className="section-wrap travel-notes-heading">
        <div><span className="eyebrow">TRAVEL NOTES</span><span className="travel-notes-subtitle">Small visual studies from the road.</span></div>
        <span className="travel-notes-count">08 works</span>
      </div>

      <div ref={railViewportRef} className="journal-rail-viewport" role="region" aria-label="Travel note artwork archive" tabIndex={0} data-testid="travel-gallery" onKeyDown={(event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        railRef.current?.scrollBy({ left: event.key === "ArrowLeft" ? -260 : 260, behavior: "smooth" });
      }}>
        <div ref={railRef} className="journal-rail" role="list" aria-label="Travel note artworks" data-testid="travel-gallery-rail">
          {artworks.map((artwork, index) => (
            <button type="button" className="journal-artwork" key={artwork.src} role="listitem" aria-label={`Open ${artwork.title}`} data-testid="travel-card" onClick={(event) => openViewer(index, event.currentTarget)}>
              <span className="journal-artwork-media">
                <Image src={artwork.src} alt={artwork.title} width={artwork.width} height={artwork.height} quality={72} priority={index < 2} loading={index < 2 ? undefined : "lazy"} draggable={false} sizes="(max-width: 700px) 76vw, (max-width: 1100px) 30vw, 280px" data-testid="travel-card-image" />
                <span className="journal-artwork-veil" data-testid="travel-card-veil" aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="section-wrap journal-rail-caption"><span>Click an artwork to enlarge</span><span className="journal-caption-rule" aria-hidden="true" /><span>Horizontal scroll →</span></div>
      <div className="section-wrap photography-journal-closing">A few things I notice when I’m not looking at a dataset.</div>

      {viewerIndex !== null && typeof document !== "undefined" && createPortal(
        <div
          ref={viewerDialogRef}
          className="journal-viewer"
          data-testid="travel-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Travel note viewer"
          tabIndex={-1}
          onClick={(event) => {
            if (event.target === event.currentTarget) setViewerIndex(null);
          }}
        >
          <div className="journal-viewer-backdrop" data-testid="travel-lightbox-backdrop" aria-hidden="true" onClick={() => setViewerIndex(null)} />
          <button type="button" ref={viewerCloseRef} className="journal-viewer-close" data-testid="travel-lightbox-close" onClick={() => setViewerIndex(null)} aria-label="Close artwork viewer">×</button>
          <button type="button" className="journal-viewer-control journal-viewer-control--prev" onClick={(event) => { event.stopPropagation(); setViewerIndex((index) => Math.max(0, (index ?? 0) - 1)); }} aria-label="Previous artwork">←</button>
          <figure className="journal-viewer-figure" onClick={(event) => event.stopPropagation()}>
            <Image src={viewerArtwork.src} alt={viewerArtwork.title} width={viewerArtwork.width} height={viewerArtwork.height} priority quality={82} sizes="min(78vw, 560px)" data-testid="travel-lightbox-image" />
            <figcaption><span>{String(viewerIndex + 1).padStart(2, "0")} / {String(artworks.length).padStart(2, "0")}</span><span>{viewerArtwork.title}</span></figcaption>
          </figure>
          <button type="button" className="journal-viewer-control journal-viewer-control--next" onClick={(event) => { event.stopPropagation(); setViewerIndex((index) => Math.min(artworks.length - 1, (index ?? 0) + 1)); }} aria-label="Next artwork">→</button>
        </div>,
        document.body,
      )}
    </section>
  );
}
