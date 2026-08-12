"use client";

import type { HTMLAttributes } from "react";
import { useEffect, useRef, useState } from "react";
import { Award, Brain, FileText, GraduationCap, Trophy } from "lucide-react";
import Image from "next/image";
import CredentialViewer from "@/components/CredentialViewer";

type AcademicJourneyMotionProps = HTMLAttributes<HTMLElement>;
type MilestoneKey = "deans" | "wcsst" | "brain" | "parkin";

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smoothStep = (value: number) => {
  const normalized = clamp(value);
  return normalized * normalized * (3 - 2 * normalized);
};

const yearSequence = [
  { year: "2022", center: 0.06, hold: 0.095 },
  { year: "2023", center: 0.22, hold: 0.06 },
  { year: "2024", center: 0.39, hold: 0.065 },
  { year: "2025", center: 0.56, hold: 0.065 },
  { year: "2026", center: 0.74, hold: 0.085 },
  { year: "2027", center: 0.93, hold: 0.10 },
] as const;

const yearWeight = (progress: number, center: number, hold: number) => {
  const holdStart = center - hold / 2;
  const holdEnd = center + hold / 2;
  const enterStart = center - 0.12;
  const exitEnd = center + 0.12;

  if (progress <= enterStart || progress >= exitEnd) return 0;
  if (progress < holdStart) return smoothStep((progress - enterStart) / (holdStart - enterStart));
  if (progress <= holdEnd) return 1;
  return 1 - smoothStep((progress - holdEnd) / (exitEnd - holdEnd));
};

