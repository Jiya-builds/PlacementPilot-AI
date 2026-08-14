"use client";

export default function AuthBackground() {
  return (
    <>
      {/* Purple Glow */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600/20 blur-[120px] rounded-full" />

      {/* Blue Glow */}
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/20 blur-[140px] rounded-full" />

      {/* Grid */}
      <div className="pointer-events-none absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:60px_60px]" />
    </>
  );
}