import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAppStore } from '../store';
import { fetchBrandBookData, uploadBrandAsset, insertMoodboardImage } from '../services/brandbookService';
import { CoverSection } from '../brandbook/sections/cover';
import { AboutSection } from '../brandbook/sections/about';
import { MissionSection } from '../brandbook/sections/mission';
import { PersonalitySection } from '../brandbook/sections/personality';
import { LogoSection } from '../brandbook/sections/logo';
import { TypographySection } from '../brandbook/sections/typography';
import { ColorsSection } from '../brandbook/sections/colors';
import { ImagerySection } from '../brandbook/sections/imagery';
import { MoodboardSection } from '../brandbook/sections/moodboard';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const navItems = [
  { id: 'cover', label: 'Cover' },
  { id: 'about', label: 'About' },
  { id: 'mission', label: 'Mission' },
  { id: 'personality', label: 'Personality' },
  { id: 'logo', label: 'Logo' },
  { id: 'typography', label: 'Typography' },
  { id: 'colors', label: 'Colors' },
  { id: 'imagery', label: 'Imagery' },
  { id: 'moodboard', label: 'Moodboard' },
];

export const BrandBookGLVT: React.FC = () => {
  const { activeBrandId, brands, identities, strategySections } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const brand = brands.find((b) => b.id === activeBrandId);
  const identity = identities.find((i) => i.brand_id === activeBrandId);
  const mission = strategySections.find((s) => s.section_type === 'Mission' && s.brand_id === activeBrandId)?.content;
  const vision = strategySections.find((s) => s.section_type === 'Vision' && s.brand_id === activeBrandId)?.content;
  const purpose = strategySections.find((s) => s.section_type === 'Purpose' && s.brand_id === activeBrandId)?.content;

  const loadData = async () => {
    if (!activeBrandId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchBrandBookData(activeBrandId);
      setData(result);
    } catch (e: any) {
      setError(e?.message || 'Failed to load brand book data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeBrandId]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUploadMood = async () => {
    if (!activeBrandId || !file) return;
    try {
      const url = await uploadBrandAsset(activeBrandId, file, 'moodboard');
      const inserted = await insertMoodboardImage(activeBrandId, url, 'upload');
      setData((prev: any) => ({ ...(prev || {}), moodboard: [...(prev?.moodboard || []), inserted] }));
      setFile(null);
    } catch (e: any) {
      setError(e?.message || 'Upload failed');
    }
  };

  const exportPdf = async () => {
    if (!containerRef.current) return;
    const canvas = await html2canvas(containerRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${brand?.name || 'brand'}-brandbook.pdf`);
  };

  const moodImages = data?.moodboard?.map((m: any) => ({ file_url: m.file_url, source: m.source }));
  const colors = data?.colors || data?.colors === undefined ? data?.colors : [];

  if (!activeBrandId) return <div className="p-8">Select a brand to view the brand book.</div>;

  return (
    <div className="flex h-screen">
      <aside className="w-56 border-r border-black/5 bg-[#f8f1e8] p-4 sticky top-0 h-screen overflow-y-auto">
        <h2 className="text-lg font-serif-brand mb-4">Brand Book</h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => scrollTo(item.id)} className="block w-full text-left px-3 py-2 rounded-lg hover:bg-black/5 text-sm">
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-6 space-y-2">
          <button onClick={loadData} className="w-full bg-black text-white px-3 py-2 rounded-lg text-sm hover:opacity-80">Refresh</button>
          <button onClick={exportPdf} className="w-full bg-black text-white px-3 py-2 rounded-lg text-sm hover:opacity-80">Export PDF</button>
          <div className="space-y-2">
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-xs" />
            <button onClick={handleUploadMood} className="w-full bg-black text-white px-3 py-2 rounded-lg text-sm hover:opacity-80">Upload Mood Image</button>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-[#f8f5f0]" ref={containerRef}>
        <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8">
          {loading && <p>Loading...</p>}
          <CoverSection brandName={brand?.name || 'Brand'} tagline={brand?.tagline} heroUrl={data?.assets?.[0]?.file_url} logoUrl={identity?.logo_primary_url} />
          <AboutSection origin={brand?.what_you_sell} philosophy={brand?.values} emotion={brand?.emotions} createdFor={brand?.name} heroUrl={data?.assets?.find((a: any) => a.type?.includes('about'))?.file_url} />
          <MissionSection mission={mission} vision={vision} essence={purpose} />
          <PersonalitySection personality={brand?.personality} tone={brand?.difference} taglines={[brand?.tagline, brand?.niche]} />
          <LogoSection main={data?.logos?.[0]} variants={data?.logos?.slice(1)} />
          <TypographySection data={data?.typography || undefined} />
          <ColorsSection colors={data?.colors} />
          <ImagerySection style={data?.imagery?.style} dos={data?.imagery?.dos} donts={data?.imagery?.donts} />
          <MoodboardSection images={moodImages} />
        </div>
      </main>
    </div>
  );
};
