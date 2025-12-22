import React from 'react';
import { SectionHeader } from '../components/SectionHeader';

export const MissionSection: React.FC<{ mission?: string; vision?: string; essence?: string }> = ({ mission, vision, essence }) => (
  <section id="mission" className="bg-white/80 rounded-2xl p-6 md:p-10 shadow-sm border border-black/5">
    <SectionHeader title="Mission · Vision · Essence" subtitle="Direction" number="02" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-800">
      <div className="p-4 bg-white/80 rounded-xl border border-black/5">
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-2">Mission</p>
        <p className="leading-relaxed">{mission || 'State the mission clearly and succinctly.'}</p>
      </div>
      <div className="p-4 bg-white/80 rounded-xl border border-black/5">
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-2">Vision</p>
        <p className="leading-relaxed">{vision || 'Describe the vision for the brand future.'}</p>
      </div>
      <div className="p-4 bg-white/80 rounded-xl border border-black/5">
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-2">Essence</p>
        <p className="leading-relaxed">{essence || 'Capture the brand essence in one statement.'}</p>
      </div>
    </div>
  </section>
);
