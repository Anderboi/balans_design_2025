"use client";

import React, { useState, useEffect, useRef } from "react";
import EditableInput from "./editable-input";

interface DebouncedInputProps
  extends Omit<React.ComponentProps<typeof EditableInput>, "onChange" | "value"> {
  value: string | number;
  onChange: (value: string) => void;
  debounceMs?: number;
}

export const DebouncedInput = React.forwardRef<HTMLInputElement, DebouncedInputProps>(
  ({ value: initialValue, onChange, debounceMs = 500, onBlur, ...props }, ref) => {
    const [value, setValue] = useState(initialValue);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setValue(val);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        onChange(val);
      }, debounceMs);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
        onChange(String(value));
      }
      onBlur?.(e);
    };

    // Clean up timeout on unmount
    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    return (
      <EditableInput
        ref={ref}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        {...props}
      />
    );
  },
);

DebouncedInput.displayName = "DebouncedInput";
