import React from 'react';
import { SectionHeader } from '../components/SectionHeader';

interface TypographyData {
  display_font?: string;
  body_font?: string;
  usage?: string;
  dos?: string;
  donts?: string;
  sample_text?: string;
}

export const TypographySection: React.FC<{ data?: TypographyData }> = ({ data }) => (
  <section id="typography" className="bg-white/80 rounded-2xl p-6 md:p-10 shadow-sm border border-black/5">
    <SectionHeader title="Typography" subtitle="Brand guidelines" number="05" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-800">
      <div className="p-4 bg-white rounded-xl border border-black/5 space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Display Font</p>
        <p className="text-lg font-semibold">{data?.display_font || 'ALTA / Cormorant Garamond'}</p>
        <p className="text-sm text-gray-600">{data?.usage || 'Use for titles, statements, luxury moments, taglines.'}</p>
        <p className="text-2xl font-serif-brand mt-2">{data?.sample_text || 'A A B C C D D'}</p>
      </div>
      <div className="p-4 bg-white rounded-xl border border-black/5 space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Body Font</p>
        <p className="text-lg font-semibold">{data?.body_font || 'Montserrat / Inter'}</p>
        <p className="text-sm text-gray-600">Paragraphs, explanations, schedules, forms, brochures.</p>
      </div>
      <div className="p-4 bg-white rounded-xl border border-black/5 space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Usage Rules</p>
        <p className="text-sm text-gray-600">{data?.dos || 'Pair serif elegance with modern sans clarity.'}</p>
        <p className="text-sm text-gray-600">{data?.donts || 'Do not stretch or distort; avoid overusing bold weights.'}</p>
      </div>
    </div>
  </section>
);
