import React, { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '../store';
import { createCampaign as createCampaignApi, listCampaigns } from '../services/campaignService';
import { format } from 'date-fns';

interface Campaign {
  id: string;
  brand_id: string;
  name: string;
  objective?: string;
  stage?: string;
  primary_kpi?: string;
  budget_total?: number;
  start_date?: string;
  end_date?: string;
  created_at?: string;
}

export const CampaignsView: React.FC<{ setView: (v: any) => void; setActiveCampaignId: (id: string) => void }> = ({ setView, setActiveCampaignId }) => {
  const { activeBrandId, brands } = useAppStore();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', objective: '', budget_total: '', primary_kpi: '', start_date: '', end_date: '' });
  const [creating, setCreating] = useState(false);

  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listCampaigns();
      const filtered = activeBrandId ? data.filter((c: Campaign) => c.brand_id === activeBrandId) : data;
      setCampaigns(filtered);
      if (filtered.length) {
        setActiveCampaignId(filtered[0].id);
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [activeBrandId]);

  const handleCreate = async () => {
    if (!activeBrandId || !form.name) {
      setError('Active brand and name required');
      return;
    }
    setCreating(true);
    setError(null);
    try {
      const payload = {
        brand_id: activeBrandId,
        name: form.name,
        objective: form.objective,
        budget_total: Number(form.budget_total) || undefined,
        primary_kpi: form.primary_kpi,
        start_date: form.start_date || undefined,
        end_date: form.end_date || undefined,
        stage: 'idea',
      };
      const created = await createCampaignApi(payload);
      setCampaigns((prev) => [created, ...prev]);
      setForm({ name: '', objective: '', budget_total: '', primary_kpi: '', start_date: '', end_date: '' });
    } catch (e: any) {
      setError(e?.message || 'Failed to create campaign');
    } finally {
      setCreating(false);
    }
  };

  const textMuted = 'opacity-60';

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className={`text-sm ${textMuted}`}>Manage campaigns for the selected brand.</p>
        </div>
        <button onClick={fetchCampaigns} className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-80">Refresh</button>
      </div>

      <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl shadow-sm border border-black/5">
        <h2 className="text-lg font-semibold mb-4">Create Campaign</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input className="border rounded-lg px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="border rounded-lg px-3 py-2" placeholder="Objective" value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })} />
          <input className="border rounded-lg px-3 py-2" placeholder="Primary KPI" value={form.primary_kpi} onChange={(e) => setForm({ ...form, primary_kpi: e.target.value })} />
          <input className="border rounded-lg px-3 py-2" placeholder="Budget" value={form.budget_total} onChange={(e) => setForm({ ...form, budget_total: e.target.value })} />
          <input className="border rounded-lg px-3 py-2" type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
          <input className="border rounded-lg px-3 py-2" type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
        </div>
        <div className="mt-4 flex gap-3">
          <button disabled={creating} onClick={handleCreate} className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-80 disabled:opacity-50">Generate Campaign</button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl shadow-sm border border-black/5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">All Campaigns</h2>
          {loading && <span className="text-sm">Loading...</span>}
        </div>
        {campaigns.length === 0 && !loading && <p className={`text-sm ${textMuted}`}>No campaigns found for this brand.</p>}
        <div className="space-y-3">
          {campaigns.map((c) => (
            <div key={c.id} className="p-4 border border-black/5 rounded-lg bg-white/70 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="text-base font-semibold">{c.name}</p>
                <p className={`text-sm ${textMuted}`}>{c.objective || 'No objective'} • {c.stage || 'idea'} • {c.primary_kpi || 'KPI?'}</p>
                <p className={`text-xs ${textMuted}`}>Budget: {c.budget_total ?? '-'} • Created: {c.created_at ? format(new Date(c.created_at), 'MMM d, yyyy') : '-'}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => { setActiveCampaignId(c.id); setView('campaignDetail'); }} className="px-3 py-1 bg-black text-white rounded text-xs hover:opacity-80">Open</button>
                <button onClick={() => { setActiveCampaignId(c.id); setView('campaignChannels'); }} className="px-3 py-1 bg-black text-white rounded text-xs hover:opacity-80">Channels</button>
                <button onClick={() => { setActiveCampaignId(c.id); setView('campaignAssets'); }} className="px-3 py-1 bg-black text-white rounded text-xs hover:opacity-80">Assets</button>
                <button onClick={() => { setActiveCampaignId(c.id); setView('campaignCalendar'); }} className="px-3 py-1 bg-black text-white rounded text-xs hover:opacity-80">Calendar</button>
                <button onClick={() => { setActiveCampaignId(c.id); setView('campaignInsights'); }} className="px-3 py-1 bg-black text-white rounded text-xs hover:opacity-80">Insights</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
