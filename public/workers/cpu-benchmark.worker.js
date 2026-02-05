// CPU Benchmark Web Worker
// Runs CPU-intensive calculations off the main thread

self.onmessage = function (e) {
  const { iterations, maxTime, isMobile } = e.data;

  const start = performance.now();
  let sink = 0;

  for (let i = 0; i < iterations; i++) {
    sink += Math.sqrt(i + (sink % 13));
  }

  const duration = performance.now() - start;
  const passed = duration <= maxTime;

  self.postMessage({
    passed,
    duration,
    sink, // prevent dead code elimination
    isMobile,
  });
};
