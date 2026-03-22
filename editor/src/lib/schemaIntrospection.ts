import { ZodTypeAny, ZodObject } from "zod";

export type FieldType = "string" | "number" | "boolean" | "enum" | "asset";

export interface FieldDescriptor {
  key: string;
  label: string;
  type: FieldType;
  defaultValue: unknown;
  options?: string[];
  isAsset: boolean;
}

function humanizeKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .trim();
}

function introspectField(key: string, field: ZodTypeAny): FieldDescriptor | null {
  // Unwrap ZodDefault
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let innerDef: any = field._def;
  let defaultValue: unknown = undefined;

  if (innerDef.type === "default") {
    defaultValue = innerDef.defaultValue;
    innerDef = innerDef.innerType._def;
  }

  // Unwrap ZodOptional
  if (innerDef.type === "optional") {
    innerDef = innerDef.innerType._def;
  }

  const assetKeyPattern = /[Uu]rl$|[Ss]rc$|[Pp]ath$/;
  const isAsset = assetKeyPattern.test(key);

  // String
  if (innerDef.type === "string") {
    return {
      key,
      label: humanizeKey(key),
      type: isAsset ? "asset" : "string",
      defaultValue,
      isAsset,
    };
  }

  // Number
  if (innerDef.type === "number") {
    return {
      key,
      label: humanizeKey(key),
      type: "number",
      defaultValue,
      isAsset: false,
    };
  }

  // Boolean
  if (innerDef.type === "boolean") {
    return {
      key,
      label: humanizeKey(key),
      type: "boolean",
      defaultValue,
      isAsset: false,
    };
  }

  // Enum
  if (innerDef.type === "enum") {
    return {
      key,
      label: humanizeKey(key),
      type: "enum",
      defaultValue,
      options: Object.keys(innerDef.entries || {}),
      isAsset: false,
    };
  }

  // Unsupported type - skip
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function introspectSchema(schema: ZodObject<any>): FieldDescriptor[] {
  const shape = schema.shape || schema._def.shape;
  return Object.entries(shape)
    .map(([key, field]) => introspectField(key, field as ZodTypeAny))
    .filter((field): field is FieldDescriptor => field !== null);
}
