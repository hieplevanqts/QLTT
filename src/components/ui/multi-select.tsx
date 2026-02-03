import * as React from "react";

export interface MultiSelectProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  allOptionLabel?: string;
}

export function MultiSelect({
  label,
  options,
  selectedValues,
  onChange,
  placeholder,
  allOptionLabel,
}: MultiSelectProps) {
  const allSelected = options.length > 0 && selectedValues.length === options.length;

  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((item) => item !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const toggleAll = () => {
    onChange(allSelected ? [] : [...options]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label
        style={{
          fontSize: "var(--text-sm)",
          fontWeight: "var(--font-weight-medium)",
          color: "var(--foreground)",
        }}
      >
        {label}
      </label>
      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          background: "var(--background)",
          padding: "8px 10px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          maxHeight: 220,
          overflowY: "auto",
        }}
      >
        {allOptionLabel ? (
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
            />
            <span style={{ fontSize: "var(--text-sm)", color: "var(--foreground)" }}>
              {allOptionLabel}
            </span>
          </label>
        ) : null}
        {options.length === 0 ? (
          <span style={{ fontSize: "var(--text-sm)", color: "var(--muted-foreground)" }}>
            {placeholder ?? "Không có dữ liệu"}
          </span>
        ) : (
          options.map((option) => (
            <label
              key={option}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(option)}
                onChange={() => toggleValue(option)}
              />
              <span style={{ fontSize: "var(--text-sm)", color: "var(--foreground)" }}>
                {option}
              </span>
            </label>
          ))
        )}
      </div>
    </div>
  );
}
