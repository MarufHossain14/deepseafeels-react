import React from "react";

const glassStyle = {
  background: "rgba(255,255,255,0.25)",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
  backdropFilter: "blur(8px)",
  borderRadius: "2rem",
  border: "1.5px solid rgba(255,255,255,0.25)",
};

export default function FishCard({ fish }) {
  if (!fish) return null;
  return (
    <div
      className="flex flex-col items-center p-6 max-w-xs mx-auto mt-6"
      style={{ ...glassStyle, borderColor: fish.color }}
    >
      <div
        className="w-[90px] h-[60px] mb-2"
        dangerouslySetInnerHTML={{ __html: fish.svg }}
        aria-label={fish.name + ' illustration'}
      />
      <h2 className="text-2xl font-bold text-center mb-1" style={{ color: fish.color }}>{fish.name}</h2>
      <div className="text-lg font-semibold text-center mb-2 opacity-80" style={{ color: fish.color }}>{fish.mood}</div>
      <p className="text-center text-base text-slate-700 mb-2">{fish.description}</p>
    </div>
  );
} 