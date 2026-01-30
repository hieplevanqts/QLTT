/**
 * Module Registry Table Component
 * Hiển thị danh sách modules với manifest details
 */

import React from 'react';
import { Eye, FileJson, Menu, Power, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ModuleManifest } from '../mocks/moduleRegistry.mock';
import styles from './ModuleRegistryTable.module.css';

interface ModuleRegistryTableProps {
  modules: ModuleManifest[];
  onViewManifest: (module: ModuleManifest) => void;
  onSyncToMenu: (module: ModuleManifest) => void;
  onToggleStatus?: (id: string, enabled: boolean) => void;
}

export function ModuleRegistryTable({ 
  modules, 
  onViewManifest, 
  onSyncToMenu,
  onToggleStatus 
}: ModuleRegistryTableProps) {
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getReleaseTypeColor = (type: string) => {
    switch (type) {
      case 'major':
        return styles.releaseMajor;
      case 'minor':
        return styles.releaseMinor;
      case 'patch':
        return styles.releasePatch;
      default:
        return '';
    }
  };

  if (modules.length === 0) {
    return (
      <div className={styles.emptyState}>
        <FileJson size={48} />
        <h3>Chưa có module manifest nào</h3>
        <p>Hệ thống chưa phát hiện module.json hợp lệ</p>
      </div>
    );
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Module</th>
          <th>Version</th>
          <th>Base Path</th>
          <th>Permissions</th>
          <th>Release Type</th>
          <th>Compatibility</th>
          <th>Status</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {modules.map((module) => (
          <tr key={module.id}>
            {/* Module Info */}
            <td>
              <div className={styles.moduleInfo}>
                <div className={styles.moduleName}>{module.name}</div>
                <div className={styles.moduleId}>{module.id}</div>
                <div className={styles.routeExport}>
                  <code>{module.routeExport}</code>
                </div>
              </div>
            </td>

            {/* Version */}
            <td>
              <span className={styles.versionBadge}>v{module.version}</span>
            </td>

            {/* Base Path */}
            <td>
              <code className={styles.codePath}>{module.basePath}</code>
            </td>

            {/* Permissions Count */}
            <td>
              <span className={styles.permissionCount}>
                {module.permissions.length} quyền
              </span>
            </td>

            {/* Release Type */}
            <td>
              <span className={`${styles.releaseBadge} ${getReleaseTypeColor(module.release.type)}`}>
                {module.release.type}
              </span>
            </td>

            {/* Compatibility */}
            <td>
              <div className={styles.compat}>
                <span className={styles.compatVersion}>{module.compat.minAppVersion}</span>
                <span className={styles.compatSeparator}>→</span>
                <span className={styles.compatVersion}>{module.compat.maxAppVersion}</span>
              </div>
            </td>

            {/* Status */}
            <td>
              {module.enabled ? (
                <span className={styles.statusEnabled}>
                  <CheckCircle2 size={14} />
                  Enabled
                </span>
              ) : (
                <span className={styles.statusDisabled}>
                  <XCircle size={14} />
                  Disabled
                </span>
              )}
            </td>

            {/* Actions */}
            <td>
              <div className={styles.actions}>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Xem manifest"
                  onClick={() => onViewManifest(module)}
                >
                  <FileJson className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Preview menu"
                  onClick={() => onSyncToMenu(module)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
                {onToggleStatus && (
                  <Button
                    variant="ghost"
                    size="icon"
                    title={module.enabled ? 'Disable' : 'Enable'}
                    onClick={() => onToggleStatus(module.id, !module.enabled)}
                  >
                    <Power className={`h-4 w-4 ${module.enabled ? 'text-success' : ''}`} />
                  </Button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
