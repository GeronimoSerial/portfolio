import { useState, useEffect } from "react";
import { getGPUTier } from "detect-gpu";

let cachedTier: number | null = null;
let tierPromise: Promise<number> | null = null;
const TIER_TIMEOUT_MS = 4000;

const resolveTier = () =>
  new Promise<number>((resolve) => {
    let settled = false;
    const timeoutId = setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve(1);
    }, TIER_TIMEOUT_MS);

    getGPUTier()
      .then((gpuTier) => gpuTier.tier)
      .catch((error) => {
        console.error(error);
        return 1;
      })
      .then((value) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        resolve(value);
      });
  });

export const useHardwareTier = () => {
  // null =  no sabemos, 0 = muy malo, 1 = bajo, 2 = medio, 3 = alto

  const [tier, setTier] = useState<number | null>(cachedTier);
  const [isLowPowerMode, setIsLowPowerMode] = useState<boolean | null>(null);

  useEffect(() => {
    let isActive = true;

    if (cachedTier !== null) {
      setTier(cachedTier);
      return () => {
        isActive = false;
      };
    }

    if (!tierPromise) {
      tierPromise = resolveTier()
        .then((value) => {
          cachedTier = value;
          return value;
        })
        .finally(() => {
          tierPromise = null;
        });
    }

    tierPromise.then((value) => {
      if (!isActive) return;
      setTier(value);
    });

    return () => {
      isActive = false;
    };
  }, []);

  return { tier, isLowPowerMode, shouldLoad3d: tier !== null && tier >= 2 };
};
