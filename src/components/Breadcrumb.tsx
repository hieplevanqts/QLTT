import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Breadcrumb.module.css';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
}

export function Breadcrumb({ items, showHome = true }: BreadcrumbProps) {
  const location = useLocation();

  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <ol className={styles.breadcrumbList}>
        {showHome && (
          <>
            <li className={styles.breadcrumbItem}>
              <Link to="/" className={styles.breadcrumbLink}>
                <Home size={14} />
                <span>Trang chủ</span>
              </Link>
            </li>
            <li className={styles.breadcrumbSeparator}>
              <ChevronRight size={14} />
            </li>
          </>
        )}
        
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isActive = item.path === location.pathname;

          return (
            <li key={index} className={styles.breadcrumbItem}>
              {!isLast && item.path ? (
                <>
                  <Link 
                    to={item.path} 
                    className={`${styles.breadcrumbLink} ${isActive ? styles.breadcrumbLinkActive : ''}`}
                  >
                    {item.label}
                  </Link>
                  <span className={styles.breadcrumbSeparator}>
                    <ChevronRight size={14} />
                  </span>
                </>
              ) : (
                <span className={styles.breadcrumbCurrent}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
