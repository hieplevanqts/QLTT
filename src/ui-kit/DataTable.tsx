import React, { ReactNode } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../app/components/ui/table';
import { Button } from '../app/components/ui/button';
import { Checkbox } from '../app/components/ui/checkbox';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => ReactNode;
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
  sortColumn,
  sortDirection,
  onSort,
}: DataTableProps<T>) {
  const allSelected = data.length > 0 && data.every((item) => selectedRows.has(getRowId(item)));

  return (
    <div className="rounded-lg overflow-hidden">
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
              <TableHead key={column.key}>
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

              return (
                <TableRow
                  key={rowId}
                  className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
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
                    <TableCell key={column.key}>
                      {column.render
                        ? column.render(item)
                        : String((item as any)[column.key] ?? '')}
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