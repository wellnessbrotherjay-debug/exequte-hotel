import React from 'react';
import { SectionHeader } from '../components/SectionHeader';

export const CoverSection: React.FC<{ brandName: string; tagline?: string; heroUrl?: string; logoUrl?: string }> = ({ brandName, tagline, heroUrl, logoUrl }) => (
  <section id="cover" className="bg-[#f4ede5] rounded-2xl p-6 md:p-10 shadow-sm border border-black/5">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="overflow-hidden rounded-2xl border-2 border-[#8b5cf6]">
        {heroUrl ? (
          <img src={heroUrl} alt="Hero" className="w-full h-full object-cover" />
        ) : (
          <div className="h-80 bg-gradient-to-br from-[#d9c3b8] to-[#f4ede5]" />
        )}
      </div>
      <div className="flex flex-col gap-4 text-right pr-4">
        <p className="text-6xl md:text-7xl font-serif-brand tracking-tight text-gray-800">GLVT</p>
        <p className="text-xl text-gray-800 uppercase tracking-[0.2em]">{tagline || 'Fashion meets wellness'}</p>
        <div className="flex flex-col items-end gap-2">
          {logoUrl && <img src={logoUrl} alt="logo" className="h-12 object-contain" />}
          <p className="text-4xl font-serif-brand text-[#b08a5c]">{brandName}</p>
        </div>
      </div>
    </div>
  </section>
);
