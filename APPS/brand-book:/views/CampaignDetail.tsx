import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { getCampaign } from '../services/campaignService';
import { format } from 'date-fns';

export const CampaignDetailView: React.FC<{ campaignId: string | null; setView: (v: any) => void }> = ({ campaignId, setView }) => {
  const { activeBrandId } = useAppStore();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!campaignId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getCampaign(campaignId);
        if (activeBrandId && data.brand_id !== activeBrandId) {
          setError('Campaign does not belong to the active brand');
        }
        setCampaign(data);
      } catch (e: any) {
        setError(e?.message || 'Failed to load campaign');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [campaignId, activeBrandId]);

  const textMuted = 'opacity-60';

  if (!campaignId) return <div className="p-8">Select a campaign from the list.</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaign Detail</h1>
          <p className={`text-sm ${textMuted}`}>{campaign?.name || 'Loading...'}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('campaignChannels')} className="bg-black text-white px-3 py-1 rounded text-sm hover:opacity-80">Channels</button>
          <button onClick={() => setView('campaignAssets')} className="bg-black text-white px-3 py-1 rounded text-sm hover:opacity-80">Assets</button>
          <button onClick={() => setView('campaignCalendar')} className="bg-black text-white px-3 py-1 rounded text-sm hover:opacity-80">Calendar</button>
          <button onClick={() => setView('campaignInsights')} className="bg-black text-white px-3 py-1 rounded text-sm hover:opacity-80">Insights</button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {campaign && (
        <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl shadow-sm border border-black/5 space-y-3">
          <div className="flex flex-wrap gap-4">
            <div>
              <p className="text-sm font-medium">Objective</p>
              <p className={textMuted}>{campaign.objective || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Stage</p>
              <p className={textMuted}>{campaign.stage || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">KPI</p>
              <p className={textMuted}>{campaign.primary_kpi || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Budget</p>
              <p className={textMuted}>{campaign.budget_total ?? '-'}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div>
              <p className="text-sm font-medium">Start</p>
              <p className={textMuted}>{campaign.start_date || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">End</p>
              <p className={textMuted}>{campaign.end_date || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Created</p>
              <p className={textMuted}>{campaign.created_at ? format(new Date(campaign.created_at), 'MMM d, yyyy') : '-'}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Brief</p>
            <pre className="text-xs bg-black/5 p-3 rounded">{JSON.stringify(campaign.brief || {}, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
