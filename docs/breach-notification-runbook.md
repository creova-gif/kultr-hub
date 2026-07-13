# Data Breach Notification Runbook

Status: **draft procedure, two roles below are not yet filled — see "Open action items" at the bottom.**

This is the operational procedure for responding to a suspected or confirmed
data breach at Kultr Hub. It implements the "strictest-common-core" approach
from the Global Compliance & Expansion Roadmap (§5): built to the tightest
applicable deadline (Kenya DPA / Nigeria NDPR / GDPR's 72-hour clock), which
also satisfies POPIA's looser "as soon as reasonably possible" standard and
PIPEDA's risk-based threshold without a second, separate procedure.

A "breach" here means any confirmed or suspected incident where personal
data held by Kultr Hub — user profiles, phone numbers, payment references,
ticket/event data — is accessed, disclosed, altered, or destroyed without
authorization. This includes both external attacks and internal mistakes
(e.g. a misconfigured database left publicly reachable).

## 1. Roles

| Role | Responsibility | Currently assigned to |
|---|---|---|
| **Privacy Officer** | Accountable owner of this runbook; makes the notify/don't-notify call; primary contact for regulators and affected users. Required by Quebec's Law 25; satisfies the "accountable role" PIPEDA and POPIA also expect. | **Not yet assigned — see §6.** |
| **Incident Lead** | Whoever first confirms the incident; drives containment and the internal timeline until the Privacy Officer takes over notification. | Rotates — whoever is on call / first responds. |
| **Engineering Lead** | Technical containment: revoking credentials, patching the vulnerability, pulling logs, confirming scope. | Whoever owns the affected system at the time. |
| **EU Representative** (Art. 27 GDPR) | Required point of contact for EU/EEA data subjects and regulators when Kultr Hub has no EU establishment but processes EU residents' data (diaspora users in France/Germany/etc.). | **Not yet appointed — see §6.** |

## 2. The 72-hour clock

The clock starts at **discovery** — the moment anyone at Kultr Hub becomes
aware a breach likely occurred, not the moment it's confirmed or fully
understood.

```
Hour 0        Discovery. Start the incident log (§4).
Hour 0–4      Contain. Stop the bleeding — revoke leaked credentials, take a
              vulnerable endpoint down, patch the hole. Don't wait for full
              root-cause before containing.
Hour 0–24     Assess scope. What data, how many users, which jurisdictions.
              Privacy Officer makes the notify/don't-notify call (§3).
Hour 24–60    If notifying: draft and send regulator notification(s) (§5),
              prepare user notification if required.
Hour ≤72      Regulator notification must be sent by this point if the
              breach is notifiable. This is a hard deadline under GDPR
              Art. 33, Kenya's DPA 2019, and Nigeria's NDPR — the strictest
              of the applicable regimes. POPIA (South Africa) and PIPEDA
              (Canada) both allow more time, so hitting this deadline
              satisfies all of them.
```

If full scope isn't known by hour 72, notify anyway with what's known and
send a supplemental update once the investigation completes — GDPR Art. 33
explicitly allows phased notification. Don't wait for certainty to blow the
deadline.

## 3. Does this breach need notification?

Notify the relevant regulator(s) unless the Privacy Officer can affirmatively
document that the breach is **unlikely to result in a risk to affected
individuals** (e.g. a handful of already-public event listings briefly
exposed, no personal data involved). When in doubt, notify — the downside of
an unnecessary notification is far smaller than the downside of a missed one.

Always notify affected **users directly** (not just the regulator) if the
breach is likely to result in a **high risk** to them — e.g. exposed
passwords, payment references, or phone numbers usable for account takeover
or fraud.

## 4. Incident log

From the moment of discovery, keep a running log (timestamped, plain text or
a shared doc) of:

- When the incident was discovered, and by whom/how
- What was affected (which tables/endpoints/users), and how that scope was
  determined
- Every containment action taken, with timestamps
- Every internal and external communication sent
- The Privacy Officer's notify/don't-notify decision and reasoning

This log is what regulators expect to see if they ask "what did you do and
when" — reconstructing it after the fact from memory is much harder than
keeping it live.

## 5. Regulator notification

Notify the data protection authority for every jurisdiction with affected
users. Kultr Hub's current markets and the relevant authority:

| Jurisdiction | Authority |
|---|---|
| Kenya | Office of the Data Protection Commissioner (ODPC) |
| Uganda | Personal Data Protection Office (PDPO) |
| Tanzania | Personal Data Protection Commission (PDPC) |
| Rwanda | National Cyber Security Authority (NCSA) |
| Nigeria (Phase 3) | Nigeria Data Protection Commission (NDPC) |
| South Africa (Phase 3) | Information Regulator |
| EU/EEA (diaspora users) | Lead supervisory authority in the member state of the EU Representative (§6), or the authority nearest the affected users if none yet appointed |
| UK (diaspora users) | Information Commissioner's Office (ICO) |

**Notification should include, at minimum:** nature of the breach, categories
and approximate number of individuals and records affected, likely
consequences, and the measures taken or proposed to address it and mitigate
harm. Send from the Privacy Officer's contact, and keep a copy of every
notification sent in the incident log.

**User notification** (when required by §3): plain-language email/SMS
explaining what happened, what data was involved, what Kultr Hub is doing
about it, and concrete steps the user can take (e.g. "reset your password,"
"a new PIN was sent"). No jargon, no minimizing.

## 6. Open action items — these need a real person, not a PR

Two items in this runbook cannot be completed by writing code or documents.
They need an actual business decision and, in one case, a paid third-party
service:

- **Name a Privacy Officer.** This can be a founder, an ops lead, or anyone
  with the authority to make the notify/don't-notify call and act as the
  accountable contact — it does not need to be a dedicated hire. What it
  needs is a real named person, recorded here and reachable.
- **Appoint an EU Representative (GDPR Article 27).** Required once Kultr
  Hub has no EU establishment but processes personal data of people in the
  EU/EEA (relevant the moment diaspora users in France/Germany/etc. are
  live — see roadmap Phase 4). This is normally done through a paid
  Article-27-representative service — search "GDPR Article 27
  representative service" for current providers and pricing; this document
  deliberately doesn't recommend a specific vendor. Until one is appointed,
  the EU/EEA row in §5's table has no dedicated contact.

Until both are filled in, treat this runbook as ready to execute
technically but missing its two accountable contacts.
