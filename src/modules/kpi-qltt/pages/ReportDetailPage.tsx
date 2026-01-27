/**
 * ReportDetailPage - Trang chi tiết báo cáo
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Calendar, User, MapPin, FileText } from 'lucide-react';
import { reportService } from '../services/reportService';
import { Report } from '../data/mock';
import { ExportCsvButton } from '../components/ExportCsvButton';
import styles from './ReportDetailPage.module.css';

export const ReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    if (id) {
      const data = reportService.getReportById(id);
      setReport(data);
    }
  }, [id]);

  const handleBack = () => {
    navigate('/kpi/list');
  };

  const handleExport = () => {
    if (report) {
      const blob = reportService.exportReportToCSV(report);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${report.id}_${report.title}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Nháp';
      case 'completed': return 'Hoàn thành';
      case 'archived': return 'Lưu trữ';
      default: return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'draft': return styles.statusDraft;
      case 'completed': return styles.statusCompleted;
      case 'archived': return styles.statusArchived;
      default: return '';
    }
  };

  if (!report) {
    return (
      <div className={styles.notFound}>
        <h2>Không tìm thấy báo cáo</h2>
        <button onClick={handleBack} className={styles.backButton}>
          <ArrowLeft size={18} />
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className={styles.reportDetailPage}>
      <div className={styles.header}>
        <button onClick={handleBack} className={styles.backButton}>
          <ArrowLeft size={18} />
          Quay lại
        </button>
        
        <ExportCsvButton onClick={handleExport} />
      </div>

      <div className={styles.reportCard}>
        <div className={styles.reportHeader}>
          <div>
            <h1 className={styles.title}>{report.title}</h1>
            <div className={styles.meta}>
              <span className={`${styles.statusBadge} ${getStatusClass(report.status)}`}>
                {getStatusLabel(report.status)}
              </span>
              <span className={styles.metaText}>ID: {report.id}</span>
            </div>
          </div>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>
              <FileText size={20} />
            </div>
            <div className={styles.infoContent}>
              <div className={styles.infoLabel}>Mẫu báo cáo</div>
              <div className={styles.infoValue}>{report.templateName}</div>
            </div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>
              <MapPin size={20} />
            </div>
            <div className={styles.infoContent}>
              <div className={styles.infoLabel}>Địa bàn</div>
              <div className={styles.infoValue}>{report.location}</div>
            </div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>
              <User size={20} />
            </div>
            <div className={styles.infoContent}>
              <div className={styles.infoLabel}>Người tạo</div>
              <div className={styles.infoValue}>{report.createdBy}</div>
            </div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>
              <Calendar size={20} />
            </div>
            <div className={styles.infoContent}>
              <div className={styles.infoLabel}>Ngày tạo</div>
              <div className={styles.infoValue}>{formatDate(report.createdAt)}</div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Thông tin chi tiết</h2>
          <div className={styles.detailGrid}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Tỉnh/Thành phố:</span>
              <span className={styles.detailValue}>{report.province}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Chuyên đề:</span>
              <span className={styles.detailValue}>{report.topic}</span>
            </div>
            {report.completedAt && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Ngày hoàn thành:</span>
                <span className={styles.detailValue}>{formatDate(report.completedAt)}</span>
              </div>
            )}
          </div>
        </div>

        {Object.keys(report.data).length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Dữ liệu báo cáo</h2>
            <div className={styles.dataGrid}>
              {Object.entries(report.data).map(([key, value]) => (
                <div key={key} className={styles.dataCard}>
                  <div className={styles.dataLabel}>{key}</div>
                  <div className={styles.dataValue}>
                    {typeof value === 'number' 
                      ? new Intl.NumberFormat('vi-VN').format(value)
                      : String(value)
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {Object.keys(report.data).length === 0 && (
          <div className={styles.emptyData}>
            <p>Báo cáo chưa có dữ liệu</p>
          </div>
        )}
      </div>
    </div>
  );
};
