# Task List

---

## Phase 1 – Project Setup & Design System
> Plan: [P1] | Requirements: All

- [x] 1.1 Initialize project folder structure (`/pages`, `/components`, `/assets`, `/data`)
- [x] 1.2 Configure Tailwind CSS with full USPN color palette from stitch design files
- [x] 1.3 Add Manrope + Inter Google Fonts and Material Symbols Outlined icon font
- [x] 1.4 Create shared CSS utilities: `.kinetic-gradient`, `.glass-panel`, `.ambient-shadow`
- [x] 1.5 Build reusable TopAppBar component (glassmorphism, USPN logo, nav links, CTA button)
- [x] 1.6 Build reusable Footer component (dark slate, 4-column grid, newsletter form)
- [x] 1.7 Build reusable StatusChip component (In Transit / Pending / Delayed / Delivered / Cancelled)
- [x] 1.8 Configure Google Maps Static API key and create a `mapEmbed(lat, lng, zoom)` helper function
- [x] 1.9 Define data models: `User`, `Shipment`, `ActivityLogEntry`, `Quote`
- [x] 1.10 Implement data persistence layer (localStorage) with CRUD helpers for each model
- [x] 1.11 Implement role-based auth state: `guest` / `user` / `admin` with route guard helper

---

## Phase 2 – Authentication
> Plan: [P2] | Requirements: [Req 2]

- [x] 2.1 Build Login page layout (split-panel: dark editorial left, form right) from `stitch/login/code.html`
- [x] 2.2 Implement login form: email + password inputs, "Remember me" checkbox, "Forgot Password?" link
- [x] 2.3 Implement client-side login validation (required, email format) with inline error messages
- [x] 2.4 Implement login logic: match credentials, set auth state, redirect to correct dashboard by role
- [x] 2.5 Implement "Remember me" session persistence via localStorage
- [x] 2.6 Build Registration page (same visual style as login, adds name + confirm password fields)
- [x] 2.7 Implement registration validation (required, email format, password match, min length)
- [x] 2.8 Implement registration logic: create User record, auto-login, redirect to user dashboard
- [x] 2.9 Build Forgot Password page/modal: email input, success state ("Check your inbox")
- [x] 2.10 Show "Account suspended" error on login attempt for deactivated users

---

## Phase 3 – Public Home Page
> Plan: [P3] | Requirements: [Req 1, 5, 11]

- [x] 3.1 Build Home page hero section (kinetic gradient, headline, tracking search bar) from `stitch/home/code.html`
- [x] 3.2 Wire hero tracking search: on submit, redirect to `/tracking?id={number}`
- [x] 3.3 Build services bento grid section (Air Expedited, Ocean Link, Land Network, Smart Inventory)
- [x] 3.4 Build "Why Choose Us" dark full-bleed section with 4 feature cards and stats overlay
- [x] 3.5 Build trust badges strip (ISO 9001, AEO, IATA, SMETA, FIATA)
- [x] 3.6 Assemble full Home page with TopAppBar and Footer

---

## Phase 4 – Quote Calculator
> Plan: [P4] | Requirements: [Req 5]

- [x] 4.1 Build Quote Calculator form: origin, destination, weight, dimensions (L×W×H), service type select
- [x] 4.2 Implement client-side pricing logic with rate table (base rate × weight × distance multiplier × service factor)
- [x] 4.3 Display estimated price range dynamically on any input change (no submit required)
- [x] 4.4 Add "Book This Shipment" CTA that navigates to `/booking` with form fields pre-filled via URL params or state
- [x] 4.5 Integrate Quote Calculator as a section on the Home page and as a standalone `/quote` page

---

## Phase 5 – Shipment Tracking Page
> Plan: [P5] | Requirements: [Req 6]

- [x] 5.1 Build Tracking page hero: asymmetric layout, tracking number search input from `stitch/tracking/code.html`
- [x] 5.2 Implement tracking lookup: read shipment by number from data layer, render all sections
- [x] 5.3 Build visual progress timeline (Ordered → Picked Up → In Transit → Delivered) with active step pulse animation
- [x] 5.4 Build activity log section: thread layout with orange dots, timestamps, and location text
- [x] 5.5 Integrate Google Maps Static API mini-map: center on `shipment.currentLocation` coordinates
- [x] 5.6 Build package manifest card (weight, dimensions, service type, fragile flag, "Download PDF" button)
- [x] 5.7 Handle "not found" state: display clear error message when tracking number is invalid
- [x] 5.8 Pre-fill tracking input from URL param `?id=` on page load

---

## Phase 6 – User Dashboard & Account
> Plan: [P6] | Requirements: [Req 3, 11]

- [x] 6.1 Build User Dashboard page: shipment list cards (tracking number, route, status chip, date)
- [x] 6.2 Link each shipment card to `/tracking?id={number}`
- [x] 6.3 Build Account Settings page: editable name, email, phone fields with save button
- [x] 6.4 Build Change Password form within Account Settings (current password, new, confirm)
- [x] 6.5 Apply route guard: redirect unauthenticated users from `/dashboard/*` to `/login`
- [x] 6.6 Conditionally render nav links based on auth state (Login/Register for guests, Dashboard/Logout for users)

