import React, { ReactNode, isValidElement } from 'react';
import { LucideIcon } from 'lucide-react';

/**
 * Safely renders an icon that could be either:
 * - A Lucide Icon component type (function or forwardRef object)
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

  // 1. If it's already a React Element (e.g., <Icon />), clone it with new props
  if (isValidElement(icon)) {
    return React.cloneElement(icon as React.ReactElement, props);
  }
  
  // 2. If it's a component type (function or object with render/$$typeof), render it
  // Lucide icons can be functions or ForwardRef objects depending on build
  if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null)) {
    const IconComponent = icon as React.ElementType;
    return <IconComponent {...props} />;
  }
  
  // 3. Fallback for primitive types (though unlikely for icons)
  return icon;
}
