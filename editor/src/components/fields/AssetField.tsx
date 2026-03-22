import React, { useState } from "react";
import { Controller } from "react-hook-form";
import type { Control, FieldError, Merge, FieldErrorsImpl } from "react-hook-form";
import { FieldDescriptor } from "../../lib/schemaIntrospection";
import { AssetPicker } from "../AssetPicker";
import styles from "./fields.module.css";

interface AssetFieldProps {
  field: FieldDescriptor;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
}

export const AssetField: React.FC<AssetFieldProps> = ({ field, control, error }) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <Controller
      name={field.key}
      control={control}
      render={({ field: fieldProps }) => (
        <div className={styles.fieldContainer}>
          <label htmlFor={field.key}>{field.label}</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              id={field.key}
              type="text"
              placeholder={String(field.defaultValue || "")}
              {...fieldProps}
              className={`${styles.input} ${error ? styles.inputError : ""}`}
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={() => setShowPicker(true)}
              className={styles.assetButton}
            >
              📁 Pick
            </button>
          </div>
          {error && <span className={styles.errorText}>{String(error.message)}</span>}
          {showPicker && (
            <AssetPicker
              onSelect={(asset) => {
                fieldProps.onChange(asset);
                setShowPicker(false);
              }}
              onClose={() => setShowPicker(false)}
            />
          )}
        </div>
      )}
    />
  );
};
