# Implementation Plan

## P1 – Project Setup & Design System
**Priority:** High | **Requirements:** All

- Initialize project structure (HTML/CSS/JS or chosen framework).
- Configure Tailwind CSS with the full USPN color palette, Manrope/Inter fonts, and custom utilities (`kinetic-gradient`, `glass-panel`, `ambient-shadow`) as defined in the stitch design files.
- Create shared layout components: TopAppBar (glassmorphism nav), Footer (dark slate), and reusable status chip component.
- Set up Google Maps Static API key configuration and a reusable map embed helper.

---

## P2 – Authentication Pages
**Priority:** High | **Requirements:** 2

- Build the Login page using the stitch `login/code.html` design: split-panel layout, dark left editorial panel, right-side form with email/password inputs, "Remember me" checkbox, and "Forgot Password?" link.
- Build the Registration page (same visual style as login, with name + confirm password fields).
- Implement client-side form validation (required fields, email format, password strength).
- Implement session management (localStorage/cookie for "remember me").
- Add password reset flow (email input modal/page).

---

## P3 – Public Home Page
**Priority:** High | **Requirements:** 1, 5, 10, 11

- Build the Home page from stitch `home/code.html`: hero section with kinetic gradient, tracking search bar, services bento grid, "Why Choose Us" dark section, trust badges strip, and footer.
- Wire the hero tracking search to redirect to the Tracking page with the number as a URL parameter.
- Embed the Quote Calculator section on the home page or as a dedicated `/quote` page.

---

## P4 – Quote Calculator
**Priority:** High | **Requirements:** 5

- Build the quote calculator form: origin (text/select), destination (text/select), weight (number input), dimensions (L×W×H), service type (Air / Ocean / Land).
- Implement client-side pricing logic with a configurable rate table (base rate per kg × distance multiplier × service type factor).
- Display estimated price range dynamically on input change.
- Add "Book This Shipment" CTA that pre-fills the booking form.

---

## P5 – Shipment Tracking Page
**Priority:** High | **Requirements:** 6

- Build the Tracking page from stitch `tracking/code.html`: asymmetric hero with search, visual progress timeline (4 steps), activity log with thread layout, Google Maps Static API mini-map showing current location, and package manifest card.
- Implement tracking number lookup: fetch shipment data by number, render all sections dynamically.
- Handle "not found" state with a clear error message.
- Animate the active step with a pulse ring; grey out future steps.

---

## P6 – User Dashboard & Account
**Priority:** High | **Requirements:** 3, 11

- Build the User Dashboard: shipment list table/cards with tracking number, route, status chip, and date; link each row to the tracking detail page.
- Build the Account Settings page: editable profile fields (name, email, phone), password change form.
- Protect all `/dashboard/*` routes — redirect unauthenticated users to login.

---

## P7 – Shipment Booking
**Priority:** High | **Requirements:** 4

- Build the Booking form page: origin, destination, cargo type (select), weight, dimensions, special handling flags (fragile, hazmat), and notes.
- On submit, create a shipment record with status "Pending" and no tracking number yet.
- Show a booking confirmation page with shipment summary and "Tracking number will be assigned shortly" notice.
- Pre-fill form when navigating from the Quote Calculator.

---

## P8 – Admin Dashboard
**Priority:** High | **Requirements:** 7, 8, 9, 11

- Build the Admin Dashboard from stitch `admin_dashboard/code.html`: persistent dark side nav drawer (Dashboard, Shipments, Users, Settings), key metrics bento grid (Total Shipments, Active Fleet), Google Maps Static API regional map, and Recent Shipments list.
- Protect all `/admin/*` routes — redirect non-admin users.

---

## P9 – Admin Shipment Management
**Priority:** High | **Requirements:** 8

- Build the Admin Shipments list page: full table with search bar, status filter chips, and sortable columns.
- Build the Shipment Detail/Edit page: editable fields for tracking number (with auto-generate button), current location, status dropdown, and an "Add Log Entry" form to append to the activity log.
- On save, persist changes and ensure the public tracking page reflects them immediately.

---

## P10 – Admin User Management
**Priority:** Medium | **Requirements:** 9

- Build the Admin Users list page: table with name, email, registration date, status badge, and action buttons (Edit, Deactivate).
- Build the User Edit modal/page: editable name, email, role, and account status toggle.
- Implement deactivation logic: blocked users see "Account suspended" on login.

---

## P11 – Services, About & Contact Pages
**Priority:** Medium | **Requirements:** 10

- Build the Services page from stitch `services/code.html`: four service cards (Air Expedited, Ocean Link, Land Network, Smart Inventory) with descriptions and CTAs.
- Build the About Us page from stitch `about_us/code.html`: company story, stats, and team section.
- Build the Contact Us page from stitch `contact_us/code.html`: contact form (name, email, subject, message) with client-side validation and success state.

---

## P12 – Responsive Layout & Navigation
**Priority:** Medium | **Requirements:** 11

- Implement mobile hamburger menu for the public TopAppBar.
- Implement mobile bottom navigation bar for the admin dashboard (as shown in stitch).
- Ensure all pages are fully responsive at mobile (375px), tablet (768px), and desktop (1280px) breakpoints.
- Conditionally render nav links based on auth state (guest / user / admin).

---

## P13 – Data Layer & State Management
**Priority:** High | **Requirements:** 2, 3, 4, 6, 7, 8, 9

- Define data models: User, Shipment, ActivityLogEntry, Quote.
- Implement a data persistence layer (localStorage for prototype, or backend API calls if a server is used).
- Implement role-based access control: `guest`, `user`, `admin`.

---

## P14 – Testing & QA
**Priority:** Medium | **Requirements:** All

- Cross-browser testing (Chrome, Firefox, Safari, Edge).
- Responsive layout QA at all breakpoints.
- Form validation edge cases (empty, invalid formats, boundary values).
- Tracking number lookup: valid, invalid, and edge-case inputs.
- Admin CRUD operations: create, read, update, deactivate.
- Accessibility audit (color contrast, keyboard navigation, ARIA labels).
