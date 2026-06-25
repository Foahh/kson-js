import { z } from "zod";
import { uint } from "./primitives.ts";

/**
 * `gauge` — gauge progression configuration.
 */
export const gaugeInfo = z.object({
  /**
   * Total ascension of the gauge percentage across the whole chart (`0`, or
   * `100`+). Automatically computed by the client when `0`.
   */
  total: uint.default(0),
});

export type GaugeInfo = z.infer<typeof gaugeInfo>;
