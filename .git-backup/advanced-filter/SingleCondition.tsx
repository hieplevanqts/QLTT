import React from 'react';
import { X } from 'lucide-react';
import {
  FilterCondition,
  FilterOperator,
  OPERATOR_LABELS,
  REGISTRY_FILTER_FIELDS,
  getFilterField,
} from '../../types/advancedFilter';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../app/components/ui/select';
import { Button } from '../../app/components/ui/button';
import styles from './SingleCondition.module.css';

interface SingleConditionProps {
  condition: FilterCondition;
  onUpdate: (condition: FilterCondition) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function SingleCondition({
  condition,
  onUpdate,
  onRemove,
  canRemove,
}: SingleConditionProps) {
  const selectedField = getFilterField(condition.field);

  const handleFieldChange = (fieldId: string) => {
    const field = getFilterField(fieldId);
    if (!field) return;

    const defaultOperator = field.operators[0];
    onUpdate({
      ...condition,
      field: fieldId,
      operator: defaultOperator,
      value: null,
    });
  };

  const handleOperatorChange = (operator: FilterOperator) => {
    onUpdate({
      ...condition,
      operator,
      value: null,
    });
  };

  const handleValueChange = (value: any) => {
    onUpdate({
      ...condition,
      value,
    });
  };

  const renderValueInput = () => {
    if (!selectedField) {
      return (
        <input
          type="text"
          className={styles.input}
          placeholder="Chọn trường lọc trước"
          disabled
        />
      );
    }

    switch (selectedField.type) {
      case 'select':
      case 'multiSelect':
        if (condition.operator === 'in' || condition.operator === 'notIn') {
          // Multi-select for 'in' operators
          return (
            <select
              className={styles.input}
              multiple
              value={condition.value || []}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                handleValueChange(selected);
              }}
            >
              {selectedField.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );
        } else {
          return (
            <Select
              value={condition.value || ''}
              onValueChange={handleValueChange}
            >
              <SelectTrigger className={styles.select}>
                <SelectValue placeholder="Chọn giá trị" />
              </SelectTrigger>
              <SelectContent>
                {selectedField.options?.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }

      case 'date':
      case 'dateRange':
        if (condition.operator === 'between') {
          return (
            <div className={styles.dateRange}>
              <input
                type="date"
                className={styles.input}
                value={condition.value?.[0] || ''}
                onChange={(e) => handleValueChange([e.target.value, condition.value?.[1] || ''])}
              />
              <span className={styles.dateRangeSeparator}>đến</span>
              <input
                type="date"
                className={styles.input}
                value={condition.value?.[1] || ''}
                onChange={(e) => handleValueChange([condition.value?.[0] || '', e.target.value])}
              />
            </div>
          );
        } else {
          return (
            <input
              type="date"
              className={styles.input}
              value={condition.value || ''}
              onChange={(e) => handleValueChange(e.target.value)}
            />
          );
        }

      case 'number':
        if (condition.operator === 'between') {
          return (
            <div className={styles.numberRange}>
              <input
                type="number"
                className={styles.input}
                placeholder="Từ"
                value={condition.value?.[0] || ''}
                onChange={(e) => handleValueChange([e.target.value, condition.value?.[1] || ''])}
              />
              <span className={styles.numberRangeSeparator}>-</span>
              <input
                type="number"
                className={styles.input}
                placeholder="Đến"
                value={condition.value?.[1] || ''}
                onChange={(e) => handleValueChange([condition.value?.[0] || '', e.target.value])}
              />
            </div>
          );
        } else {
          return (
            <input
              type="number"
              className={styles.input}
              placeholder="Nhập giá trị"
              value={condition.value || ''}
              onChange={(e) => handleValueChange(e.target.value)}
            />
          );
        }

      case 'boolean':
        // Boolean fields typically use 'has'/'hasNot' operators, no value needed
        return (
          <div className={styles.booleanPlaceholder}>
            <span className={styles.booleanText}>
              {condition.operator === 'has' ? 'Có' : 'Không có'}
            </span>
          </div>
        );

      case 'text':
      default:
        return (
          <input
            type="text"
            className={styles.input}
            placeholder="Nhập giá trị"
            value={condition.value || ''}
            onChange={(e) => handleValueChange(e.target.value)}
          />
        );
    }
  };

  return (
    <div className={styles.condition}>
      {/* Field Select */}
      <div className={styles.fieldSelect}>
        <Select
          value={condition.field}
          onValueChange={handleFieldChange}
        >
          <SelectTrigger className={styles.select}>
            <SelectValue placeholder="Chọn trường lọc" />
          </SelectTrigger>
          <SelectContent>
            {REGISTRY_FILTER_FIELDS.map(field => (
              <SelectItem key={field.id} value={field.id}>
                {field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Operator Select */}
      <div className={styles.operatorSelect}>
        <Select
          value={condition.operator}
          onValueChange={handleOperatorChange}
          disabled={!selectedField}
        >
          <SelectTrigger className={styles.select}>
            <SelectValue placeholder="Toán tử" />
          </SelectTrigger>
          <SelectContent>
            {selectedField?.operators.map(op => (
              <SelectItem key={op} value={op}>
                {OPERATOR_LABELS[op]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Value Input */}
      <div className={styles.valueInput}>
        {renderValueInput()}
      </div>

      {/* Remove Button */}
      {canRemove && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className={styles.removeButton}
          aria-label="Xóa điều kiện"
        >
          <X size={16} />
        </Button>
      )}
    </div>
  );
}
