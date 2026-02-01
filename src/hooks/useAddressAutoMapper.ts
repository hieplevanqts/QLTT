/**
 * useAddressAutoMapper Hook
 * Handles automatic address mapping from OCR data to form fields
 * 
 * Features:
 * - Parses OCR address string
 * - Matches to province/ward database
 * - Auto-selects dropdown values
 * - Respects user selections (doesn't override)
 * - Runs only once after successful OCR
 * - Provides fallback behavior
 */

import { useRef, useEffect } from 'react';
import {
  parseVietnameseAddress,
  matchAddressToDatabase,
  extractStreetAddress,
} from '@/utils/addressParser';

export interface UseAddressAutoMapperProps {
  /** OCR data with address field */
  ocrData?: {
    address?: string;
    [key: string]: any;
  };
  /** Available provinces */
  provinces: Array<{ _id: string; name: string; code?: string }>;
  /** Available wards */
  wards: Array<{ _id: string; name: string; province_id?: string; provinceId?: string }>;
  /** Current form data */
  formData?: {
    registeredAddress?: string;
    province?: string;
    ward?: string;
    [key: string]: any;
  };
  /** Callback when matching succeeds - for auto-selecting */
  onAddressMatch?: (result: {
    streetAddress: string;
    provinceId: string;
    provinceName: string;
    wardId: string;
    wardName: string;
  }) => void;
  /** Callback when matching fails - to show fallback */
  onAddressMatchFail?: (error: string, fullAddress: string) => void;
  /** Flag to skip auto-mapping (e.g., user already edited) */
  skipMapping?: boolean;
}

/**
 * Auto-map OCR address to form fields
 */
export function useAddressAutoMapper({
  ocrData,
  provinces,
  wards,
  formData,
  onAddressMatch,
  onAddressMatchFail,
  skipMapping = false,
}: UseAddressAutoMapperProps): void {
  // Track if we've already attempted mapping for this OCR data
  const mappedAddressRef = useRef<string | null>(null);
  // Track if user has manually edited address fields
  const userEditedRef = useRef(false);

  // Monitor user edits to form fields
  useEffect(() => {
    // If user modifies any address field after initial load, mark as edited
    // This prevents subsequent auto-mapping from overriding their selection
    if (formData?.registeredAddress || formData?.province || formData?.ward) {
      userEditedRef.current = true;
    }
  }, [formData?.registeredAddress, formData?.province, formData?.ward]);

  // Main auto-mapping logic
  useEffect(() => {
    // Check if we should skip mapping
    if (skipMapping || !ocrData?.address) {
      return;
    }

    // Don't re-map if we've already processed this address
    if (mappedAddressRef.current === ocrData.address) {
      return;
    }

    // Don't override user selections
    if (userEditedRef.current && (formData?.province || formData?.ward)) {
      console.log('⏭️ [Address Mapper] Skipping: User has already edited address fields');
      return;
    }

    console.log('🗺️ [Address Mapper] Starting auto-mapping for OCR address:', ocrData.address);

    try {
      // Step 1: Parse the address
      const parsed = parseVietnameseAddress(ocrData.address);
      console.log('✅ [Address Mapper] Parsed address:', parsed);

      // Step 2: Match to database
      const matchResult = matchAddressToDatabase(parsed, provinces, wards);
      console.log('🔍 [Address Mapper] Match result:', {
        confidence: matchResult.confidence,
        province: matchResult.matchedProvinceName,
        ward: matchResult.matchedWardName,
        error: matchResult.error,
      });

      // Step 3: Handle match result
      if (
        matchResult.confidence >= 0.9 && // High confidence match
        matchResult.matchedProvinceId &&
        matchResult.matchedWardId
      ) {
        // Successful match - auto-select
        const streetAddress = extractStreetAddress(parsed);
        console.log('✨ [Address Mapper] Auto-selecting:', {
          streetAddress,
          province: matchResult.matchedProvinceName,
          ward: matchResult.matchedWardName,
        });

        onAddressMatch?.({
          streetAddress,
          provinceId: matchResult.matchedProvinceId,
          provinceName: matchResult.matchedProvinceName || '',
          wardId: matchResult.matchedWardId,
          wardName: matchResult.matchedWardName || '',
        });

        // Mark address as user-edited after auto-mapping to prevent overrides
        userEditedRef.current = true;
      } else {
        // Failed to match - show full OCR address as fallback
        console.log('⚠️ [Address Mapper] Fallback: Could not match, showing full OCR address');
        onAddressMatchFail?.(
          matchResult.error || 'Không thể tự động xác định địa chỉ từ OCR',
          ocrData.address
        );
      }

      // Mark this address as processed
      mappedAddressRef.current = ocrData.address;
    } catch (error) {
      console.error('❌ [Address Mapper] Error during auto-mapping:', error);
      onAddressMatchFail?.(
        'Lỗi xử lý địa chỉ OCR',
        ocrData.address
      );
    }
  }, [ocrData?.address, provinces, wards, onAddressMatch, onAddressMatchFail, skipMapping, formData?.province, formData?.ward]);

  /**
   * Reset the mapper state (useful when opening a new form or clearing OCR data)
   */
  useEffect(() => {
    return () => {
      // Cleanup: reset refs when component unmounts
      mappedAddressRef.current = null;
      userEditedRef.current = false;
    };
  }, []);
}

/**
 * Hook to get formatted address string for display
 */
export function useFormattedAddress(
  streetAddress?: string,
  ward?: string,
  province?: string,
  wards?: Array<{ _id: string; name: string }>,
  provinces?: Array<{ _id: string; name: string }>
): string {
  return [
    streetAddress,
    wards?.find(w => w._id === ward)?.name || ward,
    provinces?.find(p => p._id === province)?.name || province,
  ]
    .filter(Boolean)
    .join(', ');
}
