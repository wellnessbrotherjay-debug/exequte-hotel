import React from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { ImageGrid } from '../components/ImageGrid';

interface MoodImage { file_url: string; source?: string; }

export const MoodboardSection: React.FC<{ images?: MoodImage[] }> = ({ images }) => {
  const grid = (images && images.length ? images : Array.from({ length: 9 }).map((_, i) => ({
    url: `https://placehold.co/400x400?text=Mood+${i + 1}`
  }))).map((img) => ({ url: img.file_url || (img as any).url, label: img.source }));

  return (
    <section id="moodboard" className="bg-white/80 rounded-2xl p-6 md:p-10 shadow-sm border border-black/5">
      <SectionHeader title="Moodboard" subtitle="Visual universe" number="08" />
      <ImageGrid images={grid} />
    </section>
  );
};
