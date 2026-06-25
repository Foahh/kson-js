import { z } from "zod";
import { audioInfo } from "./audio.ts";
import { beatInfo } from "./beat.ts";
import { bgInfo } from "./bg.ts";
import { cameraInfo } from "./camera.ts";
import { compatInfo } from "./compat.ts";
import { editorInfo } from "./editor.ts";
import { gaugeInfo } from "./gauge.ts";
import { metaInfo } from "./meta.ts";
import { noteInfo } from "./note.ts";
import { uint } from "./primitives.ts";

/** Format version of KSON 1.0.0. */
export const KSON_FORMAT_VERSION = 1;

/**
 * The top-level kson chart object.
 *
 * `impl` holds arbitrary client-specific data and is intentionally left
 * untyped so it round-trips unchanged.
 */
export const kson = z.object({
  /** Format version (`1` for KSON 1.0.0). */
  format_version: uint,
  /** Song metadata. */
  meta: metaInfo,
  /** Timing and tempo data. */
  beat: beatInfo,
  /** Gauge progression. */
  gauge: gaugeInfo.optional(),
  /** Note definitions. */
  note: noteInfo.optional(),
  /** Audio configuration. */
  audio: audioInfo.optional(),
  /** Camera effects. */
  camera: cameraInfo.optional(),
  /** Background graphics. */
  bg: bgInfo.optional(),
  /** Editor-specific data (optional support). */
  editor: editorInfo.optional(),
  /** KSH-format compatibility data (optional support). */
  compat: compatInfo.optional(),
  /** Client-specific data (optional support). */
  impl: z.unknown().optional(),
});

export type Kson = z.infer<typeof kson>;
