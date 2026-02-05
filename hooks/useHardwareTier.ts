import { useState, useEffect } from "react";
import { getGPUTier } from "detect-gpu";

let cachedTier: number | null = null;
let tierPromise: Promise<number> | null = null;

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
      tierPromise = getGPUTier()
        .then((gpuTier) => gpuTier.tier)
        .catch((error) => {
          console.error(error);
          return 1;
        })
        .then((value) => {
          cachedTier = value;
          tierPromise = null;
          return value;
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
