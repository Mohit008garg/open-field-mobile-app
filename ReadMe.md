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
| `/login` | Email/password + social buttons + **"Skip & explore the app"** |

> ⚠️ There is no auth backend yet (OTP/login needs a third-party provider). For
> now **Log In**, the social buttons, and **Skip & explore the app** all drop you
> straight into the protected app via `router.replace('/home')`. Wire real auth
> in [`app/(auth)/login.tsx`](app/(auth)/login.tsx) when the provider is ready.

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
