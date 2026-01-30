import React, { useMemo } from 'react';
import { Users, MapPin, Shield, AlertTriangle, DollarSign, FileText, CheckCircle, GraduationCap, TrendingUp, X } from 'lucide-react';
import { teamsData, Team } from '@/utils/data/officerTeamData';
import styles from './OfficerStatsOverlay.module.css';

interface OfficerStatsOverlayProps {
  selectedTeamId?: string;
  isVisible?: boolean;
  onClose?: () => void;
}

export function OfficerStatsOverlay({ selectedTeamId, isVisible = true, onClose }: OfficerStatsOverlayProps) {
  const selectedTeam = teamsData.find(t => t.id === selectedTeamId);

  // Calculate statistics for selected team or all teams
  const statistics = useMemo(() => {
    const teamsToCalculate = selectedTeamId && selectedTeam 
      ? [selectedTeam] 
      : teamsData;
    
    const allOfficers = teamsToCalculate.flatMap(team => team.officers);
    
    // Aggregate statistics
    const totalInspections = allOfficers.reduce((sum, officer) => sum + officer.criteria.totalInspections, 0);
    const totalViolations = allOfficers.reduce((sum, officer) => sum + officer.criteria.violationsCaught, 0);
    const totalFines = allOfficers.reduce((sum, officer) => sum + officer.criteria.finesIssued, 0);
    const totalFineAmount = allOfficers.reduce((sum, officer) => sum + officer.criteria.totalFineAmount, 0);
    const totalComplaints = allOfficers.reduce((sum, officer) => sum + officer.criteria.complaintsResolved, 0);
    const totalEducationSessions = allOfficers.reduce((sum, officer) => sum + officer.criteria.educationSessions, 0);
    
    // Get unique districts and wards
    const uniqueDistricts = new Set<string>();
    const uniqueWards = new Set<string>();
    teamsToCalculate.forEach(team => {
      team.managedWards.forEach(ward => {
        uniqueDistricts.add(ward.district);
        uniqueWards.add(ward.name);
      });
    });
    
    // Get team leader
    const teamLeader = selectedTeam 
      ? selectedTeam.officers.find(o => o.isTeamLeader) || selectedTeam.officers[0]
      : null;
    
    return {
      totalTeams: teamsToCalculate.length,
      totalOfficers: allOfficers.length,
      teamLeader,
      totalWards: uniqueWards.size,
      totalDistricts: uniqueDistricts.size,
      totalInspections,
      totalViolations,
      totalFines,
      totalFineAmount,
      totalComplaints,
      totalEducationSessions,
      violationRate: totalInspections > 0 ? ((totalViolations / totalInspections) * 100).toFixed(1) : '0',
      avgFineAmount: totalFines > 0 ? (totalFineAmount / totalFines).toFixed(0) : '0',
    };
  }, [selectedTeamId, selectedTeam]);

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          {selectedTeamId ? 'Thống kê đội' : 'Thống kê tổng quan'}
        </h3>
        {onClose && (
          <button className={styles.closeButton} onClick={onClose} aria-label="Đóng">
            <X size={14} />
          </button>
        )}
      </div>

      <div className={styles.content}>
        {/* Quick Stats Grid */}
        <div className={styles.quickStats}>
          <div className={styles.statCard}>
            <Users size={14} className={styles.statIcon} />
            <div className={styles.statContent}>
              <div className={styles.statValue}>{statistics.totalTeams}</div>
              <div className={styles.statLabel}>Đội</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <Users size={14} className={styles.statIcon} style={{ color: '#28a745' }} />
            <div className={styles.statContent}>
              <div className={styles.statValue} style={{ color: '#28a745' }}>
                {statistics.totalOfficers}
              </div>
              <div className={styles.statLabel}>Cán bộ</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <MapPin size={14} className={styles.statIcon} style={{ color: '#dc3545' }} />
            <div className={styles.statContent}>
              <div className={styles.statValue} style={{ color: '#dc3545' }}>
                {statistics.totalWards}
              </div>
              <div className={styles.statLabel}>Địa bàn</div>
            </div>
          </div>
        </div>

        {/* Team Leader (if selected) */}
        {statistics.teamLeader && (
          <div className={styles.teamLeaderCard}>
            <div className={styles.teamLeaderHeader}>
              <Shield size={14} />
              <span>Đội trưởng</span>
            </div>
            <div className={styles.teamLeaderName}>{statistics.teamLeader.fullName}</div>
            <div className={styles.teamLeaderContact}>
              {statistics.teamLeader.phone} • {statistics.teamLeader.yearsOfService} năm
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        <div className={styles.metricsSection}>
          <div className={styles.metricRow}>
            <FileText size={12} className={styles.metricIcon} />
            <span className={styles.metricLabel}>Kiểm tra</span>
            <span className={styles.metricValue}>{statistics.totalInspections.toLocaleString('vi-VN')}</span>
          </div>

          <div className={styles.metricRow}>
            <AlertTriangle size={12} className={styles.metricIcon} style={{ color: '#dc3545' }} />
            <span className={styles.metricLabel}>Vi phạm</span>
            <span className={styles.metricValue} style={{ color: '#dc3545' }}>
              {statistics.totalViolations.toLocaleString('vi-VN')}
            </span>
          </div>

          <div className={styles.metricRow}>
            <TrendingUp size={12} className={styles.metricIcon} style={{ color: '#ffc107' }} />
            <span className={styles.metricLabel}>Tỷ lệ VP</span>
            <span className={styles.metricValue} style={{ color: '#ffc107' }}>
              {statistics.violationRate}%
            </span>
          </div>

          <div className={styles.metricRow}>
            <DollarSign size={12} className={styles.metricIcon} style={{ color: '#28a745' }} />
            <span className={styles.metricLabel}>Tiền phạt</span>
            <span className={styles.metricValue} style={{ color: '#28a745' }}>
              {(statistics.totalFineAmount / 1000000).toFixed(1)}M
            </span>
          </div>

          <div className={styles.metricRow}>
            <CheckCircle size={12} className={styles.metricIcon} style={{ color: '#17a2b8' }} />
            <span className={styles.metricLabel}>Khiếu nại</span>
            <span className={styles.metricValue} style={{ color: '#17a2b8' }}>
              {statistics.totalComplaints.toLocaleString('vi-VN')}
            </span>
          </div>

          <div className={styles.metricRow}>
            <GraduationCap size={12} className={styles.metricIcon} style={{ color: '#6f42c1' }} />
            <span className={styles.metricLabel}>Tập huấn</span>
            <span className={styles.metricValue} style={{ color: '#6f42c1' }}>
              {statistics.totalEducationSessions.toLocaleString('vi-VN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

