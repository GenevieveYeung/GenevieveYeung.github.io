"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef } from "react";

export default function WorkChronologyGutter() {
  const gutterRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: gutterRef,
    offset: ["start 84%", "end 34%"],
  });
  const markerY = useMotionValue(0);
  const currentOpacity = useTransform(scrollYProgress, [0, 0.18, 0.34], [1, 0.95, 0.42]);
  const middleOpacity = useTransform(scrollYProgress, [0, 0.22, 0.42, 0.58], [0.42, 0.42, 1, 0.44]);
  const laterOpacity = useTransform(scrollYProgress, [0, 0.42, 0.62, 0.8], [0.4, 0.4, 1, 0.44]);
  const earliestOpacity = useTransform(scrollYProgress, [0, 0.64, 0.82, 1], [0.38, 0.38, 1, 1]);

  useEffect(() => {
    const gutter = gutterRef.current;
    if (!gutter) return;

    const updateMarker = () => {
      markerY.set(Math.max(0, gutter.clientHeight - 44) * scrollYProgress.get());
    };

    updateMarker();
    const unsubscribe = scrollYProgress.on("change", updateMarker);
    const resizeObserver = new ResizeObserver(updateMarker);
    resizeObserver.observe(gutter);

    return () => {
      unsubscribe();
      resizeObserver.disconnect();
    };
  }, [markerY, scrollYProgress]);

  return (
    <aside ref={gutterRef} className="work-chronology-gutter" aria-hidden="true">
      <motion.span className="work-chronology-label work-chronology-label--2026" style={{ opacity: reducedMotion ? 0.64 : currentOpacity }}>2026</motion.span>
      <motion.span className="work-chronology-label work-chronology-label--2025" style={{ opacity: reducedMotion ? 0.54 : middleOpacity }}>2025</motion.span>
      <motion.span className="work-chronology-label work-chronology-label--2024" style={{ opacity: reducedMotion ? 0.54 : laterOpacity }}>2024</motion.span>
      <motion.span className="work-chronology-label work-chronology-label--2023" style={{ opacity: reducedMotion ? 0.54 : earliestOpacity }}>2023</motion.span>
      <motion.span className="work-chronology-marker" style={{ y: reducedMotion ? 0 : markerY }} />
    </aside>
  );
}
