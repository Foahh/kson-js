import { z } from "zod";
import { byPulse } from "./common.ts";

/**
 * `KSHUnknownInfo` — unrecognized KSH lines preserved for round-tripping.
 */
export const kshUnknownInfo = z.object({
  /** Unrecognized option lines appearing before the first bar line (`--`). */
  meta: z.record(z.string(), z.string()).optional(),
  /** Unrecognized option lines appearing after the first bar line. */
  option: z.record(z.string(), z.array(byPulse(z.string()))).optional(),
  /** Unrecognized non-option lines. */
  line: z.array(byPulse(z.string())).optional(),
});

/** `compat` — KSH-format compatibility data (optional support). */
export const compatInfo = z.object({
  /** Original KSH `ver` field; defaults to `"100"` when absent. */
  ksh_version: z.string().optional(),
  /** Unrecognized KSH content. */
  ksh_unknown: kshUnknownInfo.optional(),
});

export type KSHUnknownInfo = z.infer<typeof kshUnknownInfo>;
export type CompatInfo = z.infer<typeof compatInfo>;
