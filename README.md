# Frontend - URL Shortener Client

## Tech Stack Contract

This document outlines the technologies, libraries, and architectural decisions used in the frontend of the URL Shortener application. This serves as a reference for the development team to ensure consistency and understanding of the core UI infrastructure.

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | Next.js | 16.0.6 | React framework for SSR, routing, and optimization |
| **Library** | React | 19.2.0 | Component-based UI library |
| **Language** | TypeScript | ^5.0 | Static typing and enhanced developer experience |
| **Styling** | Tailwind CSS | v4 | Utility-first CSS framework |
| **UI Components** | Shadcn/UI (Radix) | Latest | Accessible, headless UI primitives |
| **State/Forms** | React Hook Form | ^7.67 | Performant form validation and state |
| **Validation** | Zod | ^4.1 | Schema-based validation |
| **Data Fetching** | Axios | ^1.13 | Promise-based HTTP client |
| **Visualization** | Recharts | ^2.15 | Composable charting library |

---

## Detailed Tech Stack & Usage

### 1. Framework: Next.js 16 (App Router)
**Why:** Next.js provides a robust production framework with built-in optimizations for images, fonts, and routing. Version 16 introduces the latest React features and performance improvements.
**How:**
- **App Router:** We use the `app/` directory for file-system based routing.
- **Server Components:** Utilized for initial data fetching and reducing client-side bundle size.
- **Client Components:** Used for interactive elements (forms, charts).

### 2. Styling: Tailwind CSS v4
**Why:** Tailwind allows for rapid UI development with utility classes, ensuring design consistency. Version 4 brings performance improvements and a simplified configuration.
**How:** Used extensively for layout, spacing, typography, and colors. We avoid writing custom CSS files, preferring utility classes and configuration in `tailwind.config.ts` (or CSS variables).

### 3. Component Library: Shadcn/UI & Radix Primitives
**Why:** Shadcn/UI provides copy-pasteable components built on top of Radix UI. This gives us full control over the code while ensuring accessibility (WAI-ARIA compliance) and keyboard navigation out of the box.
**How:** Components are located in `components/ui`. They are customizable and not locked behind a node_module package.

### 4. Form Handling: React Hook Form + Zod
**Why:** Forms are complex. React Hook Form minimizes re-renders and improves performance. Zod provides a powerful schema declaration for validation that integrates seamlessly with TypeScript.
**How:**
- **Zod:** Define schemas (e.g., `LoginSchema`, `UrlSchema`) to validate inputs.
- **React Hook Form:** Manages form state and integrates with Zod resolvers to handle errors and submission.

### 5. Data Visualization: Recharts
**Why:** We need to display analytics (clicks, uptime) clearly. Recharts is a composable, React-centric charting library that is easy to customize.
**How:** Used in the `Stats` components to render line charts and bar graphs for link activity.

### 6. HTTP Client: Axios
**Why:** While `fetch` is standard, Axios provides automatic JSON transformation, interceptors (useful for auth tokens), and better error handling.
**How:** A configured Axios instance (likely in `lib/axios.ts` or similar) is used for all API requests to the backend.

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Setup**
    Create a `.env.local` file in the root and add necessary variables (e.g., API URL):
    ```bash
    NEXT_PUBLIC_API_URL=http://localhost:8000
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

4.  **Build for Production**
    ```bash
    npm run build
    npm start
    ```

### Project Structure
- `app/`: Application routes and pages.
- `components/`: Reusable UI components.
  - `ui/`: Shadcn primitive components.
- `lib/`: Utility functions and configurations (Axios, utils).
- `hooks/`: Custom React hooks.
