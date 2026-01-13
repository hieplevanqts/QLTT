/**
 * Username Validator - MAPPA Portal
 * Validates username format and database integrity for QT prefix system
 * 
 * Format: QT{code}_{username}
 * 
 * Province Level (2 digits):
 *   - Example: QT01_admin
 *   - Code: 01 (province code)
 *   - Validates: provinces.code = "01"
 * 
 * Ward Level (5 digits = 2 province + 3 ward):
 *   - Example: QT01002_user
 *   - Province Code: 01 (first 2 digits)
 *   - Ward Code: 002 (last 3 digits)
 *   - Validates:
 *     1. provinces.code = "01" exists
 *     2. wards.code = "002" exists
 *     3. wards.provinceId matches province.id
 */

import { supabase } from '../lib/supabase';

export interface UsernameValidationResult {
  isValid: boolean;
  error?: string;
  details?: {
    prefix: string;
    code: string;
    username: string;
    level: 'province' | 'ward';
  };
}

/**
 * Quick client-side format validation (no database check)
 * Returns simple validation result for immediate UI feedback
 */
export function quickValidateUsernameFormat(
  username: string
): { isValid: boolean; error?: string } {
  // Check format: must start with "QT" and contain underscore
  if (!username.startsWith('QT')) {
    return {
      isValid: false,
      error: 'Tên đăng nhập phải bắt đầu với "QT"',
    };
  }

  const underscoreIndex = username.indexOf('_');
  if (underscoreIndex === -1 || underscoreIndex === 2) {
    return {
      isValid: false,
      error: 'Tên đăng nhập phải có định dạng: QT{code}_{username}',
    };
  }

  const codeAndUsername = username.substring(2); // Remove "QT" prefix
  const code = codeAndUsername.substring(0, underscoreIndex - 2);
  const usernamePart = codeAndUsername.substring(underscoreIndex - 2 + 1);

  if (!code || code.length < 2) {
    return {
      isValid: false,
      error: 'Mã địa bàn phải có ít nhất 2 ký tự',
    };
  }

  if (!usernamePart || usernamePart.length < 1) {
    return {
      isValid: false,
      error: 'Phần tên đăng nhập không được để trống',
    };
  }

  // Determine level: 2 digits = province, 5 digits = ward
  const level = code.length === 2 ? 'province' : code.length === 5 ? 'ward' : null;

  if (!level) {
    return {
      isValid: false,
      error: 'Mã địa bàn phải có 2 ký tự (tỉnh/thành) hoặc 5 ký tự (phường/xã)',
    };
  }

  return {
    isValid: true,
  };
}

/**
 * Validates username format: QT{code}_{username}
 */
export async function validateUsername(
  username: string
): Promise<UsernameValidationResult> {
  // Check format: must start with "QT" and contain underscore
  if (!username.startsWith('QT')) {
    return {
      isValid: false,
      error: 'Tên đăng nhập phải bắt đầu với "QT"',
    };
  }

  const underscoreIndex = username.indexOf('_');
  if (underscoreIndex === -1 || underscoreIndex === 2) {
    return {
      isValid: false,
      error: 'Tên đăng nhập phải có định dạng: QT{code}_{username}',
    };
  }

  const prefix = 'QT';
  const codeAndUsername = username.substring(2); // Remove "QT" prefix
  const code = codeAndUsername.substring(0, underscoreIndex - 2);
  const usernamePart = codeAndUsername.substring(underscoreIndex - 2 + 1);

  if (!code || code.length < 2) {
    return {
      isValid: false,
      error: 'Mã địa bàn phải có ít nhất 2 ký tự',
    };
  }

  if (!usernamePart || usernamePart.length < 1) {
    return {
      isValid: false,
      error: 'Phần tên đăng nhập không được để trống',
    };
  }

  // Determine level: 2 digits = province, 5 digits = ward
  const level = code.length === 2 ? 'province' : code.length === 5 ? 'ward' : null;

  if (!level) {
    return {
      isValid: false,
      error: 'Mã địa bàn phải có 2 ký tự (tỉnh/thành) hoặc 5 ký tự (phường/xã)',
    };
  }

  // Validate against database
  try {
    if (level === 'province') {
      // Check if province exists
      const { data: province, error } = await supabase
        .from('provinces')
        .select('id, code, name')
        .eq('code', code)
        .single();

      if (error || !province) {
        return {
          isValid: false,
          error: `Tỉnh/thành với mã "${code}" không tồn tại`,
          details: {
            prefix,
            code,
            username: usernamePart,
            level: 'province',
          },
        };
      }

      return {
        isValid: true,
        details: {
          prefix,
          code,
          username: usernamePart,
          level: 'province',
        },
      };
    } else {
      // Ward level: code = 5 digits (2 province + 3 ward)
      const provinceCode = code.substring(0, 2);
      const wardCode = code.substring(2);

      // Check if province exists
      const { data: province, error: provinceError } = await supabase
        .from('provinces')
        .select('id, code, name')
        .eq('code', provinceCode)
        .single();

      if (provinceError || !province) {
        return {
          isValid: false,
          error: `Tỉnh/thành với mã "${provinceCode}" không tồn tại`,
          details: {
            prefix,
            code,
            username: usernamePart,
            level: 'ward',
          },
        };
      }

      // Check if ward exists and belongs to province
      const { data: ward, error: wardError } = await supabase
        .from('wards')
        .select('id, code, name, province_id')
        .eq('code', wardCode)
        .single();

      if (wardError || !ward) {
        return {
          isValid: false,
          error: `Phường/xã với mã "${wardCode}" không tồn tại`,
          details: {
            prefix,
            code,
            username: usernamePart,
            level: 'ward',
          },
        };
      }

      // Verify ward belongs to province
      if (ward.province_id !== province.id) {
        return {
          isValid: false,
          error: `Phường/xã "${wardCode}" không thuộc tỉnh/thành "${provinceCode}"`,
          details: {
            prefix,
            code,
            username: usernamePart,
            level: 'ward',
          },
        };
      }

      return {
        isValid: true,
        details: {
          prefix,
          code,
          username: usernamePart,
          level: 'ward',
        },
      };
    }
  } catch (error) {
    return {
      isValid: false,
      error: `Lỗi khi kiểm tra dữ liệu: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Extracts code from username
 */
export function extractCodeFromUsername(username: string): string | null {
  if (!username.startsWith('QT')) return null;

  const underscoreIndex = username.indexOf('_');
  if (underscoreIndex === -1 || underscoreIndex === 2) return null;

  const codeAndUsername = username.substring(2);
  const code = codeAndUsername.substring(0, underscoreIndex - 2);
  return code || null;
}

/**
 * Extracts username part from full username
 */
export function extractUsernamePart(username: string): string | null {
  if (!username.startsWith('QT')) return null;

  const underscoreIndex = username.indexOf('_');
  if (underscoreIndex === -1) return null;

  return username.substring(underscoreIndex + 1) || null;
}
