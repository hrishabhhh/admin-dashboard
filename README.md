# AdminHub

AdminHub is a responsive admin dashboard built as part of a Frontend Developer practical assignment.

The project converts the provided Figma design into a production-style frontend application using Next.js, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, and Redux Toolkit.

## Live Demo

> Add the Vercel deployment URL here after deployment.

## Features

- Responsive desktop and mobile layouts
- Dashboard overview with KPI cards
- Revenue chart
- Recent transaction summary
- System alerts and health information
- User directory
- User detail view
- Transaction ledger
- Transaction detail view
- Booking directory
- Booking detail view
- Search and filtering
- Pagination
- Loading skeletons
- Error states with retry
- Empty states
- Disabled pagination states
- Responsive desktop tables
- Mobile-specific card layouts
- Responsive sidebar and bottom navigation
- Public REST API integration
- Server-state caching with TanStack Query
- Client-side UI state with Redux Toolkit

## Pages

```text
/dashboard

/users
/users/[id]

/transactions
/transactions/[id]

/bookings
/bookings/[id]
```

The root `/` route redirects to `/dashboard`.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Redux Toolkit
- React Redux
- Recharts
- Lucide React
- DummyJSON REST API

## Public API

The project uses the free public DummyJSON API:

```text
https://dummyjson.com
```

API resources used include:

```text
/users
/users/:id
/carts
/carts/:id
```

Users are fetched directly from the Users API.

Transaction data is derived from the DummyJSON carts API and combined with user information.

Booking records are deterministically derived from user API data to reproduce the structure required by the provided Figma design.

No private API keys or backend services are required.

## State Management

The application separates server state from client-side UI state.

### TanStack Query

TanStack Query is used for asynchronous API/server state, including:

- API requests
- Loading states
- Error states
- Request caching
- Pagination
- Keeping previous page data during pagination
- Individual resource fetching

Example query keys:

```text
["users", page, search, limit]
["user", id]

["transactions", page, limit]
["transaction", id]

["bookings", page, limit]
["booking", id]
```

### Redux Toolkit

Redux Toolkit is intentionally kept small and is used only for application-level UI state.

For example:

```text
mobile navigation menu state
```

Fetched API data is not duplicated inside Redux because TanStack Query already manages server state.

This keeps the state architecture simple and avoids unnecessary synchronization between two state-management systems.

## API/Data Transformation

Raw DummyJSON responses are transformed in the API layer before reaching the UI.

```text
DummyJSON
    ↓
lib/api.ts
    ↓
TanStack Query
    ↓
React Components
```

This prevents UI components from depending directly on the structure of the external API.

Derived transaction and booking values are deterministic rather than random so the interface remains consistent across page refreshes.

## Responsive Design

The application follows separate desktop and mobile layouts based on the supplied Figma design.

### Desktop

- Persistent left sidebar
- Desktop header
- Multi-column dashboard layout
- Data tables
- Desktop filtering controls

### Mobile

- Compact mobile header
- Bottom navigation
- Mobile navigation drawer
- Card-based lists instead of compressed tables
- Mobile-specific detail layouts
- Responsive KPI cards and charts

The mobile implementation intentionally adapts the interface rather than simply shrinking the desktop layout.

## UI States

The application handles real-world UI states including:

- Loading
- Error
- Empty
- Success
- Active navigation
- Selected rows
- Disabled pagination controls
- Responsive state changes

Loading states use skeleton components instead of only displaying a generic spinner.

## Project Structure

```text
src/
├── app/
│   ├── bookings/
│   │   ├── [id]/
│   │   └── page.tsx
│   │
│   ├── dashboard/
│   │   └── page.tsx
│   │
│   ├── transactions/
│   │   ├── [id]/
│   │   └── page.tsx
│   │
│   ├── users/
│   │   ├── [id]/
│   │   └── page.tsx
│   │
│   ├── layout.tsx
│   ├── page.tsx
│   ├── providers.tsx
│   └── not-found.tsx
│
├── components/
│   ├── AppShell.tsx
│   ├── Header.tsx
│   ├── MobileHeader.tsx
│   ├── MobileMenu.tsx
│   ├── MobileNav.tsx
│   ├── RevenueChart.tsx
│   ├── Sidebar.tsx
│   ├── StatCard.tsx
│   ├── StatusBadge.tsx
│   └── ui/
│
├── hooks/
│   └── queries.ts
│
├── lib/
│   ├── api.ts
│   └── utils.ts
│
├── store/
│   ├── store.ts
│   └── uiSlice.ts
│
└── types/
    └── index.ts
```

## Design Approach

The provided Figma design was used as the primary visual reference.

The implementation focuses on matching:

- Layout
- Typography
- Colors
- Spacing
- Borders
- Border radius
- Navigation
- Tables
- Cards
- Status badges
- Charts
- Responsive behavior

The project intentionally avoids unnecessary abstractions in order to keep the codebase small, maintainable, and appropriate for the assignment scope.

## Getting Started

### Prerequisites

Make sure Node.js and npm are installed.

Recommended:

```text
Node.js 20+
```

Clone the repository:

```bash
git clone git@github.com:hrishabhhh/admin-dashboard.git
```

Move into the project:

```bash
cd admin-dashboard
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The root route automatically redirects to:

```text
http://localhost:3000/dashboard
```

## Production Build

Run:

```bash
npm run build
```

Then:

```bash
npm start
```

## Linting

Run:

```bash
npm run lint
```

## Deployment

The application is designed to be deployed on Vercel.

No environment variables are required because the project uses the public DummyJSON API.

Typical deployment process:

1. Push the latest code to GitHub.
2. Import the repository into Vercel.
3. Keep the default Next.js build configuration.
4. Deploy the application.
5. Add the generated deployment URL to this README.

## Architecture Decisions

### Why TanStack Query?

API data represents server state and needs:

- caching
- loading/error lifecycle handling
- refetching
- pagination
- query invalidation capabilities

TanStack Query provides these features without requiring server data to be copied into Redux.

### Why Redux Toolkit?

Redux Toolkit demonstrates global client-side state management where appropriate.

It is intentionally limited to UI/application state rather than duplicating API data.

### Why Tailwind CSS + shadcn/ui?

Tailwind enables accurate implementation of the Figma spacing, typography, colors, and responsive behavior while keeping component styling local and maintainable.

shadcn/ui provides accessible reusable primitives where appropriate.

### Why DummyJSON?

DummyJSON provides realistic public API data without requiring a custom backend, private API credentials, or paid services.

## Known Scope

This project is a frontend assignment and does not include a custom backend or database.

Some administrative action buttons are represented in the UI to match the supplied design, while the primary implemented functionality focuses on:

- API-driven data
- navigation
- search
- filtering
- pagination
- detail views
- state handling
- responsiveness

## Assignment Requirements

- [x] Next.js
- [x] React
- [x] TypeScript
- [x] Tailwind CSS
- [x] shadcn/ui
- [x] TanStack Query
- [x] Redux Toolkit
- [x] Public REST API
- [x] Dashboard
- [x] Users page
- [x] User detail page
- [x] Transactions page
- [x] Transaction detail page
- [x] Bookings page
- [x] Booking detail page
- [x] Charts
- [x] Search
- [x] Filters
- [x] Pagination
- [x] Loading states
- [x] Error states
- [x] Empty states
- [x] Disabled states
- [x] Desktop responsive implementation
- [x] Mobile responsive implementation
- [x] Reusable components
- [x] Production build support

## Author

Hrishabh Jain
