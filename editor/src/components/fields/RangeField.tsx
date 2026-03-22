import React from "react";
import { Controller } from "react-hook-form";
import type { Control, FieldError, Merge, FieldErrorsImpl } from "react-hook-form";
import { FieldDescriptor } from "../../lib/schemaIntrospection";
import styles from "./fields.module.css";

interface RangeFieldProps {
  field: FieldDescriptor;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
}

export const RangeField: React.FC<RangeFieldProps> = ({ field, control, error }) => {
  const min = (field as any).min ?? 0;
  const max = (field as any).max ?? 1;

  return (
    <Controller
      name={field.key}
      control={control}
      render={({ field: fieldProps }) => (
        <div className={styles.fieldContainer}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label htmlFor={field.key}>{field.label}</label>
            <span className={styles.rangeValue}>{Number(fieldProps.value).toFixed(2)}</span>
          </div>
          <input
            id={field.key}
            type="range"
            min={min}
            max={max}
            step={0.01}
            value={fieldProps.value}
            onChange={(e) => fieldProps.onChange(parseFloat(e.target.value))}
            className={`${styles.range} ${error ? styles.rangeError : ""}`}
          />
          {error && <span className={styles.errorText}>{String(error.message)}</span>}
        </div>
      )}
    />
  );
};
