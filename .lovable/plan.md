

# Mana — Full-Stack Hackathon Build Plan

## What We're Building

Transform the current static prototype into a fully functional app with authentication, real-time data, AI-powered features, and a production-ready NGO dashboard. Everything backed by Lovable Cloud (Supabase).

---

## Architecture Overview

```text
┌─────────────────────────────────────────────────┐
│                   Frontend (React)               │
│  Auth Pages → Feature Pages → NGO Dashboard      │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│              Lovable Cloud (Supabase)            │
│  Auth │ Database │ Edge Functions │ Storage      │
│       │          │                │              │
│  Users│ mood_    │ ai-distress-   │ voice_notes  │
│       │ checkins │ detect         │              │
│       │ stories  │ ai-companion   │              │
│       │ reactions│                │              │
│       │ streaks  │                │              │
│       │ user_    │                │              │
│       │ roles    │                │              │
└──────────────────────────────────────────────────┘
```

---

## Phase 1: Backend + Auth (Foundation)

### 1a. Enable Lovable Cloud
- Spin up Supabase backend

### 1b. Database Schema
Create these tables via migrations:

- **profiles** — `id (FK auth.users)`, `display_name`, `avatar_emoji`, `locality`, `created_at`
- **user_roles** — `id`, `user_id (FK auth.users)`, `role (enum: user, ngo_admin, peer_leader)` — separate table per security rules
- **mood_checkins** — `id`, `user_id (nullable for anonymous)`, `mood_value`, `stressors (text[])`, `journal_text`, `locality`, `created_at`
- **stories** — `id`, `user_id`, `anonymous_name`, `anonymous_avatar`, `content`, `tags (text[])`, `is_voice`, `voice_url`, `expires_at`, `created_at`
- **story_reactions** — `id`, `story_id`, `user_id`, `emoji`, `created_at`
- **story_replies** — `id`, `story_id`, `user_id`, `content`, `created_at`
- **streaks** — `id`, `user_id`, `current_streak`, `longest_streak`, `total_checkins`, `last_checkin_date`, `xp_points`
- **badges_earned** — `id`, `user_id`, `badge_key`, `earned_at`
- **quests** — `id`, `title`, `description`, `xp_reward`, `quest_type`, `target_count`
- **user_quests** — `id`, `user_id`, `quest_id`, `progress`, `completed_at`

RLS policies: Users read/write own data. NGO admins read aggregated anonymized data only. Peer leaders get elevated story moderation.

### 1c. Auth Pages
- **`/auth`** — User login/signup page with email+password, tabbed Sign In / Sign Up
- **`/ngo-login`** — Separate NGO admin login page with distinct branding ("NGO Intelligence Portal")
- Role-based routing: after login, users go to `/`, NGO admins go to `/dashboard`
- Auth context provider wrapping the app
- Protected routes: `/dashboard` requires `ngo_admin` role, `/streaks` requires authenticated user

---

## Phase 2: Feature Pages (Make Everything Real)

### 2a. Mood Pulse — Interactive Emoji Orbs
- Replace flat emoji buttons with animated floating orbs using framer-motion (scale, glow, particle effects on select)
- 30-second timer countdown UI
- On submit: INSERT into `mood_checkins` table
- If user is logged in, link to their profile for streak tracking
- Anonymous users can still check in (null user_id)

### 2b. Story Circles — Real Peer Stories
- Fetch stories from `stories` table, ordered by `created_at DESC`
- Auto-filter expired stories (7-day TTL)
- Real reaction system: click emoji → INSERT into `story_reactions`, show live counts
- Reply thread: expand to see/post replies from `story_replies`
- Compose: INSERT into `stories` with auto-generated anonymous name/avatar
- Voice note: use browser MediaRecorder API → upload to Supabase Storage → store URL

### 2c. 3AM Feature + SOS — AI Distress Detection
- Edge function `ai-distress-detect`: takes journal text + current hour → Lovable AI analyzes sentiment
- If distress detected OR time is 12am-5am: show gentle intervention UI
- SOS button: one-tap opens crisis page with real helpline numbers (tel: links)
- AI companion mini-chat: edge function `ai-companion` with system prompt tuned for empathetic teen support
- Late-night mode: detect browser time, auto-switch to calming dark UI with breathing exercise prompt

