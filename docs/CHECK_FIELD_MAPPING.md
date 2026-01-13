# 🔍 Check Field Mapping - Backend vs Code

**Issue:** Lấy được 41 points nhưng không hiển thị trên bản đồ  
**Cause:** Field mapping sai giữa Supabase data và code  
**Action:** Check console logs để verify field structure

## 🚨 CURRENT ISSUE

```
✅ Successfully fetched 41 map points from Supabase
❌ NO POINTS DISPLAYED ON MAP
```

**Root Cause:** Latitude/Longitude fields không khớp!

---

## 🔍 Step 1: Check Console Logs

### Open Browser Console (F12)

Sau khi hard refresh (Ctrl+Shift+R), tìm logs này:

```
📊 FULL FIRST POINT DATA: { ... full JSON object ... }
🗺️ Location field structure: { ... }
📍 Latitude field: 21.0285 (or "NOT FOUND")
📍 Longitude field: 105.8542 (or "NOT FOUND")
🔄 After transformation, first point: { ... }
🗺️ Transformed lat/lng: { lat: 21.0285, lng: 105.8542 }
```

---

## 📋 Common Field Structures

### ✅ Option 1: Nested location object
```json
{
  "location": {
    "latitude": 21.0285,
    "longitude": 105.8542
  }
}
```

**Code mapping (CURRENT):**
```typescript
lat: point.location?.latitude
lng: point.location?.longitude
```

### ✅ Option 2: Top-level lat/lng
```json
{
  "latitude": 21.0285,
  "longitude": 105.8542
}
```

**Code mapping (ALTERNATIVE):**
```typescript
lat: point.latitude
lng: point.longitude
```

### ✅ Option 3: Different field names
```json
{
  "location": {
    "lat": 21.0285,
    "lon": 105.8542
  }
}
```

**Code mapping (ALTERNATIVE):**
```typescript
lat: point.location?.lat
lng: point.location?.lon
```

### ✅ Option 4: String coordinates
```json
{
  "location": "21.0285,105.8542"
}
```

**Code mapping (NEEDS PARSING):**
```typescript
const coords = point.location?.split(',');
lat: coords ? parseFloat(coords[0]) : 0
lng: coords ? parseFloat(coords[1]) : 0
```

### ✅ Option 5: GeoJSON format
```json
{
  "location": {
    "type": "Point",
    "coordinates": [105.8542, 21.0285]  // [lng, lat] - reversed!
  }
}
```

**Code mapping (GEOJSON):**
```typescript
lat: point.location?.coordinates?.[1]  // Note: reversed!
lng: point.location?.coordinates?.[0]
```

---

## 🎯 How to Fix

### Step 1: Find Console Log

Look for this in console:
```
📊 FULL FIRST POINT DATA: {
  "_id": "abc123",
  "title": "Restaurant Name",
  "location": { ... },  ← COPY THIS STRUCTURE!
  ...
}
```

### Step 2: Identify Location Structure

Check what `location` looks like:

**Example A - Nested object:**
```json
"location": {
  "latitude": 21.0285,
  "longitude": 105.8542
}
```

**Example B - String:**
```json
"location": "21.0285,105.8542"
```

**Example C - GeoJSON:**
```json
"location": {
  "type": "Point",
  "coordinates": [105.8542, 21.0285]
}
```

**Example D - Top-level:**
```json
"latitude": 21.0285,
"longitude": 105.8542
```

### Step 3: Copy Console Output

**Copy the FULL JSON from console and paste it here:**

```json
PASTE CONSOLE OUTPUT HERE
```

---

## 🔧 Quick Fix Examples

### If location is nested object:
```typescript
lat: typeof point.location?.latitude === 'number' ? point.location.latitude : 0,
lng: typeof point.location?.longitude === 'number' ? point.location.longitude : 0,
```

### If location is at top level:
```typescript
lat: typeof point.latitude === 'number' ? point.latitude : 0,
lng: typeof point.longitude === 'number' ? point.longitude : 0,
```

### If location is string "lat,lng":
```typescript
const coords = point.location?.split(',').map((c: string) => parseFloat(c.trim()));
lat: coords && coords[0] ? coords[0] : 0,
lng: coords && coords[1] ? coords[1] : 0,
```

### If location is GeoJSON:
```typescript
lat: typeof point.location?.coordinates?.[1] === 'number' ? point.location.coordinates[1] : 0,
lng: typeof point.location?.coordinates?.[0] === 'number' ? point.location.coordinates[0] : 0,
```

### If location uses different field names:
```typescript
// Check console for actual field names, e.g.:
lat: point.location?.lat || point.lat || point.y || 0,
lng: point.location?.lng || point.lng || point.lon || point.x || 0,
```

---

## ✅ Verification Checklist

After checking console logs:

- [ ] I can see `📊 FULL FIRST POINT DATA` in console
- [ ] I can see the `location` field structure
- [ ] I know if lat/lng are nested or top-level
- [ ] I know the exact field names (latitude vs lat vs y)
- [ ] I know the data type (number vs string vs array)
- [ ] I see `🗺️ Transformed lat/lng: { lat: X, lng: Y }`
- [ ] lat and lng are VALID numbers (not 0, not null, not NaN)
- [ ] lat is between -90 and 90
- [ ] lng is between -180 and 180

---

## 🐛 Common Issues

### Issue 1: lat/lng are 0
```
🗺️ Transformed lat/lng: { lat: 0, lng: 0 }
```

**Cause:** Field mapping is wrong

**Fix:** Check actual field structure in `📊 FULL FIRST POINT DATA`

### Issue 2: lat/lng are undefined
```
🗺️ Transformed lat/lng: { lat: undefined, lng: undefined }
```

**Cause:** Field doesn't exist or wrong path

**Fix:** Check nested object structure

### Issue 3: lat/lng are strings
```
🗺️ Transformed lat/lng: { lat: "21.0285", lng: "105.8542" }
```

**Cause:** Data is string, need to parse

**Fix:** Use `parseFloat()`

### Issue 4: Coordinates reversed
```
Map shows points in wrong country
```

**Cause:** GeoJSON uses [lng, lat] instead of [lat, lng]

**Fix:** Swap coordinates

---

## 📊 Expected Values for Hanoi

**Valid coordinates for Hanoi, Vietnam:**
- **Latitude:** ~21.0285 (between 20.9 and 21.1)
- **Longitude:** ~105.8542 (between 105.7 and 106.0)

**If you see:**
- Lat = 0, Lng = 0 → Field mapping wrong
- Lat = 105.8, Lng = 21.0 → Coordinates reversed!
- Lat = -21.0, Lng = -105.8 → Wrong hemisphere (negative sign issue)

---

## 🚀 Action Required

1. **Hard refresh browser** (Ctrl+Shift+R)
2. **Open Console** (F12)
3. **Find these logs:**
   - `📊 FULL FIRST POINT DATA`
   - `🗺️ Location field structure`
   - `📍 Latitude field`
   - `📍 Longitude field`
   - `🗺️ Transformed lat/lng`
4. **Copy the output** and share it
5. **I'll fix the field mapping** based on actual structure

---

## 📝 Template for Sharing

```
Console Output:
--------------

📊 FULL FIRST POINT DATA:
[PASTE HERE]

🗺️ Location field structure:
[PASTE HERE]

📍 Latitude field:
[PASTE HERE]

📍 Longitude field:
[PASTE HERE]

🗺️ Transformed lat/lng:
[PASTE HERE]
```

---

**Next Step:** Hard refresh → Check console → Share output → I'll fix mapping! 🚀
