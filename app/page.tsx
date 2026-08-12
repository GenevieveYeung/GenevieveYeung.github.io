/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import { Award, Brain, BriefcaseBusiness, ExternalLink, FileText, GraduationCap, Linkedin, Trophy } from "lucide-react";
import CopyContactButton from "@/components/CopyContactButton";
import CopyEmailButton from "@/components/CopyEmailButton";
import CopyPhoneButton from "@/components/CopyPhoneButton";
import CredentialViewer from "@/components/CredentialViewer";
import AcademicJourneyMotion from "@/components/AcademicJourneyMotion";
import HeroMountainReveal from "@/components/HeroMountainReveal";
import HeroSkillField from "@/components/HeroSkillField";
import ProjectExperienceAccordion from "@/components/ProjectExperienceAccordion";
import PetEasterEgg from "@/components/PetEasterEgg";
import PhotographyJournal from "@/components/PhotographyJournal";
import SelectedReading from "@/components/SelectedReading";
import SectionDeck, { SectionDeckObserver, SectionDeckShell } from "@/components/SectionDeck";
import WorkExperienceAccordion from "@/components/WorkExperienceAccordion";
import { links, projectLibrary } from "@/data/portfolio";
import { getProjectCover } from "@/src/lib/project-media";

function ExternalLinkItem({ href, label, children, testId }: { href?: string; label: string; children: React.ReactNode; testId?: string }) {
  if (!href) return null;
  return <a className="external-link" href={href} target="_blank" rel="noopener noreferrer" aria-label={label} data-testid={testId}>{children}</a>;
}

