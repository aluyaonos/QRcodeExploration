# Prompt: Recreate the "Receive USD" Screen

---

**Before you begin, read the `MONIEVERSE_REFERENCE.md` file in the project root.** It contains the full design system — typography, color palette, component conventions, and critical implementation notes you must follow throughout this project.

---

## Task

Recreate the **"Receive USD"** screen from the MonieVerse app. Use the Figma MCP server to inspect the design — pull the exact layout, spacing, sizing, and alignment from Figma. The reference file (`MONIEVERSE_REFERENCE.md`) provides design tokens and context that Figma alone may not surface clearly.

## Tech & Setup

- **Framework:** React (or whatever the current project uses — check the existing codebase first).
- **Fonts:**
  - **Clash Grotesk** (display / headings / button labels) — imported from [Fontshare](https://www.fontshare.com/fonts/clash-grotesk) via their CSS embed.
  - **Inter** (body / labels / input values) — imported from Google Fonts.
- **Icons & Assets:**
  - **UI icons** (copy, chevron, close, checkmark, etc.) — use **Phosphor Icons** (`@phosphor-icons/react`). Never create custom SVGs for generic UI actions.
  - **Brand/token/network icons** (USDT, USDC, Ethereum, Polygon, MonieVerse logo, etc.) — these are **already stored locally in `src/`** as SVGs. Reference them from there — never use placeholder images or external URLs.

## Screen Overview

This is **Step 1 of 2** in a "Receive USD" flow. The layout has:

1. **Left sidebar stepper** — A vertical progress indicator with two steps: "Details" (active, purple dot) and "Confirmation" (inactive, gray dot), connected by a vertical line.
2. **Step counter** — "Step 1 / 2" in the top-right area.
3. **Main card** — The central content area containing everything below.

## Card Structure (Top to Bottom)

### Card Header with Gradient Background

The top of the card has a gradient banner behind the title.

**This gradient is a two-layer composite (this is critical — do not simplify to one gradient):**

- **Bottom layer:** Horizontal linear gradient from `#FFF0EB` (left) to `#DDD7FE` (right).
- **Top layer:** Vertical linear gradient from `rgba(255,255,255,0)` (top) to `#FFFFFF` (bottom).

```css
background:
  linear-gradient(to bottom, rgba(255,255,255,0) 0%, #FFFFFF 100%),
  linear-gradient(to right, #FFF0EB 0%, #DDD7FE 100%);
```

The title area shows an icon and **"Receive USD"** in Clash Grotesk Semi-Bold.

### Asset & Network Dropdowns

Two dropdowns side by side:

- **Asset dropdown** (left): Defaults to USDT. Options are USDC and USDT, each with their token icon.
- **Network dropdown** (right): Defaults to Ethereum. Options are Ethereum, BNB Smart Chain, Polygon, and Ton, each with their chain icon.

**Dropdown behavior:**
- Default/closed state: shows the selected value + icon. Border is `#E3E7EC`.
- Open state: border changes to `#7047EB` (Primary 400), chevron rotates up, dropdown menu appears below with options listed. The currently selected option has a green checkmark next to it.
- Placeholder state (before any selection): shows "Select asset" / "Select network" with a generic/placeholder icon.

### QR Code Section

- Label: **"Scan to fund your USD wallet"** (Inter, regular weight).
- A QR code centered inside a dashed-border container.
- **The icon in the center of the QR code changes based on the selected network** (e.g., Ethereum diamond logo when Ethereum is selected, Polygon logo when Polygon is selected, etc.).

### Divider

A horizontal line with **"or"** centered in the middle, separating the QR code from the address.

### Wallet Address Row

- Small label: **"Address"**
- Truncated wallet address displayed (e.g., `0xf7834K...783JA83`).
- A **"Copy"** button on the right with a clipboard icon.
- The address changes when the user switches asset or network.
- This entire section is inside a dashed-border container (same as QR code area).

### Info Rows

A light-background container with two rows:
- **"Our charges"** → **"1% of amount"**
- **"Rate"** → **"1 USDC = $0.98"** (updates based on selected asset — shows USDC or USDT accordingly)

### CTA Button

- Full-width, pill-shaped button (`border-radius: 100px`).
- Background: `#B692F6` (Primary 300).
- Text: **"I have sent the funds"** — white, Clash Grotesk, semi-bold.

## Dynamic Behavior

The following elements update reactively when the user changes the Asset or Network dropdown:

- The **QR code** (new address = new QR).
- The **center icon inside the QR code** (matches selected network).
- The **wallet address** displayed.
- The **rate text** in the info row (reflects selected asset, e.g., "1 USDT = $0.98" vs "1 USDC = $0.98").

## Styling Reminders

- Use the exact hex values from `MONIEVERSE_REFERENCE.md` — don't approximate colors.
- Clash Grotesk for all headings, titles, and buttons. Inter for everything else.
- Card has `border-radius: 24px` (`1.5rem`), buttons are `border-radius: 100px`, inputs/dropdowns are `border-radius: 8px`.
- The overall page background is a very light gray (`#F9F9FB` or `#F5F6F8` — confirm in Figma).
- Check Figma via MCP for exact pixel spacing, padding, and sizing. The reference .md gives you the design system; Figma is the source of truth for layout measurements.
- **Always convert `px` to `rem`** in CSS output (using `1rem = 16px`).
- **Button text (medium & large):** Text inside buttons gets `8px` (`0.5rem`) left/right padding and `24px` (`1.5rem`) height. No `gap` between icon and text — the text padding handles spacing.

## Deliverable

A single, working component (or page) that renders this screen with all the above behavior. Ensure it compiles, renders correctly, and all local assets load properly.
