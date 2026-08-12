"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, BookOpen, X } from "lucide-react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { selectedReading } from "@/data/reading";
import { readingContent } from "@/data/i18n";
import { useLanguage } from "@/components/LanguageProvider";

const cardNumerals = ["I", "II", "III"];
function getSpreadStep(count: number) { return Math.min(184, Math.max(122, 560 / Math.max(count - 1, 1))); }
function getSpreadRotation(index: number, count: number) { const center = (count - 1) / 2; return (index - center) * Math.min(7, 21 / Math.max(count - 1, 1)); }

export default function SelectedReading() {
  const deckRef = useRef<HTMLDivElement>(null);
  const pointerFrame = useRef<number | null>(null);
  const pointerTarget = useRef({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { locale, copy } = useLanguage();
  const books = selectedReading.map((book, index) => ({ ...book, ...readingContent[locale][index] }));

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mediaQuery.matches);
    update(); mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const resetPointer = () => {
    pointerTarget.current = { x: 0, y: 0 };
    if (pointerFrame.current !== null) return;
    pointerFrame.current = window.requestAnimationFrame(() => {
      deckRef.current?.style.setProperty("--reading-drift-x", "0px");
      deckRef.current?.style.setProperty("--reading-drift-y", "0px");
      deckRef.current?.style.setProperty("--reading-drift-rotate", "0deg");
      pointerFrame.current = null;
    });
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType !== "mouse" || !deckRef.current) return;
    const bounds = deckRef.current.getBoundingClientRect();
    pointerTarget.current = { x: Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1)), y: Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1)) };
    if (pointerFrame.current !== null) return;
    pointerFrame.current = window.requestAnimationFrame(() => {
      const { x, y } = pointerTarget.current;
      deckRef.current?.style.setProperty("--reading-drift-x", `${x * 7}px`);
      deckRef.current?.style.setProperty("--reading-drift-y", `${y * -3}px`);
      deckRef.current?.style.setProperty("--reading-drift-rotate", `${x * 0.45}deg`);
      pointerFrame.current = null;
    });
  };

  useEffect(() => () => { if (pointerFrame.current !== null) window.cancelAnimationFrame(pointerFrame.current); }, []);

  const selectBook = (direction: "previous" | "next") => setActiveIndex(current => {
    const next = current === null ? (direction === "next" ? 0 : books.length - 1) : current + (direction === "next" ? 1 : -1);
    return (next + books.length) % books.length;
  });
  const focusedIndex = activeIndex ?? hoveredIndex;
  const activeBook = activeIndex === null ? null : books[activeIndex];
  const spreadStep = getSpreadStep(books.length);

  return <section className="selected-reading-section" id="reading" aria-labelledby="selected-reading-heading"><div className="section-wrap"><div className="reading-layout">
    <div className="reading-heading"><div className="eyebrow">{copy.reading.eyebrow}</div><h2 id="selected-reading-heading">{copy.reading.title}</h2><p className="reading-intro">{copy.reading.intro}</p><div className="reading-heading-meta"><BookOpen size={16} strokeWidth={1.7} aria-hidden="true" /><span>{String(books.length).padStart(2, "0")} {copy.reading.titles}</span><span aria-hidden="true">·</span><span>{copy.reading.hover}</span></div><div className="reading-controls" aria-label={copy.reading.eyebrow}><button className="reading-control" type="button" onClick={() => selectBook("previous")} aria-label={copy.reading.previous}><ArrowLeft size={18} strokeWidth={1.7} /></button><button className="reading-control" type="button" onClick={() => selectBook("next")} aria-label={copy.reading.next}><ArrowRight size={18} strokeWidth={1.7} /></button></div></div>
    <div className={`reading-deck${focusedIndex !== null ? " reading-deck--focused" : ""}${activeIndex !== null ? " reading-deck--has-active" : ""}`} ref={deckRef} onPointerMove={handlePointerMove} onPointerLeave={resetPointer} role="region" aria-label={copy.reading.eyebrow}><div className="reading-deck__stage">{books.map((book, index) => { const center = (books.length - 1) / 2; const distance = focusedIndex === null ? 0 : index - focusedIndex; const isFocused = focusedIndex === index; const isActive = activeIndex === index; const cardStyle = { "--reading-card-x": `${(index - center) * spreadStep + (focusedIndex === null ? 0 : distance * 26)}px`, "--reading-card-y": `${Math.abs(getSpreadRotation(index, books.length)) * 1.35 + (focusedIndex !== null && !isFocused ? Math.abs(distance) * 3 : 0)}px`, "--reading-card-rotate": `${getSpreadRotation(index, books.length) + (focusedIndex === null || isFocused ? 0 : distance * -1.5)}deg`, "--reading-card-z": `${isFocused ? 20 : 10 - Math.abs(distance)}` } as CSSProperties; return <div className={`reading-card-shell${isFocused ? " is-focused" : ""}${isActive ? " is-active" : ""}`} key={book.cover} style={cardStyle}><button className="reading-card-face" type="button" aria-expanded={isActive} aria-controls={`reading-detail-${index}`} onClick={() => setActiveIndex(current => current === index ? null : index)} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)} onFocus={() => setHoveredIndex(index)} onBlur={() => setHoveredIndex(null)}><span className="reading-card-face__index" aria-hidden="true">{cardNumerals[index] ?? String(index + 1).padStart(2, "0")}</span><span className="reading-card-face__cover-wrap"><Image className="reading-card-face__cover" src={book.cover} alt={`${book.title}${book.volume ? ` — ${book.volume}` : ""} book cover`} fill sizes="(max-width: 700px) 75vw, 260px" /></span><span className="reading-card-face__copy"><span className="reading-card-face__volume">{book.volume || book.topics[0]}</span><span className="reading-card-face__title">{book.title}</span><span className="reading-card-face__tagline">{book.tagline}</span><span className="reading-card-face__author">{book.author}</span></span><span className="reading-card-face__hint">{isActive ? copy.reading.noteOpen : copy.reading.openNote}<span aria-hidden="true">→</span></span></button></div>; })}</div><div className="reading-deck__caption"><span>{copy.reading.archive}</span><span>{copy.reading.move}</span></div></div>
  </div><AnimatePresence initial={false} mode="wait">{activeBook && activeIndex !== null && <motion.article className="reading-detail" id={`reading-detail-${activeIndex}`} key={activeBook.cover} initial={reducedMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }} transition={reducedMotion ? { duration: 0 } : { duration: 0.24, ease: "easeOut" }}><div className="reading-detail__cover-wrap"><Image className="reading-detail__cover" src={activeBook.cover} alt={`${activeBook.title} book cover`} fill sizes="170px" /></div><div className="reading-detail__copy"><div className="reading-detail__kicker">{copy.reading.examining} / {cardNumerals[activeIndex] ?? String(activeIndex + 1).padStart(2, "0")}</div><h3>{activeBook.title}{activeBook.volume && <span>{activeBook.volume}</span>}</h3><p className="reading-detail__author">{activeBook.author}</p><p className="reading-detail__note">{activeBook.note}</p><div className="reading-detail__topics" aria-label="Book topics">{activeBook.topics.map(topic => <span key={topic}>{topic}</span>)}</div></div><button className="reading-detail__close" type="button" onClick={() => setActiveIndex(null)} aria-label={copy.reading.close}><X size={18} strokeWidth={1.7} /></button></motion.article>}</AnimatePresence></div></section>;
}
