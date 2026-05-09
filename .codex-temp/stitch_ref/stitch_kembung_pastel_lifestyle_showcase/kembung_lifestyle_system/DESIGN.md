---
name: Kembung Lifestyle System
colors:
  surface: '#f9faf6'
  surface-dim: '#d9dad7'
  surface-bright: '#f9faf6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f0'
  surface-container: '#edeeeb'
  surface-container-high: '#e8e8e5'
  surface-container-highest: '#e2e3df'
  on-surface: '#1a1c1a'
  on-surface-variant: '#414943'
  inverse-surface: '#2f312f'
  inverse-on-surface: '#f0f1ed'
  outline: '#717973'
  outline-variant: '#c1c8c1'
  surface-tint: '#3d6751'
  primary: '#3d6751'
  on-primary: '#ffffff'
  primary-container: '#a8d5ba'
  on-primary-container: '#345d48'
  inverse-primary: '#a4d1b6'
  secondary: '#675d51'
  on-secondary: '#ffffff'
  secondary-container: '#efe0d1'
  on-secondary-container: '#6d6357'
  tertiary: '#884f44'
  on-tertiary: '#ffffff'
  tertiary-container: '#ffbaad'
  on-tertiary-container: '#7d463c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bfedd1'
  primary-fixed-dim: '#a4d1b6'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#254f3a'
  secondary-fixed: '#efe0d1'
  secondary-fixed-dim: '#d2c4b6'
  on-secondary-fixed: '#211a11'
  on-secondary-fixed-variant: '#4f453a'
  tertiary-fixed: '#ffdad3'
  tertiary-fixed-dim: '#feb4a6'
  on-tertiary-fixed: '#360e08'
  on-tertiary-fixed-variant: '#6c382f'
  background: '#f9faf6'
  on-background: '#1a1c1a'
  surface-variant: '#e2e3df'
typography:
  display-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.2'
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-margin: 32px
  gutter: 20px
---

## Brand & Style

The brand personality is centered around "Joyful Hydration." It subverts the literal meaning of "Kembung" (bloated) into a positive, satisfied state of being perfectly hydrated. The target audience—Gen Z students and creative professionals—values aesthetics that feel curated yet effortless. 

The design style is **Soft Minimalist** with a playful, lifestyle-centric execution. It prioritizes "Instagrammable" layouts that use wide whitespace to allow product photography to breathe. The vibe is fresh, airy, and friendly, moving away from corporate rigidity toward a "digitally organic" feel that mimics the comfort of a well-designed physical living space.

## Colors

The palette utilizes "Desaturated Joy"—pastels that are vibrant enough to feel playful but soft enough to remain sophisticated. 

- **Primary (Mint Green):** Used for growth, freshness, and the core "water" association.
- **Secondary (Peach Cream):** A skin-tone adjacent neutral that adds warmth and human touch to the UI.
- **Accent & Highlight (Soft Coral & Baby Blue):** Reserved for interactive feedback, limited edition callouts, and secondary UI cues.
- **Background (Warm White):** Replaces clinical pure white to create a "paper-like" or "ceramic" texture, making the digital experience feel more tactile.
- **Text (Dark Slate):** Provides high legibility without the harshness of pure black, maintaining the soft-contrast aesthetic.

## Typography

**Plus Jakarta Sans** is the sole typeface for this design system. Its modern, geometric curves and open apertures echo the rounded forms of the tumblers themselves. 

Headlines should use heavy weights (700-800) with tight letter spacing to create a "chunky" and friendly visual impact. Body text maintains a lighter weight with generous line heights (1.6) to ensure the interface feels breathable and easy to scan during a busy lifestyle. Use "label-sm" sparingly for technical specs or eyebrow headers to provide a structured contrast to the organic headline shapes.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy on desktop (12 columns) and a fluid single-column approach on mobile, but with an emphasis on "Negative Space as a Feature."

A 24px (md) spacing unit is the standard for most internal component padding, while 48px to 80px (lg to xl) vertical margins should be used to separate major sections. This wide-gap approach prevents the UI from feeling cluttered or "salesy," instead leaning into a gallery-like experience. Container margins are intentionally wide (32px) to frame the content centrally, creating a focused, premium feel.

## Elevation & Depth

This design system avoids traditional drop shadows in favor of **Tonal Layering** and **Soft Ambient Glows**. 

Hierarchy is established by placing Primary or Secondary colored cards on the Warm White background. When depth is required (e.g., for floating action buttons or active cards), use an ultra-diffused shadow tinted with the Primary color (#A8D5BA) at 10-15% opacity, rather than gray. This keeps the "fresh" look intact. Low-contrast outlines (1px solid in a slightly darker shade of the background) should be used for secondary containers to provide structure without adding visual weight.

## Shapes

The shape language is extremely soft and "squishy." Inspired by the silhouette of a tumbler, the design uses a **Pill-shaped (3)** rounding logic.

- **Standard Cards:** Use 24px (2xl) or 32px (3xl) corner radii.
- **Buttons:** Must be fully pill-shaped (999px) to invite interaction.
- **Icons:** Should feature rounded terminals and thick strokes (2px minimum) to match the "bold yet soft" typography. 

Avoid sharp 90-degree angles entirely; every corner should feel safe and approachable.

## Components

- **Buttons:** High-contrast pill shapes. The primary button uses Mint Green with Dark Slate text. Hover states should involve a slight "bounce" scale effect (1.05x) rather than just a color change.
- **Cards:** Large, 3xl rounded containers. Use Peach Cream or Warm White surfaces. Product cards should feature a "floating" image that breaks the top boundary of the card for a playful, 3D effect.
- **Chips/Badges:** Small pill shapes using the Highlight (Baby Blue) or Accent (Soft Coral) colors with 600-weight labels.
- **Input Fields:** Soft-filled backgrounds (Peach Cream) with no borders until focused. Focus state should introduce a 2px Mint Green border.
- **Hydration Tracker (Custom):** A unique circular or "blob-shaped" progress indicator that uses fluid-like animations to show water intake levels.
- **Lists:** Items separated by wide whitespace rather than divider lines. Use playful icons as bullet points.