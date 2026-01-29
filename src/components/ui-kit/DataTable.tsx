import React, { ReactNode, isValidElement } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import styles from './DataTable.module.css';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => ReactNode;
  width?: string; // Fixed width (e.g., '140px', '200px')
  sticky?: 'left' | 'right'; // Sticky position
  className?: string; // Additional className
  truncate?: boolean; // Enable text truncation with ellipsis
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  selectable?: boolean;
  selectedRows?: Set<string | number>;
  onSelectRow?: (id: string | number) => void;
  onSelectAll?: (selected: boolean) => void;
  getRowId?: (item: T) => string | number;
  getRowClassName?: (item: T) => string;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
}

export function DataTableComponent<T>({
  columns,
  data,
  onRowClick,
  selectable = false,
  selectedRows = new Set(),
  onSelectRow,
  onSelectAll,
  getRowId = (item: any) => item.id,
  getRowClassName,
  sortColumn,
  sortDirection,
  onSort,
}: DataTableProps<T>) {
  const allSelected = data.length > 0 && data.every((item) => selectedRows.has(getRowId(item)));

  // Helper to get cell class names
  const getCellClassName = (column: Column<T>) => {
    const classes = [column.className || ''];
    
    if (column.sticky === 'right') {
      classes.push(styles.stickyRight);
    } else if (column.sticky === 'left') {
      classes.push(styles.stickyLeft);
    }
    
    if (column.truncate) {
      classes.push(styles.truncate);
    }
    
    return classes.filter(Boolean).join(' ');
  };

  // Helper to get cell inline styles
  const getCellStyle = (column: Column<T>): React.CSSProperties => {
    const style: React.CSSProperties = {};
    
    if (column.width) {
      style.width = column.width;
      style.minWidth = column.width;
      style.maxWidth = column.width;
    }
    
    return style;
  };

  // Helper to render cell content with tooltip for truncated text
  const renderCellContent = (column: Column<T>, item: T): ReactNode => {
    try {
      const content = column.render
        ? column.render(item)
        : String((item as any)[column.key] ?? '');

      // Safety check: ensure content is a valid ReactNode
      if (content === null || content === undefined) {
        return '';
      }

      // Check if content is a React element or valid ReactNode
      if (isValidElement(content) || typeof content === 'string' || typeof content === 'number') {
        if (column.truncate && typeof content === 'string') {
          return <span title={content}>{content}</span>;
        }
        return content;
      }

      // If content is an object, try to stringify it safely
      if (typeof content === 'object') {
        return String(content);
      }

      return String(content);
    } catch (error) {
      console.error('Error rendering cell content:', error);
      return '';
    }
  };

  return (
    <div className={styles.tableWrapper}>
      <Table>
        <TableHeader>
          <TableRow>
            {selectable && (
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onSelectAll}
                />
              </TableHead>
            )}
            {columns.map((column) => (
              <TableHead 
                key={column.key} 
                className={getCellClassName(column)}
                style={getCellStyle(column)}
              >
                {column.sortable && onSort ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-4 h-8"
                    onClick={() => onSort(column.key)}
                  >
                    {column.label}
                    {sortColumn === column.key ? (
                      sortDirection === 'asc' ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                      ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                      )
                    ) : (
                      <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                    )}
                  </Button>
                ) : (
                  column.label
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="h-24 text-center text-muted-foreground"
              >
                Không có dữ liệu
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => {
              const rowId = getRowId(item);
              const isSelected = selectedRows.has(rowId);
              const customClassName = getRowClassName ? getRowClassName(item) : '';

              return (
                <TableRow
                  key={rowId}
                  className={`${onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''} ${customClassName}`}
                  onClick={() => onRowClick?.(item)}
                >
                  {selectable && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onSelectRow?.(rowId)}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell 
                      key={column.key}
                      className={getCellClassName(column)}
                      style={getCellStyle(column)}
                    >
                      {renderCellContent(column, item)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export function DataTable<T>(
  props: DataTableProps<T>
) {
  return DataTableComponent(props);
}

// Default export for backward compatibility
export default DataTable;
