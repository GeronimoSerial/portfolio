import { useState, useEffect } from "react";
import { getGPUTier } from "detect-gpu";

export const useHardwareTier = () => {
  // null =  no sabemos, 0 = muy malo, 1 = bajo, 2 = medio, 3 = alto

  const [tier, setTier] = useState<number | null>(null);
  const [isLowPowerMode, setIsLowPowerMode] = useState<boolean | null>(null);

  useEffect(() => {
    const checkHardware = async () => {
      try {
        const gpuTier = await getGPUTier();
        setTier(gpuTier.tier);
      } catch (error) {
        console.error(error);
        setTier(1);
      }
    };
    checkHardware();
  }, []);

  return { tier, isLowPowerMode, shouldLoad3d: tier !== null && tier >= 2 };
};
