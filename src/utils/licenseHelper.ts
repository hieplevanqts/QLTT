
// --- Type-Specific Field Configuration ---
/**
 * Maps license type to allowed database fields for that type.
 * Only these fields will be included in the RPC payload for each document type.
 */
export const LICENSE_FIELDS: Record<string, string[]> = {
    CCCD: [
        'license_number', 'holder_name', 'issued_date', 'issued_by_name', 'issued_by',
        'permanent_address', 'sex', 'nationality', 'place_of_origin', 'file_url', 'file_url_2'
    ],
    BUSINESS_LICENSE: [
        'license_number', 'issued_date', 'expiry_date', 'issued_by_name',
        'business_field', 'business_name', 'owner_name', 'permanent_address', 'file_url'
    ],
    FOOD_SAFETY: [
        'license_number', 'issued_date', 'expiry_date', 'issued_by_name',
        'activity_scope', 'file_url'
    ],
    RENT_CONTRACT: [
        'license_number', 'lessor_name', 'lessee_name', 'rent_price_monthly',
        'rent_start_date', 'rent_end_date', 'property_address', 'file_url'
    ],
    PROFESSIONAL_LICENSE: [
        'license_number', 'issued_date', 'expiry_date', 'issued_by_name',
        'activity_scope', 'file_url'
    ],
    FIRE_PREVENTION: [
        'license_number', 'issued_date', 'expiry_date', 'issued_by_name',
        'inspection_result', 'file_url'
    ]
};

/**
 * Maps license type to required fields that must be present for saving.
 * Used for frontend validation before RPC call.
 */
export const REQUIRED_FIELDS_BY_TYPE: Record<string, string[]> = {
    CCCD: ['license_number', 'holder_name', 'issued_date', 'issued_by_name'],
    BUSINESS_LICENSE: ['license_number', 'issued_date', 'issued_by_name'],
    FOOD_SAFETY: ['license_number', 'issued_date', 'expiry_date', 'issued_by_name', 'activity_scope'],
    RENT_CONTRACT: ['license_number', 'lessor_name', 'lessee_name', 'rent_start_date', 'rent_end_date', 'property_address'],
    PROFESSIONAL_LICENSE: ['license_number', 'issued_date', 'expiry_date', 'issued_by_name', 'activity_scope'],
    FIRE_PREVENTION: ['license_number', 'issued_date', 'expiry_date', 'issued_by_name']
};

// Maps technical p_ fields to possible keys in data.fields
export const FIELD_SOURCE_MAPPING: Record<string, string[]> = {
    license_number: ['licenseNumber', 'certificateNumber', 'contractNumber', 'idNumber'],
    issued_date: ['issueDate'],
    expiry_date: ['expiryDate'],
    issued_by_name: ['issuingAuthority', 'issuePlace'],
    issued_by: ['issuePlace'],
    holder_name: ['fullName'],
    permanent_address: ['address'],
    business_field: ['businessScope'],
    activity_scope: ['scope'],
    inspection_result: ['inspectionResult'],
    lessor_name: ['lessor'],
    lessee_name: ['lessee'],
    rent_price_monthly: ['monthlyRent'],
    rent_start_date: ['startDate'],
    rent_end_date: ['endDate'],
    property_address: ['address'],
    sex: ['sex'],
    nationality: ['nationality'],
    place_of_origin: ['placeOfOrigin'],
    business_name: ['businessName'],
    owner_name: ['ownerName'],
};

// Maps UI document types to LICENSE_FIELDS keys
export const DOCUMENT_TYPE_TO_KEY: Record<string, string> = {
    'cccd': 'CCCD',
    'CCCD / CMND chủ hộ': 'CCCD',
    'business-license': 'BUSINESS_LICENSE',
    'food-safety': 'FOOD_SAFETY',
    'lease-contract': 'RENT_CONTRACT',
    'specialized-license': 'PROFESSIONAL_LICENSE',
    'fire-safety': 'FIRE_PREVENTION'
};

// --- UUID Generator ---
/**
 * Generates a random UUID v4 string
 * @returns UUID string in format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 */
const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

