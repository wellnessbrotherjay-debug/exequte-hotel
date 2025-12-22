import React from 'react';

export const ColorSwatch: React.FC<{ name: string; hex: string; role?: string; description?: string }> = ({ name, hex, role, description }) => (
  <div className="border border-black/5 rounded-xl overflow-hidden shadow-sm bg-white/80">
    <div className="h-24" style={{ backgroundColor: hex }}></div>
    <div className="p-3 space-y-1">
      <p className="text-sm font-medium">{name}</p>
      <p className="text-xs uppercase tracking-wide text-gray-500">{hex}</p>
      {role && <p className="text-xs text-gray-500">Role: {role}</p>}
      {description && <p className="text-xs text-gray-600">{description}</p>}
    </div>
  </div>
);
