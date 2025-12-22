import React from 'react';

export const SectionHeader: React.FC<{ title: string; subtitle?: string; number?: string }> = ({ title, subtitle, number }) => (
  <div className="flex items-end justify-between mb-4">
    <div>
      <p className="uppercase tracking-[0.2em] text-xs text-gray-500">{subtitle}</p>
      <h2 className="text-3xl md:text-4xl font-serif-brand text-gray-800">{title}</h2>
    </div>
    {number && <span className="text-3xl text-gray-400 font-light">{number}</span>}
  </div>
);
