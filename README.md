# GlobeTrek AI — Frontend

> A modern travel booking platform with an AI-powered trip planner. Built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, and **Stripe**.

🌐 [Live Application](https://globtrekai.vercel.app) &nbsp;|&nbsp; 📦 [Frontend Repo](https://github.com/habib-web-dev1/globtrek-frontend) &nbsp;|&nbsp; 🔧 [Backend Repo](https://github.com/habib-web-dev1/globtrek-backend)

---

## Tech Stack

| Layer            | Technology              |
| ---------------- | ----------------------- |
| Framework        | Next.js 16 (App Router) |
| Language         | TypeScript              |
| Styling          | Tailwind CSS v4         |
| State Management | Zustand                 |
| HTTP Client      | Axios                   |
| Payments         | Stripe (React SDK)      |
| Icons            | Lucide React            |
| Deployment       | Vercel                  |

---

## Features

- **AI Trip Planner** — Chat interface powered by Gemini AI. Delivers personalized destination recommendations, itinerary ideas, budget tips, and safety advice. Includes quick-suggestion prompts for new users.
- **Destination Discovery** — Browse, filter, and sort travel packages by category, price, and rating with a responsive filter sidebar.
- **Booking Flow** — Seamless multi-step booking experience with a sidebar summary and Stripe payment modal.
- **User Dashboard** — View and manage personal bookings with status tracking.
- **Admin Panel** — Full management interface for destinations, bookings, users, reviews, and platform analytics.
- **Authentication** — JWT-based login and registration with persistent auth state via Zustand.
- **Reviews** — Submit and read traveler reviews per destination.
- **Responsive Design** — Fully mobile-first layout across all pages.

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/         # Login page
│   │   └── register/      # Registration page
│   ├── admin/
│   │   ├── analytics/     # Platform analytics dashboard
│   │   ├── bookings/      # Manage all bookings
│   │   ├── items/         # Manage destinations
│   │   ├── reviews/       # Manage reviews
│   │   └── users/         # Manage users
│   ├── user/
│   │   ├── dashboard/     # User profile & stats
│   │   └── bookings/      # User's booking history
│   ├── destinations/      # All destinations listing
│   ├── ai-planner/        # AI chat interface
│   └── page.tsx           # Homepage
├── components/
│   ├── common/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── ui/
│   │   ├── Hero.tsx
│   │   ├── DestinationCard.tsx
│   │   ├── BookingSidebar.tsx
│   │   ├── PaymentModal.tsx
│   │   ├── FilterSidebar.tsx
│   │   ├── AIChatPreview.tsx
│   │   ├── CategoryExplorer.tsx
│   │   ├── TravelInsights.tsx
│   │   ├── Testimonials.tsx
│   │   ├── HowItWorks.tsx
│   │   └── StatsSection.tsx
│   └── forms/
│       └── ProfileForm.tsx
├── services/
│   └── api.ts             # Axios instance with JWT interceptor
├── store/
│   └── authStore.ts       # Zustand auth state
└── types/                 # Shared TypeScript interfaces
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A running instance of the [GlobeTrek Backend](https://github.com/habib-web-dev1/globtrek-backend)
- Stripe publishable key

### Installation

```bash
git clone https://github.com/habib-web-dev1/globtrek-frontend.git
cd globtrek-frontend
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

For production, point `NEXT_PUBLIC_API_URL` to your deployed backend URL.

### Running Locally

```bash
# Development server
npm run dev

# Production build
npm run build
npm start
```

The app runs on `http://localhost:3000` by default.

---

## Pages Overview

| Route               | Description                                | Access        |
| ------------------- | ------------------------------------------ | ------------- |
| `/`                 | Homepage with hero, categories, AI preview | Public        |
| `/destinations`     | Browse & filter all destinations           | Public        |
| `/destinations/:id` | Destination detail with booking & reviews  | Public        |
| `/ai-planner`       | AI travel chat assistant                   | Authenticated |
| `/login`            | Login page                                 | Public        |
| `/register`         | Registration page                          | Public        |
| `/user/dashboard`   | User profile and stats                     | User          |
| `/user/bookings`    | Personal booking history                   | User          |
| `/admin/analytics`  | Platform-wide analytics                    | Admin         |
| `/admin/items`      | Manage travel packages                     | Admin         |
| `/admin/bookings`   | Manage all bookings                        | Admin         |
| `/admin/users`      | Manage users & roles                       | Admin         |
| `/admin/reviews`    | Moderate reviews                           | Admin         |

---

## Deployment

Deployed on **Vercel** with zero-config Next.js support.

```bash
vercel --prod
```

Set your environment variables in the Vercel project dashboard under **Settings → Environment Variables**.

---

## 📄 License

This project is for portfolio and demonstration purposes.

---

<div align="center">
  Built with ❤️ by <a href="https://github.com/habib-web-dev1">habib-web-dev1</a>
</div>
