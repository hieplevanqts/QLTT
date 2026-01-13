# Evidence Module - Nguyên tắc Thiết kế

## 📋 Tổng quan

Evidence Module được thiết kế theo 5 nguyên tắc cốt lõi để đảm bảo code **"chuẩn, ghép dễ"** cho hệ thống MAPPA Portal.

---

## 🎯 5 Nguyên tắc Thiết kế

### **Nguyên tắc 1: Immutable-first**

> **Bản gốc không sửa; tạo derived version khi cần che/đánh dấu**

#### ✅ Quy tắc:
- **KHÔNG BAO GIỜ** sửa trực tiếp file gốc
- Khi cần redact/annotate/resize → Tạo **derived version** mới
- Giữ quan hệ `original <-> derived` rõ ràng
- Sealed evidence = **IMMUTABLE** (không thể edit/delete)

#### 📝 Implementation:

```typescript
// ❌ SAI: Sửa trực tiếp original
async editEvidence(evidenceId: string, newData: Partial<Evidence>) {
  // NEVER DO THIS
  evidence.fileName = newData.fileName;
  evidence.notes = newData.notes;
}

// ✅ ĐÚNG: Tạo derived version
async createRedactedVersion(
  original: Evidence,
  redactionData: RedactionRequest
): Promise<Evidence> {
  // Create new evidence with:
  // - New ID (derived ID)
  // - isDerived: true
  // - originalEvidenceId: original.id
  // - derivationReason: "redaction"
  
  const derived = createDerivedEvidence(original, {
    id: generateDerivedId(original.id),
    derivationReason: 'redaction',
    derivedBy: user.id,
    modifications: [...],
    hash: newHash  // Compute new hash for derived file
  });
  
  // Link to original
  original.derivedVersionIds.push(derived.id);
  
  return derived;
}
```

#### 🔗 Quan hệ Original ↔ Derived:

```typescript
interface Evidence {
  // Original evidence
  id: 'EVD-2026-1250'
  isDerived: false
  derivedVersionIds: ['EVD-2026-1250-D1', 'EVD-2026-1250-D2']
}

interface Evidence {
  // Derived version 1 (redacted)
  id: 'EVD-2026-1250-D1'
  isDerived: true
  originalEvidenceId: 'EVD-2026-1250'
  derivationReason: 'redaction'
  derivedAt: '2026-01-10T10:30:00Z'
  derivedBy: 'Nguyễn Văn A'
}

interface Evidence {
  // Derived version 2 (annotated)
  id: 'EVD-2026-1250-D2'
  isDerived: true
  originalEvidenceId: 'EVD-2026-1250'
  derivationReason: 'annotation'
  derivedAt: '2026-01-10T11:00:00Z'
  derivedBy: 'Trần Thị B'
}
```

#### 🚫 Sealed Evidence Protection:

```typescript
function canEditEvidence(evidence: Evidence): boolean {
  // Sealed/Archived = IMMUTABLE
  if (evidence.status === 'sealed' || evidence.status === 'archived') {
    return false;
  }
  
  // Approved = Cannot edit (must create derived version)
  if (evidence.status === 'approved') {
    return false;
  }
  
  // InReview = Locked
  if (evidence.status === 'inReview') {
    return false;
  }
  
  return true;  // Only draft/needMoreInfo can be edited
}
```

---

### **Nguyên tắc 2: Metadata chuẩn hóa**

> **Mọi file phải có đầy đủ metadata chuẩn**

#### ✅ Required Metadata (9 fields bắt buộc):

```typescript
interface Evidence {
  // 1. Evidence ID (unique identifier)
  id: string;  // e.g., "EVD-2026-1250"
  
  // 2. Type (loại chứng cứ)
  type: 'image' | 'video' | 'document' | 'audio';
  
  // 3. Source (nguồn thu thập)
  source: 'Mobile App' | 'Field Device' | 'Portal Upload' | 'API Integration';
  
  // 4. Created timestamp
  createdAt: string;  // ISO 8601
  
  // 5. Captured timestamp (thời điểm thu thập thực tế)
  capturedAt: string;  // ISO 8601
  
  // 6. Location (địa điểm thu thập)
  location: string;  // e.g., "Quận 1, TP.HCM"
  
  // 7. Submitter (người nộp)
  submitter: string;  // User ID or name
  
  // 8. Hash (integrity verification - SWGDE compliant)
  hash: {
    sha256: string;
    sha512: string;
    md5: string;
    computedAt: string;
    computedBy: string;
    verificationStatus: 'verified' | 'failed' | 'pending';
  };
  
  // 9. Links (liên kết entities)
  links: Array<{
    type: 'lead' | 'task' | 'plan' | 'store';
    entityId: string;
    entityName: string;
  }>;
}
```

