import React from 'react';
import { SectionHeader } from '../components/SectionHeader';

interface LogoVariant {
  file_url: string;
  variant_type: string;
  notes?: string;
}

export const LogoSection: React.FC<{ main?: LogoVariant; variants?: LogoVariant[]; clearSpaceNote?: string; minSizeNote?: string }> = ({
  main,
  variants = [],
  clearSpaceNote,
  minSizeNote
}) => (
  <section id="logo" className="bg-white/80 rounded-2xl p-6 md:p-10 shadow-sm border border-black/5">
    <SectionHeader title="Logo Guidelines" subtitle="Brand" number="04" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-4 bg-white rounded-xl border border-black/5 space-y-3">
        <p className="text-lg font-semibold">Main Logo</p>
        {main?.file_url ? <img src={main.file_url} alt="main logo" className="w-full h-32 object-contain" /> : <div className="h-32 bg-gray-100 rounded" />}
        <p className="text-sm text-gray-600">{main?.notes || 'Signature mark used for primary applications.'}</p>
      </div>
      <div className="p-4 bg-white rounded-xl border border-black/5 space-y-3">
        <p className="text-lg font-semibold">Clear Space</p>
        <p className="text-sm text-gray-600">{clearSpaceNote || 'Leave generous clear space equal to logo height.'}</p>
        <div className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-500">Clear space diagram</div>
      </div>
      <div className="p-4 bg-white rounded-xl border border-black/5 space-y-3">
        <p className="text-lg font-semibold">Minimum Size</p>
        <p className="text-sm text-gray-600">{minSizeNote || 'Digital: 80px width min; Print: 25mm width min.'}</p>
      </div>
    </div>
    {variants.length > 0 && (
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {variants.map((v, idx) => (
          <div key={idx} className="p-3 border border-black/5 rounded-lg bg-white">
            <p className="text-sm font-medium capitalize mb-2">{v.variant_type}</p>
            <img src={v.file_url} alt={v.variant_type} className="w-full h-24 object-contain" />
            {v.notes && <p className="text-xs text-gray-600 mt-2">{v.notes}</p>}
          </div>
        ))}
      </div>
    )}
  </section>
);
