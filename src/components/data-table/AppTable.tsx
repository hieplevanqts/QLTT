import React from "react";
import { Table } from "antd";
import type { TableProps } from "antd";

export type AppTableProps<T> = TableProps<T> & {
  toolbar?: React.ReactNode;
};

export default function AppTable<T extends object>(props: AppTableProps<T>) {
  const {
    toolbar,
    bordered = true,
    size = "middle",
    pagination,
    showSorterTooltip = true,
    ...rest
  } = props;

  const mergedPagination =
    pagination === false
      ? false
      : {
          pageSizeOptions: [10, 20, 50],
          showSizeChanger: true,
          ...pagination,
        };

  return (
    <div className="app-table">
      {toolbar ? <div className="app-table__toolbar">{toolbar}</div> : null}
      <Table
        bordered={bordered}
        size={size}
        showSorterTooltip={showSorterTooltip}
        pagination={mergedPagination}
        {...rest}
      />
    </div>
  );
}
