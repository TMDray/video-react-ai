import { describe, it, expect } from "vitest";
import { z } from "zod";
import { introspectSchema } from "../src/lib/schemaIntrospection";

describe("schemaIntrospection", () => {
  describe("introspectSchema", () => {
    it("extracts all fields from a schema", () => {
      const schema = z.object({
        headline: z.string().default("Build videos with code"),
        brandName: z.string().default("Acme"),
      });

      const fields = introspectSchema(schema);
      expect(fields).toHaveLength(2);
      expect(fields.map((f) => f.key)).toEqual(["headline", "brandName"]);
    });

    it("detects string fields correctly", () => {
      const schema = z.object({
        title: z.string().default("Test"),
      });

      const fields = introspectSchema(schema);
      expect(fields[0].type).toBe("string");
      expect(fields[0].isAsset).toBe(false);
      expect(fields[0].defaultValue).toBe("Test");
    });

    it("detects asset fields by key suffix (Url, Src, Path)", () => {
      const schema = z.object({
        logoUrl: z.string().default("logo.svg"),
        imageSrc: z.string().default("image.png"),
        filePath: z.string().default("/path/to/file"),
      });

      const fields = introspectSchema(schema);
      expect(fields[0].isAsset).toBe(true);
      expect(fields[0].type).toBe("asset");
      expect(fields[1].isAsset).toBe(true);
      expect(fields[2].isAsset).toBe(true);
    });

    it("detects number fields", () => {
      const schema = z.object({
        duration: z.number().default(30),
      });

      const fields = introspectSchema(schema);
      expect(fields[0].type).toBe("number");
      expect(fields[0].defaultValue).toBe(30);
    });

    it("detects boolean fields", () => {
      const schema = z.object({
        autoplay: z.boolean().default(true),
      });

      const fields = introspectSchema(schema);
      expect(fields[0].type).toBe("boolean");
      expect(fields[0].defaultValue).toBe(true);
    });

    it("detects enum fields and extracts options", () => {
      const schema = z.object({
        format: z.enum(["landscape", "portrait", "square"]).default("landscape"),
      });

      const fields = introspectSchema(schema);
      expect(fields[0].type).toBe("enum");
      expect(fields[0].options).toEqual(["landscape", "portrait", "square"]);
      expect(fields[0].defaultValue).toBe("landscape");
    });

    it("humanizes field labels", () => {
      const schema = z.object({
        brandName: z.string().default("Acme"),
        logoUrl: z.string().default("logo.svg"),
        autoplay: z.boolean().default(true),
      });

      const fields = introspectSchema(schema);
      expect(fields[0].label).toBe("Brand Name");
      expect(fields[1].label).toBe("Logo Url");
      expect(fields[2].label).toBe("Autoplay");
    });

    it("skips unsupported field types gracefully", () => {
      const schema = z.object({
        title: z.string().default("Test"),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        customType: (z.string() as any).refine(() => true), // unsupported
      });

      const fields = introspectSchema(schema);
      // Should include string field, skip refine-wrapped field
      expect(fields.length).toBeGreaterThanOrEqual(1);
      expect(fields[0].key).toBe("title");
    });

    it("handles ZodOptional", () => {
      const schema = z.object({
        optionalTitle: z.string().optional().default("Default"),
      });

      const fields = introspectSchema(schema);
      expect(fields[0].key).toBe("optionalTitle");
      expect(fields[0].defaultValue).toBe("Default");
    });

    it("works with hello-world schema pattern", () => {
      const helloWorldSchema = z.object({
        headline: z.string().default("Build videos with code"),
        brandName: z.string().default("Acme"),
        tagline: z.string().default("Your tagline here"),
        logoUrl: z.string().default("logo-placeholder.svg"),
        ctaText: z.string().default("Get Started"),
      });

      const fields = introspectSchema(helloWorldSchema);
      expect(fields).toHaveLength(5);

      const logoField = fields.find((f) => f.key === "logoUrl");
      expect(logoField?.isAsset).toBe(true);
      expect(logoField?.type).toBe("asset");

      const headlineField = fields.find((f) => f.key === "headline");
      expect(headlineField?.type).toBe("string");
      expect(headlineField?.isAsset).toBe(false);
    });
  });
});