// --- Helper Function ---
/**
 * Builds the RPC payload for upsertMerchantLicense.
 * Only includes fields that are relevant for the document type and have values.
 * ALWAYS generates or uses provided _id to avoid NOT NULL constraint violations.
 * 
 * @param typeKey - License type key (CCCD, BUSINESS_LICENSE, etc.)
 * @param dataFields - Form field values from DocumentUploadDialog
 * @param merchantId - Merchant/Store ID
 * @param fileUrl - Primary document image URL
 * @param fileUrl2 - Secondary document image URL (e.g., CCCD back side)
 * @param existingId - Existing license ID (for editing), generates new if not provided
 * @returns RPC payload with type-specific fields and always includes p_id
 */
export const buildLicensePayload = (
    typeKey: string,
    dataFields: Record<string, any>,
    merchantId: string,
    fileUrl: string | undefined,
    fileUrl2?: string,
    existingId?: string
) => {
    const allowedFields = LICENSE_FIELDS[typeKey] || [];
    
    // Generate new ID if not provided (for new licenses)
    // or use existing ID (for edits)
    const licenseId = existingId || generateUUID();
    
    const payload: any = {
        p_id: licenseId,  // Always include ID (new or existing)
        p_merchant_id: merchantId,
        p_license_type: typeKey,
        p_status: 'valid',
        p_approval_status: 0,
    };

    // Persist notes if provided
    if (dataFields.notes && dataFields.notes !== '') {
        payload.p_notes = dataFields.notes;
    }

    // Map fields based on configuration - only include non-empty values
    allowedFields.forEach((field: string) => {
        // 1. Direct p_ mapping
        const pField = `p_${field}`;

        // 2. Find value from source options
        let value: any = undefined;

        if (field === 'file_url') {
            value = fileUrl || undefined;
        } else if (field === 'file_url_2') {
            value = fileUrl2 || undefined;
        } else {
            // Look up value from dataFields using source key mapping
            const sourceKeys = FIELD_SOURCE_MAPPING[field] || [];
            for (const key of sourceKeys) {
                const fieldValue = dataFields[key];
                if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
                    value = fieldValue;
                    break;
                }
            }
        }

        // 3. Only include field if it has a value
        // Special handling for numbers
        if (field === 'rent_price_monthly' && value !== undefined) {
            payload[pField] = Number(value);
        } else if (value !== undefined) {
            payload[pField] = value;
        }
        // If value is undefined, don't include the field - PostgreSQL will use DEFAULT NULL
    });

    return payload;
};

/**
 * Validates that all required fields for a document type are present in the form data.
 * Returns validation errors for missing fields.
 * 
 * @param typeKey - License type key (e.g., 'CCCD', 'BUSINESS_LICENSE')
 * @param dataFields - Form data from DocumentUploadDialog
 * @returns Array of missing field names, or empty array if all valid
 */
export const validateRequiredFields = (
    typeKey: string,
    dataFields: Record<string, any>
): string[] => {
    const requiredFields = REQUIRED_FIELDS_BY_TYPE[typeKey] || [];
    const missingFields: string[] = [];

    requiredFields.forEach((dbField) => {
        // Get possible source keys for this database field
        const sourceKeys = FIELD_SOURCE_MAPPING[dbField] || [];
        
        // Check if any of the source keys have a value in dataFields
        const hasValue = sourceKeys.some((key) => {
            const value = dataFields[key];
            return value !== undefined && value !== null && value !== '';
        });

        if (!hasValue) {
            // Add this field to missing list for error message
            missingFields.push(dbField);
        }
    });

    return missingFields;
};

/**
 * Validates data types of fields before sending to RPC.
 * Ensures dates are in YYYY-MM-DD format and numbers are valid.
 * 
 * @param typeKey - License type key
 * @param dataFields - Form data to validate
 * @returns Object with validation result: { isValid: boolean, errors?: string[] }
 */
