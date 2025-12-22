import React from 'react';
import { SectionHeader } from '../components/SectionHeader';

export const AboutSection: React.FC<{ origin?: string; philosophy?: string; emotion?: string; createdFor?: string; heroUrl?: string }> = ({
  origin,
  philosophy,
  emotion,
  createdFor,
  heroUrl
}) => (
  <section id="about" className="bg-[#f4ede5] rounded-2xl p-6 md:p-10 shadow-sm border border-black/5">
    <SectionHeader title="About" subtitle="Brand guidelines" number="01" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="overflow-hidden rounded-2xl border border-black/5">
        {heroUrl ? <img src={heroUrl} alt="about" className="w-full h-full object-cover" /> : <div className="h-72 bg-gray-200" />}
      </div>
      <div className="space-y-4 text-gray-800">
        <p className="leading-relaxed">{origin || 'Tell the origin story here.'}</p>
        <p className="leading-relaxed">{philosophy || 'Add the brand philosophy to capture intent and feel.'}</p>
        <p className="leading-relaxed">{emotion || 'Describe the emotional landscape of the brand.'}</p>
        {createdFor && <p className="text-lg font-serif-brand">Created for: {createdFor}</p>}
      </div>
    </div>
  </section>
);
