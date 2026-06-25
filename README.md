# kson-js

TypeScript types and [Zod](https://zod.dev) schemas for the
[KSON chart format](https://github.com/kshootmania/ksm-chart-format/blob/master/kson_format.md)
used by KShootMania / SOUND VOLTEX-style charts.

KSON is just JSON, so this package is primarily a set of strongly-typed
definitions plus runtime validation. Parsing a chart gives you a fully typed
object with spec-defined defaults filled in.

## Usage

```ts
import { parseKsonString, type Kson } from "kson-js";

const chart: Kson = parseKsonString(await readFile("chart.kson", "utf8"));

console.log(chart.meta.title, chart.meta.artist);
console.log(chart.beat.bpm); // [[0, 120], ...]
console.log(chart.beat.time_sig); // [[0, [4, 4]]] — default filled in
```

### API

| Function                               | Description                                                                |
| -------------------------------------- | -------------------------------------------------------------------------- |
| `parseKson(data: unknown): Kson`       | Validate an already-parsed JSON value. Throws `KsonValidationError`.       |
| `safeParseKson(data: unknown)`         | Same, but returns a Zod `SafeParseResult` instead of throwing.             |
| `parseKsonString(text: string): Kson`  | `JSON.parse` + validate. Throws `KsonParseError` or `KsonValidationError`. |
| `stringifyKson(chart, space?): string` | Validate, then serialize back to JSON.                                     |

The raw Zod schemas (`kson`, `metaInfo`, `beatInfo`, `noteInfo`, …) and every
inferred type (`Kson`, `MetaInfo`, `NoteInfo`, …) are also exported if you want
to compose your own validation.

```ts
import { kson, noteInfo, type NoteInfo } from "kson-js";

const result = noteInfo.safeParse(someNotes);
```

## Development

```bash
vp install   # install dependencies
vp check     # format, lint and type-check
vp test      # run the unit tests
vp pack      # build the library (dist/index.mjs + index.d.mts)
```
