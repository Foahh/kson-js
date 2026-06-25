import { z } from "zod";
import { byPulse } from "./common.ts";

/** `editor` — editor-specific metadata (all fields optional support). */
export const editorInfo = z.object({
  /** Editing application name. */
  app_name: z.string().optional(),
  /** Editing application version. */
  app_version: z.string().optional(),
  /** Per-pulse author comments. */
  comment: z.array(byPulse(z.string())).optional(),
});

export type EditorInfo = z.infer<typeof editorInfo>;
