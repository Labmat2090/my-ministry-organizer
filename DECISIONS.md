# Technical Decisions - My Ministry Organizer App

This document records all major technical decisions made during development, along with the reasoning behind them.

---

## Architecture Decisions

### Decision 1: Next.js for Frontend Framework
**Date:** February 1, 2026  
**Decision:** Use Next.js 14 (App Router)

**Reasoning:**
- Modern React framework with excellent developer experience
- Built-in routing and optimizations
- Can export as static site (no server needed)
- Great performance out of the box
- Large community and ecosystem

**Alternatives Considered:**
- Plain React: More setup required
- Vue.js: Less familiar to most developers
- Svelte: Smaller ecosystem

**Impact:** Faster development, better performance, easier deployment

---

### Decision 2: Dexie.js for Local Storage
**Date:** February 1, 2026  
**Decision:** Use IndexedDB via Dexie.js instead of cloud database

**Reasoning:**
- **Privacy is paramount** - religious activity tracking is sensitive
- Users want data that never leaves their device
- No account creation = lower friction
- Works 100% offline
- Free forever (no service costs)
- User has complete control over their data

**Alternatives Considered:**
- Supabase: Cross-device sync but requires internet and accounts
- Firebase: Similar to Supabase
- LocalStorage: Too limited (5-10MB, no complex queries)
- Hybrid (Dexie + optional cloud): Added complexity

**Trade-offs:**
- ❌ No automatic cross-device sync
- ❌ Users must manually backup via export
- ✅ Maximum privacy
- ✅ Works anywhere, anytime
- ✅ No ongoing costs

**Impact:** Simplified architecture, enhanced privacy, offline-first

---

### Decision 3: No Authentication System
**Date:** February 1, 2026  
**Decision:** Skip user accounts and authentication

**Reasoning:**
- Each browser = isolated database
- No server means no need for user management
- Reduces complexity significantly
- Lowers barrier to entry (instant use)
- Aligns with privacy-first approach

**Future Option:** Could add optional "profiles" within IndexedDB for family members sharing a device

**Impact:** Simpler codebase, better privacy, faster to build

---

### Decision 4: Tailwind CSS for Styling
**Date:** February 1, 2026  
**Decision:** Use Tailwind CSS for styling

**Reasoning:**
- Utility-first approach = faster development
- Consistent design system
- Small bundle size with purging
- Well-documented
- Works great with Next.js

**Alternatives Considered:**
- CSS Modules: More verbose
- Styled Components: Runtime overhead
- Plain CSS: Harder to maintain

**Impact:** Faster UI development, consistent styling

---

### Decision 5: Static Site Export
**Date:** February 1, 2026  
**Decision:** Export Next.js as static site

**Reasoning:**
- No server needed = simpler deployment
- Can host on Vercel, Netlify, GitHub Pages, etc.
- Faster loading (CDN-served)
- Lower costs (free hosting options)
- Since all data is client-side, no API needed

**Configuration:**
```javascript
// next.config.js
module.exports = {
  output: 'export'
}
```

**Impact:** Free hosting, simpler deployment, better performance

---

## Database Schema Decisions

### Decision 6: Normalized Schema Structure
**Date:** February 1, 2026  
**Decision:** Use normalized tables instead of one big table

**Schema:**
```
- profiles (user settings)
- timeEntries (daily records)
- bibleStudies (detailed tracking)
- returnVisits (detailed tracking)
- monthlyGoals (custom targets)
```

**Reasoning:**
- Easier to query specific data
- Better data integrity
- More flexible for future features
- Follows database best practices

**Alternative:** Single denormalized table with all data - harder to maintain

**Impact:** Clean data structure, easier to extend

---

### Decision 7: Use UUIDs for IDs
**Date:** February 1, 2026  
**Decision:** Use UUID v4 for primary keys

**Reasoning:**
- No collision risk across devices (if sync added later)
- Can generate client-side
- More secure than sequential IDs

**Implementation:**
```javascript
import { v4 as uuidv4 } from 'uuid';
const id = uuidv4();
```

**Impact:** Future-proof for potential sync features

---

## Feature Decisions

### Decision 8: Export/Import as Primary Backup
**Date:** February 1, 2026  
**Decision:** Implement JSON export/import for data portability

**Format:**
```json
{
  "version": "1.0",
  "exportDate": "2026-02-01T12:00:00Z",
  "profile": {...},
  "timeEntries": [...],
  "bibleStudies": [...],
  "returnVisits": [...]
}
```

**Reasoning:**
- Simple for users to understand
- Easy to backup (save file)
- Can transfer between devices manually
- Future-proof (can import to other systems)
- Standard format

