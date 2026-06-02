# QA Report — HuniKu Web Application

**Date:** June 2026  
**Scope:** Full-stack QA — all pages, components, navigation, responsiveness, accessibility  
**Methodology:** Static code review (npm install blocked by WSL/Windows cross-filesystem issue)

---

## Executive Summary

The HuniKu web app has a strong foundation with modern React Router + TanStack Query stack. The design language is clean and premium. However, several critical production issues were identified and fixed:

- **Critical:** All navigation used `window.location.href` instead of React Router (full page reloads, broken SPA)
- **Critical:** 4 footer links were dead (`href="#"`) — Tentang Kami, Pusat Bantuan, Kontak, Blog
- **High:** `cacheTime` deprecated in TanStack Query v5 → must use `gcTime`
- **High:** No mobile navigation — no hamburger, no bottom nav
- **High:** No shared Navbar/Footer — duplicated across pages
- **Medium:** Missing essential info pages (About, Help, Terms, Privacy)
- **Medium:** Accessibility gaps — missing aria-labels, no focus styles, empty alt text

---

## Bugs Found & Fixed

### 🔴 CRITICAL

| # | Bug | Location | Fix | Status |
|---|-----|----------|-----|--------|
| 1 | `window.location.href` used everywhere (8 instances) — causes full page reload, loses React state | page.jsx, search/page.jsx, onboarding/page.jsx, dashboard/page.jsx, dashboard/owner/page.jsx | Replaced with `useNavigate()` from react-router | ✅ FIXED |
| 2 | 4 dead footer links (`href="#"`) — Tentang Kami, Pusat Bantuan, Kontak, Blog | page.jsx footer section | Created shared Footer component with real routes + missing placeholder pages | ✅ FIXED |
| 3 | No mobile navigation — no hamburger menu, no bottom nav bar | Missing entirely | Created Navbar.jsx component with hamburger drawer + bottom tab bar on mobile | ✅ FIXED |

### 🟠 HIGH

| # | Bug | Location | Fix | Status |
|---|-----|----------|-----|--------|
| 4 | `cacheTime` deprecated in TanStack Query v5 | layout.jsx line 7 | Changed to `gcTime` | ✅ FIXED |
| 5 | Navbar/Footer duplicated inline on every page | All pages | Refactored into shared components | ✅ FIXED |
| 6 | `useSearchParams` not used — manual `URLSearchParams(window.location.search)` | search/page.jsx | Replaced with `useSearchParams()` hook | ✅ FIXED |

### 🟡 MEDIUM

| # | Bug | Location | Fix | Status |
|---|-----|----------|-----|--------|
| 7 | Missing `/about`, `/help`, `/terms`, `/privacy` pages | Route not found | Created placeholder pages with proper content | ✅ FIXED |
| 8 | Property detail back button is `<a href>` instead of React Router | property/[id]/page.jsx | Changed to `<button onClick={navigate}>` with aria-label | ✅ FIXED |
| 9 | Hero section not responsive — fixed text sizes on mobile | page.jsx | Added `text-3xl sm:text-4xl md:text-7xl` breakpoints | ✅ FIXED |

### 🟢 LOW / UX Enhancements

| # | Issue | Location | Fix | Status |
|---|-------|----------|-----|--------|
| 10 | Empty alt text on images (accessibility) | Various | Added descriptive alt text where missing | ✅ FIXED |
| 11 | Touch targets potentially too small on mobile | Various | Added `min-h-[44px] min-w-[44px]` patterns | ✅ FIXED |
| 12 | No `loading="lazy"` on below-fold images | page.jsx featured section | Added lazy loading attribute | ✅ FIXED |
| 13 | `mobileMenuOpen` state declared but used by Navbar component | page.jsx | Removed from page, handled by Navbar | ✅ FIXED |

---

## Files Changed

### New Files Created
- `src/components/Navbar.jsx` — Reusable navbar with hamburger + bottom nav
- `src/components/Footer.jsx` — Reusable footer with real React Router links
- `src/app/about/page.jsx` — About page
- `src/app/help/page.jsx` — Help/FAQ page
- `src/app/terms/page.jsx` — Terms & Conditions page
- `src/app/privacy/page.jsx` — Privacy Policy page

### Modified Files
- `src/app/page.jsx` — Added Navbar/Footer, replaced all `window.location.href` with `navigate()`, responsive hero
- `src/app/layout.jsx` — Fixed `cacheTime` → `gcTime`
- `src/app/search/page.jsx` — Added `useNavigate` + `useSearchParams`, replaced all 5 `window.location.href`
- `src/app/onboarding/page.jsx` — Added `useNavigate`, replaced redirect
- `src/app/dashboard/page.jsx` — Added `useNavigate`, replaced redirect
- `src/app/dashboard/owner/page.jsx` — Added `useNavigate`, replaced redirect
- `src/app/property/[id]/page.jsx` — Added `useNavigate` + `useParams`, fixed back button

---

## Pages Still Needing Manual Review

These pages could not be fully tested due to npm install issues but static review found no critical bugs:

| Page | Status | Notes |
|------|--------|-------|
| Account Sign In | ✅ OK | Form validation good, Touch-friendly |
| Account Sign Up | ✅ OK | Multi-step fields, Role selection |
| Account Logout | ✅ OK | Loading spinner, Clean |
| Pricing | ✅ OK | Responsive grid (`grid-cols-1 md:grid-cols-3`) |
| Admin Panel | ⚠️ NEEDS RUNNING TEST | Complex modals, tables, CRUD — need live test |
| Dashboard (listing) | ⚠️ NEEDS RUNNING TEST | Subscription check flow |
| Property Detail | ⚠️ NEEDS RUNNING TEST | Google Maps API key, Mortgage calculator |

---

## Recommendations (Beyond Fixes)

### 1. Performance
- Add `React.lazy()` + `Suspense` for route-level code splitting
- Add `loading="lazy"` to all property card images
- Consider image CDN with srcset for responsive images on property detail gallery

### 2. Accessibility
- Add `:focus-visible` ring styles globally (e.g., `ring-2 ring-blue-500 ring-offset-2`)
- Ensure color contrast ratios meet WCAG AA (check blue-600 on white: 4.5:1 ✅)
- Add `htmlFor` to all `label` elements pointing to input `id`s
- Add `role="alert"` to error messages

### 3. UX Polish
- Add skeleton loaders for property cards and search results
- Add toast notifications for all mutations (already partially done)
- Add empty state illustrations for search "no results" and dashboard "no properties"
- Add pull-to-refresh on mobile for search and dashboard
- Add page transition animations
- Consider adding `navigator.share()` for the Share button on property detail

### 4. Error Handling
- Add `<ErrorBoundary>` component wrapping each route
- Add retry button in error states
- Graceful fallback when Google Maps API key is missing

### 5. SEO
- Add `<title>` and `<meta description>` per page
- Add Open Graph tags for social sharing

### 6. State Management
- Consider React Context for auth state to avoid prop drilling
- Is `useUser()` hook already doing this — verify

---

## Test Environment
- **Node:** v22.22.2
- **npm:** 10.9.7 
- **Dev server:** Could not start (WSL/Windows cross-filesystem npm install timeout)
- **Testing method:** Static code review + structural analysis
- **Recommendation:** Fix npm install on native Windows or Linux VPS to enable live testing

---

## Bug Severity Legend
- 🔴 CRITICAL: Breaks core functionality, blocks release
- 🟠 HIGH: Significant user impact, degrades UX
- 🟡 MEDIUM: Noticeable issue, should fix before production
- 🟢 LOW: Cosmetic/polish, nice-to-have
