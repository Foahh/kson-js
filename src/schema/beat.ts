import { z } from "zod";
import { byMeasureIdx, byPulse, graphPoint } from "./common.ts";
import { double, relPulse, uint } from "./primitives.ts";

/**
 * `TimeSig` — `[numerator, denominator]`.
 */
export const timeSig = z.tuple([uint, uint]);

/**
 * `beat` — timing, tempo and scroll data.
 */
export const beatInfo = z.object({
  /** BPM change events, keyed by pulse. */
  bpm: z.array(byPulse(double)),
  /** Time-signature changes, keyed by measure index. Defaults to a single 4/4. */
  time_sig: z.array(byMeasureIdx(timeSig)).default([[0, [4, 4]]]),
  /** Scroll-speed graph. Defaults to a constant speed of `1.0`. */
  scroll_speed: z.array(graphPoint).default([[0, 1.0]]),
  /** Stop events: `[pulse, durationInRelativePulses]` (optional support). */
  stop: z.array(byPulse(relPulse)).optional(),
});

export type TimeSig = z.infer<typeof timeSig>;
export type BeatInfo = z.infer<typeof beatInfo>;
