import { z } from "zod";
import { type Kson, kson } from "./schema/kson.ts";

/** Error thrown when kson input fails schema validation. */
export class KsonValidationError extends Error {
  /** The underlying Zod issues. */
  readonly issues: z.core.$ZodIssue[];

  constructor(error: z.ZodError) {
    super(`Invalid kson: ${z.prettifyError(error)}`);
    this.name = "KsonValidationError";
    this.issues = error.issues;
  }
}

/** Error thrown when a kson string is not valid JSON. */
export class KsonParseError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "KsonParseError";
  }
}

/**
 * Validate an already-parsed JSON value as a kson chart.
 *
 * Spec-defined defaults (e.g. `beat.time_sig`, `bgm.vol`) are filled in on the
 * returned object.
 *
 * @throws {KsonValidationError} if the value does not conform to the schema.
 */
export function parseKson(data: unknown): Kson {
  const result = kson.safeParse(data);
  if (!result.success) {
    throw new KsonValidationError(result.error);
  }
  return result.data;
}

/**
 * Validate an already-parsed JSON value, returning a discriminated result
 * instead of throwing.
 */
export function safeParseKson(data: unknown): z.ZodSafeParseResult<Kson> {
  return kson.safeParse(data);
}

/**
 * Parse a kson document from a JSON string and validate it.
 *
 * @throws {KsonParseError} if the text is not valid JSON.
 * @throws {KsonValidationError} if the parsed value does not conform.
 */
export function parseKsonString(text: string): Kson {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch (cause) {
    throw new KsonParseError("Failed to parse kson JSON", { cause });
  }
  return parseKson(data);
}

/**
 * Serialize a kson chart back to a JSON string.
 *
 * The value is validated first so malformed charts are rejected before
 * stringification.
 *
 * @param space - indentation passed through to `JSON.stringify`.
 */
export function stringifyKson(chart: Kson, space?: string | number): string {
  return JSON.stringify(parseKson(chart), null, space);
}
