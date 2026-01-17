import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

/**
 * Safely renders an icon that could be either:
 * - A Lucide Icon component type (function)
 * - Already rendered JSX (ReactNode)
 * - undefined/null
 * 
 * This prevents "Objects are not valid as a React child" errors
 */
export function renderIcon(
  icon: ReactNode | LucideIcon | undefined,
  props?: { className?: string; size?: number }
): ReactNode {
  if (!icon) return null;
  
  // Check if icon is a React component (function)
  if (typeof icon === 'function') {
    const IconComponent = icon as LucideIcon;
    return <IconComponent {...props} />;
  }
  
  // Otherwise, icon is already rendered JSX - return as is
  return icon;
}
