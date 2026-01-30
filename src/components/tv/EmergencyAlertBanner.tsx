import React, { useState, useEffect, useMemo } from 'react';
import { AlertTriangle, X, MapPin, TrendingUp, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTvData } from '@/contexts/TvDataContext';

interface Alert {
  id: string;
  location: string;
  province: string;
  riskScore: number;
  previousRiskScore: number;
  incidentCount: number;
  timeDetected: string;
  severity: 'critical' | 'high';
  reason: string;
}

export default function EmergencyAlertBanner() {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const { filteredHotspots } = useTvData();

  // Generate alerts using useMemo to prevent infinite loops
  const alerts = useMemo(() => {
    // Group hotspots by location
    const locationMap = new Map<string, any[]>();
    
    filteredHotspots.forEach(hotspot => {
      const key = `${hotspot.dia_ban.ward}, ${hotspot.dia_ban.province}`;
      if (!locationMap.has(key)) {
        locationMap.set(key, []);
      }
      locationMap.get(key)!.push(hotspot);
    });

    // Find locations with sudden risk spikes
    const emergencyAlerts: Alert[] = [];
    
    locationMap.forEach((hotspots, location) => {
      const totalRiskScore = hotspots.reduce((sum, h) => sum + h.risk_score, 0);
      const avgRiskScore = totalRiskScore / hotspots.length;
      
      // If average risk score is high (>75) and there are multiple incidents
      if (avgRiskScore > 75 && hotspots.length >= 3) {
        const latestHotspot = hotspots[0];
        emergencyAlerts.push({
          id: `alert-${latestHotspot.id}`,
          location: latestHotspot.dia_ban.ward,
          province: latestHotspot.dia_ban.province,
          riskScore: Math.round(avgRiskScore),
          previousRiskScore: Math.round(avgRiskScore * 0.6), // Simulate previous lower score
          incidentCount: hotspots.length,
          timeDetected: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          severity: avgRiskScore > 85 ? 'critical' : 'high',
          reason: hotspots.length > 5 
            ? 'Phát hiện cụm vi phạm tập trung bất thường'
            : 'Mức độ nghiêm trọng vi phạm tăng đột biến',
        });
      }
    });

    // Sort by risk score
    emergencyAlerts.sort((a, b) => b.riskScore - a.riskScore);
    
    // If no alerts from real data, show mock alerts for demo
    if (emergencyAlerts.length === 0) {
      const currentTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      return [
        {
          id: 'alert-demo-1',
          location: 'Phường Bến Nghé',
          province: 'TP. Hồ Chí Minh',
          riskScore: 92,
          previousRiskScore: 58,
          incidentCount: 7,
          timeDetected: currentTime,
          severity: 'critical' as const,
          reason: 'Phát hiện cụm vi phạm tập trung bất thường về hàng giả, hàng nhái',
        },
      ];
    }
    
    return emergencyAlerts.slice(0, 1); // Only show 1 critical alert
  }, [filteredHotspots]);

  if (!isVisible || alerts.length === 0) return null;

  const handleCloseAlert = (alertId: string) => {
    setIsVisible(false);
  };

  return (
    <>
      {/* Alert Banner */}
      <div 
        className="fixed left-1/2"
        style={{
          top: '130px', // Tăng từ 70px lên 130px vì có thêm rotation bar
          transform: 'translateX(-50%)',
          maxWidth: '900px',
          width: '90%',
          animation: 'slideInDown 0.4s ease-out',
          zIndex: 10000,
        }}
      >
        <div 
          className="bg-card border-2 shadow-lg"
          style={{
            borderColor: 'var(--destructive)',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'rgba(217, 45, 32, 0.08)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 24px rgba(217, 45, 32, 0.3)',
          }}
        >
          {alerts.map((alert, index) => (
            <div
              key={alert.id}
              className="flex items-center gap-4 p-4"
              style={{
                borderBottom: index < alerts.length - 1 ? '1px solid rgba(217, 45, 32, 0.2)' : 'none',
              }}
            >
              {/* Alert Icon */}
              <div 
                className="flex items-center justify-center animate-pulse"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(217, 45, 32, 0.15)',
                }}
              >
                <AlertTriangle style={{ width: '28px', height: '28px', color: 'var(--destructive)' }} />
              </div>

              {/* Alert Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span 
                    className="text-foreground"
                    style={{ 
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-bold)',
                    }}
                  >
                    CẢNH BÁO NGUY CẤP
                  </span>
                  <span
                    className="px-2 py-0.5"
                    style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                      backgroundColor: alert.severity === 'critical' ? '#dc2626' : '#ea580c',
                      color: 'white',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    {alert.severity === 'critical' ? 'KHẨN CẤP' : 'CAO'}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin style={{ width: '14px', height: '14px' }} />
                    <span style={{ fontSize: 'var(--text-xs)' }}>
                      {alert.location}, {alert.province}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <TrendingUp style={{ width: '14px', height: '14px', color: '#ef4444' }} />
                    <span style={{ fontSize: 'var(--text-xs)' }}>
                      Rủi ro: {alert.previousRiskScore} → {alert.riskScore}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock style={{ width: '14px', height: '14px' }} />
                    <span style={{ fontSize: 'var(--text-xs)' }}>
                      {alert.timeDetected}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setSelectedAlert(alert)}
                  style={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-weight-medium)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#dc2626';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ef4444';
                  }}
                >
                  Xem chi tiết
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCloseAlert(alert.id)}
                >
                  <X style={{ width: '16px', height: '16px' }} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedAlert && (
        <div 
          className="fixed inset-0 flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 10001,
          }}
          onClick={() => setSelectedAlert(null)}
        >
          <div 
            className="bg-card border border-border shadow-xl"
            style={{
              borderRadius: 'var(--radius-lg)',
              maxWidth: '700px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div 
              className="flex items-center justify-between p-6 border-b border-border"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.05)',
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="flex items-center justify-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  }}
                >
                  <AlertTriangle style={{ width: '24px', height: '24px', color: '#ef4444' }} />
                </div>
                <div>
                  <h3 
                    className="text-foreground"
                    style={{ 
                      fontSize: 'var(--text-lg)',
                      fontWeight: 'var(--font-weight-bold)',
                    }}
                  >
                    Chi tiết cảnh báo nguy cấp
                  </h3>
                  <p 
                    className="text-muted-foreground"
                    style={{ fontSize: 'var(--text-xs)' }}
                  >
                    Cp nhật lúc: {selectedAlert.timeDetected}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedAlert(null)}
              >
                <X style={{ width: '20px', height: '20px' }} />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Location & Severity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p 
                    className="text-muted-foreground mb-2"
                    style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)' }}
                  >
                    Địa bàn
                  </p>
                  <div className="flex items-center gap-2">
                    <MapPin style={{ width: '16px', height: '16px', color: 'var(--muted-foreground)' }} />
                    <p 
                      className="text-foreground"
                      style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}
                    >
                      {selectedAlert.location}, {selectedAlert.province}
                    </p>
                  </div>
                </div>

                <div>
                  <p 
                    className="text-muted-foreground mb-2"
                    style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)' }}
                  >
                    Mức độ nguy hiểm
                  </p>
                  <div
                    className="inline-flex items-center px-3 py-1.5"
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-bold)',
                      backgroundColor: selectedAlert.severity === 'critical' ? '#dc2626' : '#ea580c',
                      color: 'white',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    {selectedAlert.severity === 'critical' ? 'KHẨN CẤP' : 'CAO'}
                  </div>
                </div>
              </div>

              {/* Risk Score */}
              <div>
                <p 
                  className="text-muted-foreground mb-2"
                  style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)' }}
                >
                  Chỉ số rủi ro
                </p>
                <div className="flex items-center gap-4">
                  <div>
                    <p 
                      className="text-muted-foreground"
                      style={{ fontSize: 'var(--text-xs)' }}
                    >
                      Trước đó
                    </p>
                    <p 
                      className="text-foreground tabular-nums"
                      style={{ fontSize: '28px', fontWeight: 'var(--font-weight-bold)' }}
                    >
                      {selectedAlert.previousRiskScore}
                    </p>
                  </div>
                  <TrendingUp style={{ width: '24px', height: '24px', color: '#ef4444' }} />
                  <div>
                    <p 
                      className="text-muted-foreground"
                      style={{ fontSize: 'var(--text-xs)' }}
                    >
                      Hiện tại
                    </p>
                    <p 
                      className="tabular-nums"
                      style={{ 
                        fontSize: '28px', 
                        fontWeight: 'var(--font-weight-bold)',
                        color: '#ef4444',
                      }}
                    >
                      {selectedAlert.riskScore}
                    </p>
                  </div>
                  <div 
                    className="ml-auto px-3 py-1"
                    style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-bold)',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    +{Math.round(((selectedAlert.riskScore - selectedAlert.previousRiskScore) / selectedAlert.previousRiskScore) * 100)}%
                  </div>
                </div>
              </div>

              {/* Incident Count */}
              <div>
                <p 
                  className="text-muted-foreground mb-2"
                  style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)' }}
                >
                  Số vi phạm phát hiện
                </p>
                <p 
                  className="text-foreground tabular-nums"
                  style={{ fontSize: '32px', fontWeight: 'var(--font-weight-bold)' }}
                >
                  {selectedAlert.incidentCount}
                  <span 
                    className="text-muted-foreground"
                    style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)' }}
                  >
                    {' '}vi phạm
                  </span>
                </p>
              </div>

              {/* Reason */}
              <div>
                <p 
                  className="text-muted-foreground mb-2"
                  style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)' }}
                >
                  Lý do cảnh báo
                </p>
                <p 
                  className="text-foreground"
                  style={{ fontSize: 'var(--text-sm)' }}
                >
                  {selectedAlert.reason}
                </p>
              </div>

              {/* Recommendations */}
              <div 
                className="p-4 border border-border"
                style={{
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(59, 130, 246, 0.05)',
                }}
              >
                <p 
                  className="text-foreground mb-3"
                  style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)' }}
                >
                  Khuyến nghị hành động
                </p>
                <ul className="space-y-2">
                  <li 
                    className="text-foreground flex items-start gap-2"
                    style={{ fontSize: 'var(--text-sm)' }}
                  >
                    <span style={{ color: '#3b82f6' }}>•</span>
                    <span>Triển khai đoàn kiểm tra tăng cường tại địa bàn</span>
                  </li>
                  <li 
                    className="text-foreground flex items-start gap-2"
                    style={{ fontSize: 'var(--text-sm)' }}
                  >
                    <span style={{ color: '#3b82f6' }}>•</span>
                    <span>Phối hợp với lực lượng chức năng địa phương</span>
                  </li>
                  <li 
                    className="text-foreground flex items-start gap-2"
                    style={{ fontSize: 'var(--text-sm)' }}
                  >
                    <span style={{ color: '#3b82f6' }}>•</span>
                    <span>Tăng cường giám sát và thu thập chứng cứ</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div 
              className="flex items-center justify-end gap-3 p-6 border-t border-border"
              style={{
                backgroundColor: 'var(--muted)',
              }}
            >
              <Button
                variant="outline"
                onClick={() => setSelectedAlert(null)}
              >
                Đóng
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  setSelectedAlert(null);
                  window.location.href = '/ban-do-dieu-hanh';
                }}
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                }}
              >
                <ExternalLink style={{ width: '16px', height: '16px', marginRight: '6px' }} />
                Xem trên bản đồ
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
