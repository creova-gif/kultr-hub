import React from "react";

import { LegalDocument, type LegalSection } from "@/components/LegalDocument";

const SECTIONS: LegalSection[] = [
  {
    heading: "1. Who we are",
    body: "Kultr Hub is a cultural events and ticketing platform connecting Africans and the diaspora to live experiences. This policy explains what personal data we collect, why, and the rights you have over it.",
  },
  {
    heading: "2. Data we collect",
    body: "Account details you provide: your phone number, email address, display name, country and (optionally) profile photo. Activity data: the events you view, save and attend, tickets you purchase, and rewards (KULTROINS, quests, collectibles) you earn. Payment data: we store a payment reference and provider name for each purchase — your full card or mobile-money credentials are handled directly by the payment provider (e.g. Paystack, M-Pesa, MTN MoMo) and are never stored by us.",
  },
  {
    heading: "3. How we use your data",
    body: "To create and secure your account, deliver and verify tickets, process payments in your local currency, run the rewards programme, and keep the service safe from fraud and abuse. We do not sell your personal data.",
  },
  {
    heading: "4. Legal bases & your rights",
    body: "We process your data to perform our contract with you (providing tickets and rewards) and on the basis of your consent. Depending on where you live — including under Kenya's Data Protection Act 2019, Nigeria's NDPR, South Africa's POPIA, and the EU/UK GDPR — you have the right to access, correct, export and delete your data, and to withdraw consent. You can export a full copy of your data or permanently delete your account at any time from Profile → Privacy & data.",
  },
  {
    heading: "5. Sharing & processors",
    body: "We share data only with the processors needed to run the service: payment providers, an SMS gateway for one-time passcodes, and our hosting and exchange-rate providers. Each handles your data under its own agreement and applicable law.",
  },
  {
    heading: "6. Retention & security",
    body: "We keep your data for as long as your account is active and as required to meet legal and financial obligations. One-time passcodes expire within minutes. Passwords and passcodes are stored only as secure hashes, and all traffic to payment and messaging providers is encrypted in transit.",
  },
  {
    heading: "7. Contact",
    body: "For any privacy request or question, contact us at privacy@kultrhub.com. If you are not satisfied, you may lodge a complaint with your local data-protection authority.",
  },
];

export default function PrivacyScreen() {
  return (
    <LegalDocument
      title="Privacy Policy"
      effectiveDate="June 2026"
      intro="Your privacy matters. This policy describes how Kultr Hub collects, uses and protects your personal data, and the choices you have."
      sections={SECTIONS}
    />
  );
}
