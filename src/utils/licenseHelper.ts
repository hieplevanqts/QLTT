
// --- Optimization Config ---
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

// --- Helper Function ---
export const buildLicensePayload = (
    typeKey: string,
    dataFields: Record<string, any>,
    merchantId: string,
    fileUrl: string | undefined,
    fileUrl2?: string
) => {
    const allowedFields = LICENSE_FIELDS[typeKey] || [];
    const payload: any = {
        p_merchant_id: merchantId,
        p_license_type: typeKey,
        p_status: 'valid',
        p_approval_status: 0,
        p_notes: dataFields.notes || '', // Common field
    };

    // Persist full form data into notes as JSON for fields not stored in core columns
    const extraFields: Record<string, any> = { ...dataFields };
    const hasExtra = Object.keys(extraFields).some((key) => {
        if (key === 'notes') return false;
        const val = extraFields[key];
        return val !== undefined && val !== null && val !== '';
    });
    if (hasExtra) {
        payload.p_notes = JSON.stringify({
            notes: typeof dataFields.notes === 'string' ? dataFields.notes : '',
            fields: extraFields,
        });
    }

    // Map fields based on configuration
    allowedFields.forEach((field: string) => {
        // 1. Direct p_ mapping
        const pField = `p_${field}`;

        // 2. Find value from source options
        let value: any = '';

        if (field === 'file_url') value = fileUrl || '';
        else if (field === 'file_url_2') value = fileUrl2 || '';
        else {
            const sourceKeys = FIELD_SOURCE_MAPPING[field] || [];
            for (const key of sourceKeys) {
                if (dataFields[key] !== undefined && dataFields[key] !== null && dataFields[key] !== '') {
                    value = dataFields[key];
                    break;
                }
            }
        }

        // 3. Special handling for numbers
        if (field === 'rent_price_monthly' && value) {
            payload[pField] = Number(value);
        } else {
            payload[pField] = value;
        }
    });

    return payload;
};
