# MAPPA Portal - UI Shell & Design System

**Hệ thống quản lý thị trường thông minh - Vietnamese Government Information Management System**

## 🎯 Overview

Complete horizontal layout portal shell with comprehensive UI Kit for Vietnamese market management system. Built with ReactJS + TypeScript, styled with CSS Modules for maximum modularity and reusability.

## ✅ Deliverables Complete

### 1. Horizontal Layout Shell ✓
- **Top Utility Bar** - Logo, global search, language/theme toggle, notifications, user dropdown
- **Horizontal Navigation Bar** - 9 module groups with dropdown menus (Vuexy-inspired)
- **Page Header** - Breadcrumbs, title, actions
- **Responsive** - Collapses to hamburger drawer under 1024px

### 2. Authentication Pages ✓
- `/auth/login` - Phone/Email toggle login (Vietnamese phone numbers first)
- `/auth/verify-otp` - 6-digit OTP verification with resend countdown
- `/auth/forgot-password` - Phone/Email recovery with toggle
- `/auth/reset-password` - New password with strength meter
- `/auth/select-jurisdiction` - Unit tree selection (Cục/Chi cục/Đội) + jurisdiction dropdown

### 3. Account Pages ✓
- `/account/profile` - User information, unit, role, security settings
- `/account/preferences` - Language (VI/EN), Theme (Light/Dark/System), Table density, Notifications

### 4. System Error Pages ✓
- `/403` - No Permission (with reason + back button)
- `/404` - Not Found (friendly message + navigation)
- `/500` - Server Error (retry + support contact)
- `/maintenance` - Maintenance mode with status message

### 5. UI Kit / Design System ✓

#### Foundations
- `tokens.ts` - Design tokens (spacing, colors, radius, shadows, z-index, breakpoints)
- All values reference CSS variables from `/src/styles/theme.css`

#### Core Components (CSS Modules)
- ✅ **Input** - Label, icon, error, helper text, all states
- ✅ **PasswordInput** - Show/hide toggle, strength meter (4 levels)
- ✅ **Card** - Header/Content/Footer, hoverable variant
- ✅ **DataTable** - Existing with sorting, filtering, pagination
- ✅ **StatusBadge** - Status indicators (Draft/Verified/Approved/Overdue)
- ✅ **EmptyState** - Empty/error states with icon + action
- ✅ **SearchInput** - Search with icon

### 6. Module Route Skeletons ✓
All 9 modules configured and ready:
- `/overview` - Dashboard (full implementation)
- `/map` - Operational map
- `/stores` - Store registry (full CRUD implementation)
- `/leads` - Risk/lead management
- `/plans` - Operational plans
- `/tasks` - Field tasks
- `/evidence` - Evidence repository
- `/reports` - Reports & KPI
- `/admin` - System administration

## 🏗️ Architecture

```
src/
├── ui-kit/                    # Design System (CSS Modules)
│   ├── foundations/
│   │   └── tokens.ts         # Design tokens
│   ├── Input/
│   │   ├── Input.tsx
│   │   └── Input.module.css
│   ├── PasswordInput/
│   ├── Card/
│   ├── DataTable.tsx
│   ├── StatusBadge.tsx
│   ├── EmptyState.tsx
│   ├── SearchInput.tsx
│   ├── index.ts              # Main exports
│   └── README.md             # Documentation
│
├── layouts/                   # Layout components
│   ├── HorizontalLayout.tsx  # Main layout wrapper
│   ├── TopUtilityBar.tsx     # Top bar with logo, search, user menu
│   ├── HorizontalNavBar.tsx  # Horizontal navigation with dropdowns
│   └── PageHeader.tsx        # Page header with breadcrumbs
│
├── pages/
│   ├── auth/                 # Auth flow pages
│   │   ├── Login.tsx
│   │   ├── VerifyOTP.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── ResetPassword.tsx
│   │   └── SelectJurisdiction.tsx
│   ├── account/              # Account pages
│   │   ├── Profile.tsx
│   │   └── Preferences.tsx
│   ├── system/               # Error pages
│   │   ├── Error403.tsx
│   │   ├── Error404.tsx
│   │   ├── Error500.tsx
│   │   └── Maintenance.tsx
│   ├── OverviewPage.tsx      # Dashboard
│   ├── StoresListPage.tsx    # Full CRUD example
│   └── PlaceholderPage.tsx   # Template for other modules
│
├── patterns/                  # Reusable patterns
│   ├── FilterBar.tsx
│   └── EntityDrawer.tsx
│
├── routes/
│   └── routes.tsx            # Single source of truth for routing
│
└── styles/
    ├── theme.css             # CSS variables (design tokens)
    ├── tailwind.css          # Tailwind config
    └── fonts.css             # Font imports
```

## 🎨 Design System

### CSS Variables (from theme.css)
```css
/* Colors */
--primary: rgba(127, 86, 217, 1);      /* Purple */
--foreground: rgba(16, 24, 40, 1);     /* Dark text */
--muted-foreground: rgba(102, 112, 133, 1);
--background: rgba(249, 250, 251, 1);  /* Light gray */
--card: rgba(255, 255, 255, 1);        /* White */
--border: rgba(208, 213, 221, 1);      /* Gray border */
--destructive: rgba(217, 45, 32, 1);   /* Red */

/* Typography */
--text-xs: 12px;
--text-sm: 14px;
--text-base: 16px;
--text-lg: 20px;
--text-xl: 24px;
--text-2xl: 30px;

--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;

/* Spacing (8px system) */
/* Use multiples: 4px, 8px, 16px, 24px, 32px, 48px, 64px */

/* Radius */
--radius-sm: 4px;
--radius-lg: 8px;
--radius-card: 16px;
```

