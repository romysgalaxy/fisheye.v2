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
- `POST /api/likes` - Increment like count with optimistic updates

### Component Architecture

**Key Pattern**: Server Components for data fetching, Client Components for interactivity

**Gallery Component** (`app/components/Gallery.tsx`):
- Central client component managing media state, sorting, and lightbox
- Uses optimistic updates for likes (update UI → API call → sync or rollback)
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

**Optimistic UI Updates**: The Gallery component implements optimistic updates for likes - state updates immediately on user action, then syncs with server response or rolls back on error.

**State Management**: Gallery uses local state with derived computations (sorting, total likes) via `useMemo` to prevent unnecessary re-renders.

**Prisma Client**: Single instance in `app/lib/prisma-db.ts` - import database functions from here, never instantiate PrismaClient elsewhere.

## Error Handling & Loading States

**Loading States**:
- `app/loading.tsx` - Skeleton loader for homepage (6 photographer cards)
- `app/photographers/[id]/loading.tsx` - Skeleton loader for photographer page (header + gallery)
- Skeletons use CSS animations for smooth loading experience

**Error Handling**:
- `app/error.tsx` - Global error boundary with retry functionality
- `app/not-found.tsx` - Custom 404 page with link to homepage
- `notFound()` used in photographer page when ID not found

**User Feedback**:
- Toast component (`app/components/Toast.tsx`) for temporary messages
- Like errors display toast notification with auto-dismiss (3s)
- Optimistic updates with automatic rollback on failure
- All error/loading states are WCAG compliant with proper ARIA attributes
