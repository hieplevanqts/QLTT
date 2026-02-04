import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import styles from './SearchableSelect.module.css';

export interface AsyncSearchableSelectOption {
  value: string;
  label: string;
  category?: string;
  icon?: string;
}

interface AsyncSearchableSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  searchFunction: (searchTerm: string, limit?: number) => Promise<AsyncSearchableSelectOption[]>;
  placeholder?: string;
  disabled?: boolean;
  width?: string;
  limit?: number;
  noResultsText?: string;
  staticOptions?: AsyncSearchableSelectOption[];
}

export function AsyncSearchableSelect({
  value,
  onValueChange,
  searchFunction,
  placeholder = 'Chọn...',
  disabled,
  width,
  limit = 20,
  noResultsText = 'Không có kết quả',
  staticOptions = [],
}: AsyncSearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState<AsyncSearchableSelectOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const handler = window.setTimeout(() => {
      searchFunction(searchTerm, limit)
        .then((results) => {
          if (!cancelled) {
            setOptions(results || []);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setOptions([]);
          }
        })
        .finally(() => {
          if (!cancelled) {
            setLoading(false);
          }
        });
    }, searchTerm ? 300 : 0);

    return () => {
      cancelled = true;
      window.clearTimeout(handler);
    };
  }, [searchTerm, searchFunction, limit]);

  const mergedOptions = useMemo(() => {
    const map = new Map<string, AsyncSearchableSelectOption>();
    staticOptions.forEach((opt) => map.set(opt.value, opt));
    options.forEach((opt) => map.set(opt.value, opt));
    return Array.from(map.values());
  }, [staticOptions, options]);

  const selectedOption = useMemo(
    () => mergedOptions.find((opt) => opt.value === value),
    [mergedOptions, value]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          className={styles.trigger}
          data-placeholder={!value}
          disabled={disabled}
          style={width ? { width } : undefined}
        >
          <span className={styles.triggerText}>{selectedOption?.label || value || placeholder}</span>
          <ChevronsUpDown className={styles.triggerIcon} />
        </button>
      </PopoverTrigger>
      <PopoverContent className={styles.popoverContent} align="start">
        <Command shouldFilter={false}>
          <div className={styles.commandInput}>
            <svg className={styles.searchIcon} viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
            <CommandInput
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
          </div>
          <CommandList className={styles.commandList}>
            {loading && (
              <div className={styles.loading}>
                <Loader2 className={styles.spinner} />
                <span>Đang tải...</span>
              </div>
            )}
            {!loading && mergedOptions.length === 0 && (
              <CommandEmpty className={styles.commandEmpty}>{noResultsText}</CommandEmpty>
            )}
            <CommandGroup>
              {mergedOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onValueChange(option.value);
                    setOpen(false);
                  }}
                  className={styles.commandItem}
                  data-selected={value === option.value}
                >
                  <div className={styles.optionContent}>
                    <span className={styles.optionLabel}>{option.label}</span>
                    {option.category && (
                      <span className={styles.optionCategory}>{option.category}</span>
                    )}
                  </div>
                  {value === option.value && <Check className={styles.checkIcon} />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
