import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // Show all pages if 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.paginationInfo}>
        Hiển thị <strong>{startItem}</strong> - <strong>{endItem}</strong> trong tổng số <strong>{totalItems}</strong> bản ghi
      </div>
      
      <div className={styles.paginationControls}>
        <button
          className={styles.paginationButton}
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-label="Trang trước"
        >
          <ChevronLeft size={16} />
          Trước
        </button>
        
        <div className={styles.pageNumbers}>
          {getPageNumbers().map((page, index) => (
            typeof page === 'number' ? (
              <button
                key={index}
                className={`${styles.pageNumber} ${currentPage === page ? styles.pageNumberActive : ''}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            ) : (
              <span key={index} className={styles.pageEllipsis}>
                {page}
              </span>
            )
          ))}
        </div>
        
        <button
          className={styles.paginationButton}
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Trang sau"
        >
          Sau
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

// Hook to manage pagination state
export const usePagination = (items: any[] = [], itemsPerPage: number = 10) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  
  // Defensive check for items
  const safeItems = items || [];
  
  const totalPages = Math.ceil(safeItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = safeItems.slice(startIndex, endIndex);
  
  // Reset to page 1 if items change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [safeItems.length]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setCurrentPage(1);
  };
  
  return {
    currentPage,
    setCurrentPage,
    totalPages,
    currentItems,
    paginatedData: currentItems, // Alias for backwards compatibility
    totalItems: safeItems.length,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
  };
};