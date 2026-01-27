import React, { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  breadcrumbs?: { label: string; href?: string }[];
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  actions?: ReactNode;
}

export default function PageHeader({ breadcrumbs, title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.container}>
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className={styles.breadcrumbs}>
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className={styles.breadcrumbItem}>
                {index > 0 && <ChevronRight className={styles.chevron} />}
                {crumb.href ? (
                  <Link to={crumb.href} className={styles.breadcrumbLink}>
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={styles.breadcrumbActive}>{crumb.label}</span>
                )}
              </div>
            ))}
          </nav>
        )}

        {/* Title and Actions */}
        <div className={styles.titleRow}>
          <div className={styles.titleGroup}>
            <h1 className={styles.title}>{title}</h1>
            {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      </div>
    </div>
  );
}
