# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fisheye is a photography portfolio platform built with Next.js 16 (App Router), Prisma ORM with SQLite, and TypeScript. The application displays photographers and their media galleries with sorting, lightbox viewing, and like functionality.

## Commands

### Development
```bash
npm run dev          # Start development server on http://localhost:3000
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

### Database (Prisma)
```bash
npx prisma generate  # Generate Prisma Client after schema changes
npx prisma db push   # Push schema changes to SQLite database
npx prisma studio    # Open Prisma Studio database GUI
npx prisma db seed   # Seed database from data/ JSON files
```

## Architecture

### Routing
- `/` - Homepage listing all photographers (Server Component fetching from DB)
- `/photographers/[id]` - Individual photographer page with media gallery

### Data Layer
**Database**: SQLite via Prisma ORM
- `Photographer` model: id, name, city, country, tagline, price, portrait
- `Media` model: id, title, image, video, likes, date, price, photographerId (relation)
- All database operations centralized in `app/lib/prisma-db.ts`
- Seed data in `data/photographer.json` and `data/media.json`

**API Routes**:
- `POST /api/likes` - Toggle like/unlike with optimistic updates (supports both increment and decrement)

### Component Architecture

**Key Pattern**: Server Components for data fetching, Client Components for interactivity

**Gallery Component** (`app/components/Gallery.tsx`):
- Central client component managing media state, sorting, and lightbox
- Uses optimistic updates for like/unlike toggle (update UI → API call → sync or rollback)
- Like state tracked in component state (1 like maximum per user per media, Instagram-style)
- Sorting handled client-side with `useMemo` (popularity/date/title)
- Maintains `items` state as source of truth, derives `sortedItems` for display
- Lightbox navigation based on current sorted order

**Client Components** (marked with "use client"):
- Gallery, MediaCard, LightBox, LikesBar, SortSelect, ContactModal, PhotographerCard

**Server Components**:
- Header, PhotographerHeader, page components (fetch data, no interactivity)

### Media Files
- Images/videos stored in `public/images/`
- Database stores filenames only (e.g., "Art_Mine.jpg")
- Accessed via `/images/filename` in components

### Styling & Localization
- Global CSS in `app/globals.css`
- DM Sans font (weights: 400, 500, 700)
- French language (`lang="fr"`)

## Key Implementation Details

**Like/Unlike System**: Instagram-style toggle system where users can like (❤) or unlike (♥) media. Likes persisted in database. **Database is the source of truth** - state updates only after successful API response. Maximum 1 like per user per media (tracked in component state, resets on page refresh). No optimistic updates to prevent desynchronization issues. Double-click protection with loading state.

**State Management**: Gallery uses local state with derived computations (sorting, total likes) via `useMemo` to prevent unnecessary re-renders. Liked media IDs stored in component state as a Set. Loading states prevent concurrent requests.

**Prisma Client**: Single instance in `app/lib/prisma-db.ts` - import database functions from here, never instantiate PrismaClient elsewhere. Includes both `incrementLike()` and `decrementLike()` functions with built-in validation. `decrementLike()` prevents negative values. API fallback returns current DB state on errors to maintain synchronization.

## Error Handling & Loading States

**Loading States**:
- `app/loading.tsx` - Simple "Chargement des photographes" text for homepage
- `app/photographers/[id]/loading.tsx` - Simple "Chargement des médias du photographe" text for photographer page
- No skeleton loaders, just centered text

**Error Handling**:
- `app/error.tsx` - Simple error page with "Oups !" message and retry button (no error details displayed)
- `app/not-found.tsx` - Custom 404 page with link to homepage
- `notFound()` used in photographer page when ID not found

**User Feedback**:
- Toast component (`app/components/Toast.tsx`) for like/unlike error messages
- Errors display toast notification with auto-dismiss (3s)
- Optimistic updates with automatic rollback on failure
- All error/loading states are WCAG compliant with proper ARIA attributes
