/**
 * CATALOG SCHEMA PAGE - Cấu hình schema cho danh mục
 * Permission: sa.masterdata.catalog.update (để enable nút lưu)
 */

import React, { useState } from 'react';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { PermissionGate, ModuleShell, usePermissions } from '../../_shared';
import { MOCK_CATALOGS, MOCK_CATALOG_SCHEMAS } from '../mock-data';
import type { CatalogSchemaField } from '../types';
import styles from './CatalogSchemaPage.module.css';

export default function CatalogSchemaPage() {
  const { catalogKey } = useParams<{ catalogKey: string }>();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  const canUpdate = hasPermission('sa.masterdata.catalog.update');

  const catalog = MOCK_CATALOGS.find(c => c.key === catalogKey);
  const schemaData = MOCK_CATALOG_SCHEMAS[catalogKey || ''];

  const [fields, setFields] = useState<CatalogSchemaField[]>(schemaData?.fields || []);

  if (!catalog) {
    return (
      <ModuleShell title="Không tìm thấy danh mục">
        <p>Danh mục không tồn tại.</p>
      </ModuleShell>
    );
  }

  if (!catalog.hasSchema) {
    return (
      <ModuleShell title={catalog.name}>
        <p>Danh mục này không sử dụng schema tùy chỉnh.</p>
      </ModuleShell>
    );
  }

  const handleAddField = () => {
    const newField: CatalogSchemaField = {
      key: `field_${Date.now()}`,
      label: 'Trường mới',
      type: 'text',
      required: false
    };
    setFields([...fields, newField]);
  };

  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const getTypeLabel = (type: CatalogSchemaField['type']) => {
    switch (type) {
      case 'text': return 'Văn bản';
      case 'number': return 'Số';
      case 'boolean': return 'Đúng/Sai';
      case 'date': return 'Ngày tháng';
      case 'select': return 'Danh sách';
    }
  };

  return (
    <PermissionGate permission="sa.masterdata.catalog.read">
      <ModuleShell
        title={`Schema: ${catalog.name}`}
        subtitle="Cấu hình cấu trúc dữ liệu metadata cho các mục trong danh mục"
        breadcrumbs={[
          { label: 'Trang chủ', path: '/' },
          { label: 'Quản trị hệ thống', path: '/system-admin' },
          { label: 'Dữ liệu nền', path: '/system-admin/master-data' },
          { label: 'Danh mục', path: '/system-admin/master-data/catalogs' },
          { label: catalog.name, path: `/system-admin/master-data/catalogs/${catalog.key}/items` },
          { label: 'Schema' }
        ]}
        actions={
          <>
            <button
              className={styles.buttonSecondary}
              onClick={() => navigate(`/system-admin/master-data/catalogs/${catalog.key}/items`)}
            >
              <ArrowLeft size={18} />
              Quay lại
            </button>
            <button
              className={styles.buttonPrimary}
              disabled={!canUpdate}
            >
              <Save size={18} />
              Lưu schema
            </button>
          </>
        }
      >
        {/* Schema Info */}
        <div className={styles.infoCard}>
          <h3>Thông tin Schema</h3>
          <p>
            Schema định nghĩa cấu trúc dữ liệu metadata cho các mục trong danh mục{' '}
            <strong>{catalog.name}</strong>. Mỗi mục trong danh mục sẽ có các trường metadata
            theo schema này.
          </p>
          <p className={styles.lastUpdated}>
            Cập nhật lần cuối: {schemaData?.updatedAt ? new Date(schemaData.updatedAt).toLocaleString('vi-VN') : 'Chưa có'}
          </p>
        </div>

        {/* Fields List */}
        <div className={styles.fieldsSection}>
          <div className={styles.fieldsHeader}>
            <h3>Danh sách trường ({fields.length})</h3>
            <button
              className={styles.buttonSecondary}
              onClick={handleAddField}
              disabled={!canUpdate}
            >
              <Plus size={18} />
              Thêm trường
            </button>
          </div>

          {fields.length === 0 ? (
            <div className={styles.emptyFields}>
              <p>Chưa có trường nào. Click "Thêm trường" để bắt đầu.</p>
            </div>
          ) : (
            <div className={styles.fieldsList}>
              {fields.map((field, index) => (
                <div key={field.key} className={styles.fieldCard}>
                  <div className={styles.fieldHeader}>
                    <div className={styles.fieldBadge}>{index + 1}</div>
                    <div className={styles.fieldInfo}>
                      <div className={styles.fieldKey}>{field.key}</div>
                      <div className={styles.fieldLabel}>{field.label}</div>
                    </div>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleRemoveField(index)}
                      disabled={!canUpdate}
                    >
                      <Trash2 size={16} className="text-destructive" />
                    </button>
                  </div>
                  <div className={styles.fieldDetails}>
                    <div className={styles.fieldDetail}>
                      <span className={styles.detailLabel}>Loại:</span>
                      <span className={styles.typeBadge}>{getTypeLabel(field.type)}</span>
                    </div>
                    <div className={styles.fieldDetail}>
                      <span className={styles.detailLabel}>Bắt buộc:</span>
                      <span className={field.required ? styles.requiredYes : styles.requiredNo}>
                        {field.required ? 'Có' : 'Không'}
                      </span>
                    </div>
                    {field.defaultValue !== undefined && (
                      <div className={styles.fieldDetail}>
                        <span className={styles.detailLabel}>Giá trị mặc định:</span>
                        <span>{String(field.defaultValue)}</span>
                      </div>
                    )}
                    {field.options && field.options.length > 0 && (
                      <div className={styles.fieldDetail}>
                        <span className={styles.detailLabel}>Tùy chọn:</span>
                        <span>{field.options.map(o => o.label).join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ModuleShell>
    </PermissionGate>
  );
}
