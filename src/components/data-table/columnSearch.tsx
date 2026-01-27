import React from "react";
import { Button, Input, Space } from "antd";
import type { InputRef } from "antd";
import type { ColumnType, FilterDropdownProps } from "antd/es/table/interface";
import { SearchOutlined } from "@ant-design/icons";

export type ColumnSearchState = {
  searchText: string;
  searchedColumn: string;
  setSearchText: (value: string) => void;
  setSearchedColumn: (value: string) => void;
  inputRef?: React.RefObject<InputRef>;
};

export type ColumnSearchOptions<DataType> = {
  placeholder?: string;
  normalize?: (value: unknown, record: DataType) => string;
  render?: (value: unknown, record: DataType) => React.ReactNode;
};

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const highlightText = (text: string, keyword: string) => {
  if (!keyword) return text;
  const regex = new RegExp(`(${escapeRegExp(keyword)})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, index) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <mark key={index} style={{ padding: 0, backgroundColor: "#ffe58f" }}>
        {part}
      </mark>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
};

export function getColumnSearchProps<DataType>(
  dataIndex: keyof DataType,
  state: ColumnSearchState,
  options: ColumnSearchOptions<DataType> = {},
): ColumnType<DataType> {
  const { placeholder, normalize, render } = options;

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
  ) => {
    confirm();
    state.setSearchText(selectedKeys[0] || "");
    state.setSearchedColumn(String(dataIndex));
  };

  const handleReset = (
    clearFilters: FilterDropdownProps["clearFilters"],
    confirm: FilterDropdownProps["confirm"],
  ) => {
    clearFilters();
    state.setSearchText("");
    state.setSearchedColumn(String(dataIndex));
    confirm({ closeDropdown: true });
  };

  return {
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={state.inputRef}
          placeholder={placeholder || `Tìm theo ${String(dataIndex)}`}
          value={selectedKeys[0]}
          onChange={(event) => setSelectedKeys(event.target.value ? [event.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm)}
          style={{ marginBottom: 8, display: "block" }}
          allowClear
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm)}
            icon={<SearchOutlined />}
            size="small"
          >
            Lọc
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters, confirm)}
            size="small"
          >
            Reset
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            Đóng
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      const raw = normalize
        ? normalize((record as any)[dataIndex], record)
        : String((record as any)[dataIndex] ?? "");
      return raw.toLowerCase().includes(String(value).toLowerCase());
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => state.inputRef?.current?.select(), 100);
      }
    },
    render: (value: unknown, record: DataType) => {
      const rendered = render ? render(value, record) : value;
      if (state.searchedColumn !== String(dataIndex)) {
        return rendered as React.ReactNode;
      }
      if (rendered == null) return rendered as React.ReactNode;
      if (typeof rendered === "string" || typeof rendered === "number") {
        return highlightText(String(rendered), state.searchText);
      }
      return rendered as React.ReactNode;
    },
  };
}
