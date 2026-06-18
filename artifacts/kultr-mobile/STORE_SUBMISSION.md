# Kultr — App Store & Play Store Submission Guide

This document covers the steps to get **Kultr** live on the Apple App Store and
Google Play. The code/config side is done (bundle ID, permissions, icons,
`eas.json`). The remaining steps require **your accounts and credentials** and
cannot be automated from the repo.

> ⏱️ **Realistic timeline:** Apple review is ~24–48h; Google Play first-app
> review is ~1–7 days (and brand-new personal Google accounts require a 14-day
> closed test before production). **Same-day "live" is not possible**, but you
> can **submit** today once the steps below are done.

---

## 0. What's already configured in the repo

- ✅ Bundle identifier / package: **`com.kultr.app`** (iOS + Android)
- ✅ App name **Kultr**, version `1.0.0`, build/version code `1`
- ✅ URL scheme `kultr`, universal-link origin `https://kultr.app`
- ✅ iOS permission usage strings (location, photos, camera) + non-exempt
  encryption flag (`ITSAppUsesNonExemptEncryption: false`)
- ✅ Android adaptive icon + permissions (injected by the Expo config plugins)
- ✅ `eas.json` with `development`, `preview`, `production` build profiles and a
  `submit` profile

> **Note:** `expo-location` and `expo-image-picker` are installed but not yet
> called anywhere in the app. Their permission strings are declared so the build
> is valid. If you do **not** plan to ship location/photo features in v1,
> consider removing those two dependencies to avoid reviewer questions about
> unused permissions.

---

## 1. Prerequisites (accounts)

| Need | Where | Cost | Notes |
|------|-------|------|-------|
| Apple Developer Program | developer.apple.com | $99/yr | Approval can take 24–48h |
| Google Play Console | play.google.com/console | $25 once | New personal accounts need a 14-day closed test |
| Expo account | expo.dev | free | You already have `EXPO_TOKEN` connected in Replit |

---

## 2. Deploy the backend (required before builds)

The app reads the API base URL from `EXPO_PUBLIC_API_URL`. Production builds will
**not work** against `localhost`.

1. Deploy `artifacts/api-server` on Replit (you mentioned it's already wired
   there) and copy its public HTTPS URL, e.g. `https://kultr-api.<you>.replit.app`.
2. In **`eas.json`**, replace every `https://REPLACE-WITH-YOUR-REPLIT-BACKEND-URL`
   in the `preview` and `production` profiles with that URL.
3. Make sure the backend allows the app's requests (CORS / auth) over HTTPS.

---

## 3. Link the EAS project

From `artifacts/kultr-mobile/` with the Expo CLI authenticated (your
`EXPO_TOKEN`):

```bash
npx eas-cli@latest init        # creates the project & writes extra.eas.projectId
npx eas-cli@latest whoami      # confirm you're logged in
```

---

## 4. Build the binaries (cloud — runs on EAS, not this repo)

```bash
# Android App Bundle (.aab) for Play
npx eas-cli@latest build --platform android --profile production

# iOS build (.ipa) for App Store — EAS will guide you through signing
npx eas-cli@latest build --platform ios --profile production
```

EAS manages signing credentials. For iOS, let EAS create the Distribution
Certificate and Provisioning Profile when prompted.

---

## 5. Store listings (do in parallel with builds)

### Both stores need
- App icon (1024×1024 for Apple; the adaptive icon is generated for Android)
- Screenshots (use a simulator/emulator or a device): at least
  - iPhone 6.7" and 6.5"
  - Android phone
- Short + full description
- **Privacy policy URL** — required by both. You already have in-app
  privacy/legal screens (`app/legal/privacy.tsx`); host that text at a public
  URL (e.g. `https://kultr.app/privacy`).
- Support URL / contact email
- Content rating questionnaire

### Apple-specific (App Store Connect)
- Create the app record; bundle ID **`com.kultr.app`**
- **Privacy "Nutrition Label"** — declare what you collect (account email,
  approximate location if you enable it, etc.)
- Export compliance: already answered via `ITSAppUsesNonExemptEncryption: false`
- Sign-in for review: if the app gates content behind login, provide a **demo
  account** for the reviewer (Apple will reject without one)

### Google-specific (Play Console)
- **Data safety form** (mirrors the Apple privacy label)
- Target API level is handled by Expo SDK 54 (meets current Play requirement)
- For a brand-new personal developer account: run a **closed test** with ≥12
  testers for 14 days before you can promote to production

---

## 6. Submit

```bash
# After filling in the iOS submit fields in eas.json (appleId, ascAppId, appleTeamId)
npx eas-cli@latest submit --platform ios --profile production --latest

# Download your Play service account JSON to ./play-service-account.json (git-ignored), then
npx eas-cli@latest submit --platform android --profile production --latest
```

Then complete the listing in each console and hit **Submit for review**.

---

## 7. Pre-submission sanity checklist

- [ ] Backend deployed; `EXPO_PUBLIC_API_URL` set in `eas.json` (preview + production)
- [ ] `eas init` run; `extra.eas.projectId` present in app config
- [ ] Production build installs and **logs in against the live backend** (test the preview build first)
- [ ] Demo reviewer account created and added to App Store Connect notes
- [ ] Privacy policy + support URLs live and reachable
- [ ] Apple privacy label + Google data safety form completed
- [ ] Screenshots uploaded for all required device sizes
- [ ] Decide on the unused location/photo permissions (keep + use, or remove deps)

---

## Open items only you can resolve

1. **Backend production URL** (Replit) → paste into `eas.json`.
2. **Apple credentials** for `eas.json` submit profile: `appleId`, `ascAppId`,
   `appleTeamId`.
3. **Play service account key** → `./play-service-account.json` (git-ignored).
4. **`kultr.app` domain** — used for the link origin and privacy/support URLs;
   confirm you own it or swap in the correct domain in `app.json`.
