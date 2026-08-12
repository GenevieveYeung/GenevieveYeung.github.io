"use client";

import { GraduationCap, Trophy, X } from "lucide-react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useId, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

type CredentialViewerProps = {
  title: string;
  subtitle: string;
  image: string;
  alt: string;
  triggerLabel: string;
  icon: "degree" | "award";
  imageWidth?: number;
  imageHeight?: number;
};

export default function CredentialViewer({ title, subtitle, image, alt, triggerLabel, icon, imageWidth = 1600, imageHeight = 1131 }: CredentialViewerProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const { copy } = useLanguage();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const triggerElement = triggerRef.current;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(document.querySelectorAll<HTMLElement>(
        ".credential-lightbox button:not([disabled]), .credential-lightbox [href], .credential-lightbox [tabindex]:not([tabindex='-1'])",
      ));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      window.setTimeout(() => triggerElement?.focus(), 0);
    };
  }, [open]);

  const modal = open ? (
    <div className="credential-lightbox" role="presentation" onClick={event => event.target === event.currentTarget && setOpen(false)}>
      <div className="credential-lightbox__dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="credential-lightbox__header">
          <div>
            <span className="credential-lightbox__kicker">{copy.academic.supportingDocument}</span>
            <h2 id={titleId}>{title}</h2>
            <p>{subtitle}</p>
          </div>
          <button ref={closeRef} className="credential-lightbox__close" type="button" aria-label={copy.academic.closeCredential} onClick={() => setOpen(false)}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="credential-lightbox__document">
          <Image src={image} alt={alt} width={imageWidth} height={imageHeight} sizes="(max-width: 650px) 100vw, 1100px" />
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button ref={triggerRef} className="credential-trigger" type="button" onClick={() => setOpen(true)}>
        <span aria-hidden="true">{icon === "degree" ? <GraduationCap size={14} /> : <Trophy size={14} />}</span>
        {triggerLabel}
      </button>
      {typeof document !== "undefined" && modal ? createPortal(modal, document.body) : null}
    </>
  );
}
