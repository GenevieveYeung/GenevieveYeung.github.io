"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, BookOpen, X } from "lucide-react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { selectedReading } from "@/data/reading";

const cardNumerals = ["I", "II", "III"];

type ReadingBook = (typeof selectedReading)[number];

function getSpreadStep(count: number) {
  return Math.min(184, Math.max(122, 560 / Math.max(count - 1, 1)));
}

function getSpreadRotation(index: number, count: number) {
  const center = (count - 1) / 2;
  return (index - center) * Math.min(7, 21 / Math.max(count - 1, 1));
}

export default function SelectedReading() {
  const deckRef = useRef<HTMLDivElement>(null);
  const pointerFrame = useRef<number | null>(null);
  const pointerTarget = useRef({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches);
    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  const resetPointer = () => {
    pointerTarget.current = { x: 0, y: 0 };
    if (pointerFrame.current !== null) return;
    pointerFrame.current = window.requestAnimationFrame(() => {
      const deck = deckRef.current;
      if (deck) {
        deck.style.setProperty("--reading-drift-x", "0px");
        deck.style.setProperty("--reading-drift-y", "0px");
        deck.style.setProperty("--reading-drift-rotate", "0deg");
      }
      pointerFrame.current = null;
    });
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType !== "mouse") return;
    const deck = deckRef.current;
    if (!deck) return;
    const bounds = deck.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width * 2 - 1;
    const y = (event.clientY - bounds.top) / bounds.height * 2 - 1;
    pointerTarget.current = { x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) };
    if (pointerFrame.current !== null) return;
    pointerFrame.current = window.requestAnimationFrame(() => {
      const activeDeck = deckRef.current;
      if (activeDeck) {
        const { x: pointerX, y: pointerY } = pointerTarget.current;
        activeDeck.style.setProperty("--reading-drift-x", `${pointerX * 7}px`);
        activeDeck.style.setProperty("--reading-drift-y", `${pointerY * -3}px`);
        activeDeck.style.setProperty("--reading-drift-rotate", `${pointerX * 0.45}deg`);
      }
      pointerFrame.current = null;
    });
  };

  useEffect(() => () => {
    if (pointerFrame.current !== null) window.cancelAnimationFrame(pointerFrame.current);
  }, []);

  const selectBook = (direction: "previous" | "next") => {
    setActiveIndex((currentIndex) => {
      const nextIndex = currentIndex === null
        ? direction === "next" ? 0 : selectedReading.length - 1
        : currentIndex + (direction === "next" ? 1 : -1);
      return (nextIndex + selectedReading.length) % selectedReading.length;
    });
  };

  const toggleBook = (index: number) => {
    setActiveIndex((currentIndex) => currentIndex === index ? null : index);
  };

  const focusedIndex = activeIndex ?? hoveredIndex;
  const activeBook: ReadingBook | null = activeIndex === null ? null : selectedReading[activeIndex];
  const spreadStep = getSpreadStep(selectedReading.length);

  return (
    <section className="selected-reading-section" id="reading" aria-labelledby="selected-reading-heading">
      <div className="section-wrap">
        <div className="reading-layout">
          <div className="reading-heading">
            <div className="eyebrow">SELECTED READING</div>
            <h2 id="selected-reading-heading">What I’m reading beyond the curriculum.</h2>
            <p className="reading-intro">I like using books to explore ideas outside formal coursework — from economics and markets to practical data skills.</p>
            <div className="reading-heading-meta"><BookOpen size={16} strokeWidth={1.7} aria-hidden="true" /><span>{String(selectedReading.length).padStart(2, "0")} titles in the deck</span><span aria-hidden="true">·</span><span>Hover, then open a card</span></div>
            <div className="reading-controls" aria-label="Selected reading controls">
              <button className="reading-control" type="button" onClick={() => selectBook("previous")} aria-label="Open previous book"><ArrowLeft size={18} strokeWidth={1.7} /></button>
              <button className="reading-control" type="button" onClick={() => selectBook("next")} aria-label="Open next book"><ArrowRight size={18} strokeWidth={1.7} /></button>
            </div>
          </div>

          <div className={`reading-deck${focusedIndex !== null ? " reading-deck--focused" : ""}${activeIndex !== null ? " reading-deck--has-active" : ""}`} ref={deckRef} onPointerMove={handlePointerMove} onPointerLeave={resetPointer} role="region" aria-label="Interactive selected reading deck">
            <div className="reading-deck__stage">
              {selectedReading.map((book, index) => {
                const center = (selectedReading.length - 1) / 2;
                const distance = focusedIndex === null ? 0 : index - focusedIndex;
                const isFocused = focusedIndex === index;
                const isActive = activeIndex === index;
                const cardStyle = {
                  "--reading-card-x": `${(index - center) * spreadStep + (focusedIndex === null ? 0 : distance * 26)}px`,
                  "--reading-card-y": `${Math.abs(getSpreadRotation(index, selectedReading.length)) * 1.35 + (focusedIndex !== null && !isFocused ? Math.abs(distance) * 3 : 0)}px`,
                  "--reading-card-rotate": `${getSpreadRotation(index, selectedReading.length) + (focusedIndex === null || isFocused ? 0 : distance * -1.5)}deg`,
                  "--reading-card-z": `${isFocused ? 20 : 10 - Math.abs(distance)}`,
                } as CSSProperties;
                return (
                  <div className={`reading-card-shell${isFocused ? " is-focused" : ""}${isActive ? " is-active" : ""}`} key={book.cover} style={cardStyle} data-index={index}>
                    <button className="reading-card-face" type="button" aria-expanded={isActive} aria-controls={`reading-detail-${index}`} onClick={() => toggleBook(index)} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)} onFocus={() => setHoveredIndex(index)} onBlur={() => setHoveredIndex(null)}>
                      <span className="reading-card-face__index" aria-hidden="true">{cardNumerals[index] ?? String(index + 1).padStart(2, "0")}</span>
                      <span className="reading-card-face__cover-wrap"><Image className="reading-card-face__cover" src={book.cover} alt={`${book.title}${book.volume ? ` — ${book.volume}` : ""} book cover`} fill sizes="(max-width: 700px) 75vw, 260px" /></span>
                      <span className="reading-card-face__copy">
                        <span className="reading-card-face__volume">{book.volume || book.topics[0]}</span>
                        <span className="reading-card-face__title">{book.title}</span>
                        <span className="reading-card-face__tagline">{book.tagline}</span>
                        <span className="reading-card-face__author">{book.author}</span>
                      </span>
                      <span className="reading-card-face__hint">{isActive ? "Reading note open" : "Open reading note"}<span aria-hidden="true">↗</span></span>
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="reading-deck__caption"><span>CURATED CARD SPREAD</span><span>Move across the deck to shift its emphasis.</span></div>
          </div>
        </div>

        <AnimatePresence initial={false} mode="wait">
          {activeBook && activeIndex !== null && (
            <motion.article className="reading-detail" id={`reading-detail-${activeIndex}`} key={activeBook.cover} initial={reducedMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }} transition={reducedMotion ? { duration: 0 } : { duration: 0.24, ease: "easeOut" }}>
              <div className="reading-detail__cover-wrap"><Image className="reading-detail__cover" src={activeBook.cover} alt={`${activeBook.title}${activeBook.volume ? ` — ${activeBook.volume}` : ""} book cover`} fill sizes="170px" /></div>
              <div className="reading-detail__copy">
                <div className="reading-detail__kicker">NOW EXAMINING / {cardNumerals[activeIndex] ?? String(activeIndex + 1).padStart(2, "0")}</div>
                <h3>{activeBook.title}{activeBook.volume && <span>{activeBook.volume}</span>}</h3>
                <p className="reading-detail__author">{activeBook.author}</p>
                <p className="reading-detail__note">{activeBook.note}</p>
                <div className="reading-detail__topics" aria-label="Book topics">{activeBook.topics.map((topic) => <span key={topic}>{topic}</span>)}</div>
              </div>
              <button className="reading-detail__close" type="button" onClick={() => setActiveIndex(null)} aria-label="Close reading note"><X size={18} strokeWidth={1.7} /></button>
            </motion.article>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
