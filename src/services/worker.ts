import { parentPort, workerData } from 'worker_threads';

// We can do a bunch of stuff here, in a synchronous way
// without blocking the "main thread"

parentPort?.postMessage(workerData);