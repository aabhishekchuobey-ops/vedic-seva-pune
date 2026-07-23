# Design Brief

## Direction

Mandala Glow — a devotional digital sanctum for Pandit Abhishek Shastri's Vedic services, evoking the warmth of a temple at aarti time.

## Tone

Sacred editorial — deep maroon and saffron with marigold-gold accents, reverent and ceremonial rather than kitsch; the warmth of golden temple lighting at dusk.

## Differentiation

The saffron-to-marigold flame gradient on primary CTAs, gold-hairline-bordered sacred cards, and Devanagari-capable serif typography make this unmistakably a pandit's sanctum — not a generic service listing.

## Color Palette

| Token      | OKLCH (light)      | OKLCH (dark)       | Role                              |
| ---------- | ------------------ | ------------------ | --------------------------------- |
| background | 0.97 0.012 75      | 0.14 0.018 30      | warm cream / deep charcoal-maroon |
| foreground | 0.18 0.03 35       | 0.93 0.012 70      | deep maroon text / warm cream     |
| card       | 0.99 0.008 75      | 0.18 0.022 30      | elevated sacred surface           |
| primary    | 0.42 0.14 28       | 0.76 0.16 65       | sindoor maroon / aarti saffron    |
| accent     | 0.74 0.16 65       | 0.74 0.16 65       | marigold gold (both modes)        |
| muted      | 0.94 0.02 70       | 0.22 0.025 35      | soft sand / shadow maroon         |

## Typography

- Display: Fraunces — headings, pandit name, section titles; pairs with Noto Serif Devanagari for Hindi
- Body: General Sans — UI labels, paragraphs, bilingual content; pairs with Noto Sans Devanagari for Hindi
- Mono: Geist Mono — phone numbers, small metadata
- Scale: hero `text-5xl md:text-7xl font-bold tracking-tight`, h2 `text-3xl md:text-5xl font-bold`, label `text-sm font-semibold tracking-widest uppercase`, body `text-base text-lg`

## Elevation & Depth

Warm-toned shadows (oklch 35 0.04 35) at every tier; sacred cards get an extra gold hairline ring via `.shadow-sacred` — depth reads as temple lamplight, not flat SaaS panels.

## Structural Zones

| Zone    | Background                          | Border                  | Notes                                          |
| ------- | ----------------------------------- | ----------------------- | ---------------------------------------------- |
| Header  | `bg-card` with subtle saffron tint  | `border-b` warm gold     | pandit name in Fraunces, Om motif, lang toggle |
| Content | `bg-background`; alternate `bg-muted/30` per section | — | hero with flame gradient, service cards, gallery |
| Footer  | `bg-muted/40` warm sand              | `border-t` gold hairline | phone 9026828075, Pune areas, sankalp, socials |

## Spacing & Rhythm

Section gaps `py-16 md:py-24`; content grouping `space-y-6` within cards; micro-spacing `gap-2` for badges and meta — spacious like a temple courtyard, not cramped.

## Component Patterns

- Buttons: primary uses `.bg-gradient-flame` (saffron→marigold), `rounded-lg`, hover brightens; secondary `bg-secondary` with warm border
- Cards: `rounded-xl`, `bg-card`, `.shadow-sacred` for service/ritual cards with gold hairline ring
- Badges: `rounded-full`, saffron `bg-accent/15 text-accent-foreground` for service tags
- Dividers: gold hairline `border-accent/30` between sacred sections

## Motion

- Entrance: `animate-fade-up` with staggered delays (0.1s/0.2s/0.3s) for sections
- Hover: `.transition-smooth` (0.3s cubic-bezier) on cards and buttons; cards lift `hover:-translate-y-1`
- Decorative: `animate-flame-flicker` on aarti/diya motifs, `animate-mandala-spin` (60s slow) on background mandala patterns, `animate-diya-glow` on sacred accents

## Constraints

- Hindi (Devanagari) defaults; English via toggle — both must render with proper font fallbacks
- Pune-focused service area only; no all-India expansion, payments, or kundali tool
- No purple/blue gradients; palette is strictly saffron-maroon-marigold-gold
- Devanagari relies on system Noto fonts (bundled fonts are Latin-only) — stacks include them as fallbacks

## Signature Detail

The flame-gradient primary button (`--gradient-flame`: saffron 0.74 0.16 65 → marigold 0.55 0.12 45) paired with the slow-spinning mandala background motif — the whole interface breathes like a temple lamp.
