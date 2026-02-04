/**
 * OCR Address Auto-Mapping - Integration Example & Validation
 * 
 * This file demonstrates the complete integration and provides
 * validation checklist for the address auto-mapping feature.
 */

// ============================================================================
// INTEGRATION EXAMPLE
// ============================================================================

/**
 * Example 1: How the auto-mapper works in AddStoreDialogTabbed
 * 
 * Location: src/components/ui-kit/AddStoreDialogTabbed.tsx
 */

/*
// Step 1: Import the hook
import { useAddressAutoMapper } from '@/hooks/useAddressAutoMapper';

// Step 2: Create state for tracking OCR address
const [lastOcrAddress, setLastOcrAddress] = useState<string | undefined>();
const [skipAddressMapping, setSkipAddressMapping] = useState(false);

// Step 3: When OCR extracts data, store the address
const handleExtractData = async (file: File) => {
  const result = await extractDocumentData(file, 'business-license');
  if (result.success && result.data) {
    // Store OCR address for auto-mapping
    if (result.data.address) {
      setLastOcrAddress(result.data.address);
      setSkipAddressMapping(false); // Allow mapping for this address
    }
    // ... rest of code
  }
};

// Step 4: Use the hook to auto-map
useAddressAutoMapper({
  ocrData: lastOcrAddress ? { address: lastOcrAddress } : undefined,
  provinces: apiProvinces,
  wards: apiWards,
  formData,
  skipMapping: skipAddressMapping,
  
  // Success callback
  onAddressMatch: (result) => {
    setSelectedProvince(result.provinceId);
    setSelectedProvinceName(result.provinceName);
    loadWardsByProvince(result.provinceId).then(() => {
      setTimeout(() => {
        setSelectedWard(result.wardId);
        setSelectedWardName(result.wardName);
      }, 0);
    });
    setFormData(prev => ({
      ...prev,
      registeredAddress: result.streetAddress,
    }));
  },
  
  // Failure callback (fallback)
  onAddressMatchFail: (error, fullAddress) => {
    setFormData(prev => ({
      ...prev,
      registeredAddress: fullAddress,
    }));
    // Silent fallback - no error toast
  },
});

// Step 5: Mark as edited when user manually selects
const handleProvinceChange = (value: string) => {
  setSelectedProvince(value);
  setSkipAddressMapping(true); // Prevent auto-mapper override
  // ... load wards, etc.
};
*/

// ============================================================================
// VALIDATION CHECKLIST
// ============================================================================

/**
 * Use this checklist to validate the implementation is working correctly
 */

export const VALIDATION_CHECKLIST = {
  // Basic Functionality
  'Address Parsing': {
    test: 'Run __addressParserTests.parseVietnameseAddress("110A Ngô Quyền, Phường 8, ...")',
    expected: 'Returns ParsedAddress with streetAddress, wardName, provinceName, etc.',
    passes: false,
  },
  
  'Name Matching': {
    test: 'Run __addressParserTests.namesMatch("Phường 8", "Phường 08")',
    expected: 'Returns true',
    passes: false,
  },
  
  'Database Matching': {
    test: 'Run __addressParserTests.matchAddressToDatabase(parsed, provinces, wards)',
    expected: 'Returns result with matchedProvinceId and matchedWardId when found',
    passes: false,
  },
  
  // Integration Tests
  'Form Integration': {
    test: 'Upload a Giấy Phép Kinh Doanh with address "110A Ngô Quyền, Phường 8, Phường 5, Hà Nội"',
    expected: 'Form auto-fills: province="Thành phố Hồ Chí Minh", ward="Phường 8", address="110A Ngô Quyền"',
    passes: false,
  },
  
  'Fallback Behavior': {
    test: 'Upload a document with non-existent address "999 Fake Street, Fake Ward, Fake City"',
    expected: 'Full address shown in text field, dropdowns empty, no error message',
    passes: false,
  },
  
  'User Edit Protection': {
    test: 'Manually select province "Hà Nội", then upload another document',
    expected: 'Form does not auto-map for second document, keeps user\' selection',
    passes: false,
  },
  
  // UX Tests
  'No Error Messages': {
    test: 'Upload address that cannot be matched',
    expected: 'No error toast appears, form still functional',
    passes: false,
  },
  
  'Single Execution': {
    test: 'Upload same document twice',
    expected: 'Auto-mapping runs only once, even if form re-renders',
    passes: false,
  },
};

/**
 * How to run validation tests
 */
