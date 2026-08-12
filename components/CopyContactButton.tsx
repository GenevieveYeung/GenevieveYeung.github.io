"use client";

import { Check, Mail, Phone } from "lucide-react";
import { useState } from "react";

type CopyContactButtonProps = {
  icon: "phone" | "mail";
  value: string;
  copiedLabel: string;
  ariaLabel: string;
};

export default function CopyContactButton({ icon: Icon, value, copiedLabel, ariaLabel }: CopyContactButtonProps) {
  const [copied, setCopied] = useState(false);
  const ContactIcon = Icon === "phone" ? Phone : Mail;

  async function copyContact() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const copiedWithFallback = document.execCommand("copy");
        textarea.remove();
        if (!copiedWithFallback) throw new Error("Copy command was rejected");
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button className="top-contact-copy" type="button" onClick={copyContact} aria-label={ariaLabel}>
      <span className="top-contact-copy__icon" aria-hidden="true">
        {copied ? <Check size={15} /> : <ContactIcon size={15} />}
      </span>
      <span>{copied ? copiedLabel : value}</span>
    </button>
  );
}
