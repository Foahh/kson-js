/**
 * kson-js — TypeScript types and Zod schemas for the KSON chart format.
 *
 * @see https://github.com/kshootmania/ksm-chart-format/blob/master/kson_format.md
 */

// Parsing / validation API.
export {
  KsonParseError,
  KsonValidationError,
  parseKson,
  parseKsonString,
  safeParseKson,
  stringifyKson,
} from "./parse.ts";

// Schemas and inferred types for every part of the format.
export * from "./schema/index.ts";
