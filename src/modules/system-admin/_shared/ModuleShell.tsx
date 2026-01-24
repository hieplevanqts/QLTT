/**
 * MODULE SHELL - System Admin Shared
 * Layout wrapper cho các page trong System Admin module
 */

import React from 'react';
import styles from './ModuleShell.module.css';

interface ModuleShellProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; path?: string }>;
  children: React.ReactNode;
}

export function ModuleShell({
  title,
  subtitle,
  actions,
  breadcrumbs,
  children
}: ModuleShellProps) {
  return (
    <div className={styles.shell}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className={styles.breadcrumbs}>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className={styles.breadcrumbSeparator}>/</span>}
              {crumb.path ? (
                <a href={crumb.path} className={styles.breadcrumbLink}>
                  {crumb.label}
                </a>
              ) : (
                <span className={styles.breadcrumbCurrent}>{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>

      {/* Content */}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
