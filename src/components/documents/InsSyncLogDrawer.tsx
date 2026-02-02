import React, { useState } from 'react';
import { CheckCircle2, XCircle, History, Download, Upload, RefreshCw } from 'lucide-react';
import { CenteredModalShell } from '../overlays/CenteredModalShell';
import { EnterpriseModalHeader } from '../overlays/EnterpriseModalHeader';
import { Button } from '../ui/button';
import styles from './InsSyncLogDrawer.module.css';
import type { InsSyncLog } from '../../../types/ins-documents';

export interface InsSyncLogDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock sync logs
const MOCK_SYNC_LOGS: InsSyncLog[] = [
  {
    id: 'log_001',
    documentId: 'doc_001',
    documentCode: 'M01',
    action: 'import',
    status: 'success',
    timestamp: '2026-01-14T10:30:00',
    userId: 'user_001',
    userName: 'Nguyễn Văn A',
    details: 'Import thành công QĐ-KT 01/QĐ-KT từ INS',
  },
  {
    id: 'log_002',
    documentId: 'doc_002',
    documentCode: 'M06',
    action: 'export',
    status: 'success',
    timestamp: '2026-01-14T09:15:00',
    userId: 'user_002',
    userName: 'Trần Thị B',
    details: 'Đẩy biên bản BB-KT 001/BB-KT sang INS thành công',
  },
  {
    id: 'log_003',
    documentId: 'doc_003',
    documentCode: 'M04',
    action: 'sync',
    status: 'failed',
    timestamp: '2026-01-14T08:45:00',
    userId: 'user_001',
    userName: 'Nguyễn Văn A',
    details: 'Đồng bộ QĐ-NV 01/QĐ-NV',
    error: 'Lỗi kết nối đến server INS. Vui lòng thử lại sau.',
  },
  {
    id: 'log_004',
    documentId: 'doc_004',
    documentCode: 'M03',
    action: 'import',
    status: 'success',
    timestamp: '2026-01-13T16:20:00',
    userId: 'user_003',
    userName: 'Lê Văn C',
    details: 'Import thành công QĐ-GQ 01/QĐ-GQ từ INS',
  },
  {
    id: 'log_005',
    documentId: 'doc_005',
    documentCode: 'M08',
    action: 'export',
    status: 'success',
    timestamp: '2026-01-13T14:10:00',
    userId: 'user_002',
    userName: 'Trần Thị B',
    details: 'Đẩy báo cáo BC-001 sang INS thành công',
  },
];

export function InsSyncLogDrawer({ open, onOpenChange }: InsSyncLogDrawerProps) {
  const [logs] = useState<InsSyncLog[]>(MOCK_SYNC_LOGS);
  const [filter, setFilter] = useState<'all' | 'success' | 'failed'>('all');

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    return log.status === filter;
  });

  const getActionIcon = (action: InsSyncLog['action']) => {
    switch (action) {
      case 'import':
        return <Download size={16} />;
      case 'export':
        return <Upload size={16} />;
      case 'sync':
        return <RefreshCw size={16} />;
    }
  };

  const getActionLabel = (action: InsSyncLog['action']) => {
    switch (action) {
      case 'import':
        return 'Import từ INS';
      case 'export':
        return 'Export sang INS';
      case 'sync':
        return 'Đồng bộ';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <CenteredModalShell
      header={<EnterpriseModalHeader title="Lịch sử đồng bộ INS" moduleTag="documents" />}
      open={open}
      onClose={() => onOpenChange(false)}
      width={720}
    >
      <div className="text-sm text-muted-foreground">
        Xem lịch sử import/export biểu mẫu với hệ thống INS
      </div>

      <div className={styles.content}>
          {/* Filters */}
          <div className={styles.filters}>
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Tất cả ({logs.length})
            </Button>
            <Button
              variant={filter === 'success' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('success')}
            >
              Thành công ({logs.filter((l) => l.status === 'success').length})
            </Button>
            <Button
              variant={filter === 'failed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('failed')}
            >
              Lỗi ({logs.filter((l) => l.status === 'failed').length})
            </Button>
          </div>

          {/* Log List */}
          {filteredLogs.length === 0 ? (
            <div className={styles.emptyState}>
              <History size={48} className={styles.emptyStateIcon} />
              <div className={styles.emptyStateText}>
                Không có lịch sử đồng bộ nào
              </div>
            </div>
          ) : (
            <div className={styles.logList}>
              {filteredLogs.map((log) => (
                <div key={log.id} className={styles.logItem}>
                  <div className={`${styles.logIcon} ${styles[log.status]}`}>
                    {log.status === 'success' ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <XCircle size={20} />
                    )}
                  </div>

                  <div className={styles.logContent}>
                    <div className={styles.logHeader}>
                      <div className={styles.logAction}>
                        {getActionLabel(log.action)} - {log.documentCode}
                      </div>
                      <div className={styles.logTime}>{formatTime(log.timestamp)}</div>
                    </div>

                    <div className={styles.logMeta}>
                      <span>{getActionIcon(log.action)} {getActionLabel(log.action)}</span>
                      <span>• {log.userName}</span>
                    </div>

                    {log.details && (
                      <div className={styles.logDetails}>{log.details}</div>
                    )}

                    {log.error && (
                      <div className={styles.logError}>
                        <strong>Lỗi:</strong> {log.error}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </CenteredModalShell>
  );
}
