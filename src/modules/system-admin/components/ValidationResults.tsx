/**
 * Validation Results Component
 */

import React from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ValidationResult } from '../types';
import styles from './ValidationResults.module.css';

interface ValidationResultsProps {
  results: ValidationResult[];
  showSummary?: boolean;
}

export function ValidationResults({ results, showSummary = true }: ValidationResultsProps) {
  const successCount = results.filter(r => r.type === 'success').length;
  const errorCount = results.filter(r => r.type === 'error').length;
  const warningCount = results.filter(r => r.type === 'warning').length;

  const getIcon = (type: ValidationResult['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'error':
        return <XCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const downloadManifest = (manifest: unknown, fileName = 'module.json') => {
    const content = JSON.stringify(manifest, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.validationResults}>
      {showSummary && (
        <div className={styles.summary}>
          {successCount > 0 && (
            <div className={styles.summaryItem}>
              <CheckCircle className="h-4 w-4 text-success" />
              <span className={styles.summaryCount}>{successCount}</span>
              <span>Thành công</span>
            </div>
          )}
          {errorCount > 0 && (
            <div className={styles.summaryItem}>
              <XCircle className="h-4 w-4 text-destructive" />
              <span className={styles.summaryCount}>{errorCount}</span>
              <span>Lỗi</span>
            </div>
          )}
          {warningCount > 0 && (
            <div className={styles.summaryItem}>
              <AlertTriangle className="h-4 w-4 text-warning" />
              <span className={styles.summaryCount}>{warningCount}</span>
              <span>Cảnh báo</span>
            </div>
          )}
        </div>
      )}

      {results.map((result, index) => (
        <div key={index} className={`${styles.resultItem} ${styles[result.type]}`}>
          <div className={`${styles.resultIcon} ${styles[result.type]}`}>
            {getIcon(result.type)}
          </div>
          <div className={styles.resultContent}>
            <div className={styles.resultMessage}>{result.message}</div>
            {result.details && (
              <div className={styles.resultDetails}>{result.details}</div>
            )}
            {result.suggestedManifest && (
              <div className={styles.resultSuggest}>
                <div className={styles.resultActions}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadManifest(result.suggestedManifest)}
                  >
                    Tải module.json mẫu
                  </Button>
                </div>
                <pre className={styles.resultCode}>
                  {JSON.stringify(result.suggestedManifest, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
