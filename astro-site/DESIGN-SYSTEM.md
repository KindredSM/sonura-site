# Sonura Design System — "Sessions" (editorial / brutalist / music-mag)

Derived from the Sonura Sessions event posters and the 2026-07 landing-page redesign.
The vibe: underground music magazine, not corpo SaaS. Black field, huge condensed
uppercase type, hairline rules, square corners, film grain, one purple accent.

**The single source of truth for values is the `:root` block in `src/styles/global.css`.**
Never hardcode a color, font, or radius — always use the token. If a value you need
doesn't exist, map to the nearest token; do not invent a new shade.

---

## 1. Tokens (defined in `src/styles/global.css` `:root`)

| Token | Value | Use |
|---|---|---|
| `--font-display` | Anton | Big headlines ONLY (h1, section h2, statement h3). Always uppercase. |
| `--font-body` | Archivo | Everything else. There are exactly TWO fonts — never add another (no monospace). |
| `--bg` | `#050505` | Page background; also text color on light (button) surfaces |
| `--panel-bg` | `#0a0a0a` | Slightly raised panel surface (use sparingly) |
| `--fg` | `#f4f4f0` | Tier-1 text: headings, primary copy, feature lists; also light button fill |
| `--muted` | `#c7c7c0` | Tier-2 text: ALL secondary/reading copy (subheads, descriptions, answers) |
| `--faint` | `rgba(244,244,240,0.55)` | Tier-3 text: de-emphasized only (strikethrough, ghost numerals, separators, placeholders) |
| `--primary` | `#7c3aed` | Purple. ACCENT ONLY: badges, featured borders, grain band, prompt text. **Never buttons.** |
| `--accent` | `#b8a4ff` | Rarely; light purple accents |
| `--border` | `#27272a` | Subtle separators inside dark panels |
| `--border-light` | `#3f3f46` | Soft card/panel edges |
| `--hairline` | `rgba(244,244,240,0.35)` | THE structural line: nav bottom, section rules, button outlines, frames. All visible "design lines" use this one color. |
| `--radius-ui` | `0` | Buttons, inputs, toggles, chrome — always square |
| `--radius-panel` | `0` | Cards and panels — always square |
| `--nav-h` | `71px` (62px ≤768px) | Height of sticky nav; full-viewport heroes are `calc(100svh - var(--nav-h))` |

Exactly **three text tiers** (`--fg`, `--muted`, `--faint`). Exactly **three line
weights** (`--border`, `--border-light`, `--hairline`). Exactly **two fonts**.

## 2. Typography & casing

Four text roles. Every piece of text on a page is one of these:

| Role | Font | Casing | Spec |
|---|---|---|---|
| **Display** (h1, section h2, statement h3) | `var(--font-display)` | `text-transform: uppercase` | weight 400, `line-height: 1` (0.94–0.98 for multi-line h1), `letter-spacing: 0.01em`. Sizes: h1 `clamp(52px, 7.7vw, 115px)`; section h2 `clamp(38px, 4.8vw, 68px)`; sub-heads (h3) `clamp(24px, 2.8vw, 38px)` |
| **Metadata** (kickers, buttons, labels, names, durations) | `var(--font-body)` | `text-transform: uppercase` | 11–13px, weight 500–700, `letter-spacing: 0.1em–0.16em`, color `--muted` (or `--fg` for emphasis) |
| **Support** (subheads, one-line descriptions, card blurbs, FAQ answers) | `var(--font-body)` | `text-transform: lowercase` | 14–17px, weight 400, color `--muted`, `letter-spacing: 0.022em`, `line-height: 1.8`, `word-spacing: 0.04em` |
| **Long-form** (blog articles, terms/privacy prose) | `var(--font-body)` | sentence case (normal) | readable body settings; do NOT lowercase multi-paragraph articles |

Slash metadata pattern for kickers: `01 / COMMUNITY`, `WEDNESDAY / 29 JULY / 6PM`.
Section kickers use the global `.section-kicker` class and are numbered per page.

## 3. Layout

- **One horizontal system.** Nav, sections, and footer all use side padding
  `var(--page-pad)` — `max(clamp(24px, 5vw, 72px), calc((100% - var(--content-max)) / 2))`.
  Below `--content-max` (1440px) this behaves as fluid side margins; on wider
  screens the whole content column centers itself, so nothing strands in the left
  half of a big monitor and the nav logo always aligns with section content.
  Never hardcode side padding — use `var(--page-pad)`. Long-form prose columns
  additionally cap at ~760px (left-aligned within the container).
- **Sections** are separated by `border-top: 1px solid var(--hairline)` and use
  vertical padding `clamp(72px, 9vw, 110px)`.
- **Section header** = kicker (`.section-kicker`, numbered `01 /`, `02 /`, …) +
  display h2, both left-aligned. Never center headings.
- **Full-viewport heroes** are `min-height: calc(100svh - var(--nav-h))`; the next
  section's hairline must sit exactly on the fold. Sub-pages may use shorter heroes.
