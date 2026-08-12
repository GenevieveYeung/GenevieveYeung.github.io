"use client";

import Image from "next/image";
import Link from "next/link";
import { BriefcaseBusiness, GraduationCap, Linkedin } from "lucide-react";
import AcademicJourneyMotion from "@/components/AcademicJourneyMotion";
import CopyEmailButton from "@/components/CopyEmailButton";
import CopyPhoneButton from "@/components/CopyPhoneButton";
import CredentialViewer from "@/components/CredentialViewer";
import HeroMountainReveal from "@/components/HeroMountainReveal";
import HeroSkillField from "@/components/HeroSkillField";
import LanguageProvider, { useLanguage } from "@/components/LanguageProvider";
import PetEasterEgg from "@/components/PetEasterEgg";
import PhotographyJournal from "@/components/PhotographyJournal";
import ProjectExperienceAccordion from "@/components/ProjectExperienceAccordion";
import ResponsiveNav from "@/components/ResponsiveNav";
import SectionDeck, { SectionDeckObserver, SectionDeckShell } from "@/components/SectionDeck";
import SelectedReading from "@/components/SelectedReading";
import WorkExperienceAccordion from "@/components/WorkExperienceAccordion";
import { links, projectLibrary } from "@/data/portfolio";

const projectCovers: Record<string, string> = {
  "vgrf-koa-prediction": "/project-media/vgrf-koa-prediction/cover.png",
  medisim: "/project-media/medisim/cover.jpg",
  "fall-detection-system": "/project-media/fall-detection-system/cover.png",
  emopet: "/project-media/emopet/cover.jpg",
  parkincare: "/project-media/parkincare/cover.png",
  "colon-gland-segmentation": "/project-media/colon-gland-segmentation/cover.png",
};

function ExternalLinkItem({ href, label, children, testId }: { href?: string; label: string; children: React.ReactNode; testId?: string }) {
  if (!href) return null;
  return <a className="external-link" href={href} target="_blank" rel="noopener noreferrer" aria-label={label} data-testid={testId}>{children}</a>;
}

