import React, { forwardRef, useState, useMemo } from 'react';
import { X, Check, Users, Search } from 'lucide-react';
import styles from './MapFilterPanel.module.css';
import teamStyles from './OfficerFilterPanel.module.css';
import { teamsData, Team } from '../../../data/officerTeamData';

interface OfficerFilterPanelProps {
  isOpen: boolean;
  selectedTeamId?: string;
  onClose: () => void;
  onTeamChange?: (teamId: string) => void;
}

export const OfficerFilterPanel = forwardRef<HTMLDivElement, OfficerFilterPanelProps>(
  ({ isOpen, selectedTeamId, onClose, onTeamChange }, ref) => {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter teams based on search query - MUST be before early return
    const filteredTeams = useMemo(() => {
      if (!searchQuery.trim()) return teamsData;
      const query = searchQuery.toLowerCase();
      return teamsData.filter(team => 
        team.name.toLowerCase().includes(query)
      );
    }, [searchQuery]);

    // Early return AFTER all hooks
    if (!isOpen) return null;

    const handleTeamSelect = (teamId: string) => {
      if (onTeamChange) {
        onTeamChange(teamId);
      }
    };

    return (
      <div className={styles.panel} ref={ref}>
        <div className={styles.header}>
          <h3 className={styles.title}>Bộ lọc cán bộ quản lý</h3>
          <button className={styles.closeButton} onClick={onClose} aria-label="Đóng">
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <div className={styles.scrollableContent}>
          {/* Team Filter Section */}
          <div className={styles.filterSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>Chọn đội</div>
            </div>
            
            {/* Search Box */}
            <div style={{ position: 'relative', marginTop: '12px', marginBottom: '12px' }}>
              <Search 
                size={16} 
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#999',
                  pointerEvents: 'none'
                }}
              />
              <input
                type="text"
                placeholder="Tìm kiếm đội..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  border: '1px solid #e9ecef',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#005cb6';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e9ecef';
                }}
              />
            </div>

            {/* Teams List */}
            <div 
              className={teamStyles.teamsListScroll}
              style={{
                maxHeight: 'calc(100vh - 300px)',
                overflowY: 'auto',
                marginTop: '8px'
              }}
            >
              {/* All Teams Option */}
              <div
                onClick={() => handleTeamSelect('')}
                style={{
                  padding: '12px 14px',
                  marginBottom: '6px',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  border: selectedTeamId === '' ? '2px solid #005cb6' : '1px solid #e9ecef',
                  background: selectedTeamId === '' 
                    ? 'linear-gradient(135deg, #e7f3ff 0%, #d0e7ff 100%)' 
                    : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.2s',
                  fontFamily: 'Inter, sans-serif',
                }}
                onMouseEnter={(e) => {
                  if (selectedTeamId !== '') {
                    e.currentTarget.style.background = '#f8f9fa';
                    e.currentTarget.style.borderColor = '#005cb6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedTeamId !== '') {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.borderColor = '#e9ecef';
                  }
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  border: selectedTeamId === '' ? '2px solid #005cb6' : '2px solid #ddd',
                  background: selectedTeamId === '' ? '#005cb6' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {selectedTeamId === '' && (
                    <Check size={12} color="white" strokeWidth={3} />
                  )}
                </div>
                <Users size={18} style={{ color: selectedTeamId === '' ? '#005cb6' : '#666', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: selectedTeamId === '' ? 600 : 500,
                    color: selectedTeamId === '' ? '#005cb6' : '#333',
                    marginBottom: '2px'
                  }}>
                    Tất cả các đội
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#666',
                  }}>
                    {teamsData.length} đội
                  </div>
                </div>
              </div>

              {/* Team List */}
              {filteredTeams.length > 0 ? (
                filteredTeams.map((team) => (
                  <div
                    key={team.id}
                    onClick={() => handleTeamSelect(team.id)}
                    style={{
                      padding: '12px 14px',
                      marginBottom: '6px',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      border: selectedTeamId === team.id ? '2px solid #005cb6' : '1px solid #e9ecef',
                      background: selectedTeamId === team.id 
                        ? 'linear-gradient(135deg, #e7f3ff 0%, #d0e7ff 100%)' 
                        : 'white',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.2s',
                      fontFamily: 'Inter, sans-serif',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedTeamId !== team.id) {
                        e.currentTarget.style.background = '#f8f9fa';
                        e.currentTarget.style.borderColor = '#005cb6';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedTeamId !== team.id) {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.borderColor = '#e9ecef';
                      }
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px',
                      border: selectedTeamId === team.id ? '2px solid #005cb6' : '2px solid #ddd',
                      background: selectedTeamId === team.id ? '#005cb6' : 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {selectedTeamId === team.id && (
                        <Check size={12} color="white" strokeWidth={3} />
                      )}
                    </div>
                    <Users size={18} style={{ color: selectedTeamId === team.id ? '#005cb6' : '#666', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: selectedTeamId === team.id ? 600 : 500,
                        color: selectedTeamId === team.id ? '#005cb6' : '#333',
                        marginBottom: '2px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {team.name}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: '#666',
                      }}>
                        {team.officers.length} cán bộ • {team.managedWards.length} địa bàn
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{
                  padding: '20px',
                  textAlign: 'center',
                  color: '#999',
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Không tìm thấy đội nào
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

OfficerFilterPanel.displayName = 'OfficerFilterPanel';
