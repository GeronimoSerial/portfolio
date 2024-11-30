"use client";

import * as Dialog from "@radix-ui/react-dialog";

export default function ProyectosDrawer() {
  return (
    <Dialog.Root>
      
      <Dialog.Trigger asChild>
        <button className="text-sm duration-500 text-zinc-500 hover:text-zinc-300">Proyectos</button>
      </Dialog.Trigger>

      <Dialog.Portal>
        
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />

       
        <Dialog.Content
          className="fixed bottom-0 left-0 right-0 max-h-[70%] rounded-t-2xl bg-gradient-to-tl from-indigo-900 p-6 shadow-lg transition-transform duration-300 ease-out"
          style={{
            transform: "translateY(100%)", 
            animation: "slideUp 0.3s ease-out forwards",
          }}
        >
          <Dialog.Title className="text-lg font-semibold text-white">Mis Proyectos</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-400">
            Estoy desarrollando esta sección.
          </Dialog.Description>
          <div className="mt-4 text-white">
            <p>¡Dale, volvé pronto y mirá todo lo que estoy preparando!</p>
          </div>
          <Dialog.Close asChild>
            <button className="mt-4 text-sm text-zinc-300 hover:underline">Cerrar</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>

    
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </Dialog.Root>
  );
}
