/**
 * Per-market data-protection rights copy — Global Compliance & Expansion
 * Roadmap Phase 3 ("per-market consent-language localization... not just
 * translation, since lawful-basis wording differs NDPA-to-POPIA-to-DPA-2019").
 *
 * ⚠ DRAFT, NOT LEGAL ADVICE. This is good-faith copy based on the publicly
 * known text/structure of each named law (which regulator exists, which
 * rights it grants, what it's called) — it has NOT been reviewed by a
 * lawyer. Treat it as a strong starting draft, not certified-compliant
 * final text. Verify against the current text of each Act (laws amend)
 * before relying on this for an actual compliance claim.
 *
 * Scope decision: rather than three near-duplicate rewrites of the whole
 * consent banner/settings copy (which already builds to the strictest
 * common bar per §5 of the roadmap doc — opt-in by default, plain-language
 * purpose, withdrawable anytime — and shouldn't fork three ways just to
 * vary wording), the per-market piece that actually differs is WHICH
 * regulator and WHICH named rights apply. That's what lives here, surfaced
 * on the Privacy Policy screen (legal/privacy.tsx) keyed by the viewer's
 * selected country, plus a POPIA §26-specific note on the accessibility/
 * dietary consent screen (ticket/[id].tsx) for South African users, since
 * that data class is exactly what POPIA §26 restricts.
 */
import type { LegalSection } from "@/components/LegalDocument";

export interface JurisdictionRights {
  lawName: string;
  regulatorName: string;
  rightsBody: string;
}

const JURISDICTIONS: Record<string, JurisdictionRights> = {
  KE: {
    lawName: "Kenya's Data Protection Act, 2019",
    regulatorName: "the Office of the Data Protection Commissioner (ODPC)",
    rightsBody:
      "You have the right to access, correct, delete and receive a copy of your data, and to object to or restrict its processing. Consent must be voluntary, specific and informed, and you can withdraw it at any time. You can export a full copy of your data or permanently delete your account at any time from Profile → Privacy & data.",
  },
  NG: {
    lawName: "Nigeria's Data Protection Act, 2023 (NDPA)",
    regulatorName: "the Nigeria Data Protection Commission (NDPC)",
    rightsBody:
      "You have the right to access, correct, delete and receive a copy of your data, and to object to or restrict its processing. Consent must be freely given, specific, informed and unambiguous, and you can withdraw it at any time. You can export a full copy of your data or permanently delete your account at any time from Profile → Privacy & data.",
  },
  ZA: {
    lawName: "South Africa's Protection of Personal Information Act (POPIA)",
    regulatorName: "the Information Regulator (South Africa)",
    rightsBody:
      "You have the right to access, correct and delete your data, to object to its processing, and to complain to the Information Regulator. \"Special personal information\" — including health-related data such as the accessibility/dietary information you may optionally share on a ticket — receives extra protection under POPIA §26: we only process it with your explicit, separately-given consent, and you can withdraw that consent at any time without affecting your ticket. You can export a full copy of your data or permanently delete your account at any time from Profile → Privacy & data.",
  },
};

const DEFAULT_RIGHTS: JurisdictionRights = {
  lawName: "your local data protection law",
  regulatorName: "your local data protection authority",
  rightsBody:
    "Depending on where you live — including under Kenya's Data Protection Act 2019, Nigeria's Data Protection Act 2023, South Africa's POPIA, and the EU/UK GDPR — you have the right to access, correct, export and delete your data, and to withdraw consent. You can export a full copy of your data or permanently delete your account at any time from Profile → Privacy & data.",
};

export function getJurisdictionRights(countryCode: string | undefined): JurisdictionRights {
  if (!countryCode) return DEFAULT_RIGHTS;
  return JURISDICTIONS[countryCode.toUpperCase()] ?? DEFAULT_RIGHTS;
}

/** Builds the "Legal bases & your rights" privacy-policy section for the viewer's country. */
export function getPrivacyRightsSection(countryCode: string | undefined): LegalSection {
  const { lawName, regulatorName, rightsBody } = getJurisdictionRights(countryCode);
  return {
    heading: "4. Legal bases & your rights",
    body: `We process your data to perform our contract with you (providing tickets and rewards) and on the basis of your consent. Under ${lawName}, enforced by ${regulatorName}: ${rightsBody}`,
  };
}

/** POPIA §26-specific note shown alongside the accessibility/dietary consent toggle for South African users only. */
export const POPIA_SECTION_26_NOTE =
  "Under South Africa's POPIA §26, dietary and accessibility information is \"special personal information\" and receives extra protection: we only collect it with your explicit consent, given here separately from your ticket purchase, and never as a condition of attending.";
