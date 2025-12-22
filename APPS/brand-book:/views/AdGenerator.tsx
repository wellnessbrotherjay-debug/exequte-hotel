import React, { useState } from 'react';
import { useAppStore } from '../store';
import { createCampaign } from '../services/campaignService';
import { fetchDNA } from '../services/dnaService';

export const AdGenerator: React.FC = () => {
  const { activeBrandId, brands } = useAppStore();
  const [goal, setGoal] = useState('Awareness');
  const [audience, setAudience] = useState('Women 25-40, luxury wellness');
  const [budget, setBudget] = useState('5000');
  const [platform, setPlatform] = useState('instagram_ads');
  const [copy, setCopy] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!activeBrandId) { setStatus('Select a brand first'); return; }
    setStatus('Generating ad set...');
    try {
      const dna = await fetchDNA(activeBrandId);
      const tone = dna?.tone?.keywords?.join(', ') || 'luxury, calm, feminine';
      const palette = (dna?.colors && dna.colors.primary) ? `Palette: ${JSON.stringify(dna.colors.primary)}` : 'Warm beige palette';

      const generatedCopy = `Goal: ${goal}. Audience: ${audience}. Tone: ${tone}. ${palette}. CTA: Book now.`;
      setCopy(generatedCopy);

      const payload = {
        brand_id: activeBrandId,
        name: `${brands.find(b => b.id === activeBrandId)?.name || 'Campaign'} - ${goal}`,
        objective: goal,
        budget_total: Number(budget) || 0,
        stage: 'idea',
        brief: { audience, platform, generatedCopy }
      };
      await createCampaign(payload);
      setStatus('Campaign created with generated copy.');
    } catch (e: any) {
      setStatus(e?.message || 'Generation failed');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Ad Generator</h1>
      <p className="text-sm opacity-60">Uses Brand DNA tone to propose ad copy and create a campaign.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="border rounded px-3 py-2" placeholder="Goal" value={goal} onChange={(e) => setGoal(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Audience" value={audience} onChange={(e) => setAudience(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Budget" value={budget} onChange={(e) => setBudget(e.target.value)} />
        <select className="border rounded px-3 py-2" value={platform} onChange={(e) => setPlatform(e.target.value)}>
          <option value="instagram_ads">Instagram Ads</option>
          <option value="facebook_ads">Facebook Ads</option>
          <option value="tiktok_ads">TikTok Ads</option>
        </select>
      </div>
      <button onClick={handleGenerate} className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-80">Generate + Create Campaign</button>
      {status && <p className="text-sm">{status}</p>}
      {copy && (
        <div className="p-4 bg-white/80 rounded-lg border border-black/5">
          <p className="text-sm font-medium">Generated Copy</p>
          <p className="text-sm">{copy}</p>
        </div>
      )}
    </div>
  );
};
