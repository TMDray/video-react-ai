import React from "react";
import { Controller, Control } from "react-hook-form";
import { FieldDescriptor } from "../../lib/schemaIntrospection";
import styles from "./fields.module.css";

interface BooleanFieldProps {
  field: FieldDescriptor;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
}

export const BooleanField: React.FC<BooleanFieldProps> = ({ field, control }) => {
  return (
    <Controller
      name={field.key}
      control={control}
      render={({ field: fieldProps }) => (
        <div className={styles.fieldContainer}>
          <label htmlFor={field.key} className={styles.checkboxLabel}>
            <input
              id={field.key}
              type="checkbox"
              checked={Boolean(fieldProps.value)}
              onChange={(e) => fieldProps.onChange(e.target.checked)}
              className={styles.checkbox}
            />
            {field.label}
          </label>
        </div>
      )}
    />
  );
};
