# OpenField — Mobile App

React Native (Expo + expo-router) app for **OpenField**, a sports networking
platform — *Connect. Discover. Grow in Sports.* Built to the designs in
[`sample scrren/`](./sample%20scrren).

## Stack

- **Expo SDK 51** + **expo-router** (file-based routing), **TypeScript**
- Brand: vibrant green (`#16A34A`) on clean white/slate surfaces; card-based UI
- Icons via `@expo/vector-icons` (Ionicons)
- Responsive for phone + tablet

## Run

```bash
npm install
npm start          # Expo dev server (a = Android, i = iOS, w = web)
npm run typecheck  # tsc --noEmit
```

## Screens

Pre-login (`app/(auth)/`):

| Route | Screen |
|---|---|
| `/start` | Landing — hero + "Get Started" / "Log In" |
| `/login` | **Google sign-in** (+ dev "Skip & explore the app") |

### Authentication — Google only (for now)

SMS OTP isn't purchased yet, so sign-in is **Google only** via Expo AuthSession
([`src/hooks/useGoogleAuth.ts`](src/hooks/useGoogleAuth.ts)). To enable it:

1. `cp .env.example .env`
2. Create Google OAuth client IDs (Google Cloud Console) and fill in
   `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` / `_ANDROID_CLIENT_ID` / `_IOS_CLIENT_ID`.
   See https://docs.expo.dev/guides/google-authentication/

Until the IDs are set, the Google button shows a "not configured" alert. A
**dev "Skip"** link still enters the app, and the backend exchange
(Google identity → app session) is a `TODO` in `login.tsx` once that endpoint
exists. Phone (OTP) sign-in will be added later.

Post-login tab app (`app/(app)/`), bottom tabs **Home · Discover · Network · Jobs · Profile**:

| Route | Screen |
|---|---|
| `/home` | Feed: search, hero, stats, Quick Access, post composer |
| `/discover` | Recommended players, top academies, filter chips |
| `/network` | Connections list, Following/Followers/Requests tabs |
| `/jobs` | Opportunities — trials, scholarships, jobs |
| `/profile` | Athlete profile — stats, About, Details |
| `/messages` | Conversations (opened from the Home chat icon; hidden from tab bar) |
| `/events` | Events list (opened from Home → Quick Access → Tournaments) |

## Structure

```
app/
├── _layout.tsx            # root Stack
├── index.tsx              # redirect → /start
├── (auth)/                # start, login
└── (app)/                 # _layout = bottom Tabs + the 7 screens above
src/
├── theme/                 # colors, spacing, radius, font sizes
├── components/ui/         # Logo, PrimaryButton, Avatar, TextField, Card, Chip, SectionHeader
└── constants/mockData.ts  # placeholder players, jobs, events, messages, etc.
```

All list content is placeholder data in `src/constants/mockData.ts`; swap for the
`Open-field-be` API when endpoints are ready. Avatars are initials-based (no
network); hero/cover banners use remote placeholder images.
