# MAPPA Portal - Database Documentation

## 📚 Overview

This directory contains comprehensive documentation for the MAPPA Portal database structure, including schema definitions, KV store implementation, and TypeScript interfaces.

---

## 🗂️ Documentation Files

### 1. `database-schema.sql`
**⚠️ Reference Only - Cannot Execute in Figma Make**

Complete SQL schema showing how the data **would** be structured in a traditional PostgreSQL database with proper tables, foreign keys, and indexes.

**Use Cases:**
- Understanding data relationships
- Future migration planning
- Database design reference
- Documentation for stakeholders

**Key Tables:**
- `businesses` - Main business/establishment data
- `citizen_reports` - Public feedback and violation reports

---

### 2. `kv-store-structure.md`
**✅ Current Implementation**

Detailed documentation of the **actual** KV Store implementation used in Figma Make environment.

**Contents:**
- Key-value pair format
- Field definitions and constraints
- Data statistics (1000 businesses, 47 types, 12 districts)
- API operations
- Advantages and limitations
- Best practices

**Key Points:**
- Uses `restaurant:{id}` as key format
- Stores entire business object as JSON string
- Supports nested data (citizen reports)
- No migrations needed

---

### 3. `typescript-interfaces.md`
**📘 Type Safety Reference**

Complete TypeScript interface definitions matching the data structure.

**Interfaces:**
- `Restaurant` - Main business entity
- `CitizenReport` - Public feedback reports
- `CategoryFilter` - UI filter state
- `LocationStats` - Statistics calculation
- Component prop interfaces

**Benefits:**
- Type safety across application
- IntelliSense/autocomplete support
- Self-documenting code
- Easier refactoring

---

## 🎯 Why KV Store Instead of SQL Tables?

### Figma Make Limitations

In Figma Make environment, you **CANNOT**:
- ❌ Create custom database tables
- ❌ Run SQL migrations or DDL statements
- ❌ Access Supabase dashboard/SQL editor
- ❌ Execute CREATE TABLE commands

You **CAN ONLY**:
- ✅ Use the pre-existing KV store table (`kv_store_e4fdfce9`)
- ✅ Store/retrieve key-value pairs
- ✅ Use JSON for complex data structures

---

## 🚀 Current Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│                                                           │
│  MapPage → fetchRestaurants() → API Client              │
└─────────────────────┬───────────────────────────────────┘
                      │
                      │ HTTP Request
                      │
┌─────────────────────▼───────────────────────────────────┐
│              Supabase Edge Function                      │
│                 (Hono Web Server)                        │
│                                                           │
│  /make-server-e4fdfce9/restaurants (GET)                │
│  /make-server-e4fdfce9/seed-restaurants (POST)          │
└─────────────────────┬───────────────────────────────────┘
                      │
                      │ kv.getByPrefix()
                      │
┌─────────────────────▼───────────────────────────────────┐
│              Supabase KV Store                           │
│             (kv_store_e4fdfce9 table)                    │
│                                                           │
│  restaurant:1 → {JSON}                                   │
│  restaurant:2 → {JSON}                                   │
│  ...                                                      │
│  restaurant:1000 → {JSON}                                │
│  restaurant:metadata → {count, lastUpdated}             │
└──────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow

### Initial Seed (One-time)
```
1. User clicks "Seed Data" button (DataSeeder component)
2. Frontend calls seedRestaurants(restaurants)
3. API sends 1000 JSON objects to server
4. Server stores each as KV pair: restaurant:{id} → JSON
5. Server responds with success message
6. User refreshes page
7. Frontend fetches all data from KV store
```

### Normal Operation
```
1. Page loads → useEffect triggers
2. fetchRestaurants() called
3. Server queries KV store: kv.getByPrefix('restaurant:')
4. Returns array of 1000 Restaurant objects
5. Frontend filters/displays on map
```

---

## 🏗️ Data Structure Comparison

### Traditional SQL Approach (Reference Only)
```sql
-- businesses table
CREATE TABLE businesses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT CHECK (category IN (...)),
  ...
);

-- citizen_reports table (separate)
CREATE TABLE citizen_reports (
  id TEXT PRIMARY KEY,
  business_id TEXT REFERENCES businesses(id),
  content TEXT,
  ...
);

-- Query requires JOIN
SELECT b.*, array_agg(cr.*) as reports
FROM businesses b
LEFT JOIN citizen_reports cr ON cr.business_id = b.id
GROUP BY b.id;
```

### KV Store Approach (Current Implementation)
```typescript
// Single key-value pair
Key: "restaurant:1"
Value: {
  id: "1",
  name: "...",
  category: "hotspot",
  citizenReports: [    // Nested directly!
    { id: "report_1", content: "...", ... }
  ]
}

// Query is simple
const data = await kv.get('restaurant:1');
const restaurant = JSON.parse(data);
```

---

## ✅ Advantages of Current Approach

| Aspect | KV Store | Traditional SQL |
|--------|----------|-----------------|
| **Setup** | ✅ Zero setup | ❌ Create tables, indexes |
| **Migrations** | ✅ Not needed | ❌ Required for schema changes |
| **Nested Data** | ✅ Natural (JSON) | ❌ Requires JOINs |
| **Flexibility** | ✅ Add fields anytime | ❌ ALTER TABLE needed |
| **Performance** | ✅ Fast (1000 records) | ⚡ Better for millions |
| **Prototyping** | ✅ Perfect | ❌ Overkill |

