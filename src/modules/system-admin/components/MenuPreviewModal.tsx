/**
 * Menu Preview Modal
 * Modal hiển thị preview menu items được generate từ module manifest
 */

import React from 'react';
import { Menu, ChevronRight } from 'lucide-react';
import type { ModuleManifest } from '../mocks/moduleRegistry.mock';
import styles from './MenuPreviewModal.module.css';
import { CenteredModalShell } from '@/components/overlays/CenteredModalShell';
import { EnterpriseModalHeader } from '@/components/overlays/EnterpriseModalHeader';

interface MenuPreviewModalProps {
  module: ModuleManifest | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MenuPreviewModal({ module, isOpen, onClose }: MenuPreviewModalProps) {
  if (!isOpen || !module) return null;

  return (
    <CenteredModalShell
      open={isOpen}
      onClose={onClose}
      width={860}
      header={
        <EnterpriseModalHeader
          title="Preview Menu Item"
          code={module.id}
          moduleTag="system-admin"
        />
      }
    >
      <div className={styles.content}>
        <div className={styles.info}>
          <p className={styles.infoText}>
            Menu item sẽ được tạo từ cấu hình <code>ui</code> trong module.json:
          </p>
        </div>

        {/* Menu Config */}
        <div className={styles.configSection}>
          <h3 className={styles.sectionTitle}>Cấu hình UI</h3>
          <div className={styles.configGrid}>
            <div className={styles.configItem}>
              <label>Menu Label</label>
              <div className={styles.configValue}>{module.ui.menuLabel}</div>
            </div>
            <div className={styles.configItem}>
              <label>Menu Path</label>
              <div className={styles.configValue}>
                <code>{module.ui.menuPath}</code>
              </div>
            </div>
            <div className={styles.configItem}>
              <label>Module ID</label>
              <div className={styles.configValue}>
                <code>{module.id}</code>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Preview */}
        <div className={styles.previewSection}>
          <h3 className={styles.sectionTitle}>Preview Menu Item</h3>
          
          {/* Horizontal Menu Preview */}
          <div className={styles.menuPreviewContainer}>
            <div className={styles.menuPreviewLabel}>Horizontal Layout</div>
            <div className={styles.horizontalMenu}>
              <div className={styles.menuItem}>
                <Menu size={16} />
                <span>{module.ui.menuLabel}</span>
              </div>
            </div>
          </div>

          {/* Vertical Menu Preview */}
          <div className={styles.menuPreviewContainer}>
            <div className={styles.menuPreviewLabel}>Vertical Layout</div>
            <div className={styles.verticalMenu}>
              <div className={styles.menuItemVertical}>
                <div className={styles.menuItemContent}>
                  <Menu size={18} />
                  <span>{module.ui.menuLabel}</span>
                </div>
                <ChevronRight size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* JSON Output */}
        <div className={styles.jsonSection}>
          <h3 className={styles.sectionTitle}>Menu Object (JSON)</h3>
          <pre className={styles.jsonCode}>
            {JSON.stringify(
              {
                label: module.ui.menuLabel,
                path: module.ui.menuPath,
                moduleId: module.id,
                icon: 'Menu',
                permissions: module.permissions
              },
              null,
              2
            )}
          </pre>
        </div>

        {/* Info Note */}
        <div className={styles.note}>
          <strong>Lưu ý:</strong> Đây chỉ là preview mock. Trong môi trường thật, menu sẽ được
          tự động đăng ký vào navigation system dựa trên module manifest và permissions của user.
        </div>
      </div>
    </CenteredModalShell>
  );
}
