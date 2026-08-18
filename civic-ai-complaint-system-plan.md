# AI Complaint Action System — Team Plan
**Challenge:** 02-AI Complaint Action System | **Total build time: 3 hours**

---

## 1. Stack (locked — do not change mid-build)

**Frontend:** React + Vite + Tailwind CSS
- React Router — routing
- Recharts — charts (dashboard analytics only, if time allows)
- Lucide icons — all icons
- react-leaflet + Leaflet (OpenStreetMap tiles) — map. *Not Mapbox — no API key/billing setup needed.*
- Framer Motion — sparingly, page transitions only

**Backend:** Supabase
- PostgreSQL (schema below)
- Supabase Auth (do **not** build a custom users table — see fix below)
- Supabase Storage — complaint images
- Row Level Security — 2 policies only, see below
- Edge Functions — the *only* place the AI API key lives

**AI:** Called from an Edge Function, never from the frontend. Frontend calls `supabase.functions.invoke('classify-complaint', { body })` and gets back structured JSON.

---

## 2. Database schema (corrected)

```sql
-- profiles: extends Supabase Auth, does NOT duplicate it
profiles
──────────
id           uuid  references auth.users(id) primary key
name         text
role         text  -- 'citizen' | 'staff' | 'admin'
created_at   timestamptz default now()

departments
───────────
id           uuid primary key default gen_random_uuid()
name         text
description  text

complaints
──────────
id             uuid primary key default gen_random_uuid()
user_id        uuid references profiles(id)
title          text
description    text
category       text
priority       text        -- 'low' | 'medium' | 'high'
department_id  uuid references departments(id)   -- FK, not free text
status         text default 'submitted'
latitude       double precision
longitude      double precision
address        text
image_url      text
voice_url      text        -- nullable, stretch feature only
ai_summary     text
ai_confidence  numeric
ai_reasoning   text        -- NEW: one-line "why this priority/department" — shown to citizen for transparency
created_at     timestamptz default now()
updated_at     timestamptz default now()

complaint_updates
─────────────────
id            uuid primary key default gen_random_uuid()
complaint_id  uuid references complaints(id)
status        text
comment       text
updated_by    uuid references profiles(id)
created_at    timestamptz default now()

-- CUT for this build — do not implement, out of scope for 3 hours:
-- notifications
-- complaint_duplicates
```

**Why the changes:**
- `users` → `profiles` linked to `auth.users`: Supabase Auth already owns identity/email/password. A separate `users` table with its own email field creates two sources of truth and wastes RLS-debugging time.
- `department` (text) → `department_id` (FK): so dashboard filtering/grouping by department doesn't depend on the AI outputting exactly consistent spelling every time.
- Added `ai_reasoning`: this is the "transparent AI, not a black box" differentiator — citizens see *why* a priority/department was assigned. One column, cheap now, expensive to retrofit later.

---

## 3. RLS policies (exactly two, nothing fancier)

```sql
-- complaints: public read (it's a transparency map — this is a feature)
create policy "public read complaints"
  on complaints for select
  using (true);

-- complaints: only logged-in users can submit
create policy "authenticated insert complaints"
  on complaints for insert
  with check (auth.uid() is not null);
```

Staff-only status updates: gate this in the **dashboard UI logic** for now (check `profiles.role`), not in RLS. Fix properly post-submission if time remains.

---

## 4. Edge Function contract (AGREE ON THIS BEFORE ANYONE CODES)

Frontend calls this and expects back:

```json
{
  "category": "pothole",
  "priority": "high",
  "department_id": "uuid-of-roads-dept",
  "ai_summary": "one sentence summary of the complaint",
  "ai_reasoning": "High priority — reported near a school zone with high foot traffic",
  "ai_confidence": 0.87
}
```

If the Edge Function isn't ready when frontend gets there, frontend hardcodes a mock object matching this shape and swaps it in later. **Nobody should be blocked waiting on this.**

---

## 5. Scope — build this, nothing more

**In scope (MVP, must ship):**
1. Complaint submission form — text + photo + geolocation (button + manual address fallback)
2. AI classification round-trip via Edge Function, shown to citizen before final save (editable)
3. Public map — pins colored by priority
4. Status tracking (simple timeline/list per complaint)
5. Department dashboard — table view, filterable by status/priority/department, requires staff login

**Cut entirely — do not attempt, do not "just quickly add":**
- Voice input/upload
- Notifications table/UI
- Duplicate detection / complaint clustering
- Multilingual support
- Kanban drag-drop (use a plain sortable table instead)

**Only if all of the above ships with time to spare (stretch, in this order):**
1. Browser-native voice-to-text on the form (Web Speech API — free, no backend work)
2. AI-thinking loading animation instead of a plain spinner
3. Recharts analytics on the dashboard (resolution time per department)

---

## 6. Rough 3-hour split across the team

Adjust to your actual headcount/roles — this assumes frontend / backend+Supabase / AI+Edge Function as three tracks running in parallel from minute 0.

| Time | Frontend | Backend (Supabase) | AI / Edge Function |
|---|---|---|---|
| 0:00–0:15 | Scaffold, routing, layout | Create tables, RLS, storage bucket | Confirm Edge Function contract (section 4) |
| 0:15–1:00 | Submission form + map | Auth setup, seed `departments` table | Build + test classification Edge Function |
| 1:00–1:45 | Dashboard, status tracker | Wire real inserts/updates, test RLS | Integrate Edge Function with live form submissions |
| 1:45–2:30 | Connect everything to real Supabase data, fix integration bugs together | | |
| 2:30–3:00 | Bug fixes, demo run-through, cut anything broken rather than half-fix it | | |

---

## 7. Differentiators (why this beats a generic complaint form)

1. **AI reasoning shown to the citizen** — not a black box ("Priority: High — near school zone, water leakage")
2. **Public transparency map** — anyone can see all reported issues and their status live
3. **Department dashboard** — demonstrates the "system" half of judging criteria, not just a pretty form

If time allows a 4th: a public "department accountability" stat (average resolution time) — governance angle, not a UI trick.
