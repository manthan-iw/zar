# Hero Slide Content Animation - Implementation Plan

## Goal
Add staggered content animation to the homepage hero so the title, description, and button animate in with distinct timing on every slide change, while staying visually synchronized with the slit transition.

## Current Baseline
The hero already includes:
- Slit-style background transition with per-slide orientation/rotation/scale
- Autoplay, dot navigation, arrow navigation, and keyboard support
- Static content swap for title, description, and CTA
- A single `textIn` animation on the text block

Current limitation:
- Title, description, and button do not animate independently
- Content timing does not track slide transition phases closely enough

## Objective of This Iteration
Upgrade the content animation so each slide feels choreographed:
- Title enters first
- Description follows with a short delay
- Button enters last
- Timing varies enough to feel intentional, but remains consistent with the background slit motion

## Implementation Strategy
Use the existing React state in `HeroSection` and add a small content-phase layer rather than introducing a new animation library.

Approach:
- Keep background slit transition as the primary visual event
- Animate content separately with CSS classes or inline animation tokens derived from slide change state
- Trigger content entrance only after the next slide is visually established enough to support readable text
- Keep reduced-motion fallback simple and accessible

## Proposed File Changes
1. Update hero component logic:
- `src/components/ui/organisms/HeroSection/HeroSection.tsx`

2. Extend hero animation styles:
- `src/components/ui/organisms/HeroSection/HeroSection.module.css`

3. Optional slide-level animation metadata if timing should vary per slide:
- `src/lib/data/heroSlider.ts`

## Animation Plan
### 1. Split content animation targets
Animate these independently instead of animating `.textBlock` as one unit:
- Heading
- Subtitle
- CTA button wrapper

### 2. Stagger timing
Initial recommended sequence relative to slide change:
- Heading start: `180ms`
- Subtitle start: `320ms`
- Button start: `460ms`

Initial recommended durations:
- Heading: `700ms`
- Subtitle: `650ms`
- Button: `600ms`

Recommended motion:
- Heading: fade + upward settle + slight scale correction
- Subtitle: fade + smaller vertical offset
- Button: fade + upward settle, no scale exaggeration

### 3. Sync with slit transition
The slit transition currently runs at `900ms`.

Planned coordination:
- Background slit begins immediately
- Content animation begins after the new slide is readable, not at frame 0
- Content should complete near the end of the slit animation or just after it
- Timing should feel attached to the slide, not independent from it

### 4. Match with slide changes
Content animation should re-run on:
- Autoplay transitions
- Dot navigation
- Arrow navigation
- Keyboard navigation

Implementation options:
- Key content subtree by active slide id/index so CSS animations replay naturally
- Or maintain a dedicated content animation phase state in React

Preferred option:
- Key the content subtree by slide id first
- Add phase state only if needed for tighter sync control

## Optional Per-Slide Variation
If you want each slide to feel slightly different, add optional timing tokens per slide:
- `titleDelay`
- `subtitleDelay`
- `buttonDelay`
- `contentVariant`

Use this only if needed.
Default recommendation:
- Start with one consistent stagger system across all slides
- Add per-slide timing only if visual review shows a need

## CSS Plan
Add dedicated classes for content choreography, for example:
- `.contentInner`
- `.headingEnter`
- `.subtitleEnter`
- `.buttonEnter`

Add focused keyframes such as:
- `heroHeadingIn`
- `heroSubtitleIn`
- `heroButtonIn`

Animation properties should stay limited to:
- `opacity`
- `transform`

Avoid:
- layout-affecting properties
- filter-heavy effects
- overly long delays that hurt readability

## Accessibility and Motion Safety
- Respect `prefers-reduced-motion: reduce`
- In reduced motion mode:
  - keep slit transition disabled/fallback as currently implemented
  - remove staggered motion
  - allow instant or minimal fade-only content appearance

## Validation Checklist
- Heading, subtitle, and button animate separately on every slide change
- Animation replays correctly for autoplay and manual navigation
- Content timing feels synchronized with the slit transition
- No overlap/race when clicking navigation quickly
- No TypeScript or CSS module errors
- Reduced motion mode still works correctly
- Mobile layout remains stable during content animation

## Risks and Mitigations
1. Content animation may replay inconsistently if React reuses the same subtree.
- Mitigation: key the content wrapper by slide id.

2. Stagger may feel late or disconnected from the background animation.
- Mitigation: tune delays against the existing `900ms` slit duration.

3. Mobile screens may feel crowded if motion offsets are too large.
- Mitigation: reduce translate distances on smaller breakpoints.

## Approval Notes
This plan assumes:
- The current hero structure remains in place
- Existing copy and images stay unchanged
- We are only enhancing title, description, and button animation timing

## Post-Approval Execution
1. Add keyed content wrapper and transition-aware content replay logic
2. Add staggered heading/subtitle/button animations in CSS
3. Tune delays to visually match the slit transition
4. Validate in browser and with error checks
5. Share final behavior summary
