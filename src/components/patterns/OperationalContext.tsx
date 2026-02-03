import React from 'react';
import { Building2, MapPin, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OperationalContextProps {
  unit?: string;
  jurisdiction?: string;
  onEdit?: () => void;
}

export default function OperationalContext({ 
  unit = 'Chi cục QLTT Phường 1', 
  jurisdiction = 'Phường 1',
  onEdit 
}: OperationalContextProps) {
  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 16px',
        backgroundColor: 'var(--muted)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Building2 size={16} style={{ color: 'var(--primary)' }} />
        <span style={{ 
          fontSize: 'var(--text-sm)', 
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--foreground)'
        }}>
          {unit}
        </span>
      </div>
      
      <div style={{ 
        width: '1px', 
        height: '16px', 
        backgroundColor: 'var(--border)' 
      }} />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <MapPin size={16} style={{ color: 'var(--primary)' }} />
        <span style={{ 
          fontSize: 'var(--text-sm)', 
          color: 'var(--muted-foreground)'
        }}>
          {jurisdiction}
        </span>
      </div>

      {onEdit && (
        <>
          <div style={{ 
            width: '1px', 
            height: '16px', 
            backgroundColor: 'var(--border)' 
          }} />
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onEdit}
            style={{ height: '28px', padding: '0 8px' }}
          >
            <Edit2 size={14} />
          </Button>
        </>
      )}
    </div>
  );
}