export default function Home() {
  const { copy } = useLanguage();
  const projectMedia = Object.fromEntries(projectLibrary.map(project => [project.slug, projectCovers[project.slug] || null]));
  return <main>
    <ResponsiveNav />
    <SectionDeckObserver />

    <section className="personal-hero section-wrap" id="top" data-testid="hero">
      <HeroMountainReveal />
      <div className="hero-personal-copy">
        <div className="eyebrow eyebrow--friendly">{copy.hero.greeting} <span className="eyebrow-dot" /></div>
        <h1>{copy.hero.heading}</h1>
        <div className="hero-location-line">{copy.hero.location} <em>Hong Kong.</em></div>
        <p className="hero-lede">{copy.hero.lede}</p>
        <div className="hero-actions"><a className="button button--primary" href="#work">{copy.hero.work}</a><CopyEmailButton label={copy.hero.email} /></div>
        <div className="hero-facts">
          <div className="hero-fact hero-fact--profile"><span>{copy.hero.profile}</span></div>
          <div className="hero-fact hero-fact--education"><GraduationCap size={15} aria-hidden="true" /><div className="hero-education-copy"><strong>{copy.hero.degree}</strong><span><small>{copy.hero.major}</small><b><span aria-hidden="true">→ </span>{copy.hero.masters}</b></span></div></div>
        </div>
      </div>
      <div className="hero-photo-wrap"><HeroSkillField /><div className="photo-frame" data-testid="hero-portrait"><Image src="/images/genevieve-hero.jpg" alt={`${copy.hero.greeting} in a Hong Kong travel setting`} fill priority sizes="(max-width: 800px) 100vw, 46vw" /></div><div className="photo-caption">{copy.hero.caption}</div></div>
    </section>

    <SectionDeck><SectionDeckShell index={0} name="work"><section className="main-content-section section-wrap" id="work" data-testid="work-section"><div className="main-section-heading"><div className="eyebrow">{copy.work.eyebrow}</div><h2>{copy.work.title}</h2><p>{copy.work.intro}</p></div><WorkExperienceAccordion /></section></SectionDeckShell>
    <SectionDeckShell index={1} name="projects"><section className="main-content-section section-wrap" id="projects" data-testid="projects-section"><div className="main-section-heading"><div className="eyebrow">{copy.projects.eyebrow}</div><h2>{copy.projects.title}</h2><p>{copy.projects.intro}</p></div><ProjectExperienceAccordion media={projectMedia} /></section></SectionDeckShell>
    <SectionDeckShell index={2} name="education">
      <AcademicJourneyMotion id="education" data-testid="education-section" aria-labelledby="academic-journey-heading">
        <div className="academic-path-grid"><article className="academic-path-card academic-path-card--polyu"><div className="academic-path-card-head"><div className="academic-path-index">01</div><div className="academic-path-logo-wrap"><img className="academic-path-logo academic-path-logo--polyu" src="/brand/polyu-logo-transparent.png" alt="PolyU logo" /></div><div className="academic-path-copy"><span className="academic-period">{copy.academic.periodPolyu}</span><h3>{copy.academic.polyu}</h3><p className="academic-degree">{copy.academic.polyuDegree}</p><p className="academic-secondary">{copy.academic.majorLabel}<br /><strong>{copy.academic.major}</strong></p><div className="academic-credential-line"><GraduationCap size={16} aria-hidden="true" /><strong>{copy.academic.honours}</strong><span>·</span><span>{copy.academic.gpa}</span></div></div></div><CredentialViewer icon="degree" title="POLYU DEGREE CREDENTIAL" subtitle={`${copy.academic.polyuDegree} · ${copy.academic.major} · ${copy.academic.honours}`} image="/credentials/polyu-degree-certificate.png" alt="PolyU degree certificate" triggerLabel={copy.academic.degreeCredential} /></article><div className="academic-path-connector" aria-hidden="true"><span>→</span></div><article className="academic-path-card academic-path-card--hkust"><div className="academic-path-card-head"><div className="academic-path-index">02</div><div className="academic-path-logo-wrap"><img className="academic-path-logo academic-path-logo--hkust" src="/brand/hkust-logo-transparent.png" alt="HKUST logo" /></div><div className="academic-path-copy"><span className="academic-period">{copy.academic.periodHkust}</span><h3>{copy.academic.hkust}</h3><p className="academic-degree">{copy.academic.masters}</p></div></div></article></div>
        <div className="academic-highlights-compact"><div className="academic-highlights-compact-heading"><div><span className="academic-label">{copy.academic.undergraduate}</span><span className="academic-highlights-context">{copy.academic.context}</span></div><span className="academic-highlights-rule" /></div><div className="academic-highlights-grid"><div className="academic-highlight-compact"><div className="academic-highlight-compact-icon">✦</div><div><span className="academic-label">{copy.academic.recognition}</span><h4>{copy.academic.deans}</h4><p>{copy.academic.deansPeriod}</p></div></div><div className="academic-highlight-compact"><div className="academic-highlight-compact-icon">↗</div><div><span className="academic-label">{copy.academic.research}</span><h4>WCSST 2025</h4></div></div><div className="academic-highlight-compact"><div className="academic-highlight-compact-icon">⌁</div><div><span className="academic-label">{copy.academic.brain}</span><h4>{copy.academic.prize}</h4></div></div><div className="academic-highlight-compact"><div className="academic-highlight-compact-icon">★</div><div><span className="academic-label">{copy.academic.parkin}</span><h4>{copy.academic.award}</h4></div></div></div></div>
      </AcademicJourneyMotion>
    </SectionDeckShell>
    <div className="section-deck-interlude"><SelectedReading /></div>
    <SectionDeckShell index={3} name="beyond-work"><PhotographyJournal /></SectionDeckShell>
    <SectionDeckShell index={4} name="contact"><section className="cta-section" id="contact" data-testid="contact-section"><div className="section-wrap cta-inner"><div className="eyebrow">{copy.contact.eyebrow}</div><h2>{copy.contact.title}</h2><p>{copy.contact.intro}</p><div className="cta-actions"><CopyEmailButton label={copy.contact.email} dataTestId="contact-email" /><CopyPhoneButton label={copy.contact.phone} dataTestId="contact-phone" /><ExternalLinkItem href={links.linkedin} label={copy.contact.linkedin} testId="contact-linkedin"><span><Linkedin size={15} /> {copy.contact.linkedin}</span></ExternalLinkItem><ExternalLinkItem href={links.jobsdb} label={copy.contact.jobsdb} testId="contact-jobsdb"><span><BriefcaseBusiness size={15} /> {copy.contact.jobsdb}</span></ExternalLinkItem></div><PetEasterEgg /></div></section><footer className="footer section-wrap"><span>© 2026 Genevieve Yeung</span><span>{copy.contact.footer}</span><Link href="#top">{copy.contact.back}</Link></footer></SectionDeckShell></SectionDeck>
  </main>;
}
