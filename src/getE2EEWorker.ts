export function getE2EEWorker(): Worker {
  return new Worker(new URL("livekit-client/e2ee-worker", import.meta.url));
}