#### 📝 Validation:

```typescript
function validateEvidenceMetadata(evidence: Partial<Evidence>): {
  isValid: boolean;
  missingFields: string[];
} {
  const requiredFields = [
    'id', 'type', 'source', 'createdAt', 'capturedAt',
    'location', 'submitter', 'hash', 'links'
  ];
  
  const missingFields = requiredFields.filter(field => !evidence[field]);
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

// Usage
const validation = validateEvidenceMetadata(newEvidence);
if (!validation.isValid) {
  throw new Error(`Missing required fields: ${validation.missingFields.join(', ')}`);
}
```

#### 🔒 Hash Requirement (SWGDE):

```typescript
// SWGDE recommends multiple hash algorithms
async computeFileHash(file: File): Promise<EvidenceHash> {
  const arrayBuffer = await file.arrayBuffer();
  
  // SHA-256 (primary)
  const sha256 = await crypto.subtle.digest('SHA-256', arrayBuffer);
  
  // SHA-512 (recommended)
  const sha512 = await crypto.subtle.digest('SHA-512', arrayBuffer);
  
  // MD5 (legacy support)
  const md5 = computeMD5(arrayBuffer);
  
  return {
    sha256: toHexString(sha256),
    sha512: toHexString(sha512),
    md5: toHexString(md5),
    computedAt: new Date().toISOString(),
    computedBy: 'System',
    verificationStatus: 'verified'
  };
}
```

---

### **Nguyên tắc 3: Review Workflow rõ ràng**

> **Status transitions theo workflow chuẩn**

#### ✅ Workflow:

```
Draft → Submitted → InReview → Approved/Rejected/NeedMoreInfo → Sealed → Archived
```

#### 📊 Status Flow Chart:

```
┌────────┐
│ Draft  │ ← Start here (mới tạo)
└───┬────┘
    │ submit()
    ▼
┌────────────┐
│ Submitted  │ ← Chờ reviewer pick up
└───┬────────┘
    │ startReview()
    ▼
┌────────────┐
│  InReview  │ ← Đang xét duyệt
└───┬────────┘
    │
    ├─── approve() ──→ ┌──────────┐
    │                   │ Approved │
    │                   └────┬─────┘
    │                        │ seal()
    │                        ▼
    │                   ┌─────────┐
    │                   │ Sealed  │ ← IMMUTABLE
    │                   └────┬────┘
    │                        │ archive()
    │                        ▼
    │                   ┌──────────┐
    │                   │ Archived │
    │                   └──────────┘
    │
    ├─── reject() ──→ ┌──────────┐
    │                  │ Rejected │ ← End (không dùng)
    │                  └──────────┘
    │
    └─── needMoreInfo() ──→ ┌───────────────┐
                             │ NeedMoreInfo  │
                             └───────┬───────┘
                                     │ submit()
                                     ▼
                             (quay lại Submitted)
```

#### 📝 Implementation:

```typescript
type EvidenceStatus = 
  | 'draft'           // Nháp
  | 'submitted'       // Đã nộp
  | 'inReview'        // Đang xét duyệt
  | 'approved'        // Đã duyệt
  | 'rejected'        // Từ chối
  | 'needMoreInfo'    // Cần bổ sung
  | 'sealed'          // Đã niêm phong
  | 'archived';       // Đã lưu trữ

// Get allowed next statuses
function getNextStatus(current: EvidenceStatus): EvidenceStatus[] {
  switch (current) {
    case 'draft':
      return ['submitted'];
    case 'submitted':
      return ['inReview'];
    case 'inReview':
      return ['approved', 'rejected', 'needMoreInfo'];
    case 'needMoreInfo':
      return ['submitted'];
    case 'approved':
      return ['sealed'];
    case 'sealed':
      return ['archived'];
    default:
      return [];
  }
}
```

#### 🔐 Status Constraints:

| Status | Can Edit? | Can Delete? | Can Derive? | Requires Approval? |
|--------|-----------|-------------|-------------|-------------------|
| `draft` | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No |
| `submitted` | ❌ No | ❌ No | ✅ Yes | ❌ No |
| `inReview` | ❌ No | ❌ No | ✅ Yes | ❌ No |
| `approved` | ❌ No | ❌ No | ✅ Yes | ✅ Yes |
| `rejected` | ❌ No | ✅ Yes | ❌ No | ❌ No |
| `needMoreInfo` | ✅ Yes | ❌ No | ✅ Yes | ❌ No |
| `sealed` | ❌ No | ❌ No | ✅ Yes | ✅ Yes (Admin only) |
| `archived` | ❌ No | ❌ No | ❌ No | ✅ Yes (Admin only) |

