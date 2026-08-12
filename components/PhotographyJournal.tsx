"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { links } from "@/data/portfolio";
import { photographyContent } from "@/data/i18n";
import { useLanguage } from "@/components/LanguageProvider";

const artworks = [
  ["/photography/under-golden-eaves.png", 1024, 1536], ["/photography/between-blue-ridges.png", 1024, 1536], ["/photography/a-window-of-gold.jpg", 1024, 1536], ["/photography/a-field-of-gold.jpg", 1024, 1536], ["/photography/green-slopes-quiet-pines.png", 1024, 1536], ["/photography/winter-light-bare-branches.png", 1024, 1536], ["/photography/petals-along-the-line.jpg", 1024, 1536], ["/photography/where-water-meets-snow.png", 1024, 1536],
] as const;

export default function PhotographyJournal() {
  const { locale, copy } = useLanguage();
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null); const railRef = useRef<HTMLDivElement>(null); const dialogRef = useRef<HTMLDivElement>(null); const closeRef = useRef<HTMLButtonElement>(null); const openerRef = useRef<HTMLElement | null>(null); const stopRef = useRef<() => void>(() => undefined); const openRef = useRef(false);
  const cards = photographyContent[locale].map((text, index) => ({ ...text, src: artworks[index][0], width: artworks[index][1], height: artworks[index][2] }));
  const isOpen = viewerIndex !== null; openRef.current = isOpen;

  useEffect(() => {
    const viewport = viewportRef.current; const rail = railRef.current;
    if (!viewport || !rail || !window.matchMedia("(pointer: fine) and (hover: hover)").matches) return;
    let frame = 0; let last = 0; let target = 0; let actual = 0; let visible = true;
    const stop = () => { target = 0; actual = 0; if (frame) cancelAnimationFrame(frame); frame = 0; last = 0; };
    stopRef.current = stop;
    const velocity = (clientX: number) => { const rect = viewport.getBoundingClientRect(); const position = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)); if (position < .28) return -320 * Math.pow((.28 - position) / .28, 1.15); if (position > .72) return 320 * Math.pow((position - .72) / .28, 1.15); return 0; };
    const render = (time: number) => { frame = 0; if (!visible || openRef.current) return stop(); const delta = last ? Math.min(.05, (time - last) / 1000) : 0; last = time; actual += (target - actual) * Math.min(1, delta * 7.5); if (Math.abs(actual) > .05) { const max = Math.max(0, rail.scrollWidth - rail.clientWidth); rail.scrollLeft = Math.max(0, Math.min(max, rail.scrollLeft + actual * delta)); if ((rail.scrollLeft <= 0 && actual < 0) || (rail.scrollLeft >= max && actual > 0)) target = actual = 0; } if (Math.abs(actual) > .05 || Math.abs(target) > .05) frame = requestAnimationFrame(render); else last = 0; };
    const request = () => { if (!frame && visible && !openRef.current) frame = requestAnimationFrame(render); };
    const move = (event: PointerEvent) => { target = velocity(event.clientX); request(); }; const leave = () => { target = 0; request(); }; const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (!visible) stop(); }, { threshold: .04 });
    observer.observe(viewport); viewport.addEventListener("pointerenter", move); viewport.addEventListener("pointermove", move); viewport.addEventListener("pointerleave", leave); return () => { observer.disconnect(); viewport.removeEventListener("pointerenter", move); viewport.removeEventListener("pointermove", move); viewport.removeEventListener("pointerleave", leave); stop(); stopRef.current = () => undefined; };
  }, []);

  useEffect(() => {
    if (!isOpen) return; const previousOverflow = document.body.style.overflow; const previousPadding = document.body.style.paddingRight; const scrollbar = window.innerWidth - document.documentElement.clientWidth; document.body.style.overflow = "hidden"; if (scrollbar) document.body.style.paddingRight = `${scrollbar}px`;
    const keydown = (event: KeyboardEvent) => { if (event.key === "Escape") { event.preventDefault(); setViewerIndex(null); } else if (event.key === "ArrowLeft") { event.preventDefault(); setViewerIndex(index => Math.max(0, (index ?? 0) - 1)); } else if (event.key === "ArrowRight") { event.preventDefault(); setViewerIndex(index => Math.min(cards.length - 1, (index ?? 0) + 1)); } else if (event.key === "Tab") { const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]),[href],[tabindex]:not([tabindex='-1'])") ?? []); if (focusable.length && ((event.shiftKey && document.activeElement === focusable[0]) || (!event.shiftKey && document.activeElement === focusable[focusable.length - 1]))) { event.preventDefault(); (event.shiftKey ? focusable[focusable.length - 1] : focusable[0]).focus(); } } };
    const focus = requestAnimationFrame(() => closeRef.current?.focus()); window.addEventListener("keydown", keydown); return () => { cancelAnimationFrame(focus); window.removeEventListener("keydown", keydown); document.body.style.overflow = previousOverflow; document.body.style.paddingRight = previousPadding; openerRef.current?.focus({ preventScroll: true }); };
  }, [isOpen, cards.length]);

  const openViewer = (index: number, opener: HTMLElement) => { stopRef.current(); openerRef.current = opener; setViewerIndex(index); };
  const viewer = viewerIndex === null ? null : cards[viewerIndex];
  return <section className="photography-journal-section" id="beyond-work-journal" data-testid="beyond-work-section">
    <div className="section-wrap photography-journal-intro"><div className="eyebrow">{copy.beyond.eyebrow}</div><h2>{copy.beyond.title}</h2><p>{copy.beyond.intro}</p><div className="photography-journal-creator-line"><strong>{copy.beyond.creator}</strong><span>{copy.beyond.stats}</span><a href={links.xiaohongshu} target="_blank" rel="noopener noreferrer">{copy.beyond.profile}</a></div></div>
    <div className="section-wrap travel-notes-heading"><div><span className="eyebrow">{copy.beyond.notes}</span><span className="travel-notes-subtitle">{copy.beyond.notesSubtitle}</span></div><span className="travel-notes-count">{copy.beyond.works}</span></div>
    <div ref={viewportRef} className="journal-rail-viewport" role="region" aria-label={copy.beyond.notes} tabIndex={0} data-testid="travel-gallery" onKeyDown={event => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); railRef.current?.scrollBy({ left: event.key === "ArrowLeft" ? -260 : 260, behavior: "smooth" }); } }}><div ref={railRef} className="journal-rail" role="list" aria-label={copy.beyond.notes} data-testid="travel-gallery-rail">{cards.map((artwork, index) => <button type="button" className="journal-artwork" key={artwork.src} role="listitem" aria-label={`${copy.beyond.open}: ${artwork.title}`} data-testid="travel-card" onClick={event => openViewer(index, event.currentTarget)}><span className="journal-artwork-media"><Image src={artwork.src} alt={artwork.title} width={artwork.width} height={artwork.height} quality={72} priority={index < 2} loading={index < 2 ? undefined : "lazy"} draggable={false} sizes="(max-width: 700px) 76vw, (max-width: 1100px) 30vw, 280px" data-testid="travel-card-image" /><span className="journal-artwork-veil" data-testid="travel-card-veil" aria-hidden="true" /></span></button>)}</div></div>
    <div className="section-wrap journal-rail-caption"><span>{copy.beyond.click}</span><span className="journal-caption-rule" aria-hidden="true" /><span>{copy.beyond.scroll}</span></div><div className="section-wrap photography-journal-closing">{copy.beyond.closing}</div>
    {viewer && typeof document !== "undefined" && createPortal(<div ref={dialogRef} className="journal-viewer" data-testid="travel-lightbox" role="dialog" aria-modal="true" aria-label={copy.beyond.viewer} tabIndex={-1} onClick={event => { if (event.target === event.currentTarget) setViewerIndex(null); }}><div className="journal-viewer-backdrop" data-testid="travel-lightbox-backdrop" onClick={() => setViewerIndex(null)} /><button type="button" ref={closeRef} className="journal-viewer-close" data-testid="travel-lightbox-close" onClick={() => setViewerIndex(null)} aria-label={copy.beyond.close}>×</button><button type="button" className="journal-viewer-control journal-viewer-control--prev" onClick={event => { event.stopPropagation(); setViewerIndex(index => Math.max(0, (index ?? 0) - 1)); }} aria-label={copy.beyond.previous}>←</button><figure className="journal-viewer-figure" onClick={event => event.stopPropagation()}><Image src={viewer.src} alt={viewer.title} width={viewer.width} height={viewer.height} priority quality={82} sizes="min(78vw, 560px)" data-testid="travel-lightbox-image" /><figcaption><span>{String((viewerIndex ?? 0) + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}</span><span>{viewer.title}</span></figcaption></figure><button type="button" className="journal-viewer-control journal-viewer-control--next" onClick={event => { event.stopPropagation(); setViewerIndex(index => Math.min(cards.length - 1, (index ?? 0) + 1)); }} aria-label={copy.beyond.next}>→</button></div>, document.body)}
  </section>;
}
