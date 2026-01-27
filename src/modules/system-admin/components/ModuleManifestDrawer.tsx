/**
 * Module Manifest Drawer
 * Component hiển thị chi tiết module.json trong drawer
 */

import React, { useState } from 'react';
import { X, Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import type { ModuleManifest } from '../mocks/moduleRegistry.mock';
import { ManifestValidationPanel } from './ManifestValidationPanel';
import { validateManifest } from '../utils/manifestValidator';
import styles from './ModuleManifestDrawer.module.css';

interface ModuleManifestDrawerProps {
  manifest: ModuleManifest | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ModuleManifestDrawer({ manifest, isOpen, onClose }: ModuleManifestDrawerProps) {
  const [activeTab, setActiveTab] = useState<'parsed' | 'json' | 'validation'>('parsed');
  const [copied, setCopied] = useState(false);

  if (!manifest) return null;

  const validationResult = validateManifest(manifest);

  const handleCopyJSON = () => {
    const jsonString = JSON.stringify(manifest, null, 2);
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className={styles.overlay} onClick={onClose} />}

      {/* Drawer */}
      <div className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{manifest.name}</h2>
            <p className={styles.subtitle}>Module ID: {manifest.id}</p>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'parsed' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('parsed')}
          >
            Thông tin chi tiết
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'validation' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('validation')}
          >
            Validation
            {!validationResult.valid && (
              <span className={styles.tabBadgeError}>{validationResult.errors.length}</span>
            )}
            {validationResult.valid && validationResult.warnings.length > 0 && (
              <span className={styles.tabBadgeWarning}>{validationResult.warnings.length}</span>
            )}
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'json' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('json')}
          >
            Raw JSON
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {activeTab === 'parsed' ? (
            <div className={styles.parsed}>
              {/* Basic Info */}
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Thông tin cơ bản</h3>
                <div className={styles.grid}>
                  <div className={styles.field}>
                    <label>Module ID</label>
                    <div className={styles.value}>{manifest.id}</div>
                  </div>
                  <div className={styles.field}>
                    <label>Tên module</label>
                    <div className={styles.value}>{manifest.name}</div>
                  </div>
                  <div className={styles.field}>
                    <label>Version</label>
                    <div className={styles.value}>{manifest.version}</div>
                  </div>
                  <div className={styles.field}>
                    <label>Base Path</label>
                    <div className={styles.value}>{manifest.basePath}</div>
                  </div>
                  <div className={styles.field}>
                    <label>Entry Point</label>
                    <div className={styles.value}>{manifest.entry}</div>
                  </div>
                  <div className={styles.field}>
                    <label>Routes File</label>
                    <div className={styles.value}>{manifest.routes}</div>
                  </div>
                  <div className={styles.field}>
                    <label>Route Export</label>
                    <div className={styles.value}>{manifest.routeExport}</div>
                  </div>
                </div>
              </section>

              {/* UI Config */}
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Cấu hình UI</h3>
                <div className={styles.grid}>
                  <div className={styles.field}>
                    <label>Menu Label</label>
                    <div className={styles.value}>{manifest.ui.menuLabel}</div>
                  </div>
                  <div className={styles.field}>
                    <label>Menu Path</label>
                    <div className={styles.value}>{manifest.ui.menuPath}</div>
                  </div>
                </div>
              </section>

              {/* Permissions */}
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Permissions ({manifest.permissions.length})</h3>
                <div className={styles.permissions}>
                  {manifest.permissions.map((perm, idx) => (
                    <span key={idx} className={styles.badge}>
                      {perm}
                    </span>
                  ))}
                </div>
              </section>

              {/* Release Info */}
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Release Information</h3>
                <div className={styles.grid}>
                  <div className={styles.field}>
                    <label>Release Type</label>
                    <div className={styles.value}>
                      <span className={styles.badgeRelease}>{manifest.release.type}</span>
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label>Release Notes</label>
                    <div className={styles.value}>{manifest.release.notes}</div>
                  </div>
                  {manifest.release.breaking.length > 0 && (
                    <div className={styles.field}>
                      <label>Breaking Changes</label>
                      <div className={styles.breakingChanges}>
                        {manifest.release.breaking.map((change, idx) => (
                          <div key={idx} className={styles.breakingItem}>
                            <AlertCircle size={16} />
                            <span>{change}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Compatibility */}
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Compatibility</h3>
                <div className={styles.grid}>
                  <div className={styles.field}>
                    <label>Min App Version</label>
                    <div className={styles.value}>{manifest.compat.minAppVersion}</div>
                  </div>
                  <div className={styles.field}>
                    <label>Max App Version</label>
                    <div className={styles.value}>{manifest.compat.maxAppVersion}</div>
                  </div>
                </div>
              </section>

              {/* Runtime Status */}
              {manifest.enabled !== undefined && (
                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>Runtime Status</h3>
                  <div className={styles.grid}>
                    <div className={styles.field}>
                      <label>Status</label>
                      <div className={styles.value}>
                        {manifest.enabled ? (
                          <span className={styles.statusEnabled}>
                            <CheckCircle2 size={16} />
                            Enabled
                          </span>
                        ) : (
                          <span className={styles.statusDisabled}>
                            <AlertCircle size={16} />
                            Disabled
                          </span>
                        )}
                      </div>
                    </div>
                    {manifest.installedAt && (
                      <div className={styles.field}>
                        <label>Installed At</label>
                        <div className={styles.value}>
                          {new Date(manifest.installedAt).toLocaleString('vi-VN')}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>
          ) : activeTab === 'validation' ? (
            <ManifestValidationPanel result={validationResult} moduleName={manifest.name} />
          ) : (
            <div className={styles.jsonView}>
              <div className={styles.jsonHeader}>
                <span className={styles.jsonTitle}>module.json</span>
                <Button variant="outline" size="sm" onClick={handleCopyJSON}>
                  {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                  {copied ? 'Đã copy' : 'Copy JSON'}
                </Button>
              </div>
              <pre className={styles.jsonContent}>
                {JSON.stringify(manifest, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </>
  );
}