**Alternative:** Browser sync API - less reliable, browser-specific

**Impact:** User has full control, simple cross-device workflow

---

### Decision 9: 600 Hours as Default Annual Goal
**Date:** February 1, 2026  
**Decision:** Set 600 as default annual hour goal for regular pioneers

**Reasoning:**
- Current JW requirement for regular pioneers
- Can be customized per user in settings
- Makes monthly calculations accurate (50 hours/month)

**Customization:** Users can change this in profile settings

**Impact:** Accurate default progress tracking

---

### Decision 10: Decimal Hours Support
**Date:** February 1, 2026  
**Decision:** Allow decimal hours (e.g., 2.5 hours)

**Reasoning:**
- More accurate than rounding
- Common practice for time tracking
- Easy to input (15min = 0.25, 30min = 0.5, etc.)

**Validation:**
- Max: 24 hours per day
- Min: 0 hours
- Precision: 2 decimal places

**Impact:** Accurate time tracking

---

## UI/UX Decisions

### Decision 11: Calendar-First Interface
**Date:** February 1, 2026  
**Decision:** Main view is monthly calendar grid

**Reasoning:**
- Familiar mental model (everyone knows calendars)
- Easy to see patterns (which days you went out)
- Quick entry (click day, enter hours)
- Visual progress tracking

**Layout:**
```
┌─────────────────────────────┐
│  January 2026        [< >]  │
│                             │
│  S  M  T  W  T  F  S       │
│        1  2  3  4  5       │
│     2h 3h 1h 0h 2.5h       │
│  6  7  8  9 10 11 12       │
│  3h 0h 2h...                │
│                             │
│  Total: 45/50 hours         │
└─────────────────────────────┘
```

**Impact:** Intuitive UX, quick data entry

---

### Decision 12: Progressive Enhancement Approach
**Date:** February 1, 2026  
**Decision:** Start with core features, add enhancements incrementally

**MVP Features:**
- Time entry
- Monthly totals
- Annual progress
- Export/import

**Future Enhancements:**
- Detailed bible study tracking
- RV database with reminders
- Charts and graphs
- Dark mode
- PWA

**Reasoning:**
- Ship faster
- Get user feedback early
- Avoid over-engineering
- Iterative improvement

**Impact:** Faster time to launch, user-driven features

---

## Deployment Decisions

### Decision 13: Vercel for Hosting
**Date:** February 1, 2026  
**Decision:** Deploy to Vercel

**Reasoning:**
- Free tier is generous
- Perfect for Next.js (created by same team)
- Automatic deployments from GitHub
- Global CDN
- Custom domain support
- Zero config needed

**Alternatives:**
- Netlify: Similar, slightly less Next.js optimized
- GitHub Pages: No custom domain on free tier
- Cloudflare Pages: Great but less integrated

**Setup:**
```bash
vercel deploy
```

**Impact:** Easy deployment, professional hosting

---

## Testing Strategy

### Decision 14: Manual Testing for MVP
**Date:** February 1, 2026  
**Decision:** Start with manual testing, add automated tests later

**Reasoning:**
- Small scope for MVP
- Faster development
- Can add Jest/Testing Library after launch
- Real user testing more valuable initially

**Future:** Add unit tests for calculations, E2E tests for critical flows

**Impact:** Faster MVP, defer testing complexity

---

## Versioning & Updates

### Decision 15: Semantic Versioning
**Date:** February 1, 2026  
**Decision:** Use semantic versioning (v1.0.0)

**Format:** MAJOR.MINOR.PATCH
- MAJOR: Breaking changes (database schema changes)
- MINOR: New features (backward compatible)
- PATCH: Bug fixes

**Database Migrations:**
```javascript
db.version(1).stores({...});
db.version(2).stores({...}).upgrade(tx => {
  // migration code
});
```

**Impact:** Clear upgrade path, safe updates

---

## Performance Optimizations

### Decision 16: Lazy Loading for Heavy Components
**Date:** February 1, 2026  
**Decision:** Use React lazy loading for non-critical components

```javascript
const BibleStudyList = lazy(() => import('./BibleStudyList'));
```

**Reasoning:**
- Faster initial page load
- Better mobile experience
- Split code into smaller chunks

**Impact:** Better performance on slow connections

---

## Summary of Key Principles

1. **Privacy First** - User data never leaves their device
2. **Simplicity** - Minimum viable features first
3. **Offline First** - Works without internet
4. **User Control** - Export/import empowers users
5. **Progressive** - Start simple, enhance over time
6. **Standards** - Use web standards and best practices

---

**Note:** This document should be updated whenever significant technical decisions are made.
