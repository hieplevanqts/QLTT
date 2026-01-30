/**
 * DEMO USAGE - Ví dụ sử dụng Form Criteria Templates & Export Jobs Templates
 * 
 * File này chứa các ví dụ code để demo cách sử dụng
 * form criteria templates và export jobs templates trong các components khác
 */

import React, { useState } from 'react';
import { 
  ALL_FORM_TEMPLATES, 
  FormTemplate,
  getTemplateById, 
  getTemplateByCode,
  getActiveTemplates 
} from './formCriteriaTemplates';
import { FormCriteriaModal } from '../components/FormCriteriaModal';

// Import Export Jobs Templates
import {
  SAMPLE_EXPORT_JOBS,
  ExportJob,
  getStatusBadgeStyle,
  getSourceTypeBadgeStyle,
  getSourceTypeLabel,
  isDownloadable,
  isRetryable,
  getProcessingTime,
  getDownloadCountLabel,
} from './exportJobsTemplates';

// ============================================================================
// FORM CRITERIA DEMOS
// ============================================================================

/**
 * DEMO 1: Hiển thị danh sách templates
 */
export const TemplateListDemo = () => {
  const templates = ALL_FORM_TEMPLATES;

  return (
    <div>
      <h2>Danh sách Biểu mẫu</h2>
      <ul>
        {templates.map((template) => (
          <li key={template.id}>
            <strong>{template.name}</strong> ({template.code})
            <br />
            Số tiêu chí: {template.criteria.length}
            <br />
            Trạng thái: {template.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
          </li>
        ))}
      </ul>
    </div>
  );
};

/**
 * DEMO 2: Xem chi tiết một template
 */
export const TemplateDetailDemo = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewTemplate = (templateId: string) => {
    const template = getTemplateById(templateId);
    if (template) {
      setSelectedTemplate(template);
      setShowModal(true);
    }
  };

  return (
    <div>
      <h2>Xem Chi tiết Template</h2>
      <button onClick={() => handleViewTemplate('TEMP_001')}>
        Xem Template: Kiểm tra Hàng giả
      </button>
      <button onClick={() => handleViewTemplate('TEMP_002')}>
        Xem Template: ATVS Thực phẩm
      </button>
      <button onClick={() => handleViewTemplate('TEMP_003')}>
        Xem Template: Xăng dầu
      </button>

      {showModal && selectedTemplate && (
        <FormCriteriaModal
          template={selectedTemplate}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

/**
 * DEMO 3: Filter templates theo status
 */
export const FilteredTemplatesDemo = () => {
  const activeTemplates = getActiveTemplates();

  return (
    <div>
      <h2>Templates Đang Hoạt động</h2>
      <p>Tổng số: {activeTemplates.length}</p>
      <ul>
        {activeTemplates.map((template) => (
          <li key={template.id}>{template.name}</li>
        ))}
      </ul>
    </div>
  );
};

/**
 * DEMO 4: Duyệt qua criteria của một template
 */
export const CriteriaListDemo = () => {
  const template = getTemplateByCode('KT_HANG_GIA');

  if (!template) return <div>Template không tồn tại</div>;

  return (
    <div>
      <h2>{template.name}</h2>
      <p>{template.description}</p>
      <h3>Danh sách tiêu chí ({template.criteria.length}):</h3>
      <ol>
        {template.criteria.map((criterion) => (
          <li key={criterion.id}>
            <strong>{criterion.name}</strong> ({criterion.code})
            <br />
            <em>{criterion.description}</em>
            <br />
            Loại: {criterion.inputType} | {criterion.required}
            <br />
            Quy tắc: {criterion.completionRule}
          </li>
        ))}
      </ol>
    </div>
  );
};

/**
 * DEMO 5: Tạo form động từ template
 */
export const DynamicFormDemo = () => {
  const template = getTemplateByCode('KT_ATVSTP');
  const [formData, setFormData] = useState<Record<string, any>>({});

  if (!template) return null;

  const handleInputChange = (criterionCode: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [criterionCode]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    alert('Dữ liệu đã được gửi! Xem console.');
  };

  return (
    <div>
      <h2>Form Kiểm tra: {template.name}</h2>
      <form onSubmit={handleSubmit}>
        {template.criteria.map((criterion) => (
          <div key={criterion.id} style={{ marginBottom: '20px' }}>
            <label>
              <strong>
                {criterion.order}. {criterion.name}
              </strong>
              {criterion.required === 'BẮT BUỘC' && <span style={{ color: 'red' }}> *</span>}
            </label>
            <p style={{ fontSize: '0.9em', color: '#666' }}>{criterion.description}</p>

            {/* Render input dựa trên inputType */}
            {criterion.inputType === 'CHECKBOX' && (
              <input
                type="checkbox"
                onChange={(e) => handleInputChange(criterion.code, e.target.checked)}
              />
            )}

            {criterion.inputType === 'TEXT_INPUT' && (
              <input
                type="text"
                onChange={(e) => handleInputChange(criterion.code, e.target.value)}
                style={{ width: '100%', padding: '8px' }}
              />
            )}

            {criterion.inputType === 'TEXTAREA' && (
              <textarea
                onChange={(e) => handleInputChange(criterion.code, e.target.value)}
                style={{ width: '100%', padding: '8px', minHeight: '80px' }}
              />
            )}

            {criterion.inputType === 'NUMBER_INPUT' && (
              <input
                type="number"
                onChange={(e) => handleInputChange(criterion.code, parseInt(e.target.value))}
                style={{ width: '100%', padding: '8px' }}
              />
            )}

            {criterion.inputType === 'DROPDOWN' && criterion.options && (
              <select
                onChange={(e) => handleInputChange(criterion.code, e.target.value)}
                style={{ width: '100%', padding: '8px' }}
              >
                <option value="">-- Chọn --</option>
                {criterion.options.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}

            {criterion.inputType === 'RADIO' && criterion.options && (
              <div>
                {criterion.options.map((option, idx) => (
                  <label key={idx} style={{ display: 'block', marginBottom: '5px' }}>
                    <input
                      type="radio"
                      name={criterion.code}
                      value={option}
                      onChange={(e) => handleInputChange(criterion.code, e.target.value)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}

            <small style={{ color: '#999' }}>Quy tắc: {criterion.completionRule}</small>
          </div>
        ))}

        <button type="submit" style={{ padding: '10px 20px', background: '#005cb6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Gửi
        </button>
      </form>
    </div>
  );
};

/**
 * DEMO 6: Statistics về templates
 */
export const TemplateStatsDemo = () => {
  const templates = ALL_FORM_TEMPLATES;
  const totalCriteria = templates.reduce((sum, t) => sum + t.criteria.length, 0);
  const requiredCriteria = templates.reduce(
    (sum, t) => sum + t.criteria.filter((c) => c.required === 'BẮT BUỘC').length,
    0
  );

  return (
    <div>
      <h2>Thống kê Templates</h2>
      <ul>
        <li>Tổng số templates: {templates.length}</li>
        <li>Tổng số tiêu chí: {totalCriteria}</li>
        <li>Tiêu chí bắt buộc: {requiredCriteria}</li>
        <li>Tiêu chí tùy chọn: {totalCriteria - requiredCriteria}</li>
        <li>
          Templates đang hoạt động:{' '}
          {templates.filter((t) => t.status === 'active').length}
        </li>
      </ul>

      <h3>Chi tiết theo template:</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Tên</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Mã</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Số tiêu chí</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Bắt buộc</th>
          </tr>
        </thead>
        <tbody>
          {templates.map((template) => (
            <tr key={template.id}>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{template.name}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                <code>{template.code}</code>
              </td>
              <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
                {template.criteria.length}
              </td>
              <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
                {template.criteria.filter((c) => c.required === 'BẮT BUỘC').length}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * DEMO 7: Search criteria
 */
export const SearchCriteriaDemo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Array<{ template: FormTemplate; criterion: any }>>([]);

  const handleSearch = () => {
    const searchResults: Array<{ template: FormTemplate; criterion: any }> = [];

    ALL_FORM_TEMPLATES.forEach((template) => {
      template.criteria.forEach((criterion) => {
        if (
          criterion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          criterion.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          criterion.code.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          searchResults.push({ template, criterion });
        }
      });
    });

    setResults(searchResults);
  };

  return (
    <div>
      <h2>Tìm kiếm Tiêu chí</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Nhập từ khóa..."
        style={{ width: '300px', padding: '8px', marginRight: '10px' }}
      />
      <button onClick={handleSearch} style={{ padding: '8px 16px' }}>
        Tìm kiếm
      </button>

      <h3>Kết quả ({results.length}):</h3>
      {results.map((result, idx) => (
        <div
          key={idx}
          style={{
            border: '1px solid #ddd',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '4px',
          }}
        >
          <strong>{result.criterion.name}</strong> ({result.criterion.code})
          <br />
          <em>Template: {result.template.name}</em>
          <br />
          {result.criterion.description}
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// EXPORT JOBS DEMOS
// ============================================================================

/**
 * DEMO 8: Hiển thị danh sách các công việc xuất khẩu
 */
export const ExportJobsListDemo = () => {
  const exportJobs = SAMPLE_EXPORT_JOBS;

  return (
    <div>
      <h2>Danh sách Công việc Xuất khẩu</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>ID</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Tên</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Nguồn</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Trạng thái</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Thời gian xử lý</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Lượt tải về</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {exportJobs.map((job) => (
            <tr key={job.id}>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{job.id}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{job.name}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                <span
                  style={getSourceTypeBadgeStyle(job.sourceType)}
                >
                  {getSourceTypeLabel(job.sourceType)}
                </span>
              </td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                <span
                  style={getStatusBadgeStyle(job.status)}
                >
                  {job.status}
                </span>
              </td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                {getProcessingTime(job)}
              </td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                {getDownloadCountLabel(job)}
              </td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                {isDownloadable(job) && (
                  <button
                    style={{ padding: '5px 10px', background: '#005cb6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Tải về
                  </button>
                )}
                {isRetryable(job) && (
                  <button
                    style={{ padding: '5px 10px', background: '#ff9900', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Thử lại
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
