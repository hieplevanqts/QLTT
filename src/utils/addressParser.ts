/**
 * Address Parser Utility
 * Parses Vietnamese addresses from OCR and matches them to database records
 * 
 * Format: "110A Ngô Quyền, Phường 08, Quận 5, Thành phố Hồ Chí Minh, Việt Nam"
 */

export interface ParsedAddress {
  /** Street address (house number + street name) */
  streetAddress: string;
  /** Ward/Commune name */
  wardName: string;
  /** District name */
  districtName: string;
  /** Province/City name */
  provinceName: string;
  /** Country */
  country: string;
  /** Raw input address */
  rawAddress: string;
}

export interface AddressMatchResult {
  /** Parsed components from OCR */
  parsed: ParsedAddress;
  /** Matched province ID from database */
  matchedProvinceId?: string;
  /** Matched province name */
  matchedProvinceName?: string;
  /** Matched ward ID from database */
  matchedWardId?: string;
  /** Matched ward name */
  matchedWardName?: string;
  /** Confidence score (0-1) */
  confidence: number;
  /** Error message if matching failed */
  error?: string;
}

/**
 * Parse Vietnamese address string into components
 * Handles formats like: "110A Ngô Quyền, Phường 08, Quận 5, Thành phố Hồ Chí Minh, Việt Nam"
 */
export function parseVietnameseAddress(address: string): ParsedAddress {
  const trimmed = address.trim();
  const parts = trimmed.split(',').map(p => p.trim());

  // Default result
  const result: ParsedAddress = {
    streetAddress: '',
    wardName: '',
    districtName: '',
    provinceName: '',
    country: '',
    rawAddress: trimmed,
  };

  if (parts.length === 0) return result;

  // Usually:
  // parts[0] = street address (e.g., "110A Ngô Quyền")
  // parts[1] = ward (e.g., "Phường 08")
  // parts[2] = district (e.g., "Quận 5")
  // parts[3] = city (e.g., "Thành phố Hồ Chí Minh")
  // parts[4] = country (e.g., "Việt Nam")

  result.streetAddress = parts[0];

  if (parts.length > 1) {
    result.wardName = parts[1];
  }

  if (parts.length > 2) {
    result.districtName = parts[2];
  }

  if (parts.length > 3) {
    result.provinceName = parts[3];
  }

  if (parts.length > 4) {
    result.country = parts[4];
  }

  return result;
}

/**
 * Normalize location names for matching
 * Removes common prefixes like "Phường", "Xã", "Quận", "Huyện", etc.
 */
export function normalizeName(name: string): string {
  if (!name) return '';

  let normalized = name
    .toLowerCase()
    .trim()
    // Remove common Vietnamese prefixes
    .replace(/^(phường|xã|quận|huyện|thành phố|tỉnh)\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Remove tone marks (ă, ê, ô, etc.)
  // This helps match "Phường 08" with "Phường Tám" or similar variations
  normalized = normalized
    .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
    .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
    .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
    .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
    .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
    .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/ç/g, 'c');

  return normalized;
}

/**
 * Check if two location names match
 * Uses normalized comparison and numeric suffix handling
 */
export function namesMatch(name1: string, name2: string): boolean {
  if (!name1 || !name2) return false;

  const norm1 = normalizeName(name1);
  const norm2 = normalizeName(name2);

  // Exact match after normalization
  if (norm1 === norm2) return true;

  // Handle numeric suffixes like "08", "3", etc.
  // e.g., "Phường 08" should match "Phường 8"
  const numericPattern = /\d+/g;
  const num1 = norm1.match(numericPattern);
  const num2 = norm2.match(numericPattern);

  if (num1 && num2 && num1[0] && num2[0]) {
    // If both have numbers, compare with numbers normalized
    const norm1NoNum = norm1.replace(/\d+/g, '').trim();
    const norm2NoNum = norm2.replace(/\d+/g, '').trim();
    const sameNum = parseInt(num1[0]) === parseInt(num2[0]);
    const sameName = norm1NoNum === norm2NoNum;
    if (sameNum && sameName) return true;
  }

  // Fuzzy match: check if one is substring of other (at least 70% similar)
  const len1 = norm1.length;
  const len2 = norm2.length;
  const minLen = Math.min(len1, len2);
  const maxLen = Math.max(len1, len2);

  if (minLen > 0 && maxLen > 0) {
    const similarity = minLen / maxLen;
    // If >70% similar AND both contain the same main words
    if (similarity > 0.7) {
      const words1 = norm1.split(/\s+/).filter(w => w.length > 2);
      const words2 = norm2.split(/\s+/).filter(w => w.length > 2);
      const commonWords = words1.filter(w => words2.includes(w));
      if (commonWords.length > 0) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Match parsed address to database provinces and wards
 * 
 * @param parsed - Parsed address from OCR
 * @param provinces - Available provinces from database
 * @param wards - Available wards from database
 * @returns Match result with matched IDs and confidence score
 */
export function matchAddressToDatabase(
  parsed: ParsedAddress,
  provinces: Array<{ _id: string; name: string; code?: string }>,
  wards: Array<{ _id: string; name: string; province_id?: string; provinceId?: string }>,
): AddressMatchResult {
  const result: AddressMatchResult = {
    parsed,
    confidence: 0,
  };

  // Step 1: Match province
  if (!parsed.provinceName) {
    result.error = 'Không thể xác định tỉnh/thành phố từ địa chỉ OCR';
    return result;
  }

  const matchedProvince = provinces.find(p =>
    namesMatch(p.name, parsed.provinceName)
  );

  if (!matchedProvince) {
    result.error = `Không tìm thấy tỉnh/thành phố: "${parsed.provinceName}"`;
    result.confidence = 0.3; // Low confidence but still parseable
    return result;
  }

  result.matchedProvinceId = matchedProvince._id;
  result.matchedProvinceName = matchedProvince.name;
  result.confidence = 0.7;

  // Step 2: Match ward (only if we have a province match and ward name)
  if (!parsed.wardName) {
    result.error = 'Không thể xác định phường/xã từ địa chỉ OCR';
    return result;
  }

  // Filter wards by matched province
  const provinceWards = wards.filter(w => {
    const wardProvinceId = w.province_id || w.provinceId;
    return wardProvinceId === matchedProvince._id;
  });

  const matchedWard = provinceWards.find(w =>
    namesMatch(w.name, parsed.wardName)
  );

  if (!matchedWard) {
    result.error = `Không tìm thấy phường/xã: "${parsed.wardName}" trong ${matchedProvince.name}`;
    return result;
  }

  result.matchedWardId = matchedWard._id;
  result.matchedWardName = matchedWard.name;
  result.confidence = 0.95; // High confidence for full match

  return result;
}

/**
 * Extract just the street address from parsed address
 * Used for the "registeredAddress" field
 */
export function extractStreetAddress(parsed: ParsedAddress): string {
  if (!parsed.streetAddress) return '';

  let address = parsed.streetAddress.trim();

  // If we have ward name and it's not already in the street address, optionally include it
  // But for this use case, we keep only the street/house number
  return address;
}
