import React, { useState } from 'react';
import { useAppStore } from '../store';
import { bulkInsertCalendar } from '../services/calendarService';
import { fetchDNA } from '../services/dnaService';

export const GridBuilder: React.FC = () => {
  const { activeBrandId } = useAppStore();
  const [campaignId, setCampaignId] = useState('');
  const [days, setDays] = useState(30);
  const [status, setStatus] = useState<string | null>(null);

  const handleBuild = async () => {
    if (!activeBrandId || !campaignId) { setStatus('Select brand and campaign'); return; }
    setStatus('Building grid...');
    try {
      const dna = await fetchDNA(activeBrandId);
      const tone = dna?.tone?.keywords?.join(', ') || 'luxury calm feminine';
      const entries = Array.from({ length: days }).map((_, idx) => {
        const date = new Date();
        date.setDate(date.getDate() + idx);
        return {
          campaign_id: campaignId,
          channel: 'instagram_organic',
          run_type: 'organic',
          scheduled_at: date.toISOString(),
          status: 'planned',
          notes: `Grid slot ${idx + 1} • Tone: ${tone}`
        };
      });
      await bulkInsertCalendar(entries);
      setStatus(`Created ${days} scheduled posts.`);
    } catch (e: any) {
      setStatus(e?.message || 'Failed to build grid');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Grid Builder</h1>
      <p className="text-sm opacity-60">Generate a 30-day feed plan using Brand DNA tone.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="border rounded px-3 py-2" placeholder="Campaign ID" value={campaignId} onChange={(e) => setCampaignId(e.target.value)} />
        <input className="border rounded px-3 py-2" type="number" min={7} max={60} value={days} onChange={(e) => setDays(Number(e.target.value))} />
      </div>
      <button onClick={handleBuild} className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-80">Generate Grid</button>
      {status && <p className="text-sm">{status}</p>}
    </div>
  );
};
