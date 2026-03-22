import React from "react";
import { Controller, Control } from "react-hook-form";
import { FieldDescriptor } from "../../lib/schemaIntrospection";
import styles from "./fields.module.css";

interface EnumFieldProps {
  field: FieldDescriptor;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
}

export const EnumField: React.FC<EnumFieldProps> = ({ field, control }) => {
  return (
    <Controller
      name={field.key}
      control={control}
      render={({ field: fieldProps }) => (
        <div className={styles.fieldContainer}>
          <label htmlFor={field.key}>{field.label}</label>
          <select {...fieldProps} id={field.key} className={styles.select}>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
    />
  );
};
