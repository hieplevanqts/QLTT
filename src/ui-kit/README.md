# MAPPA UI Kit

Complete design system for MAPPA Portal - Vietnamese government information management system.

## Architecture

```
ui-kit/
├── foundations/          # Design tokens (colors, spacing, typography)
├── [Component]/         # Each component has its own folder
│   ├── Component.tsx    # Component logic
│   └── Component.module.css  # Scoped styles using CSS Modules
└── index.ts            # Main export file
```

## Design Principles

### CSS Modules
All components use **CSS Modules** to avoid global CSS conflicts. This is critical for merging with host applications later.

```tsx
import styles from './Component.module.css';

<div className={styles.component}>Content</div>
```

### Design Tokens
All components reference CSS variables from `/src/styles/theme.css`:

- Colors: `var(--primary)`, `var(--foreground)`, `var(--muted-foreground)`
- Typography: `var(--text-sm)`, `var(--font-weight-medium)`
- Spacing: `8px` base system
- Radius: `var(--radius-lg)`, `var(--radius-card)`
- Shadows: `var(--elevation-sm)`

### Typography
- Font family: **Inter** (from Google Fonts)
- All text uses font faces defined in theme.css
- No hardcoded font sizes - use CSS variables

## Core Components

### Input
```tsx
import { Input } from '@/ui-kit';

<Input
  label="Email"
  type="email"
  placeholder="Enter email"
  icon={<Mail size={18} />}
  error="Invalid email"
  helperText="We'll never share your email"
/>
```

### PasswordInput
```tsx
import { PasswordInput } from '@/ui-kit';

<PasswordInput
  label="Password"
  showStrength
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
```

### Card
```tsx
import { Card, CardHeader, CardContent, CardFooter } from '@/ui-kit';

<Card hoverable onClick={handleClick}>
  <CardHeader
    title="Card Title"
    description="Card description"
    action={<Button>Action</Button>}
  />
  <CardContent>
    Content here
  </CardContent>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>
```

### DataTable
See existing implementation with sorting, filtering, and pagination.

### StatusBadge
```tsx
import { StatusBadge } from '@/ui-kit';

<StatusBadge status="active" />
<StatusBadge status="draft" />
<StatusBadge status="verified" />
```

### EmptyState
```tsx
import { EmptyState } from '@/ui-kit';

<EmptyState
  icon={<FileQuestion size={48} />}
  title="No data"
  description="Get started by creating your first item"
  action={<Button>Create Item</Button>}
/>
```

## Responsive Design

All components are responsive with breakpoints:
- Mobile: 640px
- Tablet: 1024px (horizontal menu collapses to drawer)
- Laptop: 1280px
- Desktop: 1440px

## Component States

All components support these states:
- Default
- Hover
- Focus
- Active
- Disabled
- Loading
- Error
- Empty

## Vietnamese-First

- All labels and messages in Vietnamese by default
- English translation prepared via i18n config keys
- High readability for Vietnamese characters

## Usage in Module Projects

When creating new module projects with Make:

1. Import UI Kit components:
```tsx
import { Input, Card, DataTable } from '@/ui-kit';
```

2. Use design tokens:
```tsx
import { tokens } from '@/ui-kit';

<div style={{ padding: tokens.spacing.lg }}>
```

3. Follow CSS Modules pattern:
```css
/* MyComponent.module.css */
.myComponent {
  color: var(--foreground);
  font-size: var(--text-sm);
}
```

## Contributing

When adding new components:

1. Create folder: `/ui-kit/[ComponentName]/`
2. Add `ComponentName.tsx` + `ComponentName.module.css`
3. Use CSS variables from theme.css
4. Support all component states
5. Add TypeScript types
6. Export from `/ui-kit/index.ts`
7. Document usage in this README

## Future Components

Planned components to complete the UI Kit:
- Select / MultiSelect
- DateRangePicker
- Tabs
- Modal
- Drawer
- Toast/Alert
- Pagination
- Breadcrumb
- Skeleton loaders
- Dropdown (enhanced)
