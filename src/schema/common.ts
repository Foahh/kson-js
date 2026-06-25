import { z } from "zod";
import { double, uint } from "./primitives.ts";

/**
 * Shared, generic container types used by many sections of the kson format.
 */

/**
 * `ByPulse<T>` — an event that occurs at an absolute pulse position.
 *
 * - `[0]` y: pulse number
 * - `[1]` v: value
 */
export const byPulse = <T extends z.ZodTypeAny>(value: T) => z.tuple([uint, value]);

/**
 * `ByMeasureIdx<T>` — an event that occurs at a measure boundary.
 *
 * - `[0]` idx: measure index
 * - `[1]` v: value
 */
export const byMeasureIdx = <T extends z.ZodTypeAny>(value: T) => z.tuple([uint, value]);

/**
 * `DefKeyValuePair<T>` — an insertion-ordered named definition.
 *
 * - `[0]` name: key
 * - `[1]` v: value
 */
export const defKeyValuePair = <T extends z.ZodTypeAny>(value: T) => z.tuple([z.string(), value]);

/**
 * `GraphValue` — `[v, vf]`. When `v !== vf` an instant jump from `v` to `vf`
 * happens at the point, after which interpolation continues from `vf`.
 */
export const graphValue = z.tuple([double, double]);

/**
 * `GraphCurveValue` — `[a, b]`, the cubic Bézier control point (each in
 * `0.0`–`1.0`) shaping interpolation toward the next point. `[0, 0]` is linear.
 */
export const graphCurveValue = z.tuple([double, double]);

/**
 * `GraphPoint` — a point on a whole-chart graph at an absolute pulse.
 *
 * - `[0]` y: pulse number
 * - `[1]` v: value (`double`, or `GraphValue` for an instant jump)
 * - `[2]` curve: `GraphCurveValue` (optional, defaults to `[0, 0]`)
 */
export const graphPoint = z.tuple([
  uint,
  z.union([double, graphValue]),
  graphCurveValue.optional(),
]);

/**
 * `GraphSectionPoint` — a point within a section-relative graph (e.g. a laser).
 *
 * - `[0]` ry: relative pulse within the section (first point must be `0`)
 * - `[1]` v: value (`double`, or `GraphValue` for an instant jump)
 * - `[2]` curve: `GraphCurveValue` (optional, defaults to `[0, 0]`)
 */
export const graphSectionPoint = z.tuple([
  uint,
  z.union([double, graphValue]),
  graphCurveValue.optional(),
]);

export type ByPulse<T> = [number, T];
export type ByMeasureIdx<T> = [number, T];
export type DefKeyValuePair<T> = [string, T];
export type GraphValue = z.infer<typeof graphValue>;
export type GraphCurveValue = z.infer<typeof graphCurveValue>;
export type GraphPoint = z.infer<typeof graphPoint>;
export type GraphSectionPoint = z.infer<typeof graphSectionPoint>;
