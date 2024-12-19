import Link from "next/link";
import React from "react";
import Particles from "./components/particles";
import ProyectosDrawer from "./components/proyectosDrawer";

const navigation = [
  { name: "Perfil", href: "/perfil" },
  { name: "Contacto", href: "/contacto" },
];

export default function Home() {
  return (
    <div className="overflow-x-hidden overflow-y-hidden flex flex-col items-center justify-center w-full h-screen overflow-hidden bg-gradient-to-tl from-indigo-900 via-indigo-400/10">
			<Particles
			  className="absolute inset-0 -z-10 animate-fade-in"
			  quantity={200}
			/>
      <nav className="my-6 animate-fade-in">
        <ul className="flex items-center justify-center gap-4">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm duration-500 text-zinc-500 hover:text-zinc-300"
            >
              {item.name}
            </Link>
          ))}

          <ProyectosDrawer />
        </ul>
      </nav>
      <div className="w-screen h-px animate-glow  animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      <h1 className="py-3.5 px-0.5 z-10 text-5xl text-transparent duration-1000 bg-white cursor-default text-edge-outline animate-title font-display sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text ">
        geroserial.com
      </h1>

      <div className="w-screen h-px animate-glow animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      <div className="my-16 text-center animate-fade-in">
        <h2 className="text-sm text-zinc-500 ">
          Desarrollando{" "}
          <Link
            target="_blank"
            href="https://www.geroserial.com/"
            className="underline duration-500 hover:text-zinc-300"
          >
            geroserial.com
          </Link>{" "}
          para acercar soluciones tecnológicas que mejoren y simplifiquen tus
          proyectos.
        </h2>
      </div>
    </div>
  );
}
