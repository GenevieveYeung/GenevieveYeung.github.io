"use client";

import type { HTMLAttributes } from "react";
import { useEffect, useRef, useState } from "react";
import { Award, Brain, FileText, GraduationCap, Trophy } from "lucide-react";
import Image from "next/image";
import CredentialViewer from "@/components/CredentialViewer";
import { useLanguage } from "@/components/LanguageProvider";

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

const milestoneWeight = (progress: number, center: number) => {
  const enter = smoothStep((progress - (center - 0.11)) / 0.11);
  const exit = smoothStep((progress - (center + 0.13)) / 0.11);
  return clamp(enter - exit);
};

export default function AcademicJourneyMotion({ id, ...props }: AcademicJourneyMotionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const activeYearRef = useRef<HTMLSpanElement | null>(null);
  const [activeMilestone, setActiveMilestone] = useState<MilestoneKey | null>(null);
  const { copy, locale } = useLanguage();
  const academicMajorLabel = locale === "zh-CN" ? "第二专业" : locale === "zh-HK" ? "第二專業" : copy.academic.majorLabel;

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
      const compact = window.matchMedia("(max-width: 900px)").matches;
      const topOffset = 76;
      const sectionTop = rect.top + window.scrollY;
      const stickyHeight = sticky.getBoundingClientRect().height;
      const start = compact ? sectionTop - window.innerHeight * 0.72 : sectionTop - topOffset;
      const end = compact
        ? sectionTop + section.offsetHeight - window.innerHeight * 0.22
        : sectionTop + section.offsetHeight - stickyHeight - topOffset;
      const progress = clamp((window.scrollY - start) / Math.max(1, end - start));
      const bridge = smoothStep((progress - 0.10) / 0.48);
      const specialization = smoothStep((progress - 0.54) / 0.40);
      const milestone = smoothStep((progress - 0.12) / 0.76);

      setVariable("--journey-progress", progress);
      setVariable("--journey-bridge", bridge);
      setVariable("--journey-specialization", specialization);
      setVariable("--journey-milestone", milestone);
      setVariable("--milestone-deans", milestoneWeight(progress, 0.30));
      setVariable("--milestone-wcsst", milestoneWeight(progress, 0.43));
      setVariable("--milestone-brain", milestoneWeight(progress, 0.55));
      setVariable("--milestone-parkin", milestoneWeight(progress, 0.65));

      yearSequence.forEach(({ year, center, hold }) => {
        setVariable(`--year-${year}`, yearWeight(progress, center, hold));
        setVariable(`--year-${year}-shift`, (center - progress) * 72);
      });

      const activeYear = yearSequence.reduce((closest, item) => {
        const closestDistance = Math.abs(progress - closest.center);
        const itemDistance = Math.abs(progress - item.center);
        return itemDistance < closestDistance ? item : closest;
      }, yearSequence[0]);
      if (activeYearRef.current && activeYearRef.current.dataset.year !== activeYear.year) {
        activeYearRef.current.dataset.year = activeYear.year;
        activeYearRef.current.textContent = activeYear.year;
      }

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
        <div className="academic-journey-desktop-scene">
        <div className="academic-journey-heading">
          <div className="eyebrow">{copy.academic.eyebrow}</div>
          <h2 id="academic-journey-heading">{copy.academic.title}</h2>
          <p className="academic-journey-cue">{copy.academic.cue} <span aria-hidden="true">↓</span></p>
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

          <div className="academic-journey-polyu-block">
          <div className="academic-journey-foreground academic-journey-foreground--foundation">
            <div className="academic-journey-school-meta">
              <Image src="/brand/polyu-logo-transparent.png" alt="The Hong Kong Polytechnic University logo" width={132} height={40} />
              <div><strong>POLYU</strong><span>Aug 2022 – Jun 2026</span></div>
            </div>
              <div className="academic-journey-discipline">{copy.academic.polyuDegree}</div>
              <div className="academic-journey-secondary"><span>{academicMajorLabel}</span><strong>{copy.academic.major}</strong></div>
            <div className="academic-journey-university">{copy.academic.polyu}</div>
              <div className="academic-journey-achievement"><GraduationCap size={16} aria-hidden="true" /><strong>{copy.academic.honours}</strong><span>·</span><span>{copy.academic.gpa}</span></div>
            <CredentialViewer
              icon="degree"
              title="POLYU DEGREE CREDENTIAL"
              subtitle={`${copy.academic.polyuDegree} · ${copy.academic.major} · ${copy.academic.honours}`}
              image="/credentials/polyu-degree-certificate.png"
              alt="PolyU degree certificate for Yeung Siu Kwun"
              triggerLabel={copy.academic.degreeCredential}
            />
          </div>
          </div>

          <div className="academic-journey-foreground academic-journey-foreground--specialization">
            <div className="academic-journey-school-meta">
              <Image src="/brand/hkust-logo-transparent.png" alt="The Hong Kong University of Science and Technology logo" width={132} height={40} />
              <div><strong>HKUST</strong><span>{copy.academic.periodHkust}</span></div>
            </div>
            <div className="academic-journey-discipline academic-journey-discipline--ai">{copy.academic.masters}</div>
            <div className="academic-journey-university">{copy.academic.hkust}</div>
          </div>

          <div className="academic-journey-polyu-block academic-journey-polyu-block--milestones">
          <div className="academic-journey-milestones" aria-label="Undergraduate milestones associated with PolyU">
            <div className="academic-journey-milestone academic-journey-milestone--deans" tabIndex={0} role="group" onPointerEnter={() => focusMilestone("deans")} onPointerLeave={clearMilestone} onFocus={() => focusMilestone("deans")} onBlur={clearMilestone}>
              <Award size={14} aria-hidden="true" /><span>{copy.academic.recognition}</span><strong>{copy.academic.deans}</strong><small>{copy.academic.deansPeriod}</small>
            </div>
            <div className="academic-journey-milestone academic-journey-milestone--wcsst" tabIndex={0} role="group" onPointerEnter={() => focusMilestone("wcsst")} onPointerLeave={clearMilestone} onFocus={() => focusMilestone("wcsst")} onBlur={clearMilestone}>
              <FileText size={14} aria-hidden="true" /><span>{copy.academic.research}</span><strong>WCSST 2025</strong><small>{copy.academic.research}</small>
            </div>
            <div className="academic-journey-milestone academic-journey-milestone--brain" tabIndex={0} role="group" onPointerEnter={() => focusMilestone("brain")} onPointerLeave={clearMilestone} onFocus={() => focusMilestone("brain")} onBlur={clearMilestone}>
              <Brain size={14} aria-hidden="true" /><span>{copy.academic.brain}</span><strong>{copy.academic.prize}</strong>
              <CredentialViewer
                icon="award"
                title={copy.academic.brain}
                subtitle={copy.academic.prize}
                image="/credentials/brain-science-award.jpeg"
                imageWidth={1179}
                imageHeight={798}
                alt="Certificate for Third Prize in the English Group at the Guangdong-Hong Kong-Macao Greater Bay Area Brain Science Forum"
                triggerLabel={copy.academic.awardCredential}
              />
            </div>
            <div className="academic-journey-milestone academic-journey-milestone--parkin" tabIndex={0} role="group" onPointerEnter={() => focusMilestone("parkin")} onPointerLeave={clearMilestone} onFocus={() => focusMilestone("parkin")} onBlur={clearMilestone}>
              <Trophy size={14} aria-hidden="true" /><span>{copy.academic.parkin}</span><strong>{copy.academic.award}</strong>
              <CredentialViewer
                icon="award"
                title={copy.academic.award}
                subtitle="ParkinCare · Service-learning Project Exhibition · 16 April 2025"
                image="/credentials/parkincare-best-engineered-product-award.png"
                alt="Best Engineered Product Award certificate for the ParkinCare Parkinson Detection Game"
                triggerLabel={copy.academic.awardCredential}
              />
            </div>
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

        <div className="academic-journey-responsive-ui">
          <div className="academic-journey-responsive-heading">
            <div className="eyebrow">{copy.academic.eyebrow}</div>
            <h2>{copy.academic.title}</h2>
          </div>
          <div className="academic-vertical-journey" data-testid="academic-vertical-journey">
            <div className="academic-vertical-active-year" aria-hidden="true">
              <span ref={activeYearRef} data-testid="academic-active-year" data-year="2022">2022</span>
              <small>ACADEMIC<br />PROGRESSION</small>
            </div>
            <aside className="academic-vertical-year-rail" aria-label="Academic years">
              {yearSequence.map(({ year }) => <span key={year} className={`academic-vertical-year academic-vertical-year--${year}`}>{year}</span>)}
            </aside>
            <div className="academic-vertical-flow">
              <svg className="academic-vertical-curve" viewBox="0 0 120 1000" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <marker id="academic-vertical-curve-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M 0 0 L 6 3 L 0 6" fill="none" />
                  </marker>
                </defs>
                <path className="academic-vertical-curve-track" pathLength="100" d="M 60 250 C 86 310, 34 360, 62 430 S 91 540, 51 620 S 30 735, 68 820 S 91 950, 56 1050 S 78 1160, 60 1240" />
                <path className="academic-vertical-curve-progress" pathLength="100" markerEnd="url(#academic-vertical-curve-arrow)" d="M 60 250 C 86 310, 34 360, 62 430 S 91 540, 51 620 S 30 735, 68 820 S 91 950, 56 1050 S 78 1160, 60 1240" />
              </svg>
              <div className="academic-vertical-content">
              <article className="academic-vertical-stage academic-vertical-stage--polyu">
                <div className="academic-vertical-stage-kicker"><span>01</span><strong>POLYU</strong></div>
                <Image className="academic-vertical-logo academic-vertical-logo--polyu" src="/brand/polyu-logo-transparent.png" alt="The Hong Kong Polytechnic University logo" width={132} height={40} />
                <span className="academic-vertical-period">{copy.academic.periodPolyu}</span>
                <h3>{copy.academic.polyuDegree}</h3>
                <div className="academic-vertical-secondary"><span>{academicMajorLabel}</span><strong>{copy.academic.major}</strong></div>
                <div className="academic-vertical-honours"><GraduationCap size={15} aria-hidden="true" /><strong>{copy.academic.honours}</strong><span>·</span><span>{copy.academic.gpa}</span></div>
                <CredentialViewer
                  icon="degree"
                  title="POLYU DEGREE CREDENTIAL"
                  subtitle={`${copy.academic.polyuDegree} · ${copy.academic.major} · ${copy.academic.honours}`}
                  image="/credentials/polyu-degree-certificate.png"
                  alt="PolyU degree certificate for Yeung Siu Kwun"
                  triggerLabel={copy.academic.degreeCredential}
                />
              </article>

              <div className="academic-vertical-milestones" aria-label="Undergraduate milestones associated with PolyU">
                <div className="academic-vertical-milestones-heading"><span>{copy.academic.undergraduate}</span><small>{copy.academic.context}</small><i /></div>
                <article className="academic-vertical-milestone academic-vertical-milestone--deans academic-vertical-milestone--left" tabIndex={0} role="group" onPointerEnter={() => focusMilestone("deans")} onPointerLeave={clearMilestone} onFocus={() => focusMilestone("deans")} onBlur={clearMilestone}>
                  <Award size={14} aria-hidden="true" /><div><span>{copy.academic.recognition}</span><strong>{copy.academic.deans}</strong><small>{copy.academic.deansPeriod}</small></div>
                </article>
                <article className="academic-vertical-milestone academic-vertical-milestone--wcsst academic-vertical-milestone--right" tabIndex={0} role="group" onPointerEnter={() => focusMilestone("wcsst")} onPointerLeave={clearMilestone} onFocus={() => focusMilestone("wcsst")} onBlur={clearMilestone}>
                  <FileText size={14} aria-hidden="true" /><div><span>{copy.academic.research}</span><strong>WCSST 2025</strong><small>{copy.academic.research}</small></div>
                </article>
                <article className="academic-vertical-milestone academic-vertical-milestone--brain academic-vertical-milestone--left" tabIndex={0} role="group" onPointerEnter={() => focusMilestone("brain")} onPointerLeave={clearMilestone} onFocus={() => focusMilestone("brain")} onBlur={clearMilestone}>
                  <Brain size={14} aria-hidden="true" /><div><span>{copy.academic.brain}</span><strong>{copy.academic.prize}</strong><CredentialViewer icon="award" title={copy.academic.brain} subtitle={copy.academic.prize} image="/credentials/brain-science-award.jpeg" imageWidth={1179} imageHeight={798} alt="Certificate for Third Prize in the English Group at the Guangdong-Hong Kong-Macao Greater Bay Area Brain Science Forum" triggerLabel={copy.academic.awardCredential} /></div>
                </article>
                <article className="academic-vertical-milestone academic-vertical-milestone--parkin academic-vertical-milestone--right" tabIndex={0} role="group" onPointerEnter={() => focusMilestone("parkin")} onPointerLeave={clearMilestone} onFocus={() => focusMilestone("parkin")} onBlur={clearMilestone}>
                  <Trophy size={14} aria-hidden="true" /><div><span>{copy.academic.parkin}</span><strong>{copy.academic.award}</strong><CredentialViewer icon="award" title={copy.academic.award} subtitle="ParkinCare · Service-learning Project Exhibition · 16 April 2025" image="/credentials/parkincare-best-engineered-product-award.png" alt="Best Engineered Product Award certificate for the ParkinCare Parkinson Detection Game" triggerLabel={copy.academic.awardCredential} /></div>
                </article>
              </div>

              <article className="academic-vertical-stage academic-vertical-stage--hkust">
                <div className="academic-vertical-stage-kicker"><span>02</span><strong>HKUST</strong></div>
                <Image className="academic-vertical-logo academic-vertical-logo--hkust" src="/brand/hkust-logo-transparent.png" alt="The Hong Kong University of Science and Technology logo" width={132} height={40} />
                <span className="academic-vertical-period">{copy.academic.periodHkust}</span>
                <h3>{copy.academic.masters}</h3>
                <p className="academic-vertical-institution">{copy.academic.hkust}</p>
              </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
