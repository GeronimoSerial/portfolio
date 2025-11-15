import { request } from "http";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black/20">
      <div className="animate-pulse text-zinc-500 text-sm">
        Cargando escena 3D...
      </div>
    </div>
  ),
});

export default function Robot() {
  const splineRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (!isReady || !splineRef.current) return;

    if (inView) {
      try {
        splineRef.current.start();
      } catch (error) {
        console.error("Error starting Spline animation:", error);
      }
    } else {
      splineRef.current.stop();
    }
  }, [inView]);

  return (
    <>
      <div
        ref={ref}
        className="absolute inset-0 z-0 opacity-60  -translate-y-16 lg:-translate-y-24"
      >
        <Spline
          scene="/assets/spline/scene.splinecode"
          onLoad={(scene) => {
            splineRef.current = scene;
            requestAnimationFrame(() => setIsReady(true));
          }}
          className="w-full h-full"
        />
      </div>
    </>
  );
}