---

## Phase 7 – Shipment Booking
> Plan: [P7] | Requirements: [Req 4]

- [x] 7.1 Build Booking form page: origin, destination, cargo type, weight, dimensions, special handling checkboxes, notes
- [x] 7.2 Implement booking form validation (all required fields highlighted on error)
- [x] 7.3 On valid submit: create Shipment record (status: "Pending", no tracking number), save to data layer
- [x] 7.4 Build Booking Confirmation page: shipment summary + "Tracking number will be assigned shortly" notice
- [x] 7.5 Pre-fill booking form when navigating from Quote Calculator (read URL params or passed state)
- [x] 7.6 Apply route guard: only logged-in users can access `/booking`

---

## Phase 8 – Admin Dashboard
> Plan: [P8] | Requirements: [Req 7, 11]

- [x] 8.1 Build Admin layout: persistent dark side nav drawer (Dashboard, Shipments, Users, Settings) from `stitch/admin_dashboard/code.html`
- [x] 8.2 Build mobile bottom navigation bar for admin (4 icons: Dashboard, Shipments, Users, Settings)
- [x] 8.3 Build key metrics bento grid: Total Shipments card, Active Fleet card, (Revenue card optional)
- [x] 8.4 Integrate Google Maps Static API regional performance map in the dashboard
- [x] 8.5 Build Recent Shipments list (last 24h): tracking number, route, status chip, chevron link
- [x] 8.6 Apply route guard: redirect non-admin users from `/admin/*` to home or login

---

## Phase 9 – Admin Shipment Management
> Plan: [P9] | Requirements: [Req 8]

- [x] 9.1 Build Admin Shipments list page: full table with columns (Tracking #, Route, Status, Date, Actions)
- [x] 9.2 Implement search bar (filter by tracking number or route) and status filter chips
- [x] 9.3 Build Shipment Detail/Edit page: editable tracking number field with "Auto-Generate" button (`USPN-XXXX-XX`)
- [x] 9.4 Add current location field (text input for city/hub name + lat/lng for map)
- [x] 9.5 Add status dropdown (Pending / In Transit / Delayed / Delivered / Cancelled)
- [x] 9.6 Build "Add Activity Log Entry" form: timestamp (auto-filled), location text, event description
- [x] 9.7 On save: persist all changes to data layer; verify public tracking page reflects updates immediately

---

## Phase 10 – Admin User Management
> Plan: [P10] | Requirements: [Req 9]

- [x] 10.1 Build Admin Users list page: table with name, email, registration date, status badge, Edit/Deactivate buttons
- [x] 10.2 Build User Edit modal/page: editable name, email, role select, account status toggle
- [x] 10.3 Implement deactivation: set `user.status = "suspended"`, block login with "Account suspended" message
- [x] 10.4 Implement reactivation: toggle status back to "active"

---

## Phase 11 – Services, About & Contact Pages
> Plan: [P11] | Requirements: [Req 10]

- [x] 11.1 Build Services page from `stitch/services/code.html`: 4 service cards with descriptions and "Get a Quote" CTAs
- [x] 11.2 Build About Us page from `stitch/about_us/code.html`: company story, stats, and team section
- [x] 11.3 Build Contact Us page from `stitch/contact_us/code.html`: contact form (name, email, subject, message)
- [x] 11.4 Implement contact form validation and success state ("Message sent" confirmation)

---

## Phase 12 – Responsive Layout & Navigation
> Plan: [P12] | Requirements: [Req 11]

- [x] 12.1 Implement mobile hamburger menu for public TopAppBar (slide-down or overlay drawer)
- [x] 12.2 Ensure all public pages are responsive at 375px, 768px, and 1280px breakpoints
- [x] 12.3 Ensure admin dashboard is responsive (side nav collapses to bottom nav on mobile)
- [x] 12.4 Audit all pages for consistent spacing using `spacing-16` (4rem) between major content blocks

---

## Phase 13 – Testing & QA
> Plan: [P14] | Requirements: All

- [x] 13.1 Cross-browser test all pages (Chrome, Firefox, Safari, Edge)
- [x] 13.2 Responsive layout QA at all three breakpoints for every page
- [x] 13.3 Test all form validations: empty fields, invalid email, password mismatch, boundary weight values
- [x] 13.4 Test tracking lookup: valid number, invalid number, pre-filled from URL param
- [x] 13.5 Test admin shipment CRUD: create booking → admin assigns tracking # → status update → visible on tracking page
- [x] 13.6 Test admin user deactivation → login blocked → reactivation → login restored
- [x] 13.7 Test route guards: unauthenticated access to `/dashboard`, `/booking`, `/admin`
- [x] 13.8 Accessibility audit: color contrast ratios, keyboard tab order, ARIA labels on interactive elements
- [x] 13.9 Verify Google Maps Static API map renders correctly on tracking page and admin dashboard
