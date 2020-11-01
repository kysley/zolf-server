/**
 * The reason for this file is so that `worker_threads` can resolve the .ts file
 * as `worker_threads` lib doesn't support .ts file extensions out of the box.
 *
 * This will resolve `worker.ts` so that it can be called by `Worker` in `RoundController.ts`
 */
const path = require('path');
const { workerData } = require('worker_threads');

require('ts-node').register();
require(path.resolve(__dirname, workerData.path));