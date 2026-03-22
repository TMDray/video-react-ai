import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VideoEntry } from "@/lib/types";
import { introspectSchema } from "../lib/schemaIntrospection";
import { FieldRenderer } from "./FieldRenderer";
import styles from "./PropsForm.module.css";

interface PropsFormProps {
  entry: VideoEntry;
  currentProps: Record<string, unknown>;
  onPropsChange: (props: Record<string, unknown>) => void;
}

export const PropsForm: React.FC<PropsFormProps> = ({ entry, currentProps, onPropsChange }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fields = entry.schema ? introspectSchema(entry.schema as any) : [];
  const {
    control,
    watch,
    reset,
    formState: { errors },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<any>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: entry.schema ? (zodResolver(entry.schema as any) as any) : undefined,
    defaultValues: currentProps,
  });

  // Watch all fields and update parent on change (with debounce)
  const watchedValues = watch();
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onPropsChange(watchedValues);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [watchedValues, onPropsChange]);

  // Reset form when entry changes
  useEffect(() => {
    reset(currentProps);
  }, [entry.id, currentProps, reset]);

  return (
    <form className={styles.form}>
      <div className={styles.header}>
        <h3>Props</h3>
        <span className={styles.fieldCount}>{fields.length} fields</span>
      </div>

      <div className={styles.fields}>
        {fields.length === 0 && <p className={styles.empty}>No editable props</p>}

        {fields.map((field) => (
          <div key={field.key}>
            <FieldRenderer field={field} control={control} error={errors[field.key]} />
          </div>
        ))}
      </div>
    </form>
  );
};