- Grids: prefer ruled rows (border-top per row) and index numbers (`01`, `02`, …,
  tabular-nums, color `--faint`) over floating cards.

## 4. Components

- **Buttons**: square, uppercase, letterspaced (13px / 600 / 0.14–0.16em / padding ~20px 36px).
  Primary = `--fg` background + `--bg` text. Secondary = transparent + `1px solid var(--hairline)`,
  hover border brightens to `--fg`. NO purple buttons. NO translateY/scale on hover;
  feedback is color/border change plus the custom cursor. Labels are centered and
  NEVER wrap (`white-space: nowrap`): any label longer than ~16 characters gets a
  short mobile variant via `<span class="btn-label-full">…</span><span class="btn-label-short">…</span>`
  (globals swap them at ≤480px) — e.g. "Start Creating Free" → "Start free".
- **Nav / footer**: solid `rgba(5,5,5,0.92)` bar + blur, `--hairline` bottom rule,
  lowercase links, identical at top and scrolled (no morphing). Footer columns
  uppercase letterspaced headings. The nav CTA ("Sign up") follows the standard
  button spec (uppercase, letterspaced): lowercase = links, uppercase = actions.
- **Grain band edges**: the purple band never has hard edges. The final-CTA band
  uses the pre-faded asset `/images/purple-grain-band-fade.{webp,avif}` (grainy
  dissolve baked into the alpha channel, rendered with `background-size: 100% 100%`);
  smaller uses of the raw band get a CSS `mask-image` gradient.
- **Cards / tiles**: square, `1px solid var(--border-light)` (or `--hairline` for
  poster-frame emphasis), background transparent or `--panel-bg`. Hover: border
  brightens; never lifts.
- **Poster frame**: emphasized blocks (final CTA) get `1px solid var(--hairline)`
  frame with the purple grain band strip inside the bottom edge:
  `/images/purple-grain-band.webp` (+`.avif` via `image-set`), `background-size: cover`.
- **Film grain**: fixed full-page overlay, SVG `feTurbulence` data-URI at opacity
  ~0.14 (see `--grain` in `home-editorial.css`). Optional per-tile grain at ~0.22.
- **Pull quotes**: no card chrome — hairline-ruled columns/rows, quote in Support
  style at 16–19px, author as Metadata ("ERIK WESSLEN / ENGINEER"), square grayscale avatar. Quotes are verbatim customer speech: they keep their original
  capitalization (no lowercase transform), like the em-dash exemption.
- **FAQ**: `<details>` list with border-top rule per item, uppercase Metadata
  question, `+`/`−` indicator, lowercase Support answer.
- **Media**: square corners, hairline border, images desaturated
  (`filter: grayscale(.5) contrast(1.08)`) until hover restores color.
- **Inline text links**: ONE style everywhere — use the global `.text-link` class
  (or match it): `color: var(--fg); font-weight: 600; text-decoration: underline;
  text-decoration-thickness: 1px; text-underline-offset: 7px; text-decoration-color:
  currentColor` — underline is ALWAYS the same color as the text (white on white).
  Never use border-bottom underlines, ::after bars, grey/purple underlines, or
  purple link text. Applies to lowercase support links and uppercase metadata links alike.
- **Cursor**: site-wide custom arrow (off-white/dark-outline SVG), hand variant on
  interactive elements. Defined once in `global.css` — don't override per page.

## 5. Voice & copy rules (see memory/CLAUDE context)

- Headlines lead with the outcome verb; the word "AI" never appears in headings or
  hero copy (SEO `<title>`/meta keeps its keywords — that's Tier A and untouched).
- Social proof: "Loved by 12,000+ producers".
- Trust rows as slash metadata: `FREE TO START / NO CREDIT CARD / NO SETUP`.
- **No em dashes (—) anywhere** in copy, meta descriptions, or titles. Use a colon
  for elaboration, a period for a new sentence, a comma for a clause, or `|` in
  `<title>` tags. (Customer quotes are quoted verbatim and exempt.)

## 6. Do / Don't

- DO left-align everything. DON'T center section headings or hero copy.
- DO use the three text tiers. DON'T invent a new rgba/hex text color.
- DO square corners everywhere. DON'T use border-radius except `var(--radius-*)`.
- DO keep purple as a rare accent. DON'T put purple on buttons or large surfaces
  (the grain band is the one sanctioned large purple element).
- DO keep hovers static (color/border only). DON'T translate, scale, or glow.
- DO keep SEO markup intact: section `id`s, JSON-LD, `data-*` analytics hooks,
  heading text. This system restyles; it does not rewrite copy or structure
  unless explicitly asked.

## 7. File map

- Tokens + global chrome/components: `src/styles/global.css`
- Landing-page-specific styles: `src/styles/home-editorial.css` (scoped `body.editorial-home`)
- Layout-scoped styles: each `src/layouts/*.astro` `<style>` block — must consume tokens
- Assets: `/public/images/purple-grain-band.{webp,avif}`, grain is inline SVG data-URI