---

## 📈 Current Data Statistics

| Metric | Value | Details |
|--------|-------|---------|
| **Total Records** | 1000 | Businesses across Hà Nội |
| **Business Types** | 47 | From restaurants to banks |
| **Districts** | 12 | Major districts in Hà Nội |
| **Wards** | 120+ | Detailed ward-level data |
| **Categories** | 4 | certified, hotspot, scheduled, inspected |
| **Hotspots** | 200 | Businesses with violations |
| **Citizen Reports** | 200-600 | 1-3 reports per hotspot |

---

## 🔄 API Endpoints

### GET /make-server-e4fdfce9/restaurants
Fetch all businesses from KV store.

**Response:**
```json
{
  "success": true,
  "count": 1000,
  "data": [
    {
      "id": "1",
      "name": "Nhà hàng Phở Hà Nội",
      ...
    }
  ]
}
```

### POST /make-server-e4fdfce9/seed-restaurants
Seed initial data to KV store.

**Request:**
```json
{
  "restaurants": [
    { "id": "1", "name": "...", ... }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "count": 1000,
  "message": "Seeded 1000 restaurants successfully"
}
```

### GET /make-server-e4fdfce9/restaurants/:id
Fetch single business by ID.

### DELETE /make-server-e4fdfce9/restaurants
Delete all businesses (for re-seeding).

---

## 🛠️ Development Workflow

### First Time Setup
```bash
1. Load application → See empty map (0 businesses)
2. Click "Seed Data" button (bottom-right)
3. Wait 2-3 seconds for upload
4. See success message
5. Refresh page (F5)
6. Map shows 1000 businesses ✅
```

### Normal Development
```bash
1. Load page → Auto-fetch from Supabase
2. Make changes to filters/UI
3. Data persists across refreshes
```

### Re-seeding (if needed)
```bash
1. Click "Xóa tất cả" → Confirm
2. Click "Seed Data" again
3. Refresh page
```

---

## 🔮 Future Migration Path

If you need to migrate to PostgreSQL in the future:

### Step 1: Export from KV Store
```typescript
const restaurants = await fetchRestaurants();
const json = JSON.stringify(restaurants, null, 2);
// Save to file: restaurants-export.json
```

### Step 2: Use Schema from `database-schema.sql`
```sql
-- Execute the CREATE TABLE statements
-- in your PostgreSQL database
```

### Step 3: Transform and Import
```typescript
// Flatten nested structures
const businessRows = restaurants.map(r => ({
  id: r.id,
  name: r.name,
  // ... other fields
}));

const reportRows = restaurants.flatMap(r => 
  (r.citizenReports || []).map(cr => ({
    ...cr,
    business_id: r.id
  }))
);

// INSERT into PostgreSQL
```

### Step 4: Update API Endpoints
```typescript
// Replace kv.getByPrefix() with SQL queries
const { data } = await supabase
  .from('businesses')
  .select(`
    *,
    citizen_reports(*)
  `);
```

---

## 📚 Related Documentation

- **Main Implementation**: `/src/pages/MapPage.tsx`
- **API Client**: `/src/utils/api/restaurantApi.ts`
- **Server Code**: `/supabase/functions/server/index.tsx`
- **Data Generator**: `/src/data/restaurantData.ts`
- **Dev Tool**: `/src/app/components/dev/DataSeeder.tsx`

---

## 🎯 Key Takeaways

1. ✅ **KV Store is the ONLY option** in Figma Make environment
2. ✅ **No custom SQL tables allowed** - this is a platform limitation
3. ✅ **Current approach is optimal** for prototyping and 1000 records
4. ✅ **SQL schema is documentation** - reference for future migration
5. ✅ **TypeScript interfaces ensure type safety** across the app

---

## 💡 Best Practices

### DO ✅
- Use KV Store for prototyping in Figma Make
- Leverage JSON for nested/complex data
- Keep data size reasonable (< 10,000 records)
- Implement client-side filtering
- Use TypeScript for type safety

### DON'T ❌
- Try to create custom tables (won't work)
- Write SQL migrations (can't execute)
- Expect relational features (JOINs, foreign keys)
- Store huge datasets (performance issues)
- Ignore error handling

---

## 🆘 Troubleshooting

### "Cannot find restaurants data"
**Solution:** Click "Seed Data" button and refresh page

### "TypeError: Cannot read property..."
**Solution:** Check if API is returning correct JSON format

### "No data showing on map"
**Solution:** Open browser console, check for API errors

### "Want to add new field to Restaurant"
**Solution:** Just add to TypeScript interface, seed new data

---

## 📞 Support

For questions about:
- **KV Store implementation** → Check `kv-store-structure.md`
- **SQL schema reference** → Check `database-schema.sql`
- **TypeScript types** → Check `typescript-interfaces.md`
- **API usage** → Check server code in `/supabase/functions/server/index.tsx`

---

**Last Updated:** January 9, 2026
**MAPPA Portal Version:** 1.0.0
**Environment:** Figma Make (Supabase KV Store)
