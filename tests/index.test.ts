import { describe, expect, test } from "vite-plus/test";
import {
  KsonParseError,
  KsonValidationError,
  type Kson,
  parseKson,
  parseKsonString,
  safeParseKson,
  stringifyKson,
} from "../src/index.ts";

/** A minimal but valid kson chart. */
const minimalChart = {
  format_version: 1,
  meta: {
    title: "Test Song",
    artist: "Test Artist",
    chart_author: "Tester",
    difficulty: 0,
    level: 10,
    disp_bpm: "120",
  },
  beat: {
    bpm: [[0, 120]],
  },
} satisfies Record<string, unknown>;

describe("parseKson", () => {
  test("accepts a minimal valid chart", () => {
    const chart = parseKson(minimalChart);
    expect(chart.meta.title).toBe("Test Song");
    expect(chart.format_version).toBe(1);
  });

  test("fills in spec defaults", () => {
    const chart = parseKson(minimalChart);
    expect(chart.beat.time_sig).toEqual([[0, [4, 4]]]);
    expect(chart.beat.scroll_speed).toEqual([[0, 1.0]]);
  });

  test("fills in nested defaults when a parent object is present", () => {
    const chart = parseKson({
      ...minimalChart,
      audio: { bgm: { filename: "song.ogg" } },
    });
    expect(chart.audio?.bgm?.vol).toBe(1.0);
    expect(chart.audio?.bgm?.offset).toBe(0);
  });

  test("accepts notes, lasers and curves", () => {
    const chart = parseKson({
      ...minimalChart,
      note: {
        bt: [[[0, 0]], [240], [], []],
        fx: [[[480, 240]], []],
        laser: [
          [
            [
              0,
              [
                [0, 0.0],
                [240, [0.5, 0.5], [0.5, 0.5]],
              ],
              1,
            ],
          ],
          [],
        ],
      },
    });
    expect(chart.note?.bt?.[0]).toEqual([[0, 0]]);
    expect(chart.note?.laser?.[0]?.[0]?.[0]).toBe(0);
  });

  test("rejects a chart missing required fields", () => {
    expect(() => parseKson({ format_version: 1 })).toThrow(KsonValidationError);
  });

  test("rejects null values", () => {
    expect(() => parseKson({ ...minimalChart, gauge: null })).toThrow(KsonValidationError);
  });

  test("exposes Zod issues on the error", () => {
    try {
      parseKson({ format_version: 1 });
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(KsonValidationError);
      expect((error as KsonValidationError).issues.length).toBeGreaterThan(0);
    }
  });
});

describe("safeParseKson", () => {
  test("returns success for valid input", () => {
    const result = safeParseKson(minimalChart);
    expect(result.success).toBe(true);
  });

  test("returns failure without throwing for invalid input", () => {
    const result = safeParseKson({});
    expect(result.success).toBe(false);
  });
});

describe("parseKsonString", () => {
  test("parses and validates a JSON string", () => {
    const chart = parseKsonString(JSON.stringify(minimalChart));
    expect(chart.meta.artist).toBe("Test Artist");
  });

  test("throws KsonParseError on malformed JSON", () => {
    expect(() => parseKsonString("{not json")).toThrow(KsonParseError);
  });
});

describe("stringifyKson", () => {
  test("round-trips a chart through string form", () => {
    const chart = parseKson(minimalChart) satisfies Kson;
    const restored = parseKsonString(stringifyKson(chart));
    expect(restored).toEqual(chart);
  });
});
