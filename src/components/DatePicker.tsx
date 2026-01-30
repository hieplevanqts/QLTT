import React from 'react';
import { DatePicker as AntDatePicker } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

interface DatePickerProps {
    value?: string;
    onChange?: (dateString: string) => void;
    minDate?: string;
    placeholder?: string;
    className?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
    value,
    onChange,
    minDate,
    placeholder,
    className,
}) => {
    const handleChange = (_date: any, dateString: string | string[]) => {
        if (onChange) {
            // dateString is already a string based on format
            onChange(typeof dateString === 'string' ? dateString : dateString[0]);
        }
    };

    const disabledDate = (current: Dayjs) => {
        if (!minDate) return false;
        return current && current < dayjs(minDate).startOf('day');
    };

    return (
        <AntDatePicker
            value={value ? dayjs(value) : null}
            onChange={handleChange as any}
            disabledDate={disabledDate}
            placeholder={placeholder}
            className={className}
            style={{ width: '100%' }}
            popupStyle={{ zIndex: 99999 }}
            inputReadOnly
            format="YYYY-MM-DD"
        />
    );
};

export default DatePicker;
