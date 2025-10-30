import React from "react";
import Particles from "./components/particles";

export default function Home() {
  return (
    <div className="overflow-x-hidden overflow-y-hidden flex flex-col items-center justify-center w-full h-screen overflow-hidden bg-gradient-to-tl from-indigo-900 via-indigo-400/10">
			<Particles
			  className="absolute inset-0 -z-10 animate-fade-in"
			  quantity={200}
			/>
      
      <div className="max-w-2xl px-6 text-center">
        <div className="w-full h-px animate-glow animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0 mb-8" />
        
        <h1 className="py-3.5 px-0.5 z-10 text-4xl text-transparent duration-1000 bg-white cursor-default text-edge-outline animate-title font-display sm:text-5xl md:text-7xl whitespace-nowrap bg-clip-text mb-8">
          geroserial.com
        </h1>

        <div className="w-full h-px animate-glow animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0 mb-8" />
        
        <div className="my-8 animate-fade-in space-y-4">
          <h2 className="text-xl text-zinc-300">
            Actualizando el portfolio
          </h2>
          <p className="text-lg font-semibold text-indigo-300 mt-6">
            Regresa pronto
          </p>
        </div>
      </div>
    </div>
  );
}
