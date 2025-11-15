import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
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
  const [mounted, setMounted] = useState(false);

  // ejecutar carga 50ms después de montar el componente
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      const id = setTimeout(() => {
        setMounted(true), 50;
      }, 50);
      return () => clearTimeout(id);
    } else {
      setMounted(false);
    }
  }, [inView]);

  return (
    <>
      <div
        ref={ref}
        className="absolute inset-0 z-0 opacity-60  -translate-y-16 lg:-translate-y-24"
      >
        {mounted && (
          <Spline
            scene="/assets/spline/scene.splinecode"
            className="w-full h-full"
          />
        )}
      </div>
    </>
  );
}
