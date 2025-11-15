import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
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
  const [delayedLoad, setDelayedLoad] = useState(false);

  // ejecutar carga 50ms después de montar el componente
  useEffect(() => {
    const id = setTimeout(() => {
      setDelayedLoad(true);
    }, 50);
    return () => clearTimeout(id);
  }, []);

  return (
    <>
      <div className="absolute inset-0 z-0 opacity-60">
        {delayedLoad && (
          <Spline
            scene="/assets/spline/scene.splinecode"
            className="w-full h-full"
          />
        )}
      </div>
    </>
  );
}
