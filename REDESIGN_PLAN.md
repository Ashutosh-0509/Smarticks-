# Redesign Plan — CivicReport

Target: a civic complaint platform credible enough to pitch to an
Indian municipality. Design direction follows GIGW 3.0 (Guidelines for
Indian Government Websites and Apps — NIC/MeitY) — accessibility-first,
fast on low-end devices, institutionally trustworthy. Fast and legible
beats decorative. Every choice below should be justifiable to a
procurement/IT reviewer, not just look good in a screen recording.

## Design tokens

### Color
| Token | Hex | Use |
|---|---|---|
| `--ink` | `#14213D` | Primary text, nav, headers |
| `--surface` | `#F4F5F7` | Page background |
| `--surface-card` | `#FFFFFF` | Cards, panels, table rows |
| `--accent` | `#E8963C` | Primary actions, links, active states |
| `--priority-high` | `#D64545` | High priority |
| `--priority-medium` | `#E8963C` | Medium priority |
| `--priority-low` | `#4A9B6E` | Low priority |
| `--border` | `#DDE1E7` | Hairlines, dividers, input borders |
| `--institutional` | `#0B1E3D` | Header band background — one shade darker than `--ink`, used only for the top institutional strip |

Seven core colors plus one header-band shade. No gradients anywhere.
No blur/glass effects — they fail contrast requirements and cost
render performance on low-end devices.

### Typography
- **Body / UI:** `Noto Sans` — broadest Indic script coverage (needed
  the moment a Hindi/Marathi toggle is added, which any real municipal
  buyer will ask about).
- **Headings:** `Space Grotesk` — precise, technical, not decorative.
- **Data / mono:** `IBM Plex Mono` — IDs, timestamps, coordinates,
  status codes.
- Scale: `text-sm` (labels/meta) / `text-base` (body) / `text-xl`
  (card titles) / `text-3xl` (page titles). No sizes outside this scale.

### Layout
- 8px spacing grid throughout.
- Cards: `rounded-lg`, `border border-[--border]`, `shadow-sm` — no
  heavy shadows, no zero-radius, no fully-rounded playful shapes.
- Dashboard/map: `max-w-6xl`. Forms: `max-w-xl`.
- Dense, scannable layouts over spaced-out card grids — officials
  scanning complaint volume need density, not whitespace.

### Motion
Framer Motion used only for: page transitions between routes, and the
fade-in when an AI classification result appears. Nowhere else. No
loading animations beyond a plain spinner or skeleton screen.

## Page-by-page spec

### Institutional header band (new, appears on every page)
A slim strip above the main nav — background `--institutional`, white
text, small (`text-sm`). Contains: emblem placeholder (simple shield/
circle SVG, swappable per municipality later) + "[Municipality Name]"
text on the left, a language toggle (English / हिंदी / मराठी — labels
only for now, full translation is a later phase) and a text-size
toggle (A- / A / A+, adjusts a root CSS variable) on the right. This
single element is what makes the product read as institutional
software rather than a generic app — build it first.

### Main nav (below the header band)
Existing nav (Home / Report an issue / Dashboard) stays as-is —
`--ink` background, Lucide icons, `Space Grotesk` wordmark. No changes
needed here, it already reads correctly.

### Login (`/login`)
No hero image, no gradient background, no glassmorphism. Institutional
header band visible at top (consistency = trust). Centered card,
`max-w-sm`, white background, `border`, `shadow-sm`. Emblem + product
name above the email/OTP fields. Fast to load, instantly recognizable,
nothing atmospheric.

### Report an issue (`/report`)
Existing multi-step flow (form → AI thinking → confirm → success)
stays structurally the same. Changes:
- Wrap all four states in a consistent card container so the page
  doesn't feel like it's missing content between states.
- Replace any decorative loading animation with a plain spinner or a
  skeleton of the confirmation card shape.
- AI classification result card: plain bordered card (no glow/beam
  effects), using the priority-signal dot + mono label pattern.
- Keep the page header ("Report an issue") visible across all four
  states, not just the initial form.

### Public map (`/`)
No changes to the core react-leaflet implementation. Add: a one-line
data-use notice below the map ("Locations shown are approximate and
submitted by citizens.") — small, unobtrusive, but present, since
you're publishing citizen location data and a government buyer will
specifically look for this kind of disclosure.

### Dashboard (`/dashboard`)
Dense sortable/filterable table, as already built — correct pattern,
no card-grid conversion. Add:
- Export-to-CSV button in the filter bar — municipal staff will ask
  for this in any real pilot conversation.
- Evidence badge and priority signal stay exactly as designed
  (colored dot + mono label), just ensure they're legible at table
  density (no truncation, no overlap).

### Status tracker (`/track/:id`)
No structural changes — vertical timeline with the signal-dot pattern
stays. Ensure it's readable with the text-size toggle applied (test at
the A+ setting).

### New: Accessibility statement page (`/accessibility`)
Static page, one paragraph, describing target WCAG conformance level
and how to report an accessibility issue. Linked from the footer.
Costs almost nothing to build, materially changes how the product
reads to a compliance-focused reviewer.

### New: Footer (appears on every page)
Small, `text-sm`, `--border` top hairline. Contains: "Maintained by
[Department/Team name]" + last-updated date, links to Privacy Policy
(placeholder page is fine for now), Accessibility Statement, and a
Grievance/Feedback link (can point to the complaint form itself —
"Report an issue with this website" reusing the existing flow is a
nice, cheap bit of self-consistency).

## Build order

1. Institutional header band + footer (global, appears everywhere,
   highest "looks legitimate" payoff for the least code)
2. Login page redesign
3. Report flow — card consistency + plain loading state
4. Accessibility statement page
5. Dashboard — CSV export button
6. Public map — data-use notice
7. Text-size toggle wiring (root CSS variable, applied across all
   pages — do this after the header band exists since the toggle
   lives there)
8. Language toggle UI (labels only, no full translation yet)

## What NOT to add

No glassmorphism, no blur effects, no glowing/animated borders, no
orb/particle loading animations, no auto-triggered product tours, no
dynamic hero backgrounds, no gradients. If any generated component
introduces one of these, reject it and re-prompt — the whole point of
this redesign is restraint, not decoration.
