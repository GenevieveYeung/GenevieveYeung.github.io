"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function PetEasterEgg() {
  const petRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const visibleRef = useRef(true);
  const reducedMotionRef = useRef(false);
  const currentRef = useRef({ x: 0, y: 0, headX: 0, headY: 0, rotate: 0, attention: 0 });
  const targetRef = useRef({ x: 0, y: 0, headX: 0, headY: 0, rotate: 0, attention: 0 });

  useEffect(() => {
    const pet = petRef.current;
    const contact = pet?.closest<HTMLElement>(".cta-section");
    if (!pet || !contact) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = reducedMotion.matches;
    pet.classList.toggle("is-reduced-motion", reducedMotion.matches);

    const paint = () => {
      frameRef.current = null;
      if (!visibleRef.current || reducedMotionRef.current) return;

      const current = currentRef.current;
      const target = targetRef.current;
      const ease = 0.18;
      current.x += (target.x - current.x) * ease;
      current.y += (target.y - current.y) * ease;
      current.headX += (target.headX - current.headX) * ease;
      current.headY += (target.headY - current.headY) * ease;
      current.rotate += (target.rotate - current.rotate) * ease;
      current.attention += (target.attention - current.attention) * ease;

      pet.style.setProperty("--pet-gaze-x", `${current.x.toFixed(2)}px`);
      pet.style.setProperty("--pet-gaze-y", `${current.y.toFixed(2)}px`);
      pet.style.setProperty("--pet-head-x", `${current.headX.toFixed(2)}px`);
      pet.style.setProperty("--pet-head-y", `${current.headY.toFixed(2)}px`);
      pet.style.setProperty("--pet-head-rotate", `${current.rotate.toFixed(2)}deg`);
      pet.style.setProperty("--pet-attention", current.attention.toFixed(2));
      pet.style.setProperty("--pet-face-scale", (1 + current.attention * 0.012).toFixed(3));

      const settled = Math.abs(target.x - current.x) < 0.03
        && Math.abs(target.y - current.y) < 0.03
        && Math.abs(target.attention - current.attention) < 0.02;
      if (!settled || Math.abs(current.x) > 0.03 || Math.abs(current.y) > 0.03) {
        frameRef.current = window.requestAnimationFrame(paint);
      }
    };

    const requestPaint = () => {
      if (reducedMotionRef.current || !visibleRef.current || frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(paint);
    };

    const resetTarget = () => {
      targetRef.current = { x: 0, y: 0, headX: 0, headY: 0, rotate: 0, attention: 0 };
      requestPaint();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (reducedMotionRef.current || (event.pointerType !== "mouse" && event.pointerType !== "pen")) return;
      const rect = pet.getBoundingClientRect();
      const centerX = rect.left + rect.width * 0.5;
      const centerY = rect.top + rect.height * 0.42;
      const horizontal = clamp((event.clientX - centerX) / (rect.width * 0.58), -1, 1);
      const vertical = clamp((event.clientY - centerY) / (rect.height * 0.72), -1, 1);
      const distance = Math.sqrt(horizontal * horizontal + vertical * vertical);
      const attention = clamp(1 - distance * 0.72, 0, 1);

      targetRef.current = {
        x: horizontal * 4.8,
        y: vertical * 3.4,
        headX: horizontal * 1.5,
        headY: vertical * 0.8,
        rotate: horizontal * 1.15,
        attention,
      };
      requestPaint();
    };

    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        pet.classList.toggle("is-offscreen", !entry.isIntersecting);
        if (!entry.isIntersecting) {
          if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
          frameRef.current = null;
        }
      },
      { threshold: 0.05 },
    );

    observer?.observe(pet);
    contact.addEventListener("pointermove", handlePointerMove, { passive: true });
    contact.addEventListener("pointerleave", resetTarget, { passive: true });

    return () => {
      observer?.disconnect();
      contact.removeEventListener("pointermove", handlePointerMove);
      contact.removeEventListener("pointerleave", resetTarget);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div ref={petRef} className="pet-easter-egg" data-testid="interactive-cat" style={{
      "--pet-gaze-x": "0px",
      "--pet-gaze-y": "0px",
      "--pet-head-x": "0px",
      "--pet-head-y": "0px",
      "--pet-head-rotate": "0deg",
      "--pet-attention": "0",
      "--pet-face-scale": "1",
    } as CSSProperties}>
      <button className="pet-button" type="button" aria-label="Interactive paper cat">
        <svg className="pet-cat-art" viewBox="0 0 240 152" role="img" aria-label="A calm black paper-cut cat">
          <g className="pet-tail" aria-hidden="true">
            <path d="M66 111C42 124 23 113 31 96C36 86 48 82 61 88" fill="none" stroke="#15171d" strokeWidth="15" strokeLinecap="round" />
            <path d="M35 99C39 91 47 88 54 89" fill="none" stroke="#2b2e36" strokeWidth="2" strokeLinecap="round" opacity=".65" />
          </g>
          <g className="pet-body">
            <path d="M47 108C47 88 64 77 91 76C119 73 167 77 190 95C206 107 201 123 181 127H70C54 127 46 121 47 108Z" fill="#15171d" stroke="#0d1118" strokeWidth="2" />
            <path d="M73 108C85 101 105 99 132 101C154 103 174 110 181 120H70C65 118 66 113 73 108Z" fill="#20232b" opacity=".8" />
            <path d="M74 118C82 111 91 110 101 114C105 116 106 121 103 126H76C72 124 71 121 74 118Z" fill="#111319" />
            <path d="M146 115C157 109 171 112 178 120C180 122 179 125 176 127H148C144 124 143 118 146 115Z" fill="#111319" />
          </g>
          <g className="pet-head">
            <path d="M91 54L87 27L111 44L116 58Z" fill="#15171d" stroke="#0d1118" strokeWidth="2" />
            <path d="M143 46L170 25L165 61L150 59Z" fill="#15171d" stroke="#0d1118" strokeWidth="2" />
            <path d="M94 47L92 35L106 46Z" fill="#a3a16a" opacity=".62" />
            <path d="M153 47L166 35L162 53Z" fill="#a3a16a" opacity=".62" />
            <path d="M81 64C82 45 99 35 124 35C153 35 171 47 172 67C174 90 156 102 126 102C97 102 80 89 81 64Z" fill="#171920" stroke="#0d1118" strokeWidth="2" />
            <path d="M89 78C98 91 113 96 128 96C146 96 161 90 166 78C160 94 143 101 125 101C107 101 94 94 89 78Z" fill="#242832" opacity=".72" />
            <g className="pet-face">
              <ellipse cx="106" cy="62" rx="14" ry="12" fill="#d7c95d" stroke="#b0a845" strokeWidth="1.5" />
              <ellipse cx="145" cy="62" rx="14" ry="12" fill="#d7c95d" stroke="#b0a845" strokeWidth="1.5" />
              <ellipse cx="106" cy="62" rx="9.5" ry="9" fill="#6f8e55" />
              <ellipse cx="145" cy="62" rx="9.5" ry="9" fill="#6f8e55" />
              <g className="pet-pupil-drift">
                <g className="pet-pupils">
                  <ellipse cx="106" cy="62" rx="3.2" ry="7.2" fill="#101318" />
                  <ellipse cx="145" cy="62" rx="3.2" ry="7.2" fill="#101318" />
                  <circle cx="104.5" cy="58.5" r="1.5" fill="#f5f2d0" opacity=".8" />
                  <circle cx="143.5" cy="58.5" r="1.5" fill="#f5f2d0" opacity=".8" />
                </g>
              </g>
              <g className="pet-lids" aria-hidden="true">
                <ellipse cx="106" cy="62" rx="15" ry="13" fill="#171920" />
                <ellipse cx="145" cy="62" rx="15" ry="13" fill="#171920" />
              </g>
              <path d="M122 73Q126 76 130 73" fill="none" stroke="#b8a9a8" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M124 74L126 77L128 74" fill="#b8a9a8" />
              <path d="M91 73L72 69M91 78L70 80M160 73L179 69M160 78L181 80" stroke="#737681" strokeWidth="1.2" strokeLinecap="round" opacity=".75" />
            </g>
          </g>
        </svg>
      </button>
      <span className="pet-baseline" aria-hidden="true" />
    </div>
  );
}
