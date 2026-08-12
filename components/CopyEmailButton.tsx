"use client";

import ContactCtaButton from "@/components/ContactCtaButton";

export default function CopyEmailButton({ compact = false, dataTestId }: { compact?: boolean; dataTestId?: string }) {
  return <ContactCtaButton kind="email" label={compact ? "Copy email" : "Email me"} compact={compact} dataTestId={dataTestId} />;
}
