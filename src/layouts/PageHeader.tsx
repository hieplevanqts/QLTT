import React, { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../app/components/ui/button';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  breadcrumbs?: { label: string; href?: string }[];
  title: string;
  actions?: ReactNode;
}

export default function PageHeader({ breadcrumbs, title, actions }: PageHeaderProps) {
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
          <h1 className={styles.title}>{title}</h1>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      </div>
    </div>
  );
}