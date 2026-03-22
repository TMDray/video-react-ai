import React from "react";
import type { Control, FieldError, Merge, FieldErrorsImpl } from "react-hook-form";
import { FieldDescriptor } from "../lib/schemaIntrospection";
import { StringField } from "./fields/StringField";
import { NumberField } from "./fields/NumberField";
import { BooleanField } from "./fields/BooleanField";
import { EnumField } from "./fields/EnumField";
import { AssetField } from "./fields/AssetField";
import { RangeField } from "./fields/RangeField";

interface FieldRendererProps {
  field: FieldDescriptor;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  control,
  error,
}: FieldRendererProps) => {
  if (field.isAsset) {
    return <AssetField field={field} control={control} error={error} />;
  }

  switch (field.type) {
    case "string":
      return <StringField field={field} control={control} error={error} />;
    case "number":
      return <NumberField field={field} control={control} error={error} />;
    case "range":
      return <RangeField field={field} control={control} error={error} />;
    case "boolean":
      return <BooleanField field={field} control={control} error={error} />;
    case "enum":
      return <EnumField field={field} control={control} error={error} />;
    case "asset":
      return <AssetField field={field} control={control} error={error} />;
    default:
      return null;
  }
};