---

### **Nguyên tắc 4: Viewer tối giản nhưng đủ dùng**

> **Ảnh/video/PDF view + timeline + notes + links**

#### ✅ Viewer Components:

```
EvidenceViewer
├── EvidenceViewerToolbar    (zoom, rotate, fullscreen)
├── EvidenceImageViewer      (ảnh: zoom, pan, rotate)
├── EvidenceVideoViewer      (video: play, pause, seek, volume)
├── EvidenceDocumentViewer   (PDF: page navigation)
└── EvidenceViewerControls   (download, share)
```

#### 📝 Viewer State:

```typescript
interface EvidenceViewerState {
  // Image/Document
  zoom: number;           // 0.5 to 3.0
  rotation: number;       // 0, 90, 180, 270
  currentPage: number;    // For PDF
  totalPages: number;
  isFullscreen: boolean;
  
  // Video
  videoState?: {
    isPlaying: boolean;
    currentTime: number;  // seconds
    duration: number;     // seconds
    volume: number;       // 0 to 1
    isMuted: boolean;
  };
}
```

#### 🎨 Toolbar Features:

```tsx
<EvidenceViewerToolbar>
  {/* Image/Document tools */}
  <Button onClick={zoomIn}><ZoomIn /></Button>
  <Button onClick={zoomOut}><ZoomOut /></Button>
  <Button onClick={rotate}><RotateCw /></Button>
  <Button onClick={toggleFullscreen}><Maximize /></Button>
  
  {/* Video tools */}
  <Button onClick={togglePlay}><Play /></Button>
  <Slider value={currentTime} max={duration} />
  <Button onClick={toggleMute}><Volume2 /></Button>
  
  {/* Common tools */}
  <Button onClick={download}><Download /></Button>
</EvidenceViewerToolbar>
```

#### 📍 Tabs Layout (Nguyên tắc 4):

```
┌─────────────────────────────────────────────┐
│ Tabs: Overview | Viewer | Metadata | Links | │
│       Chain of Custody | Review              │
└─────────────────────────────────────────────┘

Tab: Viewer
├── Toolbar (zoom, rotate, download)
├── Main Viewer (image/video/pdf)
└── Timeline (for video)

Tab: Overview
├── Basic Info
├── Hash & Integrity
└── Notes

Tab: Links
└── Linked Entities (leads, tasks, plans, stores)

Tab: Chain of Custody
└── Event Timeline

Tab: Review
└── Review Decision Panel
```

---

### **Nguyên tắc 5: Component Prefix**

> **Tất cả components dùng prefix `Evidence*`**

#### ✅ Naming Convention:

```
// ✅ ĐÚNG: Có prefix Evidence*
EvidenceListPage
EvidenceDetailPage
EvidenceUploadPage
EvidenceReviewQueuePage
EvidenceViewer
EvidenceCard
EvidenceFilterPanel
EvidenceHashBadge
EvidenceStatusBadge

// ❌ SAI: Không có prefix
ListPage
DetailPage
UploadPage
Viewer
Card
FilterPanel
```

#### 📂 File Structure:

```
src/app/
├── pages/evidence/
│   ├── EvidenceHomePage.tsx           ✅
│   ├── EvidenceListPage.tsx           ✅
│   ├── EvidenceDetailPage.tsx         ✅
│   ├── EvidenceUploadPage.tsx         ✅
│   ├── EvidenceReviewQueuePage.tsx    ✅
│   ├── EvidenceReviewDetailPage.tsx   ✅
│   ├── EvidencePackageListPage.tsx    ✅
│   ├── EvidencePackageBuilderPage.tsx ✅
│   ├── EvidencePackageDetailPage.tsx  ✅
│   ├── EvidenceExportCenterPage.tsx   ✅
│   ├── EvidenceAuditLogPage.tsx       ✅
│   └── EvidenceIntakeInboxPage.tsx    ✅
│
├── components/evidence/
│   ├── EvidenceCard.tsx               ✅
│   ├── EvidenceViewer.tsx             ✅
│   ├── EvidenceFilterPanel.tsx        ✅
│   ├── EvidenceStatusBadge.tsx        ✅
│   ├── EvidenceHashBadge.tsx          ✅
│   ├── EvidenceChainOfCustody.tsx     ✅
│   ├── EvidenceReviewDecisionPanel.tsx ✅
│   └── EvidenceCaseAssociation.tsx    ✅
│
├── types/
│   └── evidence.types.ts              ✅
│
└── services/
    ├── evidence.service.ts             ✅
    ├── evidence-security.service.ts    ✅
    ├── evidence-integrity.service.ts   ✅
    └── evidence-performance.service.ts ✅
```

