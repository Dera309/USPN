```markdown
# Design System Specification: Editorial Logistics

## 1. Overview & Creative North Star
### The Creative North Star: "The Kinetic Architect"
In the world of cargo and logistics, "standard" design is often heavy, industrial, and cluttered. This design system rejects the warehouse aesthetic in favor of **Kinetic Architecture**. It treats digital space like a high-end logistics terminal: precise, expansive, and perpetually in motion.

We break the "template" look through **Intentional Asymmetry**. By utilizing large-scale editorial typography (Manrope) against a technical backbone (Inter), we create a sense of authoritative scale. Elements do not just sit on a grid; they overlap and breathe, using deep navy fields as "anchors" for vibrant, kinetic orange "action points." The result is a premium interface that feels less like a database and more like a command center.

---

## 2. Colors & Surface Philosophy
This system moves away from flat UI by utilizing a sophisticated Material-based tonal palette that emphasizes depth over decoration.

### The Color Palette
*   **Primary (`#000000` / `#0D1C32`):** Used for deep anchoring elements. We treat black and deep navy as the "void" in which cargo moves.
*   **Secondary/Accent (`#A04100` / `#FE6B00`):** This is your kinetic energy. Use it sparingly for primary CTAs and critical status indicators (e.g., "In Transit").
*   **Surface Tiers:** Use `surface` (#F8F9FA) for the main canvas. For nested content, use `surface-container-low` (#F3F4F5) and `surface-container-high` (#E7E8E9).

### The "No-Line" Rule
**Explicit Instruction:** Prohibit 1px solid borders for sectioning. Traditional borders create visual noise that disrupts the "flow" of logistics.
*   **Alternative:** Define boundaries through background color shifts. A `surface-container-lowest` card should sit on a `surface-container-low` section. The contrast is the border.

### The "Glass & Gradient" Rule
To elevate the "professional" feel to "premium," use Glassmorphism for floating navigation or overlay panels. 
*   **Implementation:** Use `surface-variant` at 70% opacity with a `backdrop-blur` of 20px. 
*   **Signature Textures:** For Hero sections, use a subtle linear gradient from `primary` (#000000) to `primary-container` (#0D1C32) at a 135-degree angle to create a sense of night-sky depth.

---

## 3. Typography
We use a dual-font system to balance "Editorial Authority" with "Technical Precision."

*   **Display & Headline (Manrope):** These are your "billboard" fonts. Use `display-lg` (3.5rem) for hero statements and `headline-md` (1.75rem) for section starts. The wide tracking and geometric builds of Manrope suggest global scale.
*   **Title, Body & Label (Inter):** Inter is the workhorse. Use `title-md` (1.125rem) for data headers and `body-md` (0.875rem) for standard information. It provides the technical legibility required for tracking numbers and manifest data.
*   **Hierarchy Note:** Always pair a `display-sm` headline with a `label-md` uppercase sub-header in `secondary` orange to create a high-contrast, professional focal point.

---

## 4. Elevation & Depth
In this design system, depth is a functional tool, not a stylistic flourish.

### The Layering Principle
Stacking is the new bordering. 
1.  **Level 0 (Base):** `surface`
2.  **Level 1 (Sections):** `surface-container-low`
3.  **Level 2 (Interactive Cards):** `surface-container-lowest` (White)

### Ambient Shadows
Avoid the "dirty" look of default shadows. Shadows must be "Ambient":
*   **Value:** 0px 12px 32px
*   **Color:** `on-surface` (#191C1D) at **4% opacity**.
*   **Result:** A soft, natural lift that makes a manifest or cargo card feel like it's hovering over the desk.

### The "Ghost Border" Fallback
If accessibility requires a container edge (e.g., in high-glare environments), use a **Ghost Border**:
*   **Stroke:** 1px
*   **Color:** `outline-variant` at **15% opacity**. Never use a 100% opaque outline.

---

## 5. Components

### Buttons: The Action Units
*   **Primary:** Solid `secondary` (#A04100) or `primary` (#000000). Use `DEFAULT` (0.5rem/8px) roundedness.
*   **Tertiary:** No background, `label-md` Inter, bold, with a `secondary` color. No border.

### Cards & Lists: The Manifest
*   **Rule:** Forbid divider lines.
*   **Separation:** Use `spacing-6` (1.5rem) or `spacing-8` (2rem) of vertical white space to separate list items. Use a slight background shift (`surface-container-highest`) on hover to define the interactive area.

### Logistics-Specific Components
*   **Route Trackers:** Use a "Thread" layout. A thin `outline-variant` line at 20% opacity connecting `secondary` orange dots. 
*   **Status Chips:** Use `secondary-container` (#FE6B00) with `on-secondary-container` (#572000) text for active shipments. Use `surface-variant` for pending shipments.
*   **Input Fields:** Ghost-style inputs. Use `surface-container-low` as the fill. On focus, transition to a `secondary` ghost border (20% opacity) and a subtle 4% ambient shadow.

---

## 6. Do's and Don'ts

### Do:
*   **Use Asymmetry:** Place a large headline on the left and a small data table on the right with significant white space between them.
*   **Embrace the Dark:** Use the `primary-container` (Deep Navy) for full-bleed sections to break up long white pages.
*   **Prioritize Breathing Room:** Use `spacing-16` (4rem) between major content blocks to convey a sense of "Premium Space."

### Don't:
*   **Don't use 1px solid lines:** Avoid the "Excel Sheet" look. Logistics is about flow, not boxes.
*   **Don't use saturated primary blue for text:** Use `on-surface` (#191C1D) for readability.
*   **Don't crowd the data:** If a table has 20 columns, use a horizontal scroll on a `surface-container-low` background rather than shrinking the text. High-end design never sacrifices legibility for density.

---
**Director's Note:** Every pixel must feel intentional. If an element doesn't have a clear purpose in the "Kinetic" flow of the page, remove it. This design system is about the power of what remains.```