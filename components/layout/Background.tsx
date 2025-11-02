// import { cn } from "@/lib/utils";
// import React from "react";

// export function Background({ children }: { children: React.ReactNode }) {
//   return (
//     <>
//       <div className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-black">
//         <div
//           className={cn(
//             "absolute inset-0",
//             "[background-size:20px_20px]",
//             "bg-[image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
//             "dark:bg-[image:radial-gradient(#404040_1px,transparent_1px)]"
//           )}
//         />
//         {/* Radial gradient for the container to give a faded look */}
//         <div className="pointer-events-none absolute inset-0 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />
//       </div>
//       {children}
//     </>
//   );
// }

import { cn } from "@/lib/utils";
import React from "react";

export function Background({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-black">
        <div
          className={cn(
            "absolute inset-0",
            "opacity-0 md:opacity-90",
            "[background-size:40px_40px]",
            "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
            "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
          )}
        />
        {/* Radial gradient for the container to give a faded look */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
        <p className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-7xl"></p>
      </div>
      {children}
    </>
  );
}
