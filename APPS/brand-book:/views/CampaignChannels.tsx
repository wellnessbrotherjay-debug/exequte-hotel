import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { addChannels, listChannels, updateChannel } from '../services/campaignService';

const channelOptions = ['facebook_ads', 'instagram_ads', 'tiktok_ads', 'email', 'whatsapp', 'website', 'in_room_tv'];

export const CampaignChannelsView: React.FC<{ campaignId: string | null; setActiveCampaignId?: (id: string) => void }> = ({ campaignId, setActiveCampaignId }) => {
  const { activeBrandId } = useAppStore();
  const [channels, setChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ channel: 'facebook_ads', daily_budget: '', status: 'planned', targeting: '{}', placements: '{}' });
  const [saving, setSaving] = useState(false);

  const fetchChannels = async () => {
    if (!campaignId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listChannels(campaignId);
      setChannels(data);
    } catch (e: any) {
      setError(e?.message || 'Failed to load channels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, [campaignId, activeBrandId]);

  const handleAdd = async () => {
    if (!campaignId) return;
    setSaving(true);
    setError(null);
    try {
      const newChannels = [{
        channel: form.channel,
        daily_budget: form.daily_budget ? Number(form.daily_budget) : null,
        status: form.status,
        targeting: JSON.parse(form.targeting || '{}'),
        placements: JSON.parse(form.placements || '{}'),
      }];
      const created = await addChannels(campaignId, newChannels);
      setChannels((prev) => [...prev, ...created]);
      setForm({ channel: 'facebook_ads', daily_budget: '', status: 'planned', targeting: '{}', placements: '{}' });
    } catch (e: any) {
      setError(e?.message || 'Failed to add channel');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string, field: string, value: any) => {
    try {
      const updates: any = { [field]: value };
      if (field === 'targeting' || field === 'placements') {
        updates[field] = JSON.parse(value || '{}');
      }
      const updated = await updateChannel(id, updates);
      setChannels((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch (e) {
      setError((e as any)?.message || 'Update failed');
    }
  };

  const textMuted = 'opacity-60';

  if (!campaignId) return <div className="p-8">Select a campaign from Campaigns, then open Channels.</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Channel Setup</h1>
          <p className={`text-sm ${textMuted}`}>Configure delivery channels for this campaign.</p>
        </div>
        <button onClick={fetchChannels} className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-80">Refresh</button>
      </div>

      <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl shadow-sm border border-black/5 space-y-3">
        <h2 className="text-lg font-semibold">Add Channel</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select className="border rounded-lg px-3 py-2" value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })}>
            {channelOptions.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input className="border rounded-lg px-3 py-2" placeholder="Daily budget" value={form.daily_budget} onChange={(e) => setForm({ ...form, daily_budget: e.target.value })} />
          <select className="border rounded-lg px-3 py-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="planned">planned</option>
            <option value="active">active</option>
            <option value="paused">paused</option>
          </select>
          <textarea className="border rounded-lg px-3 py-2 md:col-span-2" rows={3} placeholder="Targeting JSON" value={form.targeting} onChange={(e) => setForm({ ...form, targeting: e.target.value })} />
          <textarea className="border rounded-lg px-3 py-2 md:col-span-2" rows={3} placeholder="Placements JSON" value={form.placements} onChange={(e) => setForm({ ...form, placements: e.target.value })} />
        </div>
        <div className="mt-3">
          <button disabled={saving} onClick={handleAdd} className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-80 disabled:opacity-50">Add Channel</button>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl shadow-sm border border-black/5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Channels</h2>
          {loading && <span className="text-sm">Loading...</span>}
        </div>
        {channels.length === 0 && !loading && <p className={`text-sm ${textMuted}`}>No channels yet.</p>}
        <div className="space-y-4">
          {channels.map((c) => (
            <div key={c.id} className="p-4 border border-black/5 rounded-lg bg-white/70 space-y-2">
              <div className="flex flex-wrap gap-3 items-center justify-between">
                <div>
                  <p className="text-base font-semibold capitalize">{c.channel}</p>
                  <p className={`text-sm ${textMuted}`}>Status: {c.status}</p>
                </div>
                <div className="flex gap-2">
                  <input className="border rounded px-2 py-1 text-sm" value={c.daily_budget ?? ''} onChange={(e) => handleUpdate(c.id, 'daily_budget', Number(e.target.value) || null)} />
                  <select className="border rounded px-2 py-1 text-sm" value={c.status || 'planned'} onChange={(e) => handleUpdate(c.id, 'status', e.target.value)}>
                    <option value="planned">planned</option>
                    <option value="active">active</option>
                    <option value="paused">paused</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-medium">Targeting</p>
                  <textarea className="w-full border rounded px-2 py-2 text-xs" rows={3} value={JSON.stringify(c.targeting || {}, null, 2)} onChange={(e) => handleUpdate(c.id, 'targeting', e.target.value)} />
                </div>
                <div>
                  <p className="text-xs font-medium">Placements</p>
                  <textarea className="w-full border rounded px-2 py-2 text-xs" rows={3} value={JSON.stringify(c.placements || {}, null, 2)} onChange={(e) => handleUpdate(c.id, 'placements', e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
