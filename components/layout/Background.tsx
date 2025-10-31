export default function BackgroundStatic() {
  return (
    <div className="fixed inset-0 -z-50 bg-black">
      {/* Grid pattern estático */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-zinc-900/50 via-black to-black" />
    </div>
  );
}
