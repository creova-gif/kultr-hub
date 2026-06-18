import React from "react";

import { LegalDocument, type LegalSection } from "@/components/LegalDocument";

const SECTIONS: LegalSection[] = [
  {
    heading: "1. Acceptance",
    body: "By creating an account or using Kultr Hub, you agree to these Terms of Service. If you do not agree, please do not use the app.",
  },
  {
    heading: "2. Your account",
    body: "You sign in with your phone number or email. You are responsible for keeping access to your number and device secure, and for activity that happens under your account. You must be old enough to enter into a contract in your country to buy tickets.",
  },
  {
    heading: "3. Tickets & payments",
    body: "Prices are set by event organisers and shown in your local currency using current exchange rates; a service fee may be added at checkout. Payments are processed by third-party providers such as Paystack, M-Pesa and MTN Mobile Money. A ticket is confirmed only once payment is verified. Refunds and entry conditions are set by the organiser of each event.",
  },
  {
    heading: "4. Rewards programme",
    body: "KULTROINS, quests, collectibles and KULTR PASS benefits have no cash value, cannot be exchanged for money, and may be adjusted or discontinued. Attempting to manipulate check-ins or rewards may result in forfeiture of rewards and suspension of your account.",
  },
  {
    heading: "5. Acceptable use",
    body: "You agree not to misuse the service, including by attempting to defraud organisers or other users, reselling tickets in breach of organiser rules, or interfering with the security of the platform.",
  },
  {
    heading: "6. Organisers",
    body: "If you create events, you are responsible for the accuracy of your listings and for honouring tickets sold. You may not delete your account while your events still hold tickets bought by other attendees.",
  },
  {
    heading: "7. Liability",
    body: "Kultr Hub provides the platform connecting you to events but is not the organiser of those events. To the extent permitted by law, we are not liable for the conduct of organisers or for events that are changed or cancelled.",
  },
  {
    heading: "8. Changes & contact",
    body: "We may update these terms; continued use after an update means you accept the change. Questions? Contact support@kultrhub.com.",
  },
];

export default function TermsScreen() {
  return (
    <LegalDocument
      title="Terms of Service"
      effectiveDate="June 2026"
      intro="These terms govern your use of Kultr Hub — discovering events, buying tickets, and earning rewards across Africa and the diaspora."
      sections={SECTIONS}
    />
  );
}
