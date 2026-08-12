"use client";

import ContactCtaButton from "@/components/ContactCtaButton";

export default function CopyPhoneButton({ compact = false, dataTestId, label }: { compact?: boolean; dataTestId?: string; label?: string }) {
  return <ContactCtaButton kind="phone" label={label ?? "Call me"} compact={compact} dataTestId={dataTestId} />;
}
