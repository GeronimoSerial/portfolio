"use client";

import { ArrowDown } from "lucide-react";

export default function SendMessage() {
  return (
    <button
      onClick={() =>
        document
          .getElementById("contact")
          ?.scrollIntoView({ behavior: "smooth" })
      }
      className="mt-6 inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
    >
      Enviar mensaje
      <ArrowDown className="h-4 w-4" />
    </button>
  );
}
