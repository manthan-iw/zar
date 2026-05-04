# Loading, Transition, and Skeleton Implementation

## Objective
Implement production-level loading UX with this architecture:

1. Homepage loader (Lottie) on each homepage load
2. Page transition (Framer Motion)
3. Component skeletons for route/content loading

This prevents overuse of animated loaders and keeps perceived performance high.

## Decisions Applied

### 1) Skeletons kept as primary loading UX
- Route loading boundaries now render skeleton layouts only.
- No Lottie overlay is rendered above skeletons.
- Product listing route has a dedicated grid skeleton matching card layout.

### 2) Page transition implemented with Framer Motion
- Route shell transitions are handled in a single provider.
- Enter/exit motion uses opacity + translate + mild blur.
- Transition implementation no longer depends on document click interception.

### 3) Lottie usage restricted to high-value moments
- Homepage loader: shown every time the homepage loads.
- Form submission loader: shown inline in contact submit button while request is pending.

## Files Added
- `src/components/ui/organisms/FirstVisitLoader/FirstVisitLoader.tsx`
- `src/components/ui/organisms/FirstVisitLoader/FirstVisitLoader.module.css`
- `src/components/ui/PageHeader/PageHeaderSkeleton.tsx`
- `src/components/ui/PageHeader/PageHeaderSkeleton.module.css`
- `src/components/ui/organisms/ProductListingSkeleton/ProductListingSkeleton.tsx`
- `src/components/ui/organisms/ProductListingSkeleton/ProductListingSkeleton.module.css`

## Files Updated
- `src/components/ui/organisms/PageTransitionProvider/PageTransitionProvider.tsx`
- `src/styles/globals.css`
- `src/components/ui/organisms/RouteLoadingState/RouteLoadingState.tsx`
- `src/components/ui/organisms/RouteLoadingState/RouteLoadingState.module.css`
- `src/app/layout.tsx`
- `src/app/collections/[purity]/[category]/[style]/loading.tsx`
- `src/app/collections/[purity]/[category]/loading.tsx`
- `src/components/ui/organisms/AppLoader/AppLoader.tsx`
- `src/app/contact/ContactForm.tsx`
- `src/app/contact/page.module.css`

## Behavior Summary

### Global loader
- Homepage load: full-screen Lottie appears briefly every time homepage is loaded.
- Other routes: no global Lottie flash.

### Page transition
- All page route changes animate using Framer Motion in transition shell.

### Route/component loading
- Route loading boundaries keep skeletons only.
- Product listing loading shows:
  - Page header skeleton (breadcrumbs + title)
  - Full-size image skeleton banner
  - Product grid skeleton cards

### Form submit
- Contact form submit button is disabled while posting.
- Lottie appears inline with `Sending...` during submit.

## Guardrails
- Avoid putting Lottie above skeletons.
- Avoid showing Lottie for every API request.
- Keep skeleton dimensions close to final layout to reduce CLS.
- Use Lottie only where user benefit is meaningful.
