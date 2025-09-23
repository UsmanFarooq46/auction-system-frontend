# Online Auction System - Folder Structure

This document outlines the organized folder structure for the Angular-based online auction system.

## 📁 Project Structure

```
auction-system/
│── src/
│   ├── app/
│   │   ├── core/                     # Global services, models, guards
│   │   │   ├── services/             # AuthService, ApiService, SocketService
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── api.service.ts
│   │   │   ├── guards/               # AuthGuard, RoleGuard
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── role.guard.ts
│   │   │   ├── interceptors/         # Http interceptors
│   │   │   ├── models/               # Interfaces (User, Auction, Bid, Payment)
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── auction.model.ts
│   │   │   │   ├── bid.model.ts
│   │   │   │   └── payment.model.ts
│   │   │   └── utils/                # Helper functions
│   │   │
│   │   ├── shared/                   # Reusable UI + Pipes + Directives
│   │   │   ├── components/           # Generic components (Button, Modal, Table, Loader)
│   │   │   │   ├── button/
│   │   │   │   │   └── button.component.ts
│   │   │   │   └── loader/
│   │   │   │       └── loader.component.ts
│   │   │   ├── directives/           # Reusable directives
│   │   │   ├── pipes/                # Currency, Date, etc.
│   │   │   └── ui/                   # Small UI atoms (inputs, dropdowns, cards)
│   │   │
│   │   ├── features/                 # Domain-specific pages (each as standalone)
│   │   │   ├── auth/                 # Login, Register, Profile
│   │   │   │   ├── login/            # login.component.ts (standalone)
│   │   │   │   │   └── login.component.ts
│   │   │   │   ├── register/         
│   │   │   │   └── profile/
│   │   │   ├── auctions/             # Auction domain
│   │   │   │   ├── list/             # list.component.ts (browse auctions)
│   │   │   │   │   └── list.component.ts
│   │   │   │   ├── detail/           # detail.component.ts (auction details, live bids)
│   │   │   │   ├── create/           # create.component.ts (create auction)
│   │   │   │   └── components/       # auction-specific UI (bid-timer, bid-card)
│   │   │   ├── bids/                 # Bid history, live bids
│   │   │   ├── users/                # User dashboard, settings
│   │   │   ├── payments/             # Payment checkout, history
│   │   │   └── admin/                # Admin panel
│   │   │
│   │   ├── layouts/                  # Layout components (shells)
│   │   │   ├── main-layout/          # navbar + sidebar
│   │   │   │   └── main-layout.component.ts
│   │   │   ├── admin-layout/         
│   │   │   └── auth-layout/          
│   │   │
│   │   ├── state/                    # NgRx / Signals-based global state
│   │   │   ├── auctions/
│   │   │   ├── auth/
│   │   │   └── bids/
│   │   │
│   │   ├── app.config.ts             # provideRouter(), provideHttpClient(), providers
│   │   ├── app.routes.ts             # Central routing file
│   │   └── app.component.ts          # Root standalone component
│   │
│   ├── assets/                       # Images, icons, translations
│   ├── environments/                 # environment.ts, environment.prod.ts
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── styles/                       # global styles or Tailwind config
│   └── main.ts                       # bootstrapApplication(AppComponent, { providers: [...] })
│
└── angular.json
```

## 🏗️ Architecture Principles

### 1. **Core Module** (`src/app/core/`)
- **Services**: Global services like authentication, API communication, WebSocket connections
- **Guards**: Route guards for authentication and authorization
- **Interceptors**: HTTP interceptors for request/response handling
- **Models**: TypeScript interfaces and types
- **Utils**: Helper functions and utilities

### 2. **Shared Module** (`src/app/shared/`)
- **Components**: Reusable UI components (buttons, modals, tables, loaders)
- **Directives**: Custom directives for common functionality
- **Pipes**: Transform pipes for data formatting
- **UI**: Small atomic UI components (inputs, dropdowns, cards)

### 3. **Features Module** (`src/app/features/`)
- **Domain-specific modules**: Each feature is self-contained
- **Standalone components**: Each component is standalone for better tree-shaking
- **Lazy loading**: Features are loaded on-demand
- **Centralized routing**: All routes are defined in the main app.routes.ts file

### 4. **Layouts Module** (`src/app/layouts/`)
- **Layout components**: Different layouts for different sections
- **Main Layout**: Standard layout with navigation
- **Admin Layout**: Admin-specific layout
- **Auth Layout**: Authentication pages layout

### 5. **State Management** (`src/app/state/`)
- **NgRx/Signals**: Global state management
- **Feature-based state**: Each feature has its own state slice
- **Actions, Reducers, Effects**: Organized state management

## 🚀 Benefits of This Structure

1. **Scalability**: Easy to add new features without affecting existing code
2. **Maintainability**: Clear separation of concerns
3. **Reusability**: Shared components can be used across features
4. **Performance**: Lazy loading and standalone components
5. **Team Collaboration**: Clear boundaries for different team members
6. **Testing**: Easy to unit test individual components and services

## 📝 Next Steps

1. **Add NgRx**: Implement state management for auctions, auth, and bids
2. **Create more components**: Build out the remaining feature components
3. **Add interceptors**: Implement HTTP interceptors for authentication
4. **Add pipes**: Create custom pipes for currency, date formatting
5. **Add directives**: Create reusable directives
6. **Add tests**: Unit tests for components and services
7. **Add documentation**: JSDoc comments for better code documentation

## 🔧 Development Guidelines

- Use standalone components for better tree-shaking
- Implement lazy loading for all feature modules
- Follow Angular style guide conventions
- Use TypeScript strict mode
- Implement proper error handling
- Use reactive forms for form handling
- Implement proper loading states
- Use Angular Material or similar UI library for consistent design
