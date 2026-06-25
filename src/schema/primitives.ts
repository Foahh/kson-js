import { z } from "zod";

/**
 * Primitive numeric schemas used throughout the kson format.
 *
 * kson forbids `null` everywhere; absent values are simply omitted, which maps
 * to `undefined` in TypeScript.
 */

/** Unsigned integer (`uint` in the spec). */
export const uint = z.number().int().nonnegative();

/** Signed integer (`int` in the spec). */
export const int = z.number().int();

/** Double-precision float (`double` in the spec). */
export const double = z.number();

/**
 * Pulse position. Resolution is 240 per beat (960 per measure). Absolute pulse
 * positions and durations are both expressed as `uint`.
 */
export const pulse = uint;

/** Relative pulse count (`RelPulse`). */
export const relPulse = uint;

/** Measure index. */
export const measureIdx = uint;

export type Uint = z.infer<typeof uint>;
export type Int = z.infer<typeof int>;
export type Double = z.infer<typeof double>;
export type Pulse = z.infer<typeof pulse>;
export type RelPulse = z.infer<typeof relPulse>;
export type MeasureIdx = z.infer<typeof measureIdx>;
