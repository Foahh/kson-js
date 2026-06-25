import { z } from "zod";
import { byPulse, graphCurveValue, graphPoint, graphValue } from "./common.ts";
import { double, uint } from "./primitives.ts";

/* -------------------------------------------------------------------------- */
/* Tilt                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Named automatic tilt modes. `keep_*` variants only update when the absolute
 * value increases while keeping the same sign.
 */
export const tiltAuto = z.enum([
  "normal",
  "bigger",
  "biggest",
  "keep_normal",
  "keep_bigger",
  "keep_biggest",
  "zero",
]);

/**
 * `TiltValue` — the value half of a tilt `ByPulse` event. Manual values are
 * doubles in `[-100, 100]` where `±1.0` is the standard maximum tilt.
 */
export const tiltValue = z.union([
  // Named automatic tilt.
  tiltAuto,
  // Manual tilt value.
  double,
  // Immediate transition `[from, to]`.
  z.tuple([double, double]),
  // Manual value transitioning instantly to an automatic tilt.
  z.tuple([double, tiltAuto]),
  // Manual value with a curve control point toward the next point.
  z.tuple([double, graphCurveValue]),
  // Immediate `[from, to]` jump followed by curve interpolation.
  z.tuple([graphValue, graphCurveValue]),
]);

/* -------------------------------------------------------------------------- */
/* Camera body graphs                                                         */
/* -------------------------------------------------------------------------- */

/**
 * `CamGraphs` — camera body graphs. All values are in `[-65535, 65535]` and may
 * be clamped by clients.
 */
export const camGraphs = z.object({
  /** Rotation around the judgment line (+2400 per full rotation). */
  zoom_top: z.array(graphPoint).optional(),
  /** Vertical perspective depth. */
  zoom_bottom: z.array(graphPoint).optional(),
  /** Horizontal highway offset. */
  zoom_side: z.array(graphPoint).optional(),
  /** Rotation in degrees (highway and judgment line). */
  rotation_deg: z.array(graphPoint).optional(),
  /** Highway split at the center. */
  center_split: z.array(graphPoint).optional(),
});

/* -------------------------------------------------------------------------- */
/* Camera patterns                                                            */
/* -------------------------------------------------------------------------- */

/** Spin/half-spin direction: counter-clockwise (`-1`) or clockwise (`1`). */
const direction = z.union([z.literal(-1), z.literal(1)]);

/**
 * `CamPatternInvokeSpin` — `[y, direction, length]`.
 */
export const camPatternInvokeSpin = z.tuple([uint, direction, uint]);

/** Per-invocation swing parameters. */
export const camPatternInvokeSwingValue = z.object({
  /** Swing scale. */
  scale: double.default(250.0),
  /** Repeat count. */
  repeat: uint.default(3),
  /** Decay function order (`0`–`2`). */
  decay_order: uint.default(2),
});

/**
 * `CamPatternInvokeSwing` — `[y, direction, length, value?]`.
 */
export const camPatternInvokeSwing = z.tuple([
  uint,
  direction,
  uint,
  camPatternInvokeSwingValue.optional(),
]);

/** `CamPatternLaserInvokeList` — camera patterns triggered by laser slams. */
export const camPatternLaserInvokeList = z.object({
  spin: z.array(camPatternInvokeSpin).optional(),
  half_spin: z.array(camPatternInvokeSpin).optional(),
  /** Swing pattern (optional support). */
  swing: z.array(camPatternInvokeSwing).optional(),
});

/** `CamPatternInfo` — camera-animation patterns. */
export const camPatternInfo = z.object({
  laser: camPatternLaserInvokeList.optional(),
});

/* -------------------------------------------------------------------------- */
/* Camera                                                                     */
/* -------------------------------------------------------------------------- */

/** `CamInfo` — camera body graphs and trigger patterns. */
export const camInfo = z.object({
  body: camGraphs.optional(),
  pattern: camPatternInfo.optional(),
});

/** `camera` — tilt and camera effects. */
export const cameraInfo = z.object({
  /** Lane-rotation (tilt) events. Defaults to a single `"normal"` at pulse 0. */
  tilt: z.array(byPulse(tiltValue)).default([[0, "normal"]]),
  /** Camera body graphs and patterns. */
  cam: camInfo.optional(),
});

export type TiltAuto = z.infer<typeof tiltAuto>;
export type TiltValue = z.infer<typeof tiltValue>;
export type CamGraphs = z.infer<typeof camGraphs>;
export type CamPatternInvokeSpin = z.infer<typeof camPatternInvokeSpin>;
export type CamPatternInvokeSwingValue = z.infer<typeof camPatternInvokeSwingValue>;
export type CamPatternInvokeSwing = z.infer<typeof camPatternInvokeSwing>;
export type CamPatternLaserInvokeList = z.infer<typeof camPatternLaserInvokeList>;
export type CamPatternInfo = z.infer<typeof camPatternInfo>;
export type CamInfo = z.infer<typeof camInfo>;
export type CameraInfo = z.infer<typeof cameraInfo>;