export default function AcademicJourneyMotion({ id, ...props }: AcademicJourneyMotionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const [activeMilestone, setActiveMilestone] = useState<MilestoneKey | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    if (!section || !sticky) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let pointerFrame = 0;
    let nearViewport = false;

    const setVariable = (name: string, value: number) => section.style.setProperty(name, value.toFixed(3));

    const updateProgress = () => {
      const rect = section.getBoundingClientRect();
      const topOffset = window.matchMedia("(max-width: 700px)").matches ? 76 : 76;
      const sectionTop = rect.top + window.scrollY;
      const stickyHeight = sticky.getBoundingClientRect().height;
      const start = sectionTop - topOffset;
      const end = sectionTop + section.offsetHeight - stickyHeight - topOffset;
      const progress = clamp((window.scrollY - start) / Math.max(1, end - start));
      const bridge = smoothStep((progress - 0.10) / 0.48);
      const specialization = smoothStep((progress - 0.54) / 0.40);
      const milestone = smoothStep((progress - 0.12) / 0.76);

      setVariable("--journey-progress", progress);
      setVariable("--journey-bridge", bridge);
      setVariable("--journey-specialization", specialization);
      setVariable("--journey-milestone", milestone);

      yearSequence.forEach(({ year, center, hold }) => {
        setVariable(`--year-${year}`, yearWeight(progress, center, hold));
        setVariable(`--year-${year}-shift`, (center - progress) * 72);
      });

      const phase = progress < 0.26 ? "foundation" : progress < 0.58 ? "bridge" : progress < 0.84 ? "specialization" : "settled";
      section.dataset.journeyPhase = phase;
    };

    const scheduleProgress = () => {
      if (!nearViewport || frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateProgress();
      });
    };

    const updatePointer = (event: PointerEvent) => {
      if (window.matchMedia("(max-width: 900px)").matches || reducedMotion.matches || pointerFrame) return;
      pointerFrame = window.requestAnimationFrame(() => {
        pointerFrame = 0;
        const rect = section.getBoundingClientRect();
        setVariable("--journey-pointer-x", clamp((event.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5));
        setVariable("--journey-pointer-y", clamp((event.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5));
      });
    };

    const resetPointer = () => {
      setVariable("--journey-pointer-x", 0);
      setVariable("--journey-pointer-y", 0);
    };

    section.dataset.journeyReady = "true";
    section.dataset.journeyVisible = "false";
    section.dataset.journeyPhase = "foundation";

    if (reducedMotion.matches) {
      section.dataset.journeyReady = "false";
      section.dataset.journeyVisible = "true";
      section.dataset.journeyPhase = "settled";
      return () => undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        nearViewport = entry.isIntersecting;
        section.dataset.journeyVisible = entry.isIntersecting ? "true" : "false";
        if (entry.isIntersecting) updateProgress();
      },
      { threshold: 0, rootMargin: "-16% 0px -16%" },
    );

    observer.observe(section);
    nearViewport = true;
    updateProgress();
    window.addEventListener("scroll", scheduleProgress, { passive: true });
    window.addEventListener("resize", scheduleProgress);
    section.addEventListener("pointermove", updatePointer);
    section.addEventListener("pointerleave", resetPointer);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", scheduleProgress);
      window.removeEventListener("resize", scheduleProgress);
      section.removeEventListener("pointermove", updatePointer);
      section.removeEventListener("pointerleave", resetPointer);
      if (frame) window.cancelAnimationFrame(frame);
      if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
    };
  }, []);

  const focusMilestone = (key: MilestoneKey) => setActiveMilestone(key);
  const clearMilestone = () => setActiveMilestone(null);

  return (
    <section
      ref={sectionRef}
      id={id}
      className="academic-journey-section section-wrap"
      data-testid="education-section"
      {...props}
      data-journey-ready="false"
      data-journey-visible="false"
      data-journey-phase="foundation"
      data-active-milestone={activeMilestone ?? ""}
    >
      <div ref={stickyRef} className="academic-journey-sticky">
        <div className="academic-journey-heading">
          <div className="eyebrow">ACADEMIC JOURNEY</div>
          <h2 id="academic-journey-heading">The academic foundation behind my work.</h2>
          <p className="academic-journey-cue">Scroll to trace the journey <span aria-hidden="true">↓</span></p>
        </div>

        <div className="academic-journey-scene">
          <div className="academic-journey-years" aria-hidden="true">
            {yearSequence.map(({ year }) => (
              <span key={year} className={`academic-journey-year academic-journey-year--${year}`}>{year}</span>
            ))}
          </div>

          <svg className="academic-journey-trajectory" viewBox="0 0 1000 360" preserveAspectRatio="none" aria-hidden="true">
            <path className="academic-journey-trajectory-track" pathLength="100" d="M 72 254 C 205 252, 270 318, 394 306 S 560 204, 682 218 S 824 282, 930 238" />
            <path className="academic-journey-trajectory-progress" pathLength="100" d="M 72 254 C 205 252, 270 318, 394 306 S 560 204, 682 218 S 824 282, 930 238" />
            <circle className="academic-journey-trajectory-dot academic-journey-trajectory-dot--deans" cx="178" cy="264" r="4" />
            <circle className="academic-journey-trajectory-dot academic-journey-trajectory-dot--wcsst" cx="351" cy="311" r="4" />
            <circle className="academic-journey-trajectory-dot academic-journey-trajectory-dot--brain" cx="620" cy="226" r="4" />
            <circle className="academic-journey-trajectory-dot academic-journey-trajectory-dot--parkin" cx="844" cy="272" r="4" />
          </svg>

          <div className="academic-journey-foreground academic-journey-foreground--foundation">
            <div className="academic-journey-school-meta">
              <Image src="/brand/polyu-logo-transparent.png" alt="The Hong Kong Polytechnic University logo" width={132} height={40} />
              <div><strong>POLYU</strong><span>Aug 2022 – Jun 2026</span></div>
            </div>
            <div className="academic-journey-discipline">BSc Biomedical Engineering</div>
            <div className="academic-journey-university">The Hong Kong Polytechnic University</div>
            <div className="academic-journey-achievement"><GraduationCap size={16} aria-hidden="true" /><strong>First Class Honours</strong><span>·</span><span>GPA 3.67 / 4.30</span></div>
            <CredentialViewer
              icon="degree"
              title="POLYU DEGREE CREDENTIAL"
              subtitle="BSc Biomedical Engineering · Secondary Major in Artificial Intelligence & Data Analytics · First Class Honours"
              image="/credentials/polyu-degree-certificate.png"
              alt="PolyU degree certificate for Yeung Siu Kwun"
              triggerLabel="View degree credential"
            />
          </div>

          <div className="academic-journey-bridge-zone" aria-label="Secondary Major in Artificial Intelligence and Data Analytics">
            <span>THE BRIDGE · SECONDARY MAJOR IN</span>
            <strong>Artificial Intelligence &amp; Data Analytics</strong>
          </div>

          <div className="academic-journey-foreground academic-journey-foreground--specialization">
            <div className="academic-journey-school-meta">
              <Image src="/brand/hkust-logo-transparent.png" alt="The Hong Kong University of Science and Technology logo" width={132} height={40} />
              <div><strong>HKUST</strong><span>Sep 2026 – Expected 2027</span></div>
            </div>
            <div className="academic-journey-discipline academic-journey-discipline--ai">MSc Artificial Intelligence</div>
            <div className="academic-journey-university">The Hong Kong University of Science and Technology</div>
          </div>

          <div className="academic-journey-milestones" aria-label="Undergraduate milestones">
            <div className="academic-journey-milestone academic-journey-milestone--deans" tabIndex={0} role="group" onPointerEnter={() => focusMilestone("deans")} onPointerLeave={clearMilestone} onFocus={() => focusMilestone("deans")} onBlur={clearMilestone}>
              <Award size={14} aria-hidden="true" /><span>ACADEMIC RECOGNITION</span><strong>Dean’s List</strong><small>2023–24 · 2024–25</small>
            </div>
            <div className="academic-journey-milestone academic-journey-milestone--wcsst" tabIndex={0} role="group" onPointerEnter={() => focusMilestone("wcsst")} onPointerLeave={clearMilestone} onFocus={() => focusMilestone("wcsst")} onBlur={clearMilestone}>
              <FileText size={14} aria-hidden="true" /><span>FIRST-AUTHOR RESEARCH</span><strong>WCSST 2025</strong><small>First-author Research</small>
            </div>
            <div className="academic-journey-milestone academic-journey-milestone--brain" tabIndex={0} role="group" onPointerEnter={() => focusMilestone("brain")} onPointerLeave={clearMilestone} onFocus={() => focusMilestone("brain")} onBlur={clearMilestone}>
              <Brain size={14} aria-hidden="true" /><span>BRAIN SCIENCE RESEARCH</span><strong>Third Prize · English Group</strong>
              <CredentialViewer
                icon="award"
                title="BRAIN SCIENCE RESEARCH"
                subtitle="Third Prize · English Group"
                image="/credentials/brain-science-award.jpeg"
                imageWidth={1179}
                imageHeight={798}
                alt="Certificate for Third Prize in the English Group at the Guangdong-Hong Kong-Macao Greater Bay Area Brain Science Forum"
                triggerLabel="View award certificate"
              />
            </div>
            <div className="academic-journey-milestone academic-journey-milestone--parkin" tabIndex={0} role="group" onPointerEnter={() => focusMilestone("parkin")} onPointerLeave={clearMilestone} onFocus={() => focusMilestone("parkin")} onBlur={clearMilestone}>
              <Trophy size={14} aria-hidden="true" /><span>PARKINCARE</span><strong>Best Engineered Product Award</strong>
              <CredentialViewer
                icon="award"
                title="BEST ENGINEERED PRODUCT AWARD"
                subtitle="ParkinCare · Service-learning Project Exhibition · 16 April 2025"
                image="/credentials/parkincare-best-engineered-product-award.png"
                alt="Best Engineered Product Award certificate for the ParkinCare Parkinson Detection Game"
                triggerLabel="View award certificate"
              />
            </div>
          </div>
        </div>

        <div className="academic-journey-final-highlights">
          <div className="academic-journey-final-heading"><span>UNDERGRADUATE HIGHLIGHTS</span><small>POLYU · 2022–2026</small><i /></div>
          <div className="academic-journey-final-grid">
            <div className="academic-journey-final-item"><Award size={16} aria-hidden="true" /><div><span>ACADEMIC RECOGNITION</span><strong>Dean’s List</strong><small>2023–24 · 2024–25</small></div></div>
            <div className="academic-journey-final-item"><FileText size={16} aria-hidden="true" /><div><span>FIRST-AUTHOR RESEARCH</span><strong>WCSST 2025</strong></div></div>
            <div className="academic-journey-final-item"><Brain size={16} aria-hidden="true" /><div><span>BRAIN SCIENCE RESEARCH</span><strong>Third Prize · English Group</strong></div></div>
            <div className="academic-journey-final-item"><Trophy size={16} aria-hidden="true" /><div><span>PARKINCARE</span><strong>Best Engineered Product Award</strong></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
