import { z } from "zod";
import { int } from "./primitives.ts";

/* -------------------------------------------------------------------------- */
/* Legacy (KSH) background data                                               */
/* -------------------------------------------------------------------------- */

/** `KSHBGInfo` — a single KSH background layer. */
export const kshBGInfo = z.object({
  /** Background name/filename, e.g. a KSM default like `"desert"`. */
  filename: z.string().optional(),
});

/** Rotation flags for an animated KSH layer. */
export const kshLayerRotationInfo = z.object({
  /** Whether the layer follows tilt. */
  tilt: z.boolean().default(true),
  /** Whether the layer follows spin. */
  spin: z.boolean().default(true),
});

/** `KSHLayerInfo` — animated foreground layer. */
export const kshLayerInfo = z.object({
  filename: z.string().optional(),
  /**
   * Duration in milliseconds. Negative plays backward; `0` is tempo-synced
   * (one frame per `0.035` measure).
   */
  duration: int.default(0),
  rotation: kshLayerRotationInfo.optional(),
});

/** `KSHMovieInfo` — background movie. */
export const kshMovieInfo = z.object({
  filename: z.string().optional(),
  /** Movie offset, in milliseconds. */
  offset: int.default(0),
});

/** `LegacyBGInfo` — KSH-format background compatibility data. */
export const legacyBGInfo = z.object({
  /**
   * Background layers. With two elements the first applies to gauge `< 70%`
   * and the second to gauge `>= 70%`; a single element applies regardless.
   */
  bg: z.union([z.tuple([kshBGInfo]), z.tuple([kshBGInfo, kshBGInfo])]).optional(),
  layer: kshLayerInfo.optional(),
  movie: kshMovieInfo.optional(),
});

/* -------------------------------------------------------------------------- */
/* Background                                                                 */
/* -------------------------------------------------------------------------- */

/** `bg` — background graphics (most fields are optional support). */
export const bgInfo = z.object({
  /** Reserved for future use; not consumed by KSM v2 (optional support). */
  filename: z.string().optional(),
  /** KSH-format background compatibility data (optional support). */
  legacy: legacyBGInfo.optional(),
});

export type KSHBGInfo = z.infer<typeof kshBGInfo>;
export type KSHLayerRotationInfo = z.infer<typeof kshLayerRotationInfo>;
export type KSHLayerInfo = z.infer<typeof kshLayerInfo>;
export type KSHMovieInfo = z.infer<typeof kshMovieInfo>;
export type LegacyBGInfo = z.infer<typeof legacyBGInfo>;
export type BGInfo = z.infer<typeof bgInfo>;
