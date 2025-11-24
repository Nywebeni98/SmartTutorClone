# Design Guidelines: Be Smart Online Tutorials

## Design Approach
**Reference-Based Approach** inspired by modern educational platforms like Coursera, Khan Academy, and Udemy, adapted for a local tutoring service with emphasis on accessibility and trust-building for the Khayelitsha community.

## Brand Colors
- Primary: `#0a4191` (Professional Blue) - Headers, CTAs, primary buttons
- Secondary: `#f9a825` (Vibrant Yellow/Gold) - Accents, highlights, success states
- Tertiary: `#c97700` (Warm Orange) - Secondary CTAs, hover states, badges
- Neutral: White backgrounds, `#f8f9fa` for sections, `#212529` for text

## Typography
**Font Stack:**
- Primary: 'Inter' (Google Fonts) - Clean, modern sans-serif for UI
- Headings: 'Poppins' (Google Fonts) - Bold, friendly for impact

**Hierarchy:**
- Hero Headline: text-5xl to text-6xl, font-bold, Poppins
- Section Headers: text-3xl to text-4xl, font-semibold, Poppins
- Subheadings: text-xl to text-2xl, font-medium
- Body: text-base to text-lg, Inter, leading-relaxed for readability
- Buttons/CTAs: text-base, font-semibold, uppercase tracking

## Layout System
**Spacing Primitives:** Tailwind units of 4, 8, 12, 16, 20 (p-4, m-8, gap-12, py-16, space-y-20)

**Container Strategy:**
- Full-width sections with inner max-w-7xl for consistency
- Content sections: max-w-6xl for optimal reading
- Forms: max-w-md for focused interaction

**Section Padding:**
- Desktop: py-20 to py-24
- Mobile: py-12 to py-16

## Header & Navigation
**Logo Prominence:** 
- Logo height: h-16 to h-20 (significantly larger than typical)
- Top-left positioning with generous padding
- "Be Smart Online Tutorials" text alongside logo in Poppins font-bold

**Navigation:**
- Horizontal menu: Home, Subjects, About, Contact, Login
- Mobile: Hamburger menu with full-screen overlay
- Sticky header with shadow on scroll
- "Continue with Google" button in header (rounded-full, blue background with blur backdrop)

## Hero Section
**Full-width hero with background gradient** (blue to orange tones)
- Height: 85vh on desktop, auto on mobile
- Large headline emphasizing local Khayelitsha tutoring excellence
- Subheadline highlighting subjects/approach
- Dual CTA buttons: "Browse Subjects" (primary yellow), "Get Started" (outlined white)
- Background: Blurred backdrop with subtle pattern or abstract educational imagery

## Core Components

**Subject/Course Cards:**
- Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3, gap-8
- Card design: rounded-2xl, shadow-lg with hover lift effect
- Card contents: Subject icon/image, title, brief description, "Learn More" link
- Color coding: Each subject card uses one of the brand colors as accent border/icon

**Authentication Modal:**
- Centered modal with rounded-3xl container
- "Continue with Google" button: Full width, blue background, Google icon + text
- Simple, clean design with logo at top
- Backdrop blur effect for modal overlay

**About Section:**
- Two-column layout (lg:grid-cols-2)
- Left: Mission statement, teaching approach, location highlight
- Right: Placeholder for tutor image or community photo
- Khayelitsha, Cape Town prominently featured with location icon

**Contact Section:**
- Split layout: Contact form (left) + Info card (right)
- Form fields: Name, Email, Subject, Message (simple, large inputs)
- Info card: Location (Khayelitsha, Cape Town), Phone, Email with icons
- Submit button: Yellow with orange hover state

**Footer:**
- Three-column grid: About, Quick Links, Contact Info
- Social media icons in brand colors
- Newsletter signup (email input + yellow button)
- Copyright with "Khayelitsha, Cape Town" mention

## Images
**Hero Section:** 
- Large background image showing students learning/studying (warm, diverse, aspirational)
- Image should be optimistic, featuring South African students if possible
- Overlay: Semi-transparent blue-orange gradient for text readability

**About Section:**
- Image of tutoring in action or Khayelitsha community setting
- Authentic, relatable photography showcasing local context

**Subject Cards:**
- Icon-based graphics for each subject (Math, Science, English, etc.)
- Consistent illustration style across all cards

## Animation & Interaction
**Minimal, purposeful animations:**
- Fade-in on scroll for sections
- Card hover: Subtle lift (translateY) with shadow increase
- Button hover: Slight scale + color shift
- No distracting parallax or complex scroll effects

## Accessibility
- High contrast text (WCAG AA minimum)
- Focus states on all interactive elements (2px blue outline)
- Clear button labels and ARIA labels
- Large touch targets (min 44x44px)
- Simple language throughout

## Mobile Responsiveness
- Mobile-first approach
- Stack all multi-column layouts to single column
- Larger tap targets on mobile
- Hamburger menu for navigation
- Contact form full-width on mobile

This design creates a trustworthy, professional yet approachable educational platform that celebrates the Khayelitsha community while maintaining modern web standards.