export const validateFieldTypes = (
    typeKey: string,
    dataFields: Record<string, any>
): { isValid: boolean; errors?: string[] } => {
    const errors: string[] = [];

    // Check for date fields
    const dateFields = ['issued_date', 'expiry_date', 'rent_start_date', 'rent_end_date'];
    const sourceMapping = Object.entries(FIELD_SOURCE_MAPPING)
        .filter(([dbField]) => dateFields.includes(dbField))
        .reduce((acc, [dbField, sources]) => {
            sources.forEach(source => {
                acc[source] = dbField;
            });
            return acc;
        }, {} as Record<string, string>);

    Object.entries(sourceMapping).forEach(([key, dbField]) => {
        const value = dataFields[key];
        if (value && value !== '') {
            // Check for valid date format YYYY-MM-DD
            if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
                errors.push(`${key} phải có định dạng YYYY-MM-DD (nhận: ${value})`);
            }
        }
    });

    // Check for number fields
    const numberFields = ['rent_price_monthly'];
    const numberMapping = Object.entries(FIELD_SOURCE_MAPPING)
        .filter(([dbField]) => numberFields.includes(dbField))
        .reduce((acc, [dbField, sources]) => {
            sources.forEach(source => {
                acc[source] = dbField;
            });
            return acc;
        }, {} as Record<string, string>);

    Object.entries(numberMapping).forEach(([key, dbField]) => {
        const value = dataFields[key];
        if (value && value !== '') {
            if (isNaN(Number(value))) {
                errors.push(`${key} phải là số hợp lệ (nhận: ${value})`);
            }
        }
    });

    return {
        isValid: errors.length === 0,
        ...(errors.length > 0 && { errors }),
    };
};

/**
 * Sanitizes form data before sending to RPC:
 * - Removes empty strings (converts to undefined so PostgreSQL uses DEFAULT NULL)
 * - Trims whitespace from text fields
 * - Converts numeric strings to numbers
 * 
 * @param typeKey - License type key
 * @param dataFields - Form data to sanitize
 * @returns Sanitized data object
 */
export const sanitizeLicenseData = (
    typeKey: string,
    dataFields: Record<string, any>
): Record<string, any> => {
    const sanitized: Record<string, any> = { ...dataFields };

    // Get all database fields for this type
    const allowedDbFields = LICENSE_FIELDS[typeKey] || [];
    const allSourceKeys = new Set<string>();
    
    allowedDbFields.forEach((dbField) => {
        const sources = FIELD_SOURCE_MAPPING[dbField] || [];
        sources.forEach((source) => allSourceKeys.add(source));
    });

    // Sanitize each field
    allSourceKeys.forEach((key) => {
        let value = sanitized[key];

        if (value === undefined || value === null) {
            delete sanitized[key];
            return;
        }

        // Trim strings
        if (typeof value === 'string') {
            value = value.trim();
            if (value === '') {
                delete sanitized[key];
                return;
            }
            sanitized[key] = value;
        }

        // Convert numbers
        if (key === 'monthlyRent' || key === 'rent_price_monthly') {
            sanitized[key] = Number(value);
        }
    });

    return sanitized;
};

/**
 * Gets user-friendly field label for error messages.
 * Maps database field names to Vietnamese labels.
 */
export const getFieldLabel = (dbField: string): string => {
    const labels: Record<string, string> = {
        license_number: 'Số giấy phép / Số CCCD / Số hợp đồng',
        holder_name: 'Họ và tên chủ hộ',
        issued_date: 'Ngày cấp',
        expiry_date: 'Ngày hết hạn',
        issued_by_name: 'Cơ quan cấp',
        permanent_address: 'Địa chỉ',
        business_field: 'Ngành kinh doanh',
        business_name: 'Tên doanh nghiệp',
        owner_name: 'Người đại diện',
        lessor_name: 'Bên cho thuê',
        lessee_name: 'Bên thuê',
        rent_price_monthly: 'Tiền thuê hàng tháng',
        rent_start_date: 'Ngày bắt đầu thuê',
        rent_end_date: 'Ngày kết thúc thuê',
        property_address: 'Địa chỉ mặt bằng',
        activity_scope: 'Phạm vi hoạt động',
        inspection_result: 'Kết quả kiểm tra',
    };

    return labels[dbField] || dbField;
};
