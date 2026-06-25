import { z } from "zod";
import { double, uint } from "./primitives.ts";

/**
 * `meta` — song metadata.
 */
export const metaInfo = z.object({
  /** Song title. */
  title: z.string(),
  /** Transliterated title (optional support). */
  title_translit: z.string().optional(),
  /** Image shown instead of the title text (optional support). */
  title_img_filename: z.string().optional(),
  /** Artist name. */
  artist: z.string(),
  /** Transliterated artist (optional support). */
  artist_translit: z.string().optional(),
  /** Image shown instead of the artist text (optional support). */
  artist_img_filename: z.string().optional(),
  /** Chart creator. */
  chart_author: z.string(),
  /** Difficulty index (`0`–`3`) or a difficulty name. */
  difficulty: z.union([uint, z.string()]),
  /** Level on the 1–20 scale. */
  level: uint,
  /** Display BPM string, composed of `[0-9]`, `-` and `.`. */
  disp_bpm: z.string(),
  /** Standard BPM; auto-calculated when omitted (optional support). */
  std_bpm: double.optional(),
  /** Jacket / album-art filename. */
  jacket_filename: z.string().optional(),
  /** Jacket artwork author. */
  jacket_author: z.string().optional(),
  /** Selection-screen icon filename (optional support). */
  icon_filename: z.string().optional(),
  /** Free-form additional information (optional support). */
  information: z.string().optional(),
});

export type MetaInfo = z.infer<typeof metaInfo>;
