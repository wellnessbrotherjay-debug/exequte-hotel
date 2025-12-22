import React from 'react';
import { SectionHeader } from '../components/SectionHeader';

export const PersonalitySection: React.FC<{ personality?: string; tone?: string; taglines?: string[] }> = ({ personality, tone, taglines }) => (
  <section id="personality" className="bg-white/80 rounded-2xl p-6 md:p-10 shadow-sm border border-black/5">
    <SectionHeader title="Personality & Tone" subtitle="Voice" number="03" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
      <div className="p-4 bg-white rounded-xl border border-black/5 space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-1">Personality</p>
        <p className="leading-relaxed">{personality || 'Define the brand personality attributes.'}</p>
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mt-4">Tone of Voice</p>
        <p className="leading-relaxed">{tone || 'Describe the tone and communication style.'}</p>
      </div>
      <div className="p-4 bg-white rounded-xl border border-black/5">
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-2">Taglines</p>
        <ul className="space-y-2">
          {(taglines && taglines.length ? taglines : ['Refined wellness', 'Luxury in motion', 'Fashion meets calm']).map((t, idx) => (
            <li key={idx} className="text-lg font-serif-brand">{t}</li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);
