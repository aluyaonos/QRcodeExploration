# MonieVerse Project Reference

> **This file must be referenced by Claude in every task related to the MonieVerse project. It contains design tokens, component conventions, and critical implementation notes.**

---

## Fonts

### Display / Headings — Clash Grotesk

- **Source:** [Fontshare](https://www.fontshare.com/fonts/clash-grotesk)
- **Import:** Use the Fontshare CSS embed (not Google Fonts).
- **Weights used:** Regular (400), Medium (500), Semi-Bold (600)
- **Usage:** All headings, page titles, card titles, button labels, and any display-level text.

#### Type Scale (Clash Grotesk)

| Token          | Size  | Line Height | Tracking | Notes                    |
|----------------|-------|-------------|----------|--------------------------|
| Display 2xl    | 72px  | 90px        | -2%      | Hero / splash screens    |
| Display xl     | 60px  | 72px        | -2%      | Major section headings   |
| Display lg     | 48px  | 60px        | -2%      | Page titles              |
| Display md     | 36px  | 44px        | -2%      | Card titles              |
| Display sm     | 30px  | 38px        | —        | Sub-headings             |
| Display xs     | 24px  | 32px        | —        | Small headings           |
| Display xxs    | 24px  | 32px        | —        | Micro headings           |

### Body / UI Copy — Inter

- **Source:** [Google Fonts](https://fonts.google.com/specimen/Inter)
- **Weights used:** Regular (400), Medium (500), Semi-Bold (600)
- **Usage:** All body text, labels, descriptions, input values, helper text, info rows.

#### Type Scale (Inter)

| Token       | Size  | Line Height | Notes                              |
|-------------|-------|-------------|------------------------------------|
| Text lg     | 18px  | 28px        | Large body text                    |
| Text md     | 16px  | 24px        | Default body / input values        |
| Text sm     | 14px  | 20px        | Secondary text, labels, helper     |
| Text xs     | 12px  | 18px        | Fine print, captions               |
| Caption     | 12px  | 18px        | Tracking +8%, uppercase captions   |

---

## Color Palette

### Neutrals (Gray)

| Step | Hex       |
|------|-----------|
| 0    | #FFFFFF   |
| 25   | #F9F9FB   |
| 50   | #F5F6F8   |
| 100  | #EEEEF0   |
| 200  | #E3E7EC   |
| 300  | #BBC0CA   |
| 400  | #868FA2   |
| 500  | #4B5565   |
| 600  | #101828   |

### Primary — Purple

| Step | Hex       |
|------|-----------|
| 100  | #F6F0FF   |
| 200  | #E9D7FE   |
| 300  | #B692F6   |
| 400  | #7047EB   |
| 500  | #5742CE   |
| 600  | #28197D   |

### Error — Red

| Step | Hex       |
|------|-----------|
| 100  | #FEF3F2   |
| 200  | #FFCDCA   |
| 300  | #FA7066   |
| 400  | #F04438   |
| 500  | #D92D20   |
| 600  | #7A271A   |

### Warning — Orange

| Step | Hex       |
|------|-----------|
| 100  | #FEF0EB   |
| 200  | #FED5C8   |
| 300  | #FDAC91   |
| 400  | #FF7D52   |
| 500  | #D84E04   |
| 600  | #9C3310   |

### Amber / Yellow

| Step | Hex       |
|------|-----------|
| 100  | #FFFAEB   |
| 200  | #FEF0C7   |
| 300  | #FEDF89   |
| 400  | #FEC84B   |
| 500  | #F79009   |
| 600  | #B54708   |

### Success — Green

| Step | Hex       |
|------|-----------|
| 100  | #ECFDF5   |
| 200  | #DFFBEE   |
| 300  | #93E9C1   |
| 400  | #66C498   |
| 500  | #339969   |
| 600  | #14613D   |

### Info — Cyan / Teal

| Step | Hex       |
|------|-----------|
| 100  | #F0F9FF   |
| 200  | #B9E6FE   |
| 300  | #7CD4FD   |
| 400  | #0BA5E    |
| 500  | #0086C9   |
| 600  | #0B4A6F   |

---

## Global UI Conventions

### Corner Radius

- Cards / modals: `24px` (`1.5rem`)
- Buttons: `100px` (fully rounded / pill)
- Input fields / dropdowns: `8px`
- QR code container: dashed border, `8px` radius
- Dropdown menu: `8px`

### Shadows & Elevation

- Cards: subtle `box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)`
- Dropdowns: `box-shadow: 0 4px 16px rgba(0,0,0,0.08)`

### Spacing

- Card internal padding: `24px` – `32px`
- Gap between form fields (side by side): `16px`
- Section spacing within cards: `24px`

### Button Text Convention (Medium & Large Buttons)

- Text inside medium and large buttons must have **`8px` (`0.5rem`) left and right padding** and a **height of `24px` (`1.5rem`)**.
- This padding on the text element itself replaces any `gap` between icons and text — **do not add extra spacing (e.g., `gap`) between icon and text** in the button container. The text padding handles the visual separation.

---

## Key Component Patterns

### Card Header Gradient (CRITICAL)

The gradient behind the card title (e.g., "Receive USD") is a **two-layer composite**:

1. **Layer 1 (bottom):** Horizontal linear gradient — `#FFF0EB` (left) → `#DDD7FE` (right).
2. **Layer 2 (top):** Vertical linear gradient — `rgba(255,255,255,0)` (top, fully transparent) → `#FFFFFF` (bottom, fully opaque).

**CSS implementation:**
```css
background:
  linear-gradient(to bottom, rgba(255,255,255,0) 0%, #FFFFFF 100%),
  linear-gradient(to right, #FFF0EB 0%, #DDD7FE 100%);
```
> The vertical white fade sits on top and blends the colored gradient into the white card body below.

### Dropdowns

- **Default state:** Shows the selected value with its icon (e.g., USDT icon + "USDT"). Border is `#E3E7EC` (Neutral 200).
- **Open state:** Border becomes `#7047EB` (Primary 400). Chevron rotates upward. A dropdown menu appears below with options. The selected option shows a green checkmark.
- **Placeholder state:** Shows "Select asset" or "Select network" with a generic icon.
- **Asset dropdown options:** USDC, USDT (each with its respective token icon).
- **Network dropdown options:** Ethereum, BNB Smart Chain, Polygon, Ton (each with its chain icon).

### QR Code Section

- Label above: "Scan to fund your USD wallet"
- QR code is centered in a dashed-border container.
- The icon in the **center of the QR code changes based on the selected network** (e.g., Ethereum diamond, Polygon logo, etc.).
- Below the QR code, a divider with "or" separates it from the wallet address.

#### QR Code "Eyes" — Definition (CRITICAL)

The **eyes** of the QR code are the **three finder-pattern shapes** located at:
- **Top-left corner**
- **Top-right corner**
- **Bottom-left corner**

Each eye consists of exactly **two paths** in the SVG:
1. A large **rounded outer square** (border ring)
2. A filled **inner circle / dot**

These are the visually distinct square-with-circle shapes visible in the three corners. They are **NOT** the small individual data module squares that make up the rest of the QR code.

**Absolute SVG coordinates** (viewBox `0 0 240 240`):

| Eye           | x range   | y range   | Centre (cx, cy) |
|---------------|-----------|-----------|-----------------|
| Top-left      | 18 – 61   | 18 – 61   | ≈ (40, 40)      |
| Top-right     | 178 – 221 | 18 – 61   | ≈ (200, 40)     |
| Bottom-left   | 18 – 61   | 178 – 221 | ≈ (40, 200)     |

**Classification rule used in `src/app.js`** (do not change to percentage-based):
```js
var isEye = (cx < 65  && cy < 65)  ||   // top-left finder
            (cx > 175 && cy < 65)  ||   // top-right finder
            (cx < 65  && cy > 175);     // bottom-left finder
```
Data modules adjacent to the finders start at x/y ≈ 67, so the `< 65` / `> 175` boundaries cleanly isolate only the finder paths with no leakage into data modules. **Never revert to a percentage-of-bounding-box approach.**

### Wallet Address Row

- Label: "Address"
- Truncated address displayed (e.g., `0xf7834K...783JA83`).
- "Copy" button on the right with a clipboard icon.
- The address and QR code **change when the network or asset selection changes**.

### Info Row

- Two rows inside a light container:
  - "Our charges" → "1% of amount"
  - "Rate" → "1 USDC = $0.98" (this rate text updates based on the selected asset)

### Primary CTA Button

- Full-width, pill-shaped (`border-radius: 100px`).
- Background: `#B692F6` (Primary 300) — a soft purple.
- Text: white, `font-family: 'Clash Grotesk'`, semi-bold.
- Label: "I have sent the funds"

### Stepper / Progress Indicator (Left Sidebar)

- Vertical stepper with two steps: "Details" (active) and "Confirmation" (inactive).
- Active step has a filled purple dot; inactive step has a gray dot.
- A vertical line connects the dots.
- Top right shows "Step 1 / 2".

---

## Icons

### UI Icons — Phosphor Icons

- **Library:** [Phosphor Icons](https://phosphoricons.com/)
- **Package:** `@phosphor-icons/react`
- **Usage:** All general-purpose UI icons across the project must use Phosphor Icons. Never create custom SVGs or use other icon libraries for UI icons.

#### Common Phosphor Icons Used in This Project

| Purpose              | Phosphor Icon Component       | Weight   |
|----------------------|-------------------------------|----------|
| Copy / clipboard     | `<Copy />`                    | Regular  |
| Dropdown chevron     | `<CaretDown />` / `<CaretUp />`| Regular |
| Close / dismiss      | `<X />`                       | Regular  |
| Checkmark (selected) | `<Check />`                   | Regular  |
| QR code icon         | `<QrCode />`                  | Regular  |
| Escape / back        | `<ArrowLeft />`               | Regular  |
| Info                 | `<Info />`                    | Regular  |
| Warning              | `<Warning />`                 | Regular  |
| Success              | `<CheckCircle />`             | Regular  |
| Error                | `<XCircle />`                 | Regular  |

> **Always import directly:** `import { Copy, CaretDown, Check, X } from "@phosphor-icons/react";`
>
> **Sizing:** Match the icon size to the context — typically `size={16}` for inline/small UI, `size={20}` for default, `size={24}` for prominent actions. Confirm exact sizes in Figma.
>
> **Weight:** Default to `weight="regular"`. Use `weight="bold"` only if the Figma design shows a bolder stroke. Phosphor supports: `thin`, `light`, `regular`, `bold`, `fill`, `duotone`.

### Brand / Token / Network Assets — Local Files

Brand-specific icons (token logos, network logos, the MonieVerse logo) are **not available in Phosphor** and are stored locally in `src/` (or a subfolder like `src/assets/`). **Always reference these local SVG/PNG files — never use placeholder images or external URLs.**

Local assets to expect:
- **Token icons:** `usdc.svg`, `usdt.svg`
- **Network icons:** `ethereum.svg`, `bnb.svg`, `polygon.svg`, `ton.svg`
- **QR center icons:** Per-network variants or dynamically rendered based on the selected network
- **MonieVerse logo**

### Decision Rule

> **Is it a generic UI action** (copy, close, chevron, check, arrow, etc.)? → Use **Phosphor Icons**.
>
> **Is it a brand, token, or network logo** (USDT, Ethereum, MonieVerse, etc.)? → Use the **local SVG asset** from `src/`.
>
> **Never mix** — don't use Phosphor for brand icons or local SVGs for generic UI icons.

---

## General Rules for Claude

1. **UI icons must use Phosphor Icons (`@phosphor-icons/react`)** — never create custom SVGs or use other icon libraries for UI icons.
2. **Brand/token/network icons use local assets** from `src/` — never use placeholder images or external URLs for these.
3. **Clash Grotesk for display, Inter for body** — no exceptions.
4. **Follow the color palette exactly** — use the hex values from this file, not approximations.
5. **The card header gradient is two layers** — never simplify to a single gradient.
6. **Dropdowns are dynamic** — the QR code center icon, wallet address, and rate info all update based on asset + network selection.
7. **Pixel-perfect fidelity to the Figma designs** — use the Figma MCP server to inspect exact spacing, sizing, and alignment. This .md file provides context; Figma is the source of truth for measurements.
8. **Responsive but desktop-first** — match the Figma desktop layout as the primary target.
9. **Use SVGs for all icons** to keep everything crisp at any resolution.
10. **Always convert `px` to `rem`** — when the user specifies values in `px`, convert them to `rem` in the CSS output (using `1rem = 16px`). This ensures scalable, accessible sizing across the project.
