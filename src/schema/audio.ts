import { z } from "zod";
import { byPulse, defKeyValuePair } from "./common.ts";
import { double, int, uint } from "./primitives.ts";

/* -------------------------------------------------------------------------- */
/* BGM                                                                        */
/* -------------------------------------------------------------------------- */

/** `BGMPreviewInfo` — song-select preview window. */
export const bgmPreviewInfo = z.object({
  /** Preview start, in milliseconds. */
  offset: int.default(0),
  /** Preview length, in milliseconds. */
  duration: uint.default(15000),
});

/** `LegacyBGMInfo` — KSH-format compatibility data for prerendered audio. */
export const legacyBgmInfo = z.object({
  /** Filenames of prerendered audio with legacy effects baked in. */
  fp_filenames: z.array(z.string()).optional(),
});

/** `BGMInfo` — background-music configuration. */
export const bgmInfo = z.object({
  /** Audio file path. */
  filename: z.string().optional(),
  /** Volume multiplier. */
  vol: double.default(1.0),
  /** Start offset, in milliseconds. */
  offset: int.default(0),
  /** Preview settings. */
  preview: bgmPreviewInfo.optional(),
  /** KSH-format compatibility data. */
  legacy: legacyBgmInfo.optional(),
});

/* -------------------------------------------------------------------------- */
/* Key sounds                                                                 */
/* -------------------------------------------------------------------------- */

/** `KeySoundInvokeFX` — per-invocation FX key-sound settings. */
export const keySoundInvokeFX = z.object({
  /** Key-sound volume. */
  vol: double.default(1.0),
});

/** An FX key-sound entry: a bare pulse, or a `ByPulse<KeySoundInvokeFX>`. */
const keySoundFXEntry = z.union([uint, byPulse(keySoundInvokeFX)]);

/** `KeySoundFXInfo` — chip-triggered FX sounds, keyed by sound name. */
export const keySoundFXInfo = z.object({
  /**
   * Sounds triggered on FX chip notes. Keys are sound names (e.g. `clap`,
   * `snare`) or custom filenames; values are 2-lane arrays.
   */
  chip_event: z
    .record(z.string(), z.tuple([z.array(keySoundFXEntry), z.array(keySoundFXEntry)]))
    .optional(),
});

/** `KeySoundInvokeLaser` — per-invocation laser slam-sound settings. */
export const keySoundInvokeLaser = z.object({
  vol: double.optional(),
});

/** `KeySoundLaserInfo` — laser slam sounds and volume envelope. */
export const keySoundLaserInfo = z.object({
  /** Slam-sound volume envelope. Defaults to a constant `0.5`. */
  vol: z.array(byPulse(double)).default([[0, 0.5]]),
  /**
   * Slam-triggered sounds, keyed by name (`slam_up`, `slam_down`, `slam_swing`,
   * `slam_mute`, or a custom filename) (optional support).
   */
  slam_event: z
    .record(z.string(), z.array(z.union([uint, byPulse(keySoundInvokeLaser)])))
    .optional(),
  /** Legacy volume-automation settings (optional support). */
  legacy: z.unknown().optional(),
});

/** `KeySoundInfo` — all key-sound configuration. */
export const keySoundInfo = z.object({
  fx: keySoundFXInfo.optional(),
  laser: keySoundLaserInfo.optional(),
});

/* -------------------------------------------------------------------------- */
/* Audio effects                                                              */
/* -------------------------------------------------------------------------- */

/** `AudioEffectDef` — a named audio-effect definition. */
export const audioEffectDef = z.object({
  /** Effect type, e.g. `"flanger"`. */
  type: z.string(),
  /** Parameter values, as a name → string-value map. */
  v: z.record(z.string(), z.string()).optional(),
});

/**
 * `param_change` — effect-name → parameter-name → `ByPulse<string>[]`.
 */
const paramChange = z.record(z.string(), z.record(z.string(), z.array(byPulse(z.string()))));

/** `AudioEffectFXInfo` — effects applied to FX long notes. */
export const audioEffectFXInfo = z.object({
  /** Named effect definitions (insertion-ordered). */
  def: z.array(defKeyValuePair(audioEffectDef)).optional(),
  /** Parameter changes over time. */
  param_change: paramChange.optional(),
  /**
   * Long-note effect invocations, keyed by effect name. Each value is a 2-lane
   * array; a lane entry is a bare pulse or a `ByPulse` of parameter overrides.
   */
  long_event: z
    .record(
      z.string(),
      z.tuple([
        z.array(z.union([uint, byPulse(z.record(z.string(), z.string()))])),
        z.array(z.union([uint, byPulse(z.record(z.string(), z.string()))])),
      ]),
    )
    .optional(),
});

/** `AudioEffectLaserInfo` — effects applied to lasers. */
export const audioEffectLaserInfo = z.object({
  /** Named effect definitions (insertion-ordered). */
  def: z.array(defKeyValuePair(audioEffectDef)).optional(),
  /** Parameter changes over time. */
  param_change: paramChange.optional(),
  /**
   * Pulse-triggered effect invocations, keyed by effect name. Values are plain
   * pulse arrays; parameter changes must go through `param_change` instead.
   */
  pulse_event: z.record(z.string(), z.array(uint)).optional(),
  /** Peaking-filter delay, in milliseconds (`0`–`160`) (optional support). */
  peaking_filter_delay: uint.default(0),
  /** Legacy filter-gain settings (optional support). */
  legacy: z.unknown().optional(),
});

/** `AudioEffectInfo` — FX and laser audio effects. */
export const audioEffectInfo = z.object({
  fx: audioEffectFXInfo.optional(),
  laser: audioEffectLaserInfo.optional(),
});

/* -------------------------------------------------------------------------- */
/* Audio                                                                      */
/* -------------------------------------------------------------------------- */

/** `audio` — all audio-related chart data. */
export const audioInfo = z.object({
  bgm: bgmInfo.optional(),
  key_sound: keySoundInfo.optional(),
  audio_effect: audioEffectInfo.optional(),
});

export type BGMPreviewInfo = z.infer<typeof bgmPreviewInfo>;
export type LegacyBGMInfo = z.infer<typeof legacyBgmInfo>;
export type BGMInfo = z.infer<typeof bgmInfo>;
export type KeySoundInvokeFX = z.infer<typeof keySoundInvokeFX>;
export type KeySoundFXInfo = z.infer<typeof keySoundFXInfo>;
export type KeySoundInvokeLaser = z.infer<typeof keySoundInvokeLaser>;
export type KeySoundLaserInfo = z.infer<typeof keySoundLaserInfo>;
export type KeySoundInfo = z.infer<typeof keySoundInfo>;
export type AudioEffectDef = z.infer<typeof audioEffectDef>;
export type AudioEffectFXInfo = z.infer<typeof audioEffectFXInfo>;
export type AudioEffectLaserInfo = z.infer<typeof audioEffectLaserInfo>;
export type AudioEffectInfo = z.infer<typeof audioEffectInfo>;
export type AudioInfo = z.infer<typeof audioInfo>;
