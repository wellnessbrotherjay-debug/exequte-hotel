import React, { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '../store';
import { listMetricsByCampaign } from '../services/metricsService';
import { insertInsight, listInsightsByCampaign } from '../services/insightsService';
import { listCampaigns } from '../services/campaignService';
import { format } from 'date-fns';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';

export const CampaignInsightsView: React.FC<{ campaignId: string | null; setActiveCampaignId?: (id: string) => void }> = ({ campaignId, setActiveCampaignId }) => {
  const { activeBrandId } = useAppStore();
  const [metrics, setMetrics] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [campaignOptions, setCampaignOptions] = useState<any[]>([]);

  const fetchData = async () => {
    if (!campaignId) return;
    setLoading(true);
    setError(null);
    try {
      const [m, i] = await Promise.all([
        listMetricsByCampaign(campaignId),
        listInsightsByCampaign(campaignId)
      ]);
      setMetrics(m);
      setInsights(i);
    } catch (e: any) {
      setError(e?.message || 'Failed to load metrics/insights');
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
    fetchData();
  }, [campaignId, activeBrandId]);

  const handleGenerateInsight = async () => {
    if (!campaignId) return;
    setGenerating(true);
    setError(null);
    try {
      const summary = 'Auto insight: review performance and adjust targeting.';
      const recommendations = 'Increase budget on top channels; iterate creatives with higher CTR.';
      const created = await insertInsight({
        campaign_id: campaignId,
        summary,
        recommendations,
        raw_json: { generated_at: new Date().toISOString(), notes: 'Sample AI stub' }
      });
      setInsights((prev) => [created, ...prev]);
    } catch (e: any) {
      setError(e?.message || 'Failed to generate insights');
    } finally {
      setGenerating(false);
    }
  };

  const aggregated = useMemo(() => {
    const map: Record<string, any> = {};
    metrics.forEach((m) => {
      const day = m.metric_date;
      if (!map[day]) map[day] = { impressions: 0, clicks: 0, leads: 0, purchases: 0, spend: 0 };
      map[day].impressions += m.impressions || 0;
      map[day].clicks += m.clicks || 0;
      map[day].leads += m.leads || 0;
      map[day].purchases += m.purchases || 0;
      map[day].spend += Number(m.spend || 0);
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [metrics]);

  const textMuted = 'opacity-60';
  if (!campaignId) {
    return (
      <div className="p-8 max-w-xl space-y-4">
        <h1 className="text-2xl font-bold">Insights</h1>
        <p className={textMuted}>Pick a campaign to view metrics.</p>
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
          <h1 className="text-3xl font-bold">Metrics & Insights</h1>
          <p className={`text-sm ${textMuted}`}>Performance by day with AI insights.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData} className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-80">Refresh</button>
          <button disabled={generating} onClick={handleGenerateInsight} className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-80 disabled:opacity-50">Generate Insights</button>
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl shadow-sm border border-black/5">
        <h2 className="text-lg font-semibold mb-3">Daily Metrics</h2>
        {aggregated.length === 0 && <p className={`text-sm ${textMuted}`}>No metrics yet.</p>}
        {aggregated.length > 0 && (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={aggregated.map(([day, m]) => ({ day, ...m }))}>
                <XAxis dataKey="day" tickFormatter={(d) => format(new Date(d), 'MM/dd')} />
                <YAxis />
                <Tooltip labelFormatter={(d) => format(new Date(d), 'MMM d, yyyy')} />
                <Legend />
                <Line type="monotone" dataKey="impressions" stroke="#4f46e5" dot={false} />
                <Line type="monotone" dataKey="clicks" stroke="#22c55e" dot={false} />
                <Line type="monotone" dataKey="leads" stroke="#f59e0b" dot={false} />
                <Line type="monotone" dataKey="purchases" stroke="#ef4444" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {aggregated.map(([day, m]) => (
            <div key={day} className="p-3 rounded-lg border border-black/5 bg-white/70">
              <p className="text-sm font-semibold">{format(new Date(day), 'MMM d, yyyy')}</p>
              <p className={`text-xs ${textMuted}`}>Impressions: {m.impressions} • Clicks: {m.clicks} • Leads: {m.leads} • Purchases: {m.purchases}</p>
              <p className={`text-xs ${textMuted}`}>Spend: {m.spend}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl shadow-sm border border-black/5">
        <h2 className="text-lg font-semibold mb-3">Insights</h2>
        {insights.length === 0 && <p className={`text-sm ${textMuted}`}>No insights yet.</p>}
        <div className="space-y-3">
          {insights.map((insight) => (
            <div key={insight.id} className="p-4 border border-black/5 rounded-lg bg-white/70">
              <p className="text-sm font-semibold">{insight.generated_at ? format(new Date(insight.generated_at), 'MMM d, yyyy HH:mm') : 'Generated'}</p>
              <p className="text-sm">{insight.summary}</p>
              {insight.recommendations && <p className={`text-xs ${textMuted}`}>{insight.recommendations}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