### Typography (Inter Font)
- Body text: 14px (--text-sm)
- Headings: 20-30px (--text-lg to --text-2xl)
- Labels: 12px (--text-xs)
- All components use Inter font from Google Fonts

### CSS Modules Pattern
```tsx
// Component.tsx
import styles from './Component.module.css';

export function Component() {
  return <div className={styles.wrapper}>...</div>;
}

// Component.module.css
.wrapper {
  color: var(--foreground);
  font-size: var(--text-sm);
  padding: 16px;
  border-radius: var(--radius-lg);
}
```

## 🌐 Vietnamese-First Design

- Primary language: **Vietnamese**
- Phone number format: +84 (Vietnamese mobile)
- Email as secondary option (toggle)
- All UI text in Vietnamese
- English prepared via i18n keys (not implemented yet, structure ready)

## 📱 Responsive Breakpoints

```typescript
mobile: 640px    // Stack cards, simplified UI
tablet: 1024px   // **Horizontal menu collapses to drawer**
laptop: 1280px   // Standard desktop layout
desktop: 1440px  // Wide layout
```

## 🔐 Auth Flow

```
1. /auth/login (phone or email)
   ↓
2. /auth/verify-otp (optional 2FA)
   ↓
3. /auth/select-jurisdiction (unit + địa bàn)
   ↓
4. /overview (main app)

Forgot password flow:
/auth/forgot-password → /auth/reset-password → /auth/login
```

## 🎯 Key Features

### 1. Modular & Reusable
- CSS Modules prevent conflicts
- Easy to merge with host applications
- Clean component exports from `/ui-kit/index.ts`

### 2. Design Token System
- All styles reference CSS variables
- Update design by editing `/src/styles/theme.css`
- Consistent spacing, colors, typography

### 3. Complete States
- Default, Hover, Focus, Active
- Disabled, Loading, Error, Empty
- All interactive elements have proper states

### 4. Production-Ready
- TypeScript for type safety
- Proper error handling
- Loading states
- Empty states
- 403/404/500 error pages

## 🚀 Usage for Module Development

### Using UI Kit Components
```tsx
import { Input, Card, DataTable, StatusBadge } from '@/ui-kit';

function MyModule() {
  return (
    <Card>
      <CardHeader title="My Module" />
      <CardContent>
        <Input label="Name" placeholder="Enter name" />
        <StatusBadge status="active" />
      </CardContent>
    </Card>
  );
}
```

### Styling New Components
```tsx
// MyComponent.tsx
import styles from './MyComponent.module.css';

export function MyComponent() {
  return <div className={styles.container}>...</div>;
}

// MyComponent.module.css
.container {
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  padding: 24px;
}
```

### Adding to Layout
```tsx
// Already configured in routes.tsx
// Just create your page and add route
<Route path="/your-module" element={<YourModule />} />
```

## 📋 TODO / Future Enhancements

### Additional UI Components
- [ ] Select / MultiSelect dropdown
- [ ] DateRangePicker
- [ ] Tabs component
- [ ] Modal / Dialog
- [ ] Drawer (right panel)
- [ ] Toast notifications
- [ ] Pagination component
- [ ] Advanced Breadcrumb
- [ ] Skeleton loaders
- [ ] Progress indicators

### Features
- [ ] i18n implementation (vi/en)
- [ ] Dark mode toggle implementation
- [ ] Real API integration
- [ ] Form validation library integration
- [ ] Global search functionality
- [ ] Advanced filtering patterns
- [ ] Export functionality (PDF, Excel)

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Routing**: React Router v6
- **Styling**: CSS Modules + Tailwind CSS 4.0
- **Icons**: Lucide React
- **UI Components**: Custom + Radix UI primitives
- **Build**: Vite

## 📖 Documentation

- **UI Kit**: See `/src/ui-kit/README.md`
- **Design Tokens**: See `/src/ui-kit/foundations/tokens.ts`
- **Routes**: See `/src/routes/routes.tsx`

## ✨ Quality Checklist

✅ Clean alignment and consistent spacing (8px system)  
✅ All hover/focus/disabled states implemented  
✅ Fully responsive (collapses at 1024px)  
✅ Vietnamese labels by default  
✅ All dropdowns work smoothly  
✅ Phone/Email toggle in auth pages  
✅ Password strength meter  
✅ OTP verification with countdown  
✅ Unit hierarchy selection (3-level)  
✅ Error pages (403, 404, 500, maintenance)  
✅ Account pages (profile, preferences)  
✅ CSS Modules for all components  
✅ Design tokens from theme.css  
✅ Mappa logo integrated  
✅ No React Fragment errors  
✅ TypeScript types defined  
✅ Production build ready  

---

**Ready for Module Integration** 🚀

This shell is designed to be the foundation for all MAPPA modules. Each module can be developed independently using Make and merged into this shell structure.
