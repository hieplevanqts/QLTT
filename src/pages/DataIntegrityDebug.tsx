/**
 * Data Integrity Debug Tool - MAPPA Portal
 * Tool to check and debug ward-province relationships
 * Helps identify data inconsistencies in the database
 */

import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, CheckCircle, Database, RefreshCw } from 'lucide-react';
import styles from './AdminPage.module.css';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface WardDebugInfo {
  id: string;
  code: string;
  name: string;
  provinceId: string;
  provinceName: string;
  provinceCode: string;
  expectedProvinceCode?: string;
  hasIssue?: boolean;
}

export default function DataIntegrityDebug() {
  const [searchCode, setSearchCode] = useState('');
  const [wardsData, setWardsData] = useState<WardDebugInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [allWards, setAllWards] = useState<WardDebugInfo[]>([]);
  const [showOnlyIssues, setShowOnlyIssues] = useState(false);

  // Load all wards on mount
  useEffect(() => {
    loadAllWards();
  }, []);

  const loadAllWards = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wards')
        .select(`
          id,
          code,
          name,
          provinceId,
          provinces (
            id,
            code,
            name
          )
        `)
        .order('code');

      if (error) throw error;

      const formattedData: WardDebugInfo[] = (data || []).map((ward: any) => ({
        id: ward.id,
        code: ward.code,
        name: ward.name,
        provinceId: ward.provinceId || ward.provinceid,
        provinceName: ward.provinces?.name || 'N/A',
        provinceCode: ward.provinces?.code || 'N/A',
      }));

      setAllWards(formattedData);
      setWardsData(formattedData);
    } catch (error: any) {
      console.error('❌ Error loading wards:', error);
      toast.error(`Lỗi tải dữ liệu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const searchWardByCode = async () => {
    if (!searchCode.trim()) {
      setWardsData(allWards);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wards')
        .select(`
          id,
          code,
          name,
          provinceId,
          provinces (
            id,
            code,
            name
          )
        `)
        .ilike('code', `%${searchCode}%`)
        .order('code');

      if (error) throw error;

      const formattedData: WardDebugInfo[] = (data || []).map((ward: any) => ({
        id: ward.id,
        code: ward.code,
        name: ward.name,
        provinceId: ward.provinceId || ward.provinceid,
        provinceName: ward.provinces?.name || 'N/A',
        provinceCode: ward.provinces?.code || 'N/A',
      }));

      setWardsData(formattedData);

      if (formattedData.length === 0) {
        toast.info('Không tìm thấy phường/xã nào');
      }
    } catch (error: any) {
      console.error('❌ Error searching wards:', error);
      toast.error(`Lỗi tìm kiếm: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const validateUsername = (wardCode: string, provinceCode: string) => {
    return `QT${provinceCode}${wardCode}_user`;
  };

  const filteredData = showOnlyIssues
    ? wardsData.filter((w) => w.hasIssue)
    : wardsData;

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Database size={28} style={{ color: 'var(--primary)' }} />
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 600, 
            margin: 0,
            fontFamily: 'var(--font-sans)',
          }}>
            Debug Data Integrity - Wards & Provinces
          </h1>
        </div>
        <p style={{ 
          color: 'var(--muted-foreground)', 
          margin: 0,
          fontSize: '14px',
        }}>
          Kiểm tra tính toàn vẹn dữ liệu giữa bảng Phường/Xã và Tỉnh/TP
        </p>
      </div>

      {/* Search */}
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        marginBottom: '20px',
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'var(--font-sans)',
            }}>
              Tìm theo mã Phường/Xã
            </label>
            <input
              type="text"
              className={styles.input}
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchWardByCode()}
              placeholder="VD: 004, 002, 103..."
              style={{ width: '100%' }}
            />
          </div>
          <button
            className={styles.primaryButton}
            onClick={searchWardByCode}
            disabled={loading}
            style={{ height: '40px', minWidth: '120px' }}
          >
            <Search size={16} />
            Tìm kiếm
          </button>
          <button
            className={styles.secondaryButton}
            onClick={loadAllWards}
            disabled={loading}
            style={{ height: '40px', minWidth: '120px' }}
          >
            <RefreshCw size={16} />
            Tải lại
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '20px',
      }}>
        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
        }}>
          <div style={{ 
            fontSize: '12px', 
            color: 'var(--muted-foreground)',
            marginBottom: '4px',
            fontFamily: 'var(--font-sans)',
          }}>
            Tổng số Phường/Xã
          </div>
          <div style={{ fontSize: '24px', fontWeight: 600 }}>
            {allWards.length}
          </div>
        </div>
        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
        }}>
          <div style={{ 
            fontSize: '12px', 
            color: 'var(--muted-foreground)',
            marginBottom: '4px',
            fontFamily: 'var(--font-sans)',
          }}>
            Kết quả tìm kiếm
          </div>
          <div style={{ fontSize: '24px', fontWeight: 600 }}>
            {wardsData.length}
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}>
        <div style={{
          overflowX: 'auto',
        }}>
          <table className={styles.dataTable} style={{ width: '100%', marginBottom: 0 }}>
            <thead>
              <tr>
                <th style={{ minWidth: '80px' }}>Mã PX</th>
                <th style={{ minWidth: '200px' }}>Tên Phường/Xã</th>
                <th style={{ minWidth: '100px' }}>Mã Tỉnh</th>
                <th style={{ minWidth: '200px' }}>Tên Tỉnh</th>
                <th style={{ minWidth: '200px' }}>Username Format</th>
                <th style={{ minWidth: '120px' }}>Province ID</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                    <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
                    <div style={{ marginTop: '12px', color: 'var(--muted-foreground)' }}>
                      Đang tải dữ liệu...
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                    <AlertTriangle size={24} style={{ color: 'var(--muted-foreground)' }} />
                    <div style={{ marginTop: '12px', color: 'var(--muted-foreground)' }}>
                      Không tìm thấy dữ liệu
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((ward) => (
                  <tr key={ward.id}>
                    <td>
                      <code style={{
                        background: 'var(--muted)',
                        padding: '4px 8px',
                        borderRadius: 'var(--radius)',
                        fontSize: '13px',
                        fontFamily: 'monospace',
                      }}>
                        {ward.code}
                      </code>
                    </td>
                    <td style={{ fontWeight: 500 }}>{ward.name}</td>
                    <td>
                      <code style={{
                        background: 'var(--muted)',
                        padding: '4px 8px',
                        borderRadius: 'var(--radius)',
                        fontSize: '13px',
                        fontFamily: 'monospace',
                      }}>
                        {ward.provinceCode}
                      </code>
                    </td>
                    <td>{ward.provinceName}</td>
                    <td>
                      <code style={{
                        background: 'var(--primary-foreground, #f0f9ff)',
                        color: 'var(--primary)',
                        padding: '4px 8px',
                        borderRadius: 'var(--radius)',
                        fontSize: '13px',
                        fontFamily: 'monospace',
                        fontWeight: 500,
                      }}>
                        {validateUsername(ward.code, ward.provinceCode)}
                      </code>
                    </td>
                    <td>
                      <code style={{
                        fontSize: '11px',
                        color: 'var(--muted-foreground)',
                        fontFamily: 'monospace',
                      }}>
                        {ward.provinceId}
                      </code>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instructions */}
      <div style={{
        marginTop: '24px',
        background: 'var(--muted)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: '12px',
        }}>
          <AlertTriangle size={20} style={{ color: 'var(--primary)', marginTop: '2px', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>
              Hướng dẫn kiểm tra:
            </div>
            <ol style={{ 
              margin: 0, 
              paddingLeft: '20px',
              fontSize: '14px',
              lineHeight: '1.6',
              color: 'var(--muted-foreground)',
            }}>
              <li>Tìm kiếm phường/xã theo mã (VD: tìm "004" để xem xã Dương Hưu)</li>
              <li>Kiểm tra cột "Mã Tỉnh" và "Tên Tỉnh" - đảm bảo phường thuộc đúng tỉnh</li>
              <li>Cột "Username Format" cho biết format username hợp lệ cho phường đó</li>
              <li>Nếu phát hiện data sai (VD: xã 004 thuộc sai tỉnh), cần sửa trong Supabase Table Editor</li>
              <li>Sửa bằng cách: Supabase Dashboard → Table "wards" → Tìm record → Sửa "provinceId"</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
