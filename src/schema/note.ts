import { z } from "zod";
import { graphSectionPoint } from "./common.ts";
import { uint } from "./primitives.ts";

/**
 * `ButtonNote` — `[y, length]`.
 *
 * - `[0]` y: pulse number
 * - `[1]` length: duration in pulses (`0` = chip note, `>0` = long note)
 */
export const buttonNote = z.tuple([uint, uint]);

/**
 * A single button-lane entry: either a bare pulse (`uint`, a chip note) or a
 * full `ButtonNote`.
 */
export const buttonLaneEntry = z.union([uint, buttonNote]);

/**
 * `LaserSection` — a continuous laser segment.
 *
 * - `[0]` y: pulse number where the section starts
 * - `[1]` v: laser-position points (values in `0.0`–`1.0`)
 * - `[2]` w: width scale factor (optional, `1`–`2`, default `1`)
 */
export const laserSection = z.tuple([uint, z.array(graphSectionPoint), uint.optional()]);

/**
 * `note` — chip/long button notes and lasers.
 *
 * Lanes are fixed-length tuples: 4 BT lanes, 2 FX lanes and 2 laser lanes.
 */
export const noteInfo = z.object({
  /** BT button notes across the 4 BT lanes. */
  bt: z
    .tuple([
      z.array(buttonLaneEntry),
      z.array(buttonLaneEntry),
      z.array(buttonLaneEntry),
      z.array(buttonLaneEntry),
    ])
    .optional(),
  /** FX button notes across the 2 FX lanes. */
  fx: z.tuple([z.array(buttonLaneEntry), z.array(buttonLaneEntry)]).optional(),
  /** Laser sections across the 2 laser lanes (left, right). */
  laser: z.tuple([z.array(laserSection), z.array(laserSection)]).optional(),
});

export type ButtonNote = z.infer<typeof buttonNote>;
export type ButtonLaneEntry = z.infer<typeof buttonLaneEntry>;
export type LaserSection = z.infer<typeof laserSection>;
export type NoteInfo = z.infer<typeof noteInfo>;
