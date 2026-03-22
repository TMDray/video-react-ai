import React from "react";
import { Control } from "react-hook-form";
import { FieldDescriptor } from "../lib/schemaIntrospection";
import { StringField } from "./fields/StringField";
import { NumberField } from "./fields/NumberField";
import { BooleanField } from "./fields/BooleanField";
import { EnumField } from "./fields/EnumField";
import { AssetField } from "./fields/AssetField";

interface FieldRendererProps {
  field: FieldDescriptor;
  control: Control<any>;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  control,
}: FieldRendererProps) => {
  if (field.isAsset) {
    return <AssetField field={field} control={control} />;
  }

  switch (field.type) {
    case "string":
      return <StringField field={field} control={control} />;
    case "number":
      return <NumberField field={field} control={control} />;
    case "boolean":
      return <BooleanField field={field} control={control} />;
    case "enum":
      return <EnumField field={field} control={control} />;
    case "asset":
      return <AssetField field={field} control={control} />;
    default:
      return null;
  }
};