### 2d. Resilience Journey — Duolingo-Style Gamification
- **Daily XP**: earn 10 XP per mood check-in, 25 XP per story shared, 5 XP per reaction
- **Streaks**: auto-calculated from `streaks` table, increment on daily check-in
- **Achievements/Badges**: unlock based on thresholds (3-day streak, 10 stories, etc.), stored in `badges_earned`
- **Quests**: daily/weekly tasks from `quests` table ("Check in 3 days this week", "React to 5 stories")
- **Level system**: XP thresholds for levels (0-100 = Seedling, 100-300 = Sprout, etc.)
- **Leaderboard**: anonymized peer leader board from aggregated data
- Progress bars, animations, confetti on level-up using framer-motion

### 2e. NGO Intelligence Dashboard (Enhanced)
- **Real-time heatmaps**: aggregate `mood_checkins` by locality, render as colored region cards with live mood scores
- **Early warning system**: edge function that queries checkins in last 24h, flags localities with >20% "struggling" ratio
- **Trend charts**: recharts pulling from real aggregated data (mood distribution over time)
- **Stressor analytics**: aggregate stressor tags, show top stressors per region
- **Time-of-day analysis**: group checkins by hour, highlight late-night distress patterns
- **Story sentiment overview**: AI-analyzed story sentiment trends
- **Export functionality**: download CSV of anonymized aggregate data
- **Resource deployment tracker**: which regions need more support based on data

---

## Phase 3: Polish & Unique Features

### 3a. AI Companion Chat
- Floating chat bubble on all pages
- Edge function using Lovable AI with carefully crafted system prompt for teen mental health support
- Streaming responses for real-time feel
- Conversation stored locally (not in DB — privacy first)

### 3b. Dark Mode Toggle
- Already have dark theme CSS vars defined
- Add toggle in navbar

### 3c. Unique Hackathon Differentiators
- **Mood Weather Map**: visual "emotional weather" representation (sunny/cloudy/stormy icons per region)
- **Anonymous QR Check-in**: generate QR code that links directly to mood check-in — for schools to print and post
- **Impact Counter**: live animated counter on homepage showing total check-ins, stories shared, peers helped

---

## Technical Details

**New files to create:**
- `src/pages/Auth.tsx` — User auth page
- `src/pages/NGOLogin.tsx` — NGO admin auth page
- `src/contexts/AuthContext.tsx` — Auth state management
- `src/components/ProtectedRoute.tsx` — Route guard
- `src/components/AICompanion.tsx` — Floating AI chat
- `src/components/MoodOrbs.tsx` — Animated emoji orbs
- `src/components/QRCheckIn.tsx` — QR code generator
- `supabase/functions/ai-distress-detect/index.ts`
- `supabase/functions/ai-companion/index.ts`
- 10+ migration files for tables and RLS

**Files to modify:**
- `src/App.tsx` — Add auth context, protected routes, new routes
- `src/components/Navbar.tsx` — Add auth state, login/logout, dark mode toggle
- `src/pages/MoodCheckIn.tsx` — Animated orbs, DB writes, timer
- `src/pages/StoryCircles.tsx` — Real data, reactions, voice recording
- `src/pages/CrisisSupport.tsx` — AI distress detection, SOS
- `src/pages/ResilienceStreaks.tsx` — Full gamification with DB
- `src/pages/Dashboard.tsx` — Real aggregated data, enhanced charts
- `src/pages/Index.tsx` — Live impact counter, QR section

**Dependencies to add:** `qrcode.react` for QR generation

---

## Implementation Order

1. Enable Lovable Cloud + create all DB tables
2. Build auth (both login pages + context + protected routes)
3. Wire Mood Check-in to DB + add animated orbs
4. Wire Story Circles to DB + voice recording
5. Build gamification system (streaks, XP, quests, badges)
6. Create AI edge functions (distress detection + companion)
7. Wire NGO Dashboard to real aggregated queries
8. Add dark mode, QR check-in, impact counter
9. Polish animations and test end-to-end

