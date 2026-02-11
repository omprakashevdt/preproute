# Architecture & Implementation Strategy

This document outlines the core architectural decisions, patterns, and strategies used in the development of the **PrepRoute** application.

## 1. Technology Stack

- **React 19 (w/ TypeScript):** Chosen for its component-based architecture and strong ecosystem. TypeScript ensures type safety, reducing runtime errors and improving developer experience.
- **Vite:** Selected as the build tool for its superior development server speed (HMR) and optimized production builds.
- **Redux Toolkit:** Centralized state management for authentication and complex application state.
- **React Router v7:** utilized for client-side routing, enabling a Single Page Application (SPA) experience.
- **MUI (Material UI):** Comprehensive UI component library for consistent design and rapid development.
- **React Hook Form:** Efficient, flexible, and extensible forms with easy validation.
- **React Toastify:** For elegant, customizable toast notifications.

## 2. Routing Architecture

### Approach: Centralized & Lazy Loaded

Instead of scattering routes throughout the application, we use a centralized `AppRoutes.tsx` file.

- **Lazy Loading (`React.lazy`):**
  - **Why:** Loading the entire application bundle upfront slows down the initial page load.
  - **Benefit:** Routes are split into separate chunks. A user only downloads the code for the "Dashboard" when they actually visit `/dashboard`.

- **Suspense Fallback:**
  - **Who:** `<Suspense fallback={<Loader />}>`
  - **Benefit:** Provides immediate visual feedback (a spinner) while the lazy-loaded chunk is being fetched, preventing the app from appearing "frozen".

### Pattern: Layout-Based Routing

We utilize "Layout Components" (`MainLayout`, `AuthLayout`) to wrap specific groups of routes.

- **`AuthLayout`:** Wraps public pages like Login/Register. It simplifies the design by handling common styles (e.g., centered box) in one place.
- **`MainLayout`:** Wraps private pages. It persists the **Navbar** and **Footer** across route transitions, so only the content area (`<Outlet />`) re-renders. This is crucial for performance and UX.

## 3. Security & Access Control

### Authentication Flow (Redux + API)

We implement a robust authentication strategy:

- **State Management:** `authSlice.ts` manages `user`, `token`, `isAuthenticated`, and loading states via Redux.
- **API Communication:** `apiClient.ts` (Axios instance) is configured with interceptors:
  - **Request Interceptor:** Automatically attaches the JWT token from `localStorage` to every request header.
  - **Response Interceptor:** Global error handling. If a 401 (Unauthorized) response is received, it automatically logs the user out and clears storage.
- **Login Service:** `Login.service.ts` encapsulates the API call logic, keeping components clean.

### Protected Routes Wrapper

We adhere to the **High-Order Component (HOC)** pattern for protection.

- **Implementation:** `ProtectedRoute.tsx` checks for the presence of an authentication token (currently in `localStorage`).
- **Benefit:** If a user tries to access `/dashboard` without a token, they are automatically redirected to `/login`. This logic is centralized, meaning we don't need to manually check for tokens in every single page component.

## 4. Error Handling & Robustness

### Error Boundaries

React components can crash due to runtime errors (e.g., trying to access a property of `undefined`).

- **Approach:** We wrapped the entire application (in `AppRoutes`) with a custom `ErrorBoundary` component.
- **Benefit:** Instead of the entire application crashing and showing a blank white screen (White Screen of Death), the user is presented with a friendly "Something went wrong" UI with a "Reload" button. This is critical for production stability.

### Form Validation

- **React Hook Form:** Used in `LoginForm.tsx` for performant, uncontrolled form inputs with built-in validation rules (required fields, patterns).

## 5. Production Readiness Enhancements

Recent updates to ensure the application is production-ready:

- **SEO Optimization:** `index.html` updated with proper `<title>` and `<meta name="description">`.
- **TypeScript Configuration:** Added `vite-env.d.ts` for type-safe environment variables.
- **Asset Management:** Moved static assets to `public/` directory and switched to absolute paths to prevent build/runtime import errors.
- **Polished UI:** Enhanced `NotFound.tsx` with a professional design and navigation options.

## 6. Folder Structure

We follow a **feature-first** organization balanced with **type-based** grouping:

```
src/
├── components/     # Reusable UI elements
│   ├── auth/       # Authentication (LoginForm)
│   ├── common/     # Global components (Loader, ErrorBoundary, CustomButton)
│   └── ...
├── layouts/        # Page wrappers (MainLayout, AuthLayout)
├── pages/          # Views corresponding to routes (Dashboard, Login, NotFound)
├── redux/          # State management
│   ├── service/    # API interaction logic
│   ├── slice/      # Redux slices (reducers/actions)
│   └── ...
├── routes/         # Router configuration & protection logic
├── theme/          # Design system tokens (colors, typography)
└── ...
```

---

_This document serves as a living guide to the architectural choices of the project._
