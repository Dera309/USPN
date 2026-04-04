# Requirements Document

## Introduction
USPN is a premium cargo logistics web platform that enables users to book shipments, track cargo in real-time, and manage their accounts. Administrators have a dedicated dashboard to manage all shipments, assign tracking numbers, update cargo location/status, and manage user data. The platform uses the "Kinetic Architect" design system (deep navy + orange accent, Manrope/Inter fonts, glassmorphism) and Google Maps Static API for map visuals. No payment processing is included; a quote calculator is provided instead.

---

## Requirements

### 1. Public Home Page
**User Story:**
> As a visitor, I want to see a compelling home page with a quick tracking search so that I can immediately check a shipment or learn about USPN's services.

**Acceptance Criteria:**
> WHEN a visitor lands on the home page THEN the system SHALL display a hero section with a tracking number input and "Track Status" button, a services bento grid, a "Why Choose Us" section, and a footer with navigation links.
> WHEN a visitor submits a tracking number from the hero search THEN the system SHALL redirect to the tracking page with the number pre-filled.

---

### 2. User Registration & Login
**User Story:**
> As a new user, I want to register for an account so that I can book and manage my shipments.

**Acceptance Criteria:**
> WHEN a visitor submits a valid email and password on the registration form THEN the system SHALL create an account and redirect to the user dashboard.
> WHEN a user submits valid credentials on the login page THEN the system SHALL authenticate them and redirect to their dashboard.
> WHEN a user submits invalid credentials THEN the system SHALL display an inline error message without clearing the email field.
> WHEN a user checks "Remember this workstation" THEN the system SHALL persist the session across browser restarts.
> WHEN a user clicks "Forgot Password?" THEN the system SHALL send a password reset email.

---

### 3. User Account Dashboard
**User Story:**
> As a logged-in user, I want a personal dashboard so that I can view my shipment history and account details.

**Acceptance Criteria:**
> WHEN a user accesses their dashboard THEN the system SHALL display a list of their shipments with tracking number, route, and current status.
> WHEN a user clicks a shipment THEN the system SHALL navigate to the shipment tracking detail page.
> WHEN a user updates their profile information THEN the system SHALL save the changes and display a success confirmation.

---

### 4. Shipment Booking
**User Story:**
> As a logged-in user, I want to book a new shipment so that I can arrange cargo transport through USPN.

**Acceptance Criteria:**
> WHEN a user submits the booking form with origin, destination, cargo type, weight, and dimensions THEN the system SHALL create a shipment record with a "Pending" status.
> WHEN a booking is created THEN the system SHALL display a confirmation page with the shipment details and a note that a tracking number will be assigned by an admin.
> WHEN required fields are missing THEN the system SHALL highlight the missing fields and prevent submission.

---

### 5. Quote Calculator
**User Story:**
> As a visitor or user, I want to calculate a shipping quote so that I can estimate costs before booking.

**Acceptance Criteria:**
> WHEN a user enters origin, destination, cargo weight, and service type THEN the system SHALL display an estimated price range.
> WHEN the user changes any input THEN the system SHALL recalculate and update the quote in real time.
> WHEN the user clicks "Book This Shipment" from the quote result THEN the system SHALL pre-fill the booking form with the entered details.

---

### 6. Shipment Tracking
**User Story:**
> As any visitor, I want to track a shipment by its tracking number so that I can see its current location and status.

**Acceptance Criteria:**
> WHEN a user enters a valid tracking number THEN the system SHALL display the shipment status, a visual progress timeline (Ordered → Picked Up → In Transit → Delivered), an activity log with timestamps and locations, a Google Maps Static API map showing the current location, and the package manifest.
> WHEN a user enters an invalid or unknown tracking number THEN the system SHALL display a "Shipment not found" message.
> WHEN the shipment status is "In Transit" THEN the system SHALL show an animated pulse indicator on the current step.

---

### 7. Admin Dashboard – Overview
**User Story:**
> As an admin, I want a global overview dashboard so that I can monitor all shipments, active fleet, and key metrics at a glance.

**Acceptance Criteria:**
> WHEN an admin logs in THEN the system SHALL redirect to the admin dashboard showing total shipments, active fleet count, and a Google Maps Static API regional performance map.
> WHEN an admin views the dashboard THEN the system SHALL display a "Recent Shipments" list with status chips for the last 24 hours.
> WHEN an admin clicks a shipment in the list THEN the system SHALL open the shipment detail/edit view.

---

### 8. Admin – Shipment Management
**User Story:**
> As an admin, I want to manage all shipments so that I can assign tracking numbers, update cargo location, and change shipment status.

**Acceptance Criteria:**
> WHEN an admin views the shipments list THEN the system SHALL display all shipments with filtering by status and search by tracking number or route.
> WHEN an admin opens a shipment THEN the system SHALL allow editing of: tracking number, current location, status (Pending / In Transit / Delayed / Delivered / Cancelled), and adding activity log entries.
> WHEN an admin saves changes THEN the system SHALL update the record and the change SHALL be immediately visible on the public tracking page.
> WHEN an admin assigns a tracking number to a "Pending" shipment THEN the system SHALL generate a unique number in the format `USPN-XXXX-XX` if none is provided.

---

### 9. Admin – User Management
**User Story:**
> As an admin, I want to manage user accounts so that I can view, edit, or deactivate users.

**Acceptance Criteria:**
> WHEN an admin views the users list THEN the system SHALL display all registered users with name, email, registration date, and account status.
> WHEN an admin deactivates a user THEN the system SHALL prevent that user from logging in and display a "Account suspended" message on login attempt.
> WHEN an admin edits a user's details THEN the system SHALL save the changes and reflect them in the user's profile.

---

### 10. Services & About Pages
**User Story:**
> As a visitor, I want to browse USPN's services and learn about the company so that I can decide whether to use the platform.

**Acceptance Criteria:**
> WHEN a visitor navigates to the Services page THEN the system SHALL display Air Expedited, Ocean Link, Land Network, and Smart Inventory service cards with descriptions.
> WHEN a visitor navigates to the About Us page THEN the system SHALL display company information, stats, and a contact section.
> WHEN a visitor submits the contact form THEN the system SHALL send the message and display a success confirmation.

---

### 11. Navigation & Responsive Layout
**User Story:**
> As any user, I want consistent navigation and a responsive layout so that I can use USPN on any device.

**Acceptance Criteria:**
> WHEN a user views the site on mobile THEN the system SHALL display a hamburger menu or bottom navigation bar.
> WHEN a user is logged in THEN the system SHALL show account/dashboard links in the navigation.
> WHEN a user is not logged in THEN the system SHALL show Login and Register links.
> WHEN an admin is logged in THEN the system SHALL show a persistent side navigation drawer with Dashboard, Shipments, Users, and Settings links.
