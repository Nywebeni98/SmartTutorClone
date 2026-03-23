# Be Smart Online Tutorials - Replit Documentation

## Overview

Be Smart Online Tutorials is a web application for a local tutoring service in Cape Town, South Africa. It provides information about tutoring services across various subjects (Maths, Physical Sciences, English, Life Sciences) and includes a contact form for prospective students and parents. This full-stack TypeScript SPA emphasizes accessibility, modern design, and user-friendly interactions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
-   **Design System:** shadcn/ui components built on Radix UI primitives, styled with Tailwind CSS.
-   **Branding:** Professional Blue (#0a4191), Vibrant Yellow (#f9a825), and Warm Orange (#c97700).
-   **Typography:** Inter for UI, Poppins for headings (Google Fonts).
-   **Accessibility:** Focus on best-in-class accessibility with keyboard navigation and ARIA support (Radix UI).

### Technical Implementations
-   **Frontend:** React 18 with TypeScript, Vite for fast HMR, Wouter for lightweight client-side routing.
-   **Backend:** Express.js for HTTP server and API routing, with separate dev/prod entry points.
-   **State Management:** TanStack Query for server state, React Context for authentication, React hooks for local state.
-   **Data Validation:** Zod schemas for runtime type validation on API requests.
-   **Authentication:** Multi-role system (Students via Google OAuth/Supabase, Tutors via Email/Password/Supabase, Admin via server-side token).
-   **Payment Flow:** Secure "Pay-First" flow using Yoco fixed payment links with server-side token validation, one-time use tokens, and expiration.
-   **Session Management:** Tracks `sessionStartTime`, `sessionEndTime`, and `isActive` flag. Hides tutor details after session ends. Includes a reminder system for upcoming sessions.

### Feature Specifications
-   **Contact Form:** Submits via `mailto:` to `onlinepresenceimpact@gmail.com`.
-   **Booking Email Notifications:** Configured via Resend for successful bookings.
-   **Tutor Management:** Profiles for tutors with subjects, rates, availability, and approval status.
-   **Admin Dashboard:** Manages tutors (approve/block), views bookings, and handles pricing.
-   **Protected Routes:** `/tutor-dashboard` and `/admin` for role-specific access.

### System Design Choices
-   **Development vs. Production:** Vite middleware for dev, static asset serving for prod.
-   **Deployment:** Server binds to `0.0.0.0:5000` for Replit Autoscale, `/health` endpoint for monitoring.
-   **Data Storage:** PostgreSQL via Drizzle ORM.
    -   **Schema:** `users`, `contact_submissions`, `tutor_profiles`, `tutor_availability`, `booking_payments`, `payment_links`, `admin_settings`, `action_logs`, `learner_registrations`.
    -   **Migration:** Drizzle Kit for schema changes.

## External Dependencies

### Third-Party Services
-   **Supabase:** Authentication provider for Google OAuth and email/password.
-   **Neon Database:** Serverless PostgreSQL database (used for `DATABASE_URL`).
-   **Resend:** Email notification service.
-   **Yoco:** Payment gateway for processing bookings (fixed payment links).

### UI Libraries
-   **Radix UI:** Accessible, unstyled component primitives (Dialog, Dropdown Menu, etc.).
-   **Tailwind CSS:** Utility-first CSS framework for styling.

### Developer Tools
-   **Replit Plugins:** `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner` (dev mode only).

### Form Handling
-   **React Hook Form:** Form state management with Zod schema validation.
-   **date-fns:** Date formatting and manipulation utilities.
```