export default function Home() {
  const projectMedia = Object.fromEntries(projectLibrary.map(project => [project.slug, getProjectCover(project.slug)]));
  return <main>
    <nav className="nav-shell" aria-label="Main navigation" data-testid="site-nav"><Link href="#top" className="wordmark">Genevieve <span>Yeung</span></Link><div className="nav-links"><Link href="#work">Work Experience</Link><Link href="#projects">Project Experience</Link><Link href="#education">Education</Link><Link href="#beyond-work-journal">Beyond Work</Link><Link href="#contact">Contact</Link></div><div className="nav-contact"><CopyContactButton icon="phone" value="+852 6080 4041" copiedLabel="Phone copied" ariaLabel="Copy phone number" /><CopyContactButton icon="mail" value="genevieveyeung@gmail.com" copiedLabel="Email copied" ariaLabel="Copy email address" /><ExternalLinkItem href={links.linkedin} label="LinkedIn"><Linkedin size={16} /></ExternalLinkItem><ExternalLinkItem href={links.jobsdb} label="JobsDB"><BriefcaseBusiness size={16} /></ExternalLinkItem></div></nav>
    <SectionDeckObserver />

    <section className="personal-hero section-wrap" id="top" data-testid="hero"><HeroMountainReveal /><div className="hero-personal-copy"><div className="eyebrow eyebrow--friendly">Hi, I’m Genevieve <span className="eyebrow-dot" /></div><h1>AI engineer,<br />researcher <span>&amp;</span> curious builder.</h1><div className="hero-location-line">Based in <em>Hong Kong.</em></div><p className="hero-lede">I work across machine learning, biomedical AI, financial-data automation, and applied research to solve practical problems with care.</p><div className="hero-actions"><a className="button button--primary" href="#work">View my work</a><CopyEmailButton /></div><div className="hero-facts"><div className="hero-fact hero-fact--profile"><span>Canadian · Hong Kong since 2022 · English / Cantonese / Mandarin</span></div><div className="hero-fact hero-fact--education"><GraduationCap size={15} aria-hidden="true" /><div className="hero-education-copy"><strong>BSc Biomedical Engineering</strong><span><small>Secondary Major in Artificial Intelligence &amp; Data Analytics</small><b><span aria-hidden="true">→</span> MSc Artificial Intelligence</b></span></div></div></div></div><div className="hero-photo-wrap"><HeroSkillField /><div className="photo-frame" data-testid="hero-portrait"><Image src="/images/genevieve-hero.jpg" alt="Genevieve Yeung in a Hong Kong travel setting" fill priority sizes="(max-width: 800px) 100vw, 46vw" /></div><div className="photo-caption">Hong Kong / Canada · photography / city life</div></div></section>


    <SectionDeck><SectionDeckShell index={0} name="work"><section className="main-content-section section-wrap" id="work" data-testid="work-section"><div className="main-section-heading"><div className="eyebrow">01 / WORK EXPERIENCE</div><h2>Where technical work met a real operating context.</h2><p>Expandable entries keep the page calm while preserving the details: professional automation, research software, scientific data, and disciplined data collection.</p></div><WorkExperienceAccordion /></section></SectionDeckShell>

    <SectionDeckShell index={1} name="projects"><section className="main-content-section section-wrap" id="projects" data-testid="projects-section"><div className="main-section-heading"><div className="eyebrow">02 / PROJECT EXPERIENCE</div><h2>Technical projects, explored by capability.</h2><p>Filter across overlapping capabilities, then open a project for its overview, evidence, technical details, and supplied artwork.</p></div><ProjectExperienceAccordion media={projectMedia} /></section></SectionDeckShell>
    <SectionDeckShell index={2} name="education">

    <AcademicJourneyMotion id="education" data-testid="education-section" aria-labelledby="academic-journey-heading"><div className="academic-journey-heading"><div className="eyebrow">ACADEMIC JOURNEY</div><h2 id="academic-journey-heading">The academic foundation behind my work.</h2></div><div className="academic-path-grid"><article className="academic-path-card academic-path-card--polyu"><div className="academic-path-card-head"><div className="academic-path-index">01</div><div className="academic-path-logo-wrap"><img className="academic-path-logo academic-path-logo--polyu" src="/brand/polyu-logo-transparent.png" alt="The Hong Kong Polytechnic University logo" /></div><div className="academic-path-copy"><span className="academic-period">Aug 2022 – Jun 2026</span><h3>The Hong Kong Polytechnic University</h3><p className="academic-degree">BSc Biomedical Engineering</p><p className="academic-secondary">Secondary Major in<br /><strong>Artificial Intelligence &amp; Data Analytics</strong></p><div className="academic-credential-line"><GraduationCap size={16} aria-hidden="true" /><strong>First Class Honours</strong><span>·</span><span>GPA 3.67 / 4.30</span></div></div></div><CredentialViewer icon="degree" title="POLYU DEGREE CREDENTIAL" subtitle="BSc Biomedical Engineering · Secondary Major in Artificial Intelligence &amp; Data Analytics · First Class Honours" image="/credentials/polyu-degree-certificate.png" alt="PolyU degree certificate for Yeung Siu Kwun" triggerLabel="View degree credential" /></article><div className="academic-path-connector" aria-hidden="true"><span>→</span></div><article className="academic-path-card academic-path-card--hkust"><div className="academic-path-card-head"><div className="academic-path-index">02</div><div className="academic-path-logo-wrap"><img className="academic-path-logo academic-path-logo--hkust" src="/brand/hkust-logo-transparent.png" alt="The Hong Kong University of Science and Technology logo" /></div><div className="academic-path-copy"><span className="academic-period">Sep 2026 – Expected 2027</span><h3>The Hong Kong University of Science and Technology</h3><p className="academic-degree">MSc Artificial Intelligence</p></div></div></article></div><div className="academic-highlights-compact"><div className="academic-highlights-compact-heading"><div><span className="academic-label">UNDERGRADUATE HIGHLIGHTS</span><span className="academic-highlights-context">POLYU · 2022–2026</span></div><span className="academic-highlights-rule" /></div><div className="academic-highlights-grid"><div className="academic-highlight-compact"><div className="academic-highlight-compact-icon"><Award size={16} aria-hidden="true" /></div><div><span className="academic-label">ACADEMIC RECOGNITION</span><h4>Dean’s List</h4><p>2023–24 · 2024–25</p></div></div><div className="academic-highlight-compact"><div className="academic-highlight-compact-icon"><FileText size={16} aria-hidden="true" /></div><div><span className="academic-label">FIRST-AUTHOR RESEARCH</span><h4>WCSST 2025</h4></div></div><div className="academic-highlight-compact"><div className="academic-highlight-compact-icon"><Brain size={16} aria-hidden="true" /></div><div><span className="academic-label">BRAIN SCIENCE RESEARCH</span><h4>Third Prize · English Group</h4></div></div><div className="academic-highlight-compact"><div className="academic-highlight-compact-icon"><Trophy size={16} aria-hidden="true" /></div><div><span className="academic-label">PARKINCARE</span><h4>Best Engineered Product Award</h4></div></div></div></div></AcademicJourneyMotion>

    </SectionDeckShell>
    <div className="section-deck-interlude"><SelectedReading /></div>
    <SectionDeckShell index={3} name="beyond-work"><PhotographyJournal /></SectionDeckShell>
    <SectionDeckShell index={4} name="contact">


    <section className="cta-section" id="contact" data-testid="contact-section"><div className="section-wrap cta-inner"><div className="eyebrow">LET’S CONNECT</div><h2>Have a project, question, or conversation in mind?</h2><p>I’m always glad to hear from people working on interesting things in AI, data, research, and beyond.</p><div className="cta-actions"><CopyEmailButton dataTestId="contact-email" /><CopyPhoneButton dataTestId="contact-phone" /><ExternalLinkItem href={links.linkedin} label="Connect with Genevieve on LinkedIn" testId="contact-linkedin"><span><Linkedin size={15} /> LinkedIn</span></ExternalLinkItem><ExternalLinkItem href={links.jobsdb} label="View Genevieve on JobsDB" testId="contact-jobsdb"><span><BriefcaseBusiness size={15} /> JobsDB</span></ExternalLinkItem></div><PetEasterEgg /></div></section>
    <footer className="footer section-wrap"><span>© 2026 Genevieve Yeung</span><span>AI · data · research · Hong Kong</span><Link href="#top">Back to top ↑</Link></footer>
    </SectionDeckShell></SectionDeck>
   </main>;
}
