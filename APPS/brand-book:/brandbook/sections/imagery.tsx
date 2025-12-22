import React from 'react';
import { SectionHeader } from '../components/SectionHeader';

export const ImagerySection: React.FC<{ style?: string; dos?: string; donts?: string }> = ({ style, dos, donts }) => (
  <section id="imagery" className="bg-white/80 rounded-2xl p-6 md:p-10 shadow-sm border border-black/5">
    <SectionHeader title="Brand Imagery" subtitle="Visual Language" number="07" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Style</p>
        <p className="leading-relaxed">{style || 'Warm cream tones, women-only focus, minimalist luxury wellness, soft lighting, boutique hotel aesthetics.'}</p>
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mt-4">Do</p>
        <p className="leading-relaxed">{dos || 'Use fashion-inspired poses, neutral palettes, elegant interiors, calm confident expressions.'}</p>
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mt-4">Do Not</p>
        <p className="leading-relaxed">{donts || 'Avoid loud commercial visuals, cluttered backgrounds, harsh lighting, overly saturated colors.'}</p>
      </div>
      <div className="h-64 rounded-2xl overflow-hidden border border-black/5 bg-gradient-to-br from-[#d9c3b8] to-[#f4ede5] flex items-center justify-center text-gray-700 font-serif-brand">
        Imagery examples
      </div>
    </div>
  </section>
);
