/**
 * Manifest Validation Panel
 * Component hiển thị kết quả validation của module manifest
 */

import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, FileCheck } from 'lucide-react';
import type { ValidationResult } from '../utils/manifestValidator';
import styles from './ManifestValidationPanel.module.css';

interface ManifestValidationPanelProps {
  result: ValidationResult;
  moduleName?: string;
}

export function ManifestValidationPanel({ result, moduleName }: ManifestValidationPanelProps) {
  return (
    <div className={styles.panel}>
      {/* Header */}
      <div className={styles.header}>
        <FileCheck size={18} />
        <h4 className={styles.title}>
          Manifest Validation {moduleName ? `- ${moduleName}` : ''}
        </h4>
      </div>

      {/* Status */}
      <div className={styles.status}>
        {result.valid ? (
          <div className={styles.statusSuccess}>
            <CheckCircle2 size={20} />
            <span>Manifest hợp lệ</span>
          </div>
        ) : (
          <div className={styles.statusError}>
            <AlertCircle size={20} />
            <span>Manifest không hợp lệ</span>
          </div>
        )}
      </div>

      {/* Errors */}
      {result.errors.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <AlertCircle size={16} />
            <span className={styles.sectionTitle}>Errors ({result.errors.length})</span>
          </div>
          <div className={styles.items}>
            {result.errors.map((error, idx) => (
              <div key={idx} className={styles.errorItem}>
                <div className={styles.itemHeader}>
                  <code className={styles.itemField}>{error.field}</code>
                  <span className={styles.itemCode}>{error.code}</span>
                </div>
                <p className={styles.itemMessage}>{error.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <AlertTriangle size={16} />
            <span className={styles.sectionTitle}>Warnings ({result.warnings.length})</span>
          </div>
          <div className={styles.items}>
            {result.warnings.map((warning, idx) => (
              <div key={idx} className={styles.warningItem}>
                <div className={styles.itemHeader}>
                  <code className={styles.itemField}>{warning.field}</code>
                  <span className={styles.itemCode}>{warning.code}</span>
                </div>
                <p className={styles.itemMessage}>{warning.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No issues */}
      {result.valid && result.warnings.length === 0 && (
        <div className={styles.noIssues}>
          <CheckCircle2 size={24} />
          <p>Không có lỗi hoặc cảnh báo</p>
        </div>
      )}
    </div>
  );
}
