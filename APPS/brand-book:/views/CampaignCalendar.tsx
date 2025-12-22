import React, { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '../store';
import { bulkInsertCalendar, listCalendarByCampaign } from '../services/calendarService';
import { listCampaigns } from '../services/campaignService';
import { format } from 'date-fns';

export const CampaignCalendarView: React.FC<{ campaignId: string | null; setActiveCampaignId?: (id: string) => void }> = ({ campaignId, setActiveCampaignId }) => {
  const { activeBrandId } = useAppStore();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [campaignOptions, setCampaignOptions] = useState<any[]>([]);
  const [newEntry, setNewEntry] = useState({ channel: 'instagram_organic', scheduled_at: '', notes: '' });

  const fetchEntries = async () => {
    if (!campaignId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listCalendarByCampaign(campaignId);
      setEntries(data);
    } catch (e: any) {
      setError(e?.message || 'Failed to load calendar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const run = async () => {
      try {
        const all = await listCampaigns();
        const filtered = activeBrandId ? all.filter((c: any) => c.brand_id === activeBrandId) : all;
        setCampaignOptions(filtered);
        if (!campaignId && filtered.length && setActiveCampaignId) {
          setActiveCampaignId(filtered[0].id);
        }
      } catch (e) {
        console.warn('Could not load campaigns', e);
      }
    };
    run();
    fetchEntries();
  }, [campaignId, activeBrandId]);

  const handleSendAutomation = async () => {
    if (!campaignId) return;
    setSending(true);
    setError(null);
    try {
      const sample = [{
        campaign_id: campaignId,
        channel: 'instagram_organic',
        run_type: 'organic',
        scheduled_at: new Date().toISOString(),
        status: 'pending',
        notes: 'Auto generated from BrandOS'
      }];
      const data = await bulkInsertCalendar(sample);
      setEntries((prev) => [...prev, ...data]);
    } catch (e: any) {
      setError(e?.message || 'Failed to send to automation');
    } finally {
      setSending(false);
    }
  };

  const handleCreateEntry = async () => {
    if (!campaignId || !newEntry.scheduled_at) {
      setError('Campaign and schedule time required');
      return;
    }
    setSending(true);
    setError(null);
    try {
      const created = await bulkInsertCalendar([{
        campaign_id: campaignId,
        channel: newEntry.channel,
        scheduled_at: newEntry.scheduled_at,
        run_type: 'organic',
        status: 'planned',
        notes: newEntry.notes
      }]);
      setEntries((prev) => [...prev, ...created]);
      setNewEntry({ channel: 'instagram_organic', scheduled_at: '', notes: '' });
    } catch (e: any) {
      setError(e?.message || 'Failed to add calendar entry');
    } finally {
      setSending(false);
    }
  };

  const grouped = useMemo(() => {
    const map: Record<string, any[]> = {};
    entries.forEach((e) => {
      const day = e.scheduled_at ? e.scheduled_at.slice(0, 10) : 'unscheduled';
      if (!map[day]) map[day] = [];
      map[day].push(e);
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [entries]);

  const textMuted = 'opacity-60';
  if (!campaignId) {
    return (
      <div className="p-8 max-w-xl space-y-4">
        <h1 className="text-2xl font-bold">Content Calendar</h1>
        <p className={textMuted}>Pick a campaign to view schedule.</p>
        {campaignOptions.length > 0 && setActiveCampaignId && (
          <select className="border rounded-lg px-3 py-2" onChange={(e) => setActiveCampaignId(e.target.value)}>
            <option>Select campaign</option>
            {campaignOptions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Calendar</h1>
          <p className={`text-sm ${textMuted}`}>Schedule for this campaign.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchEntries} className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-80">Refresh</button>
          <button disabled={sending} onClick={handleSendAutomation} className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-80 disabled:opacity-50">Send to Automation</button>
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl shadow-sm border border-black/5 space-y-3">
        <h2 className="text-lg font-semibold">Schedule a Post</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select className="border rounded-lg px-3 py-2" value={newEntry.channel} onChange={(e) => setNewEntry({ ...newEntry, channel: e.target.value })}>
            <option value="instagram_organic">instagram_organic</option>
            <option value="facebook_ads">facebook_ads</option>
            <option value="tiktok_ads">tiktok_ads</option>
            <option value="email">email</option>
          </select>
          <input className="border rounded-lg px-3 py-2" type="datetime-local" value={newEntry.scheduled_at} onChange={(e) => setNewEntry({ ...newEntry, scheduled_at: e.target.value })} />
          <input className="border rounded-lg px-3 py-2 md:col-span-3" placeholder="Notes" value={newEntry.notes} onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })} />
        </div>
        <button disabled={sending} onClick={handleCreateEntry} className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-80 disabled:opacity-50">Add Entry</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {grouped.map(([day, dayEntries]) => (
          <div key={day} className="p-4 border border-black/5 rounded-lg bg-white/70 space-y-2">
            <p className="text-sm font-semibold">{day !== 'unscheduled' ? format(new Date(day), 'MMM d, yyyy') : 'Unscheduled'}</p>
            {dayEntries.map((e) => (
              <div key={e.id || e.scheduled_at} className="p-3 rounded bg-black/5">
                <p className="text-sm font-medium">{e.channel} • {e.run_type}</p>
                <p className={`text-xs ${textMuted}`}>Status: {e.status}</p>
                {e.notes && <p className={`text-xs ${textMuted}`}>{e.notes}</p>}
              </div>
            ))}
          </div>
        ))}
      </div>
      {entries.length === 0 && !loading && <p className={`text-sm ${textMuted}`}>No calendar entries yet.</p>}
    </div>
  );
};
