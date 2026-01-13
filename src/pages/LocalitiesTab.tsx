/**
 * Localities Tab - MAPPA Portal
 * Danh mục dùng chung với 3 tabs:
 * - Địa phương (Tỉnh/TP & Phường/Xã)
 * - Danh mục (Categories)
 * - Ngân hàng (Banks)
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState } from 'react';
import { MapPin, Tag, Building2 } from 'lucide-react';
import { LocationsTab } from './LocationsTab';
import { CategoriesTab } from './CategoriesTab';
import { BanksTab } from './BanksTab';
import styles from './AdminPage.module.css';

type LocalitiesSubTab = 'localities' | 'categories' | 'banks';

export const LocalitiesTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LocalitiesSubTab>('localities');

  const tabs = [
    { id: 'localities' as const, label: 'Địa phương', icon: MapPin },
    { id: 'categories' as const, label: 'Danh mục', icon: Tag },
    { id: 'banks' as const, label: 'Ngân hàng', icon: Building2 },
  ];

  return (
    <div className={styles.tabContentInner}>
      {/* Sub-tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '24px',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '0',
      }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'localities' && <LocationsTab />}
      {activeTab === 'categories' && <CategoriesTab />}
      {activeTab === 'banks' && <BanksTab />}
    </div>
  );
};

export default LocalitiesTab;