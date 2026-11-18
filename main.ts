// The World Today — Wednesday 18 November 2026. entry.png sits beside this file and is copied to the
// grader's /output/entry.png. Node 22, standard library only, no network.
// The image is pre-rendered, so the copy is byte for byte the committed file and both runs agree.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const LIMIT = 1048576; // the gate's 1 MiB cap
const image = new URL('./entry.png', import.meta.url);
const bytes = statSync(image).size;
if (bytes > LIMIT) throw new Error(`entry.png is ${bytes} bytes, over the ${LIMIT}-byte limit`);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const out = join(outDir, 'entry.png');
copyFileSync(image, out);
if (statSync(out).size !== bytes) throw new Error('the copy is not the same size as entry.png');
console.log(`wrote ${out} (${bytes} bytes)`);
