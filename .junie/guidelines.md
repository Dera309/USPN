# Junie Guidelines – USPN Project

## Working with `docs/tasks.md`

- Mark a task complete by changing `[ ]` to `[x]`.
- Work through tasks in phase order; do not skip phases unless dependencies are confirmed met.
- Keep all phase headings and task numbers intact — do not renumber existing tasks.
- If a new task is needed, append it to the relevant phase with the next sequential number (e.g., `9.8`).
- Every task (new or modified) must reference its plan item (e.g., `Plan: [P9]`) and requirement (e.g., `Requirements: [Req 8]`) in the phase header or inline.
- Keep formatting consistent: `- [ ]` for incomplete, `- [x]` for complete, phase headers as `## Phase N – Name`.

## Design Rules (from `stitch/freight_flow/DESIGN.md`)

- Colors: primary `#000000` / `#0D1C32`, accent `#FE6B00` / `#A04100`. Never use 100%-opacity borders.
- Fonts: Manrope for headlines, Inter for body/labels.
- No 1px solid dividers — use background color shifts or `spacing-6`/`spacing-8` whitespace.
- Shadows: `0px 12px 32px rgba(25,28,29,0.04)` ambient only.
- Maps: Google Maps Static API only (no embeds, no JS Maps SDK).

## Key Conventions

- Tracking number format: `USPN-XXXX-XX` (admin-assigned or auto-generated).
- Shipment statuses: `Pending` | `In Transit` | `Delayed` | `Delivered` | `Cancelled`.
- User roles: `guest` | `user` | `admin`.
- Route guards: `/dashboard/*` → requires `user` or `admin`; `/admin/*` → requires `admin`; `/booking` → requires `user` or `admin`.
- No payment processing anywhere in the codebase.
