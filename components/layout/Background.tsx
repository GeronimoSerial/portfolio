export default function BackgroundStatic() {
  return (
    <div
      className="fixed inset-0 -z-50 bg-white dark:bg-black transition-colors duration-300"
      aria-hidden="true"
    >
      {/* Grid pattern adaptativo */}
      <div
        className="absolute inset-0 opacity-20 
                   bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)]
                   dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]"
        style={{ backgroundSize: "80px 80px" }}
      />

      {/* Gradient overlay adaptativo */}
      <div
        className="absolute inset-0 
                   bg-linear-to-b from-zinc-50/50 via-white to-white
                   dark:from-zinc-900/50 dark:via-black dark:to-black"
      />
    </div>
  );
}
