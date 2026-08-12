"use client";

import { LayoutGroup } from "motion/react";
import { useState } from "react";
import { otherExperience, professionalExperience, researchDataExperience } from "@/data/portfolio";
import ExperienceIndexShell from "@/components/ExperienceIndexShell";
import PortfolioIcon from "@/components/PortfolioIcon";
import WorkChronologyGutter from "@/components/WorkChronologyGutter";

type WorkItem = { period: string; role: string; org: string; tag?: string; featured?: boolean; bullets: string[] };
const workItems: WorkItem[] = [
  professionalExperience[0],
  researchDataExperience[0],
  researchDataExperience[1],
  otherExperience[0],
  researchDataExperience[2],
  otherExperience[1],
];

const workIconSources = [
  "/icons/portfolio/hkmc-automation.png",
  "/icons/portfolio/polyu-biomechanics-research.png",
  "/icons/portfolio/polyu-medical-image-annotator.png",
  "/icons/portfolio/claire-biomechanics-rd.png",
  "/icons/portfolio/clinical-data-collection.png",
  "/icons/portfolio/hsb-biomedical-data.png",
];

function WorkIcon({ index }: { index: number }) {
  return <PortfolioIcon src={workIconSources[index]} />;
}

export default function WorkExperienceAccordion() {
  const [activeExperienceId, setActiveExperienceId] = useState<string | null>(null);
  return <LayoutGroup id="experience-focus"><div className="work-accordion"><WorkChronologyGutter /><div className="work-chronology-list">{workItems.map((item, index) => { const key = `${item.org}-${item.role}`; const isOpen = activeExperienceId === key; const isQuiet = activeExperienceId !== null && !isOpen; return <ExperienceIndexShell key={key} id={key} kind="work" number={String(index + 1).padStart(2, "0")} icon={<WorkIcon index={index} />} period={item.period} title={item.role} supporting={item.org} open={isOpen} quiet={isQuiet} detailId={`work-detail-${index}`} onToggle={() => setActiveExperienceId(isOpen ? null : key)}><div className="work-dossier"><aside className="work-detail-rail"><span>{item.tag || "Professional practice"}</span><i aria-hidden="true" /></aside><div className="work-details__content"><ul className="work-responsibilities">{item.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul></div></div></ExperienceIndexShell>; })}</div></div></LayoutGroup>;
}
