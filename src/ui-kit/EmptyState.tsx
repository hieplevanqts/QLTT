import React, { ReactNode } from 'react';
import { FileQuestion, TriangleAlert, Ban, Info } from 'lucide-react';
import { Button } from '../app/components/ui/button';

interface EmptyStateProps {
  type?: 'empty' | 'error' | 'no-permission' | 'info';
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: ReactNode;
}

const typeIcons = {
  empty: FileQuestion,
  error: TriangleAlert,
  'no-permission': Ban,
  info: Info,
};

const typeColors = {
  empty: 'text-muted-foreground',
  error: 'text-destructive',
  'no-permission': 'text-chart-5',
  info: 'text-primary',
};

function EmptyState({
  type = 'empty',
  title,
  description,
  action,
  icon,
}: EmptyStateProps) {
  const Icon = icon ? null : typeIcons[type];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {icon || (Icon && <Icon className={`h-16 w-16 ${typeColors[type]} mb-4`} />)}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground text-center max-w-md mb-6">
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Named export
export { EmptyState };

// Default export for backward compatibility
export default EmptyState;