#### 📝 CSS Modules Naming:

```typescript
// ✅ ĐÚNG: Component-specific CSS module
import styles from './EvidenceListPage.module.css';

<div className={styles.container}>
  <div className={styles.filterPanel}>...</div>
  <div className={styles.evidenceGrid}>...</div>
</div>

// Generated CSS classes:
// .EvidenceListPage_container_xyz123
// .EvidenceListPage_filterPanel_abc456
// .EvidenceListPage_evidenceGrid_def789
```

---

## 🎯 Design Patterns

### **Pattern 1: Immutable Updates**

```typescript
// Create derived version instead of editing
const redacted = await evidenceService.createRedactedVersion(
  originalEvidence,
  { redactedBy, redactionAreas, reason }
);
```

### **Pattern 2: Metadata Validation**

```typescript
// Always validate before submitting
const validation = validateEvidenceMetadata(evidence);
if (!validation.isValid) {
  throw new Error(`Missing: ${validation.missingFields.join(', ')}`);
}
```

### **Pattern 3: Status Transition Guards**

```typescript
// Check allowed transitions
const allowedNext = getNextStatus(evidence.status);
if (!allowedNext.includes(targetStatus)) {
  throw new Error(`Cannot transition from ${evidence.status} to ${targetStatus}`);
}
```

### **Pattern 4: Chain of Custody Logging**

```typescript
// Log every sensitive action
evidenceService.logChainOfCustody({
  evidenceId,
  eventType: 'download',
  actor: currentUser.name,
  action: 'Downloaded evidence file',
  metadata: { fileSize, format }
});
```

---

## 🚀 Integration Guide

### **1. Tạo Evidence mới:**

```typescript
import { evidenceService } from '@/services/evidence.service';

const newEvidence = await evidenceService.createNewEvidence({
  fileName: 'photo.jpg',
  type: 'image',
  source: 'Mobile App',
  capturedAt: '2026-01-10T09:00:00Z',
  location: 'Quận 1, TP.HCM',
  submitter: 'Nguyễn Văn A',
  file: fileBlob,
  notes: 'Vi phạm vệ sinh...',
  tags: ['food-safety', 'inspection']
});
```

### **2. Submit for Review:**

```typescript
const submitted = await evidenceService.submitForReview(
  evidenceId,
  submittedBy
);
// Status: draft → submitted
```

### **3. Create Redacted Version:**

```typescript
const redacted = await evidenceService.createRedactedVersion(
  originalEvidence,
  {
    redactedBy: 'Trần Thị B',
    redactionAreas: [{ x: 100, y: 200, width: 50, height: 30 }],
    reason: 'Hide personal information'
  }
);
// Creates new Evidence with isDerived: true
```

### **4. Approve Evidence:**

```typescript
const approved = await evidenceService.approveEvidence(
  evidenceId,
  reviewer,
  'Looks good'
);
// Status: inReview → approved
```

### **5. Seal Evidence:**

```typescript
const sealed = await evidenceService.sealEvidence(
  evidenceId,
  admin
);
// Status: approved → sealed (IMMUTABLE)
```

---

## ✅ Compliance Checklist

- [ ] **Nguyên tắc 1**: Không sửa original, tạo derived version
- [ ] **Nguyên tắc 2**: Validate 9 required metadata fields
- [ ] **Nguyên tắc 3**: Follow workflow: Draft → Submitted → InReview → Approved/Rejected/NeedMoreInfo → Sealed
- [ ] **Nguyên tắc 4**: Viewer có đủ: image/video/pdf view + timeline + notes + links
- [ ] **Nguyên tắc 5**: Tất cả components có prefix `Evidence*`

---

## 📚 References

- **Type Definitions**: `/src/app/types/evidence.types.ts`
- **Service Layer**: `/src/app/services/evidence.service.ts`
- **Security Service**: `/src/app/services/evidence-security.service.ts`
- **Integrity Service**: `/src/app/services/evidence-integrity.service.ts`

---

## 🎉 Summary

Evidence Module tuân thủ nghiêm ngặt 5 nguyên tắc thiết kế:

1. ✅ **Immutable-first** - Derived versions, không sửa original
2. ✅ **Metadata chuẩn hóa** - 9 fields bắt buộc + hash SWGDE
3. ✅ **Workflow rõ ràng** - Draft → Submitted → InReview → Approved → Sealed
4. ✅ **Viewer tối giản** - Ảnh/video/PDF + timeline + notes + links
5. ✅ **Component prefix** - Tất cả dùng `Evidence*`

Code được thiết kế để **"chuẩn, ghép dễ"** cho hệ thống MAPPA Portal!
