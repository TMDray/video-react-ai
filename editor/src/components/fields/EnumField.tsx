import React from "react";
import { Controller, Control, FieldError } from "react-hook-form";
import { FieldDescriptor } from "../../lib/schemaIntrospection";
import styles from "./fields.module.css";

interface EnumFieldProps {
  field: FieldDescriptor;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  error?: FieldError;
}

export const EnumField: React.FC<EnumFieldProps> = ({ field, control, error }) => {
  return (
    <Controller
      name={field.key}
      control={control}
      render={({ field: fieldProps }) => (
        <div className={styles.fieldContainer}>
          <label htmlFor={field.key}>{field.label}</label>
          <select
            {...fieldProps}
            id={field.key}
            className={`${styles.select} ${error ? styles.selectError : ""}`}
          >
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {error && <span className={styles.errorText}>{String(error.message)}</span>}
        </div>
      )}
    />
  );
};
