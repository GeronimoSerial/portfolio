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

const benchmarkCache = new Map<string, BenchmarkResult>();
const benchmarkPromises = new Map<string, Promise<BenchmarkResult>>();

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
  const hasRunRef = useRef(false);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    let isActive = true;

    const resolvedIsMobile =
      typeof optionsRef.current.isMobile === "boolean"
        ? optionsRef.current.isMobile
        : typeof window !== "undefined" && window.innerWidth < 1024;
    const resolvedIterations =
      optionsRef.current.iterations ??
      (resolvedIsMobile ? DEFAULT_ITERATIONS_MOBILE : DEFAULT_ITERATIONS_DESKTOP);
    const resolvedMaxTime =
      optionsRef.current.maxTime ??
      (resolvedIsMobile ? DEFAULT_MAX_TIME_MOBILE : DEFAULT_MAX_TIME_DESKTOP);

    const cacheKey = `${resolvedIsMobile}-${resolvedIterations}-${resolvedMaxTime}`;

    const cachedResult = benchmarkCache.get(cacheKey);
    if (cachedResult) {
      setResult(cachedResult);
      return () => {
        isActive = false;
      };
    }

    const existingPromise = benchmarkPromises.get(cacheKey);
    if (existingPromise) {
      setIsRunning(true);
      existingPromise.then((resolved) => {
        if (!isActive) return;
        setResult(resolved);
        setIsRunning(false);
      });
      return () => {
        isActive = false;
      };
    }

    setIsRunning(true);

    const benchmarkPromise = new Promise<BenchmarkResult>((resolve) => {
      // First: quick main-thread check (catches DevTools throttling)
      const mainResult = runMainThreadBenchmark(
        resolvedIterations / 4,
        resolvedMaxTime / 4
      );

      if (!mainResult.passed) {
        resolve({
          passed: false,
          duration: mainResult.duration,
          source: "main",
        });
        return;
      }

      // Then: worker benchmark for more accurate off-thread measurement
      if (typeof window === "undefined" || !window.Worker) {
        resolve({ passed: true, duration: 0, source: "main" });
        return;
      }

      const worker = new Worker("/workers/cpu-benchmark.worker.js");

      worker.onmessage = (e: MessageEvent) => {
        const { passed, duration } = e.data;
        resolve({ passed, duration, source: "worker" });
        worker.terminate();
      };

      worker.onerror = () => {
        resolve({ passed: true, duration: 0, source: "main" });
        worker.terminate();
      };

      worker.postMessage({
        iterations: resolvedIterations,
        maxTime: resolvedMaxTime,
        isMobile: resolvedIsMobile,
      });
    });

    benchmarkPromises.set(cacheKey, benchmarkPromise);

    benchmarkPromise
      .then((resolved) => {
        benchmarkCache.set(cacheKey, resolved);
        benchmarkPromises.delete(cacheKey);
        return resolved;
      })
      .then((resolved) => {
        if (!isActive) return;
        setResult(resolved);
        setIsRunning(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  return {
    result,
    isRunning,
    canRender3d: result?.passed ?? null,
  };
}
