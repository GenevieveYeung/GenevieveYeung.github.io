"use client";

import { useEffect, useRef } from "react";

export default function HeroMountainReveal() {
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const hero = layer?.parentElement;

    if (!layer || !hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (coarsePointer) return;

    let frameId = 0;
    let targetX = 50;
    let targetY = 44;
    let currentX = targetX;
    let currentY = targetY;

    const render = () => {
      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;
      layer.style.setProperty("--mountain-x", `${currentX}%`);
      layer.style.setProperty("--mountain-y", `${currentY}%`);

      if (Math.abs(targetX - currentX) > 0.03 || Math.abs(targetY - currentY) > 0.03) {
        frameId = window.requestAnimationFrame(render);
      } else {
        frameId = 0;
      }
    };

    const requestRender = () => {
      if (!frameId) frameId = window.requestAnimationFrame(render);
    };

    const handlePointerEnter = () => {
      layer.classList.add("is-active");
    };

      const handlePointerMove = (event: PointerEvent) => {
        const heroBounds = hero.getBoundingClientRect();
        const layerBounds = layer.getBoundingClientRect();

        // The event belongs to the Hero content box, while the visual layer
        // intentionally bleeds to the viewport edges. Keep the mask anchored
        // to the actual overlay geometry so it never drifts at the gutters.
        const heroX = event.clientX - heroBounds.left;
        const heroY = event.clientY - heroBounds.top;
        targetX = Math.max(
          0,
          Math.min(100, ((heroX + heroBounds.left - layerBounds.left) / layerBounds.width) * 100),
        );
        targetY = Math.max(
          0,
          Math.min(100, ((heroY + heroBounds.top - layerBounds.top) / layerBounds.height) * 100),
        );
        requestRender();
      };

    const handlePointerLeave = () => {
      layer.classList.remove("is-active");
    };

    hero.addEventListener("pointerenter", handlePointerEnter);
    hero.addEventListener("pointermove", handlePointerMove, { passive: true });
    hero.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      hero.removeEventListener("pointerenter", handlePointerEnter);
      hero.removeEventListener("pointermove", handlePointerMove);
      hero.removeEventListener("pointerleave", handlePointerLeave);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div ref={layerRef} className="hero-mountain" data-testid="hero-spotlight" aria-hidden="true">
      <div className="hero-mountain-base" />
      <div className="hero-mountain-clear" />
      <div className="hero-mountain-veil" />
      <div className="hero-mountain-readability" />
    </div>
  );
}
