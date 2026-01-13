import React, { useState } from 'react';
import {
  Search,
  Filter,
  Check,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Info,
  TrendingUp,
  Database,
  FileText,
  Activity,
  History,
} from 'lucide-react';
import styles from './AdminPage.module.css';

// TAB 1.4: MA TRẬN QUYỀN - REDESIGNED
export const PermissionsTabNew = () => {
  const [selectedModule, setSelectedModule] = useState('report-dashboard');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [searchAction, setSearchAction] = useState('');

  // Module definitions
  const modules = [
    { id: 'report-dashboard', name: 'Report & Dashboard', icon: TrendingUp },
    { id: 'master-data', name: 'Master Data', icon: Database },
    { id: 'templates', name: 'Templates', icon: FileText },
    { id: 'jobs-monitor', name: 'Jobs Monitor', icon: Activity },
    { id: 'audit-log', name: 'Audit Log', icon: History },
  ];

  // Role definitions
  const roles = [
    { id: 'hq-admin', name: 'HQ Admin / Director' },
    { id: 'provincial-admin', name: 'Provincial Admin / Ops' },
    { id: 'analyst', name: 'Analyst / Reporter' },
    { id: 'supervisor', name: 'Supervisor' },
    { id: 'viewer', name: 'Viewer' },
  ];

  // Permission levels
  const permissionLevels = [
    { id: 'full', label: 'Full', icon: Check, color: '#10b981' },
    { id: 'limited', label: 'Limited', icon: AlertTriangle, color: '#f59e0b' },
    { id: 'no-access', label: 'No Access', icon: XCircle, color: '#94a3b8' },
  ];

  // Permissions data structure for each module
  const permissionsData: Record<string, Array<{
    action: string;
    permissions: Record<string, 'full' | 'limited' | 'no-access'>;
  }>> = {
    'report-dashboard': [
      { action: 'View Dashboard Overview', permissions: { 'hq-admin': 'full', 'provincial-admin': 'full', 'analyst': 'full', 'supervisor': 'limited', 'viewer': 'limited' } },
      { action: 'Export Dashboard Data', permissions: { 'hq-admin': 'full', 'provincial-admin': 'full', 'analyst': 'limited', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'Create Custom Reports', permissions: { 'hq-admin': 'full', 'provincial-admin': 'full', 'analyst': 'full', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'Schedule Reports', permissions: { 'hq-admin': 'full', 'provincial-admin': 'limited', 'analyst': 'limited', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'Share Reports', permissions: { 'hq-admin': 'full', 'provincial-admin': 'full', 'analyst': 'limited', 'supervisor': 'limited', 'viewer': 'no-access' } },
      { action: 'Manage Report Templates', permissions: { 'hq-admin': 'full', 'provincial-admin': 'no-access', 'analyst': 'no-access', 'supervisor': 'no-access', 'viewer': 'no-access' } },
    ],
    'master-data': [
      { action: 'View Master Data', permissions: { 'hq-admin': 'full', 'provincial-admin': 'full', 'analyst': 'full', 'supervisor': 'limited', 'viewer': 'limited' } },
      { action: 'Create Master Data', permissions: { 'hq-admin': 'full', 'provincial-admin': 'limited', 'analyst': 'no-access', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'Edit Master Data', permissions: { 'hq-admin': 'full', 'provincial-admin': 'limited', 'analyst': 'no-access', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'Delete Master Data', permissions: { 'hq-admin': 'full', 'provincial-admin': 'no-access', 'analyst': 'no-access', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'Import Bulk Data', permissions: { 'hq-admin': 'full', 'provincial-admin': 'limited', 'analyst': 'no-access', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'Export Master Data', permissions: { 'hq-admin': 'full', 'provincial-admin': 'full', 'analyst': 'full', 'supervisor': 'limited', 'viewer': 'no-access' } },
    ],
    'templates': [
      { action: 'View Templates', permissions: { 'hq-admin': 'full', 'provincial-admin': 'full', 'analyst': 'full', 'supervisor': 'full', 'viewer': 'full' } },
      { action: 'Create Templates', permissions: { 'hq-admin': 'full', 'provincial-admin': 'full', 'analyst': 'limited', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'Edit Templates', permissions: { 'hq-admin': 'full', 'provincial-admin': 'full', 'analyst': 'limited', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'Delete Templates', permissions: { 'hq-admin': 'full', 'provincial-admin': 'limited', 'analyst': 'no-access', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'Publish Templates', permissions: { 'hq-admin': 'full', 'provincial-admin': 'no-access', 'analyst': 'no-access', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'Archive Templates', permissions: { 'hq-admin': 'full', 'provincial-admin': 'limited', 'analyst': 'no-access', 'supervisor': 'no-access', 'viewer': 'no-access' } },
    ],
    'jobs-monitor': [
      { action: 'View Job Status', permissions: { 'hq-admin': 'full', 'provincial-admin': 'full', 'analyst': 'full', 'supervisor': 'limited', 'viewer': 'limited' } },
      { action: 'Start/Stop Jobs', permissions: { 'hq-admin': 'full', 'provincial-admin': 'limited', 'analyst': 'no-access', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'View Job Logs', permissions: { 'hq-admin': 'full', 'provincial-admin': 'full', 'analyst': 'limited', 'supervisor': 'limited', 'viewer': 'no-access' } },
      { action: 'Configure Jobs', permissions: { 'hq-admin': 'full', 'provincial-admin': 'no-access', 'analyst': 'no-access', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'Retry Failed Jobs', permissions: { 'hq-admin': 'full', 'provincial-admin': 'limited', 'analyst': 'no-access', 'supervisor': 'no-access', 'viewer': 'no-access' } },
    ],
    'audit-log': [
      { action: 'View Audit Logs', permissions: { 'hq-admin': 'full', 'provincial-admin': 'limited', 'analyst': 'limited', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'Export Audit Logs', permissions: { 'hq-admin': 'full', 'provincial-admin': 'no-access', 'analyst': 'no-access', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'Search Audit History', permissions: { 'hq-admin': 'full', 'provincial-admin': 'limited', 'analyst': 'limited', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'View User Activities', permissions: { 'hq-admin': 'full', 'provincial-admin': 'limited', 'analyst': 'no-access', 'supervisor': 'no-access', 'viewer': 'no-access' } },
      { action: 'Archive Old Logs', permissions: { 'hq-admin': 'full', 'provincial-admin': 'no-access', 'analyst': 'no-access', 'supervisor': 'no-access', 'viewer': 'no-access' } },
    ],
  };

  // Get current module permissions
  const currentPermissions = permissionsData[selectedModule] || [];

  // Filter permissions based on search and filters
  const filteredPermissions = currentPermissions.filter(perm => {
    // Search filter
    if (searchAction && !perm.action.toLowerCase().includes(searchAction.toLowerCase())) {
      return false;
    }

    // Permission level filter
    if (selectedLevels.length > 0) {
      const hasMatchingLevel = Object.values(perm.permissions).some(level => 
        selectedLevels.includes(level)
      );
      if (!hasMatchingLevel) return false;
    }

    return true;
  });

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedRole('all');
    setSelectedLevels([]);
    setSearchAction('');
  };

  // Toggle permission level in multi-select
  const togglePermissionLevel = (levelId: string) => {
    setSelectedLevels(prev => 
      prev.includes(levelId) 
        ? prev.filter(l => l !== levelId)
        : [...prev, levelId]
    );
  };

  // Get permission badge
  const getPermissionBadge = (level: 'full' | 'limited' | 'no-access', roleId: string) => {
    const config = permissionLevels.find(p => p.id === level);
    if (!config) return null;

    const Icon = config.icon;
    const isHighlighted = selectedRole === 'all' || selectedRole === roleId;

    return (
      <div 
        style={{ 
          background: level === 'full' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
                      level === 'limited' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 
                      'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
          color: level === 'no-access' ? 'var(--muted-foreground, #64748b)' : '#ffffff',
          opacity: isHighlighted ? 1 : 0.5,
          fontFamily: 'Inter, sans-serif',
          fontSize: '11px',
          fontWeight: 600,
          padding: '6px 10px',
          borderRadius: 'var(--radius-sm, 4px)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          whiteSpace: 'nowrap',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.2s ease',
        }}
        title={level === 'limited' ? 'Giới hạn theo phạm vi địa bàn được gán. Chỉ áp dụng cho dữ liệu thuộc scope. Không bao gồm dữ liệu nhạy cảm.' : undefined}
      >
        <Icon size={11} />
        <span>{config.label}</span>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', gap: 'var(--spacing-5, 20px)', height: 'calc(100vh - 280px)' }}>
      {/* LEFT SIDEBAR - MODULE LIST */}
      <div style={{ 
        width: '240px', 
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-4, 16px)',
      }}>
        <div>
          <h3 style={{ 
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--muted-foreground)',
            marginBottom: 'var(--spacing-3, 12px)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            System Modules
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2, 8px)' }}>
          {modules.map(module => {
            const Icon = module.icon;
            const isActive = selectedModule === module.id;
            
            return (
              <button
                key={module.id}
                onClick={() => setSelectedModule(module.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-3, 12px)',
                  padding: 'var(--spacing-3, 12px) var(--spacing-4, 16px)',
                  background: isActive ? 'linear-gradient(135deg, var(--primary, #005cb6) 0%, #004a94 100%)' : 'var(--card, #ffffff)',
                  color: isActive ? '#ffffff' : 'var(--foreground)',
                  border: `1px solid ${isActive ? 'transparent' : 'var(--border)'}`,
                  borderRadius: 'var(--radius, 6px)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500,
                  textAlign: 'left',
                  boxShadow: isActive ? '0 4px 12px rgba(0, 92, 182, 0.2)' : '0 1px 2px rgba(0, 0, 0, 0.05)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--accent, rgba(0, 92, 182, 0.05))';
                    e.currentTarget.style.borderColor = 'var(--primary, #005cb6)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--card, #ffffff)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }
                }}
              >
                <Icon size={16} />
                <span>{module.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT MAIN CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* HEADER */}
        <div style={{ marginBottom: 'var(--spacing-4, 16px)' }}>
          <h2 style={{ 
            fontFamily: 'Inter, sans-serif', 
            fontSize: '20px', 
            fontWeight: 700, 
            color: 'var(--foreground)',
            margin: '0 0 6px 0',
          }}>
            Ma trận quyền - {modules.find(m => m.id === selectedModule)?.name}
          </h2>
          <p style={{ 
            fontFamily: 'Inter, sans-serif', 
            fontSize: '13px', 
            color: 'var(--muted-foreground)',
            margin: 0,
          }}>
            Tra cứu phân quyền theo module và vai trò (Read-only)
          </p>
        </div>

        {/* FILTER BAR */}
        <div style={{
          background: 'var(--card, #ffffff)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius, 6px)',
          padding: 'var(--spacing-4, 16px)',
          marginBottom: 'var(--spacing-4, 16px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-4, 16px)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}>
          {/* Filter by Role */}
          <div>
            <label style={{ 
              display: 'block',
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--muted-foreground)',
              marginBottom: 'var(--spacing-2, 8px)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Role Filter
            </label>
            <select 
              className={styles.select}
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              style={{ width: '100%', fontFamily: 'Inter, sans-serif', fontSize: '13px' }}
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>

          {/* Search by Action */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ 
              display: 'block',
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--muted-foreground)',
              marginBottom: 'var(--spacing-2, 8px)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Search Action
            </label>
            <div className={styles.searchBox} style={{ margin: 0 }}>
              <Search size={16} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search by function or action name..." 
                className={styles.searchInput}
                value={searchAction}
                onChange={(e) => setSearchAction(e.target.value)}
                style={{ paddingLeft: '36px', fontFamily: 'Inter, sans-serif', fontSize: '13px' }}
              />
            </div>
          </div>

          {/* Reset Filters */}
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button 
              className={styles.secondaryBtn}
              onClick={handleResetFilters}
              style={{ whiteSpace: 'nowrap', width: '100%', fontFamily: 'Inter, sans-serif', fontSize: '13px' }}
            >
              <RefreshCw size={14} /> Reset
            </button>
          </div>
        </div>

        {/* FILTER CHIPS - Permission Levels */}
        <div style={{ 
          display: 'flex', 
          gap: 'var(--spacing-2, 8px)', 
          marginBottom: 'var(--spacing-4, 16px)',
          flexWrap: 'wrap',
        }}>
          <span style={{ 
            fontFamily: 'Inter, sans-serif', 
            fontSize: '11px', 
            fontWeight: 600, 
            color: 'var(--muted-foreground)',
            display: 'flex',
            alignItems: 'center',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Permission Level:
          </span>
          {permissionLevels.map(level => {
            const isSelected = selectedLevels.includes(level.id);
            const Icon = level.icon;
            return (
              <button
                key={level.id}
                onClick={() => togglePermissionLevel(level.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  background: isSelected ? level.color : 'var(--card, #ffffff)',
                  color: isSelected ? '#ffffff' : 'var(--foreground)',
                  border: `1.5px solid ${isSelected ? level.color : 'var(--border)'}`,
                  borderRadius: 'var(--radius-full, 20px)',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                }}
              >
                <Icon size={12} />
                {level.label}
              </button>
            );
          })}
        </div>

        {/* PERMISSIONS MATRIX TABLE */}
        <div style={{ 
          flex: 1, 
          overflow: 'auto', 
          border: '1px solid var(--border)', 
          borderRadius: 'var(--radius, 6px)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          background: 'var(--card, #ffffff)',
        }}>
          <table className={styles.table} style={{ minWidth: '800px' }}>
            <thead>
              <tr style={{ background: 'var(--muted, rgba(0, 0, 0, 0.02))' }}>
                <th style={{ 
                  width: '280px', 
                  position: 'sticky', 
                  left: 0, 
                  background: 'var(--muted, rgba(0, 0, 0, 0.02))', 
                  zIndex: 2,
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: 'var(--foreground)',
                }}>
                  Function / Action
                </th>
                {roles.map(role => (
                  <th 
                    key={role.id}
                    style={{ 
                      minWidth: '140px',
                      background: selectedRole === role.id ? 'rgba(0, 92, 182, 0.08)' : 'var(--muted, rgba(0, 0, 0, 0.02))',
                      fontWeight: selectedRole === role.id ? 700 : 600,
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '12px',
                      textAlign: 'center',
                      borderLeft: selectedRole === role.id ? '2px solid var(--primary, #005cb6)' : 'none',
                    }}
                  >
                    {role.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPermissions.length === 0 ? (
                <tr>
                  <td colSpan={roles.length + 1} style={{ textAlign: 'center', padding: '3rem', fontFamily: 'Inter, sans-serif', color: 'var(--muted-foreground)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2, 8px)' }}>
                      <Filter size={32} style={{ opacity: 0.3 }} />
                      <span>No results match your filters</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPermissions.map((perm, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ 
                      fontFamily: 'Inter, sans-serif', 
                      fontWeight: 500,
                      fontSize: '13px',
                      position: 'sticky',
                      left: 0,
                      background: 'var(--card, #ffffff)',
                      zIndex: 1,
                    }}>
                      {perm.action}
                    </td>
                    {roles.map(role => (
                      <td 
                        key={role.id}
                        style={{ 
                          textAlign: 'center',
                          background: selectedRole === role.id ? 'rgba(0, 92, 182, 0.02)' : 'transparent',
                          borderLeft: selectedRole === role.id ? '2px solid var(--primary, #005cb6)' : 'none',
                        }}
                      >
                        {getPermissionBadge(perm.permissions[role.id], role.id)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER INFO */}
        <div style={{
          marginTop: 'var(--spacing-4, 16px)',
          padding: 'var(--spacing-3, 12px) var(--spacing-4, 16px)',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.05) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          borderRadius: 'var(--radius-sm, 4px)',
          fontFamily: 'Inter, sans-serif',
          fontSize: '12px',
          color: 'var(--foreground)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 'var(--spacing-3, 12px)',
        }}>
          <Info size={16} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: '#f59e0b' }}>Limited Access:</strong> Giới hạn theo phạm vi địa bàn được gán. Chỉ áp dụng cho dữ liệu thuộc scope của người dùng. Không bao gồm truy cập vào dữ liệu nhạy cảm hoặc ngoài phạm vi quản lý.
          </div>
        </div>
      </div>
    </div>
  );
};
