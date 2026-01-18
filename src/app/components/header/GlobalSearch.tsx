import React, { useState, useRef, useEffect } from 'react';
import { Search, Building2, FileText, TrendingUp, Calendar, ClipboardCheck, FolderOpen, X, Clock, AlertTriangle, FileSearch } from 'lucide-react';
import { 
  searchAllData, 
  getRecentSearches, 
  saveRecentSearch,
  SearchResult,
  SearchResultType
} from '../../../data/mockData';
import styles from './GlobalSearch.module.css';

const getResultIcon = (type: SearchResultType) => {
  const iconProps = { size: 18, className: styles.resultIcon };
  switch (type) {
    case 'facility':
      return <Building2 {...iconProps} />;
    case 'plan':
      return <Calendar {...iconProps} />;
    case 'lead':
      return <TrendingUp {...iconProps} />;
    case 'inspection-batch':
      return <ClipboardCheck {...iconProps} />;
    case 'inspection-session':
      return <ClipboardCheck {...iconProps} />;
    case 'legal-file':
      return <FileText {...iconProps} />;
    case 'violation-file':
      return <AlertTriangle {...iconProps} />;
    case 'evidence':
      return <FolderOpen {...iconProps} />;
    default:
      return <FileText {...iconProps} />;
  }
};

const getResultTypeLabel = (type: SearchResultType) => {
  switch (type) {
    case 'facility':
      return 'Cơ sở';
    case 'plan':
      return 'Kế hoạch';
    case 'lead':
      return 'Nguồn tin';
    case 'inspection-batch':
      return 'Đợt kiểm tra';
    case 'inspection-session':
      return 'Phiên kiểm tra';
    case 'legal-file':
      return 'Hồ sơ pháp lý';
    case 'violation-file':
      return 'Hồ sơ vi phạm';
    case 'evidence':
      return 'Gói chứng cứ';
    default:
      return '';
  }
};

// Helper function to highlight matched text
const highlightText = (text: string, query: string) => {
  if (!query.trim()) return text;
  
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <>
      {parts.map((part, index) => 
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={index} className={styles.highlight}>{part}</mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
};

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchAllData(searchQuery, 10);
      setFilteredResults(results);
    } else {
      setFilteredResults([]);
    }
  }, [searchQuery]);

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleClear = () => {
    setSearchQuery('');
    setFilteredResults([]);
  };

  const handleResultClick = (result: SearchResult) => {
    console.log('Navigate to:', result.url);
    // Save to recent searches
    saveRecentSearch(result);
    setRecentSearches(getRecentSearches());
    
    // TODO: Navigate to detail page
    // window.location.href = result.url;
    
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log('Search for all results:', searchQuery);
      // TODO: Navigate to search results page with query
      // window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const groupedResults = filteredResults.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  const hasRecentSearches = recentSearches.length > 0;

  return (
    <div className={styles.searchContainer} ref={searchRef}>
      <div className={styles.searchInputWrapper}>
        <Search className={styles.searchIcon} size={18} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Tìm cơ sở / hồ sơ / kế hoạch / đợt kiểm tra…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
        />
        {searchQuery && (
          <>
            <button 
              className={styles.searchButton} 
              onClick={handleSearch}
              title="Tìm kiếm"
            >
              <Search size={16} />
            </button>
            <button className={styles.clearButton} onClick={handleClear} title="Xóa">
              <X size={16} />
            </button>
          </>
        )}
      </div>

      {isOpen && (
        <div className={styles.searchDropdown}>
          {!searchQuery && (
            <>
              <div className={styles.dropdownHeader}>
                <Clock size={16} />
                <span>Tìm kiếm gần đây</span>
              </div>
              {hasRecentSearches ? (
                <>
                  {recentSearches.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      className={styles.searchResultItem}
                      onClick={() => handleResultClick(result)}
                    >
                      {getResultIcon(result.type)}
                      <div className={styles.resultContent}>
                        <div className={styles.resultTitle}>{result.title}</div>
                        {result.subtitle && (
                          <div className={styles.resultSubtitle}>{result.subtitle}</div>
                        )}
                      </div>
                      {result.code && <div className={styles.resultCode}>{result.code}</div>}
                    </button>
                  ))}
                </>
              ) : (
                <div className={styles.emptyState}>
                  Chưa có tìm kiếm gần đây
                </div>
              )}
            </>
          )}

          {searchQuery && filteredResults.length === 0 && (
            <div className={styles.noResults}>
              <FileSearch className={styles.noResultsIcon} size={48} />
              <div className={styles.noResultsTitle}>Không tìm thấy kết quả phù hợp</div>
              <div className={styles.noResultsSubtitle}>
                Thử tìm kiếm theo các danh mục sau:
              </div>
              <div className={styles.categoryList}>
                <button className={styles.categoryItem} onClick={() => setIsOpen(false)}>
                  <TrendingUp size={14} />
                  <span>Nguồn tin / Rủi ro</span>
                </button>
                <button className={styles.categoryItem} onClick={() => setIsOpen(false)}>
                  <Calendar size={14} />
                  <span>Kế hoạch tác nghiệp</span>
                </button>
                <button className={styles.categoryItem} onClick={() => setIsOpen(false)}>
                  <ClipboardCheck size={14} />
                  <span>Nhiệm vụ hiện trường</span>
                </button>
                <button className={styles.categoryItem} onClick={() => setIsOpen(false)}>
                  <FolderOpen size={14} />
                  <span>Kho chứng cứ</span>
                </button>
              </div>
            </div>
          )}

          {searchQuery && Object.keys(groupedResults).length > 0 && (
            <>
              {Object.entries(groupedResults).map(([type, results]) => (
                <div key={type}>
                  <div className={styles.groupHeader}>
                    {getResultTypeLabel(type as SearchResultType)} ({results.length})
                  </div>
                  {results.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      className={styles.searchResultItem}
                      onClick={() => handleResultClick(result)}
                    >
                      {getResultIcon(result.type)}
                      <div className={styles.resultContent}>
                        <div className={styles.resultTitle}>
                          {highlightText(result.title, searchQuery)}
                        </div>
                        {result.subtitle && (
                          <div className={styles.resultSubtitle}>
                            {highlightText(result.subtitle, searchQuery)}
                          </div>
                        )}
                      </div>
                      {result.code && (
                        <div className={styles.resultCode}>
                          {highlightText(result.code, searchQuery)}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </>
          )}

          {searchQuery && filteredResults.length > 0 && (
            <div className={styles.dropdownFooter}>
              <button className={styles.viewAllButton} onClick={handleSearch}>
                Xem tất cả {filteredResults.length} kết quả
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}