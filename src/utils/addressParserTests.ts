/**
 * Test utilities and examples for address parsing and auto-mapping
 * 
 * Usage:
 * - Test parsing of Vietnamese addresses
 * - Test matching to database
 * - Debug auto-mapping behavior
 */

import {
  parseVietnameseAddress,
  matchAddressToDatabase,
  namesMatch,
  normalizeName,
  extractStreetAddress,
} from '@/utils/addressParser';

// Mock data for testing
export const mockProvinces = [
  { _id: '1', name: 'Thành phố Hồ Chí Minh', code: '79' },
  { _id: '2', name: 'Hà Nội', code: '01' },
  { _id: '3', name: 'Đà Nẵng', code: '48' },
  { _id: '4', name: 'Thừa Thiên Huế', code: '42' },
];

export const mockWards = [
  // HCM wards
  { _id: 'w1', name: 'Phường 1', province_id: '1' },
  { _id: 'w2', name: 'Phường 2', province_id: '1' },
  { _id: 'w3', name: 'Phường 3', province_id: '1' },
  { _id: 'w4', name: 'Phường 4', province_id: '1' },
  { _id: 'w5', name: 'Phường 5', province_id: '1' },
  { _id: 'w6', name: 'Phường 8', province_id: '1' },
  { _id: 'w7', name: 'Bến Thành', province_id: '1' },
  { _id: 'w8', name: 'Tân Định', province_id: '1' },
  // Hanoi wards
  { _id: 'w9', name: 'Hoàn Kiếm', province_id: '2' },
  { _id: 'w10', name: 'Ba Đình', province_id: '2' },
  { _id: 'w11', name: 'Hai Bà Trưng', province_id: '2' },
  // Danang wards
  { _id: 'w12', name: 'Hải Châu', province_id: '3' },
  { _id: 'w13', name: 'Sơn Trà', province_id: '3' },
];

/**
 * Test case: Parse and match Vietnamese address
 */
export function testAddressParsing() {
  console.log('=== Address Parsing Tests ===\n');

  // Test case 1: Standard HCM address
  const test1 = "110A Ngô Quyền, Phường 8, Phường 5, Thành phố Hồ Chí Minh, Việt Nam";
  console.log('Test 1 - Standard HCM address:');
  console.log('Input:', test1);
  const parsed1 = parseVietnameseAddress(test1);
  console.log('Parsed:', parsed1);
  const match1 = matchAddressToDatabase(parsed1, mockProvinces, mockWards);
  console.log('Match result:', match1);
  console.log('');

  // Test case 2: Hanoi address
  const test2 = "45 Cầu Giấy, Phường Cầu Giấy, Phường Cầu Giấy, Hà Nội, Việt Nam";
  console.log('Test 2 - Hanoi address:');
  console.log('Input:', test2);
  const parsed2 = parseVietnameseAddress(test2);
  console.log('Parsed:', parsed2);
  const match2 = matchAddressToDatabase(parsed2, mockProvinces, mockWards);
  console.log('Match result:', match2);
  console.log('');

  // Test case 3: Short address (missing components)
  const test3 = "100 Tô Hiến Thành, Hoàn Kiếm, Hà Nội";
  console.log('Test 3 - Short address (missing country):');
  console.log('Input:', test3);
  const parsed3 = parseVietnameseAddress(test3);
  console.log('Parsed:', parsed3);
  const match3 = matchAddressToDatabase(parsed3, mockProvinces, mockWards);
  console.log('Match result:', match3);
  console.log('');

  // Test case 4: Ward with number variation
  const test4 = "50 Trần Hưng Đạo, Phường 05, Phường 1, Thành phố Hồ Chí Minh, Việt Nam";
  console.log('Test 4 - Ward number variation (05 vs 5):');
  console.log('Input:', test4);
  const parsed4 = parseVietnameseAddress(test4);
  console.log('Parsed:', parsed4);
  const match4 = matchAddressToDatabase(parsed4, mockProvinces, mockWards);
  console.log('Match result:', match4);
  console.log('');
}

/**
 * Test name matching logic
 */
export function testNameMatching() {
  console.log('=== Name Matching Tests ===\n');

  const testCases = [
    // [name1, name2, expected]
    ['Phường 08', 'Phường 8', true],
    ['Phường Tám', 'Phường 8', false], // Different - one has text, one has number
    ['Hoàn Kiếm', 'Phường Hoàn Kiếm', true], // Should match after removing prefix
    ['Thành phố Hồ Chí Minh', 'TP Hồ Chí Minh', false], // Too different
    ['Thành phố Hồ Chí Minh', 'Hồ Chí Minh', true], // Should match after normalization
    ['Ba Đình', 'Phường Ba Đình', true],
    ['Sơn Trà', 'Phường Sơn Trà', true],
  ];

  testCases.forEach(([name1, name2, expected]) => {
    const result = namesMatch(name1, name2);
    const status = result === expected ? '✅' : '❌';
    console.log(`${status} namesMatch('${name1}', '${name2}') = ${result} (expected: ${expected})`);
  });
  console.log('');
}

/**
 * Test normalization
 */
export function testNormalization() {
  console.log('=== Normalization Tests ===\n');

  const testCases = [
    'Phường 08',
    'Xã 01',
    'Phường 5',
    'Xã Bắc Từ Liêm',
    'Thành phố Hồ Chí Minh',
    'Tỉnh Hà Giang',
  ];

  testCases.forEach(name => {
    const normalized = normalizeName(name);
    console.log(`'${name}' -> '${normalized}'`);
  });
  console.log('');
}

/**
 * Full integration test
 */
export function testFullIntegration() {
  console.log('=== Full Integration Test ===\n');

  const realWorldAddresses = [
    "110A Ngô Quyền, Phường 8, Phường 5, Thành phố Hồ Chí Minh, Việt Nam",
    "35 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội, Việt Nam",
    "28 Bạch Đằng, Sơn Trà, Đà Nẵng, Việt Nam",
  ];

  realWorldAddresses.forEach(address => {
    console.log(`📍 Testing: ${address}`);
    const parsed = parseVietnameseAddress(address);
    const match = matchAddressToDatabase(parsed, mockProvinces, mockWards);
    
    if (match.confidence >= 0.9) {
      console.log(`✅ MATCH`);
      console.log(`   Province: ${match.matchedProvinceName} (${match.matchedProvinceId})`);
      console.log(`   Ward: ${match.matchedWardName} (${match.matchedWardId})`);
    } else {
      console.log(`⚠️ FALLBACK`);
      console.log(`   Reason: ${match.error}`);
    }
    console.log('');
  });
}

/**
 * Run all tests
 */
export function runAllTests() {
  console.clear();
  console.log('🧪 OCR Address Parser - Test Suite\n');
  testNormalization();
  testNameMatching();
  testAddressParsing();
  testFullIntegration();
  console.log('✅ All tests completed!');
}

// Export for use in browser console during development
if (typeof window !== 'undefined') {
  (window as any).__addressParserTests = {
    testAddressParsing,
    testNameMatching,
    testNormalization,
    testFullIntegration,
    runAllTests,
    parseVietnameseAddress,
    matchAddressToDatabase,
    namesMatch,
  };
}