export const VALIDATION_INSTRUCTIONS = `
=== OCR ADDRESS AUTO-MAPPER VALIDATION ===

STEP 1: Test Core Functions
  1. Open browser console (F12)
  2. Run: __addressParserTests.runAllTests()
  3. Verify all tests pass ✅

STEP 2: Test Form Integration
  1. Navigate to "Add New Store" dialog
  2. Click on "Upload Giấy Phép Kinh Doanh" section
  3. Upload a sample document with address:
     "110A Ngô Quyền, Phường 8, Phường 5, Thành phố Hồ Chí Minh, Việt Nam"
  4. Verify:
     ✓ Tỉnh/Thành phố field shows "Thành phố Hồ Chí Minh"
     ✓ Phường/Xã field shows "Phường 8"
     ✓ Địa chỉ field shows "110A Ngô Quyền"

STEP 3: Test Fallback Behavior
  1. Modify the OCR document address to something non-existent:
     "999 Unknown Street, Unknown Ward, Unknown City, Vietnam"
  2. Upload the document
  3. Verify:
     ✓ Full address appears in "Địa chỉ" field
     ✓ Province and Ward dropdowns remain empty
     ✓ NO error message appears
     ✓ User can manually select province/ward

STEP 4: Test User Edit Protection
  1. In a fresh form, manually select Province = "Hà Nội"
  2. Upload any document with a Hà Nội address
  3. Verify:
     ✓ Province remains "Hà Nội" (not changed to Hà Nội)
     ✓ Ward dropdown remains empty

STEP 5: Test Repeated Upload
  1. Upload a document (Step 2)
  2. Verify it auto-maps correctly
  3. Clear form and upload THE SAME document again
  4. Verify:
     ✓ Auto-mapping runs again (fresh instance)
     ✓ Same fields are auto-filled

STEP 6: Check Console Logs
  Throughout these tests, verify console shows:
  - ✅ [Address Mapper] Starting auto-mapping...
  - ✅ [Address Mapper] Parsed address: {...}
  - ✅ [Address Mapper] Match result: {...}
  - ✅ [AddStoreDialogTabbed] Address auto-mapped successfully

EXPECTED OUTCOMES:
  ✓ Parsing works correctly
  ✓ Name matching is intelligent (handles "08" vs "8")
  ✓ Form auto-fills when addresses match
  ✓ Form shows full address as fallback when no match
  ✓ No error messages on failed matching
  ✓ User selections are respected
  ✓ Performance is not impacted
`;

/**
 * Expected behavior for different address formats
 */
export const TEST_CASES = [
  {
    name: 'Standard HCM Address',
    input: '110A Ngô Quyền, Phường 8, Phường 5, Thành phố Hồ Chí Minh, Việt Nam',
    expectedProvince: 'Thành phố Hồ Chí Minh',
    expectedWard: 'Phường 8',
    expectedAddress: '110A Ngô Quyền',
    confidence: 0.95,
  },
  {
    name: 'Hanoi Address',
    input: '45 Cầu Giấy, Phường Cầu Giấy, Phường Cầu Giấy, Hà Nội, Việt Nam',
    expectedProvince: 'Hà Nội',
    expectedWard: 'Hoàn Kiếm', // Or whatever actual ward name is in DB
    expectedAddress: '45 Cầu Giấy',
    confidence: 0.7, // Lower confidence since matching is more complex
  },
  {
    name: 'Short Address (Missing Country)',
    input: '100 Tô Hiến Thành, Hoàn Kiếm, Hà Nội',
    expectedProvince: 'Hà Nội',
    expectedWard: 'Hoàn Kiếm',
    expectedAddress: '100 Tô Hiến Thành',
    confidence: 0.95,
  },
  {
    name: 'Ward Number Variation (05 vs 5)',
    input: '50 Trần Hưng Đạo, Phường 05, Phường 1, Thành phố Hồ Chí Minh, Việt Nam',
    expectedProvince: 'Thành phố Hồ Chí Minh',
    expectedWard: 'Phường 5', // Database has "Phường 5" not "Phường 05"
    expectedAddress: '50 Trần Hưng Đạo',
    confidence: 0.95,
  },
  {
    name: 'Non-existent Address (Fallback)',
    input: '999 Fake Street, Fake Ward, Fake City, Vietnam',
    expectedProvince: undefined, // Will fallback
    expectedWard: undefined,
    expectedAddress: '999 Fake Street, Fake Ward, Fake City, Vietnam', // Full address
    confidence: 0.0,
  },
];

/**
 * Performance benchmarks
 */
export const PERFORMANCE_TARGETS = {
  'Parse Single Address': '< 1ms',
  'Match Against 10k Provinces/Wards': '< 50ms',
  'Full Auto-Mapping Flow': '< 100ms',
  'Hook Mount/Update': '< 10ms',
  'Memory Footprint': '< 1MB',
};

/**
 * Browser Console Helper Commands
 */
export const CONSOLE_COMMANDS = `
// In browser console, use these commands for testing:

// Run full test suite
__addressParserTests.runAllTests()

// Test specific address
__addressParserTests.parseVietnameseAddress("YOUR_ADDRESS_HERE")

// Test name matching
__addressParserTests.namesMatch("name1", "name2")

// Test name normalization
__addressParserTests.normalizeName("Phường 08")

// Test database matching
const parsed = __addressParserTests.parseVietnameseAddress("...")
__addressParserTests.matchAddressToDatabase(parsed, mockProvinces, mockWards)

// Check if tests are available
typeof __addressParserTests  // Should return "object"
`;

export default {
  VALIDATION_CHECKLIST,
  VALIDATION_INSTRUCTIONS,
  TEST_CASES,
  PERFORMANCE_TARGETS,
  CONSOLE_COMMANDS,
};
