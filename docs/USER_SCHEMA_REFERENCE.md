# User Schema Reference

## Database Schema (Supabase)

```sql
create table public.users (
  id uuid not null default extensions.uuid_generate_v4(),
  username character varying(100) null,
  full_name character varying(255) null,
  email character varying(255) null,
  status integer not null default 1,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  phone character varying(20) null,
  "avatarUrl" text null,
  role character varying(20) null default 'VIEWER'::character varying,
  "departmentId" uuid null,
  "lastLoginAt" timestamp with time zone null,
  avatar_url text null,
  constraint users_pkey primary key (id),
  constraint users_username_key unique (username)
);
```

## Field Mapping

| Database Field | Type | Nullable | Default | Notes |
|----------------|------|----------|---------|-------|
| `id` | uuid | NOT NULL | uuid_generate_v4() | Primary key |
| `username` | varchar(100) | YES | - | Unique constraint |
| `full_name` | varchar(255) | YES | - | **snake_case** |
| `email` | varchar(255) | YES | - | - |
| `status` | integer | NOT NULL | 1 | **1 = active, 0 = inactive** |
| `created_at` | timestamp | YES | now() | **snake_case** |
| `updated_at` | timestamp | YES | now() | **snake_case** |
| `phone` | varchar(20) | YES | - | - |
| `avatarUrl` | text | YES | - | **camelCase** |
| `role` | varchar(20) | YES | 'VIEWER' | - |
| `departmentId` | uuid | YES | - | **camelCase** |
| `lastLoginAt` | timestamp | YES | - | **camelCase** |
| `avatar_url` | text | YES | - | **snake_case** (also exists) |

## Status Values

- `1` = Active (kích hoạt)
- `0` = Inactive (hủy kích hoạt/khóa)

## TypeScript Interface

### Correct Interface (matches database)

```typescript
interface User {
  id: string; // uuid as string
  username?: string;
  full_name: string; // snake_case
  email?: string;
  phone?: string;
  avatar_url?: string; // snake_case
  status: number; // 1 = active, 0 = inactive
  created_at: string; // ISO timestamp string
  updated_at: string; // ISO timestamp string
  lastLoginAt?: string; // camelCase (ISO timestamp string)
  role?: string; // default 'VIEWER'
  departmentId?: string; // uuid as string
  avatarUrl?: string; // camelCase (also exists in schema)
}
```

### Files Using Correct Interface

✅ **src/pages/UserListTabNew.tsx** - Uses correct interface
✅ **src/components/UserModal.tsx** - Uses correct interface

### Files That Need Updates

⚠️ **src/pages/AdminPage.tsx** - Interface updated but handlers still use old format
⚠️ **src/data/generateFakeData.ts** - Uses camelCase and string status

## Common Issues

### ❌ Wrong: Using camelCase
```typescript
interface User {
  fullName: string; // WRONG - should be full_name
  createdAt: string; // WRONG - should be created_at
  status: 'active' | 'locked' | 'pending'; // WRONG - should be number
}
```

### ✅ Correct: Using database schema format
```typescript
interface User {
  full_name: string; // CORRECT
  created_at: string; // CORRECT
  status: number; // CORRECT (1 = active, 0 = inactive)
}
```

## Status Handling

### Converting Status

```typescript
// String to Number (for database)
const statusToNumber = (status: string): number => {
  return status === 'active' ? 1 : 0;
};

// Number to String (for display)
const statusToString = (status: number): string => {
  return status === 1 ? 'active' : 'inactive';
};

// Toggle status
const toggleStatus = (currentStatus: number): number => {
  return currentStatus === 1 ? 0 : 1;
};
```

## Notes

1. **Mixed naming**: Schema has both `avatarUrl` (camelCase) and `avatar_url` (snake_case)
2. **lastLoginAt**: Uses camelCase (not `last_login`)
3. **departmentId**: Uses camelCase (not `department_id`)
4. **Status**: Always use integer (1 or 0), not strings
5. **Timestamps**: Stored as ISO strings in TypeScript, timestamp in database

## Components Using Database

- `UserListTabNew.tsx` - ✅ Correct implementation
- `UserModal.tsx` - ✅ Correct implementation
- `RBACManagement.tsx` - Uses Supabase, should use correct interface
