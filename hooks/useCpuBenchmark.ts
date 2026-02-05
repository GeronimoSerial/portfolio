"use client";

import { useState, useEffect, useRef } from "react";

type BenchmarkResult = {
  passed: boolean;
  duration: number;
  source: "worker" | "main";
};

type UseCpuBenchmarkOptions = {
  iterations?: number;
  maxTime?: number;
  isMobile?: boolean;
};

const DEFAULT_ITERATIONS_DESKTOP = 800000;
const DEFAULT_ITERATIONS_MOBILE = 600000;
const DEFAULT_MAX_TIME_DESKTOP = 35;
const DEFAULT_MAX_TIME_MOBILE = 45;

function runMainThreadBenchmark(
  iterations: number,
  maxTime: number
): BenchmarkResult {
  const start = performance.now();
  let sink = 0;

  for (let i = 0; i < iterations; i++) {
    sink += Math.sqrt(i + (sink % 13));
  }

  const duration = performance.now() - start;
  void sink;

  return {
    passed: duration <= maxTime,
    duration,
    source: "main",
  };
}

export function useCpuBenchmark(options: UseCpuBenchmarkOptions = {}) {
  const [result, setResult] = useState<BenchmarkResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const hasRunRef = useRef(false);

  const {
    isMobile = false,
    iterations = isMobile
      ? DEFAULT_ITERATIONS_MOBILE
      : DEFAULT_ITERATIONS_DESKTOP,
    maxTime = isMobile ? DEFAULT_MAX_TIME_MOBILE : DEFAULT_MAX_TIME_DESKTOP,
  } = options;

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    // First: quick main-thread check (catches DevTools throttling)
    const mainResult = runMainThreadBenchmark(iterations / 4, maxTime / 4);

    if (!mainResult.passed) {
      setResult({
        passed: false,
        duration: mainResult.duration,
        source: "main",
      });
      return;
    }

    // Then: worker benchmark for more accurate off-thread measurement
    if (typeof window === "undefined" || !window.Worker) {
      setResult({ passed: true, duration: 0, source: "main" });
      return;
    }

    setIsRunning(true);

    const worker = new Worker("/workers/cpu-benchmark.worker.js");
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent) => {
      const { passed, duration } = e.data;
      setResult({ passed, duration, source: "worker" });
      setIsRunning(false);
      worker.terminate();
      workerRef.current = null;
    };

    worker.onerror = () => {
      setResult({ passed: true, duration: 0, source: "main" });
      setIsRunning(false);
      worker.terminate();
      workerRef.current = null;
    };

    worker.postMessage({ iterations, maxTime, isMobile });

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [iterations, maxTime, isMobile]);

  return {
    result,
    isRunning,
    canRender3d: result?.passed ?? null,
  };
}
