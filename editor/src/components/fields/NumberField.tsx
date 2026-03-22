import React from "react";
import { Controller, Control, FieldError } from "react-hook-form";
import { FieldDescriptor } from "../../lib/schemaIntrospection";
import styles from "./fields.module.css";

interface NumberFieldProps {
  field: FieldDescriptor;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  error?: FieldError;
}

export const NumberField: React.FC<NumberFieldProps> = ({ field, control, error }) => {
  return (
    <Controller
      name={field.key}
      control={control}
      render={({ field: fieldProps }) => (
        <div className={styles.fieldContainer}>
          <label htmlFor={field.key}>{field.label}</label>
          <input
            id={field.key}
            type="number"
            placeholder={String(field.defaultValue || 0)}
            {...fieldProps}
            onChange={(e) => fieldProps.onChange(e.target.valueAsNumber)}
            className={`${styles.input} ${error ? styles.inputError : ""}`}
          />
          {error && <span className={styles.errorText}>{String(error.message)}</span>}
        </div>
      )}
    />
  );
};
