import React from 'react';
import { Plus, Trash2, ChevronDown } from 'lucide-react';
import {
  FilterGroup,
  FilterCondition,
  LogicOperator,
  createEmptyCondition,
  createEmptyGroup,
  generateFilterId,
} from '../../types/advancedFilter';
import { SingleCondition } from './SingleCondition';
import { Button } from '../../app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../app/components/ui/select';
import styles from './ConditionGroup.module.css';

interface ConditionGroupProps {
  group: FilterGroup;
  onUpdate: (group: FilterGroup) => void;
  onRemove?: () => void;
  level?: number;
  canRemove?: boolean;
}

export function ConditionGroup({
  group,
  onUpdate,
  onRemove,
  level = 0,
  canRemove = false,
}: ConditionGroupProps) {
  const isNested = level > 0;
  const maxNestingLevel = 2; // Limit nesting to 2 levels

  const handleLogicChange = (logic: LogicOperator) => {
    onUpdate({ ...group, logic });
  };

  const handleConditionUpdate = (index: number, condition: FilterCondition) => {
    const newConditions = [...group.conditions];
    newConditions[index] = condition;
    onUpdate({ ...group, conditions: newConditions });
  };

  const handleConditionRemove = (index: number) => {
    const newConditions = group.conditions.filter((_, i) => i !== index);
    onUpdate({ ...group, conditions: newConditions });
  };

  const handleAddCondition = () => {
    onUpdate({
      ...group,
      conditions: [...group.conditions, createEmptyCondition()],
    });
  };

  const handleGroupUpdate = (index: number, updatedGroup: FilterGroup) => {
    const newGroups = [...group.groups];
    newGroups[index] = updatedGroup;
    onUpdate({ ...group, groups: newGroups });
  };

  const handleGroupRemove = (index: number) => {
    const newGroups = group.groups.filter((_, i) => i !== index);
    onUpdate({ ...group, groups: newGroups });
  };

  const handleAddGroup = () => {
    const newGroup = createEmptyGroup(group.logic === 'AND' ? 'OR' : 'AND');
    onUpdate({
      ...group,
      groups: [...group.groups, newGroup],
    });
  };

  const canAddNestedGroup = level < maxNestingLevel;
  const hasMultipleItems = group.conditions.length + group.groups.length > 1;

  return (
    <div className={`${styles.group} ${isNested ? styles.groupNested : ''}`} data-level={level}>
      {/* Group Header */}
      <div className={styles.groupHeader}>
        <div className={styles.groupHeaderLeft}>
          {/* Logic Operator */}
          {hasMultipleItems && (
            <Select value={group.logic} onValueChange={handleLogicChange}>
              <SelectTrigger className={styles.logicSelect}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AND">AND (Và)</SelectItem>
                <SelectItem value="OR">OR (Hoặc)</SelectItem>
              </SelectContent>
            </Select>
          )}

          {!hasMultipleItems && (
            <div className={styles.logicPlaceholder}>
              <span className={styles.logicText}>Điều kiện</span>
            </div>
          )}
        </div>

        {/* Remove Group Button */}
        {canRemove && onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className={styles.removeGroupButton}
          >
            <Trash2 size={16} />
            Xóa nhóm
          </Button>
        )}
      </div>

      {/* Conditions */}
      <div className={styles.conditionsList}>
        {group.conditions.map((condition, index) => (
          <div key={condition.id} className={styles.conditionItem}>
            {/* Show logic label before each item (except first) */}
            {index > 0 && (
              <div className={styles.logicLabel}>
                <span className={styles.logicLabelText}>{group.logic}</span>
              </div>
            )}
            
            <SingleCondition
              condition={condition}
              onUpdate={(updated) => handleConditionUpdate(index, updated)}
              onRemove={() => handleConditionRemove(index)}
              canRemove={group.conditions.length > 1 || group.groups.length > 0}
            />
          </div>
        ))}

        {/* Nested Groups */}
        {group.groups.map((childGroup, index) => (
          <div key={childGroup.id} className={styles.nestedGroupItem}>
            {/* Show logic label before nested group */}
            {(group.conditions.length > 0 || index > 0) && (
              <div className={styles.logicLabel}>
                <span className={styles.logicLabelText}>{group.logic}</span>
              </div>
            )}

            <ConditionGroup
              group={childGroup}
              onUpdate={(updated) => handleGroupUpdate(index, updated)}
              onRemove={() => handleGroupRemove(index)}
              level={level + 1}
              canRemove
            />
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className={styles.groupActions}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddCondition}
          className={styles.addButton}
        >
          <Plus size={16} />
          Thêm điều kiện
        </Button>

        {canAddNestedGroup && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddGroup}
            className={styles.addButton}
          >
            <Plus size={16} />
            Thêm nhóm {group.logic === 'AND' ? 'OR' : 'AND'}
          </Button>
        )}
      </div>
    </div>
  );
}
