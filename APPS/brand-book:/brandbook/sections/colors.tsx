import React from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { ColorSwatch } from '../components/ColorSwatch';

interface ColorItem {
  name: string;
  hex: string;
  role?: string;
  description?: string;
}

export const ColorsSection: React.FC<{ colors?: ColorItem[] }> = ({ colors }) => {
  const palette = colors && colors.length ? colors : [
    { name: 'Cream Satin', hex: '#F4EDE5', role: 'Primary', description: 'Soft neutral base' },
    { name: 'Obsidian', hex: '#000000', role: 'Primary', description: 'High contrast' },
    { name: 'Soft Beige Rose', hex: '#D9C3B8', role: 'Secondary', description: 'Warm feminine accent' },
    { name: 'Gold Honey', hex: '#D9C3B8', role: 'Secondary', description: 'Luxe highlight' },
  ];
  return (
    <section id="colors" className="bg-white/80 rounded-2xl p-6 md:p-10 shadow-sm border border-black/5">
      <SectionHeader title="Color System" subtitle="Palette" number="06" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {palette.map((c, idx) => (
          <ColorSwatch key={idx} name={c.name} hex={c.hex} role={c.role} description={c.description} />
        ))}
      </div>
    </section>
  );
};
