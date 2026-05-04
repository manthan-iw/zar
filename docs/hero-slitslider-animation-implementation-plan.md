# Hero SlitSlider Animation - Implementation Plan

## Goal
Replicate the provided SlitSlider hero animation (from `SlitSlider-master`) inside this Next.js codebase as a reusable, responsive, and performant React implementation.

## Source Reference (Verified)
Files reviewed from local source:
- `index2.html`
- `css/style.css`
- `js/jquery.slitslider.js`

Key behaviors to replicate:
- Dual-slice transition effect (horizontal/vertical)
- Per-slide transition config (orientation, rotation, scale)
- Navigation dots + active state
- Optional autoplay with pause on user interaction
- Keyboard support (left/right)

## Implementation Strategy
Do **not** bring legacy jQuery plugin into production code.

Instead, implement a modern React/Next.js version with:
- Client-side component state for current slide and animation lock
- CSS module animations and transforms to emulate slit effect
- Typed slide config in TypeScript
- RequestAnimationFrame/timers for transition sequencing

This avoids:
- jQuery dependency overhead
- DOM mutation patterns that conflict with React
- Modern build compatibility risks

## Proposed File Changes
1. Create hero slider component:
- `src/components/ui/organisms/HeroSlitSlider/HeroSlitSlider.tsx`

2. Create style module with slit/slice transitions:
- `src/components/ui/organisms/HeroSlitSlider/HeroSlitSlider.module.css`

3. Optional data config file for maintainability:
- `src/lib/data/heroSlider.ts`

4. Integrate into homepage hero position:
- update `src/app/page.tsx`

5. If needed, global variable tokens for timing/easing:
- update `src/styles/variables.css` (minimal additions only)

## Component Design
### Data shape
Each slide config will include:
- `id`
- `title`
- `subtitle` / description
- `imageUrl`
- `orientation`: `horizontal | vertical`
- `slice1Rotation`, `slice2Rotation`
- `slice1Scale`, `slice2Scale`

### Render structure
- Hero section wrapper
- Current slide + incoming/outgoing layered slide
- Two animated slices for transition phase
- Content overlay (title/CTA)
- Dot navigation controls
- Optional prev/next controls (if desired)

## Transition Behavior (Parity Plan)
For each navigation event:
1. Block re-entry while animating
2. Capture current and target slides
3. Build two slices from moving slide
4. Apply orientation-specific transform:
- Horizontal: `translateY(...) rotate(...) scale(...)`
- Vertical: `translateX(...) rotate(...) scale(...)`
5. Complete animation, clean temporary layers, set new current index
6. Unlock and emit active dot/content state

## Responsiveness
- Desktop: full hero with large imagery/text
- Tablet: reduced heights and typography scale
- Mobile: preserve effect with lower transform magnitudes and simplified overlay spacing

## Accessibility
- Keyboard navigation (left/right arrows)
- Dots as buttons with `aria-label`
- `aria-current` on active dot
- Sufficient text contrast over images
- Respect `prefers-reduced-motion`:
  - disable slit transform animation
  - use instant/fade fallback

## Performance Considerations
- Use Next/Image for hero backgrounds where feasible
- Keep animation on transform/opacity only
- Avoid layout-thrashing properties
- Preload first slide image, lazy load others
- Keep JS transition logic minimal and deterministic

## Validation Checklist
- Slit transition visually matches reference behavior
- Dot navigation works and active state stays in sync
- Keyboard navigation works
- No animation overlap/race during rapid clicks
- Works across desktop/tablet/mobile
- Works with reduced motion enabled
- No TypeScript or lint errors

## Risks and Mitigations
1. Exact visual parity may differ due to non-jQuery architecture.
- Mitigation: tune timing, translate factor, angle caps, and scale caps to match source.

2. Mobile performance can degrade on heavy images.
- Mitigation: compressed assets, controlled hero height, reduced transform intensity on small screens.

3. Existing homepage composition constraints.
- Mitigation: integrate as isolated organism component with minimal page coupling.

## Approval Required Before Implementation
1. Placement confirmation:
- Should this replace the existing homepage hero or be added below it?

2. Controls confirmation:
- Dots only, or dots + prev/next arrows?

3. Autoplay confirmation:
- Enable autoplay by default (`4000ms`) or keep manual only?

4. Content source confirmation:
- Use temporary placeholder slides first, or provide final slide images/text now?

## Post-Approval Execution Plan
1. Build component + CSS module
2. Integrate into homepage
3. Tune animation parity against reference
4. Run type/error checks
5. Share summary of changed files and behavior
