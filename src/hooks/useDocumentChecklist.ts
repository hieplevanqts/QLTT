import { useMemo } from 'react';
import {
  type DocumentChecklistItem,
  type DocumentCode,
  type DocumentRequirement,
  DOCUMENT_TEMPLATES,
  createEmptyDocumentInstance,
} from '../types/ins-documents';

/**
 * Hook for managing document checklists based on business context
 */

// Context types
export type DocumentContext = 
  | 'plan_create'           // Thêm mới kế hoạch
  | 'plan_edit'             // Chỉnh sửa kế hoạch
  | 'round_create'          // Khởi tạo đợt kiểm tra
  | 'round_edit'            // Chỉnh sửa đợt kiểm tra
  | 'session_create'        // Tạo phiên làm việc
  | 'session_edit';         // Chỉnh sửa phiên làm việc

// Context parameters
export interface DocumentContextParams {
  // Plan context
  planType?: 'periodic' | 'urgent' | 'thematic';
  hasAuthorization?: boolean; // Có ủy quyền?
  
  // Round context
  hasM01?: boolean; // Đã có QĐ-KT?
  hasM02?: boolean; // Có QĐ sửa đổi?
  hasM05?: boolean; // Có QĐ kéo dài?
  
  // Session context
  sessionType?: 'inspection' | 'verification'; // Phiên kiểm tra / Phiên xác minh
  hasEvidence?: boolean; // Có tang vật/hàng hóa?
  needsAttachment?: boolean; // Cần phụ lục?
}

/**
 * Get document checklist configuration based on context
 */
export function useDocumentChecklist(
  context: DocumentContext,
  params: DocumentContextParams = {}
) {
  const documents = useMemo((): DocumentChecklistItem[] => {
    const items: DocumentChecklistItem[] = [];

    // Helper to add document
    const addDoc = (
      code: DocumentCode,
      requirement: DocumentRequirement,
      visible: boolean = true,
      disabled: boolean = false,
      warning?: string
    ) => {
      const template = DOCUMENT_TEMPLATES[code];
      const instance = createEmptyDocumentInstance(template, requirement);
      items.push({
        template,
        instance,
        requirement,
        visible,
        disabled,
        warning,
      });
    };

    // PLAN CREATE CONTEXT
    if (context === 'plan_create') {
      // M03 - QĐ Giao quyền
      addDoc(
        'M03',
        'required',
        params.hasAuthorization === true, // Chỉ hiện khi có ủy quyền
        false,
        params.hasAuthorization ? undefined : undefined
      );

      // M09 - Đề xuất đột xuất
      addDoc(
        'M09',
        'required',
        params.planType === 'urgent', // Chỉ hiện khi loại = đột xuất
        false
      );

      // M08 - Báo cáo
      addDoc('M08', 'optional', true); // Luôn hiện, tùy chọn
    }

    // PLAN EDIT CONTEXT
    if (context === 'plan_edit') {
      // Same as create
      addDoc('M03', 'required', params.hasAuthorization === true);
      addDoc('M09', 'required', params.planType === 'urgent');
      addDoc('M08', 'optional', true);
    }

    // ROUND CREATE CONTEXT
    if (context === 'round_create') {
      // M01 - QĐ Kiểm tra (BẮT BUỘC - nền tảng)
      addDoc(
        'M01',
        'required',
        true,
        false,
        !params.hasM01 ? 'Cần import M01 trước để khởi tạo đợt' : undefined
      );

      // M04 - QĐ Phân công nhiệm vụ
      addDoc(
        'M04',
        'optional',
        true,
        !params.hasM01, // Disable nếu chưa có M01
        !params.hasM01 ? 'Chỉ có thể import sau khi có M01' : undefined
      );

      // M02 - QĐ Sửa đổi bổ sung (phát sinh)
      addDoc(
        'M02',
        'optional',
        params.hasM02 === true, // Chỉ hiện khi có
        false
      );

      // M05 - QĐ Kéo dài/Gia hạn (phát sinh)
      addDoc(
        'M05',
        'optional',
        params.hasM05 === true, // Chỉ hiện khi có
        false
      );
    }

    // ROUND EDIT CONTEXT
    if (context === 'round_edit') {
      // Same as create, but M01 should already exist
      addDoc('M01', 'required', true, true); // Read-only khi edit
      addDoc('M04', 'optional', true);
      addDoc('M02', 'optional', params.hasM02 === true);
      addDoc('M05', 'optional', params.hasM05 === true);
    }

    // SESSION CREATE CONTEXT
    if (context === 'session_create') {
      // M06 - Biên bản kiểm tra
      addDoc(
        'M06',
        'required',
        params.sessionType === 'inspection', // Bắt buộc nếu phiên kiểm tra
        false
      );

      // M07 - Biên bản xác minh
      addDoc(
        'M07',
        'required',
        params.sessionType === 'verification', // Bắt buộc nếu phiên xác minh
        false
      );

      // M10 - Bảng kê (phụ lục của M06)
      addDoc(
        'M10',
        'optional',
        params.hasEvidence === true, // Chỉ hiện khi có tang vật
        false
      );

      // M11 - Phụ lục
      addDoc(
        'M11',
        'optional',
        params.needsAttachment === true, // Chỉ hiện khi cần phụ lục
        false
      );

      // M12 - Nhật ký công tác
      addDoc('M12', 'optional', true); // Luôn hiện
    }

    // SESSION EDIT CONTEXT
    if (context === 'session_edit') {
      // Same as create
      addDoc('M06', 'required', params.sessionType === 'inspection');
      addDoc('M07', 'required', params.sessionType === 'verification');
      addDoc('M10', 'optional', params.hasEvidence === true);
      addDoc('M11', 'optional', params.needsAttachment === true);
      addDoc('M12', 'optional', true);
    }

    return items;
  }, [context, params]);

  // Calculate validation state
  const validation = useMemo(() => {
    const missingRequired = documents.filter(
      doc =>
        doc.visible &&
        doc.requirement === 'required' &&
        (doc.instance.status === 'not_available' || doc.instance.status === 'error')
    ).length;

    const allRequiredComplete = documents
      .filter(doc => doc.visible && doc.requirement === 'required')
      .every(doc =>
        ['content_ready', 'pdf_generated', 'signed', 'pushed_to_ins'].includes(doc.instance.status)
      );

    return {
      isValid: missingRequired === 0,
      missingRequired,
      allRequiredComplete,
    };
  }, [documents]);

  return {
    documents,
    validation,
  };
}

/**
 * Helper to determine if an action can proceed based on document validation
 */
export function canProceedWithAction(
  context: DocumentContext,
  action: 'submit' | 'approve' | 'start' | 'complete',
  validation: ReturnType<typeof useDocumentChecklist>['validation']
): { canProceed: boolean; reason?: string } {
  // Rules for different actions
  const rules: Record<string, boolean> = {
    'plan_create_submit': validation.isValid,
    'plan_edit_submit': validation.isValid,
    'round_create_start': validation.isValid,
    'session_create_complete': validation.isValid,
  };

  const key = `${context}_${action}`;
  const canProceed = rules[key] ?? true; // Default to true if no rule

  return {
    canProceed,
    reason: canProceed ? undefined : `Thiếu ${validation.missingRequired} biểu mẫu bắt buộc`,
  };
}
