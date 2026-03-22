import React from "react";
import { Controller, Control, FieldError } from "react-hook-form";
import { FieldDescriptor } from "../../lib/schemaIntrospection";
import styles from "./fields.module.css";

interface StringFieldProps {
  field: FieldDescriptor;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  error?: FieldError;
}

export const StringField: React.FC<StringFieldProps> = ({ field, control, error }) => {
  return (
    <Controller
      name={field.key}
      control={control}
      render={({ field: fieldProps }) => (
        <div className={styles.fieldContainer}>
          <label htmlFor={field.key}>{field.label}</label>
          <input
            id={field.key}
            type="text"
            placeholder={String(field.defaultValue || "")}
            {...fieldProps}
            className={`${styles.input} ${error ? styles.inputError : ""}`}
          />
          {error && <span className={styles.errorText}>{String(error.message)}</span>}
        </div>
      )}
    />
  );
};
