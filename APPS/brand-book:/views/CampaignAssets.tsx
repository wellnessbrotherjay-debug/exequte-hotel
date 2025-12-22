import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { addAssets, listAssets, listCampaigns } from '../services/campaignService';
import { getSupabaseClient } from '../lib/supabaseClient';
import { fetchDNA, createConsistencyReview, scoreTextAgainstDNA, generateRecommendations, listConsistencyReviewsByAsset } from '../services/dnaService';

const assetTypes = ['video', 'image', 'carousel', 'copy', 'script', 'landing_page', 'email_template'];

export const CampaignAssetsView: React.FC<{ campaignId: string | null; setActiveCampaignId?: (id: string) => void }> = ({ campaignId, setActiveCampaignId }) => {
  const { activeBrandId } = useAppStore();
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ asset_type: 'image', title: '', description: '', file_url: '', channel: '' });
  const [saving, setSaving] = useState(false);
  const [campaignOptions, setCampaignOptions] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [dna, setDna] = useState<any>(null);
  const [critiqueText, setCritiqueText] = useState('');
  const [critiqueResult, setCritiqueResult] = useState<string | null>(null);
  const [reviewMap, setReviewMap] = useState<Record<string, any>>({});

  const fetchAssets = async () => {
    if (!campaignId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listAssets(campaignId);
      setAssets(data);
      // fetch latest review per asset
      const entries = await Promise.all(data.map(async (a: any) => {
        const reviews = await listConsistencyReviewsByAsset(a.id);
        return { assetId: a.id, review: reviews?.[0] };
      }));
      const map: Record<string, any> = {};
      entries.forEach((e) => { if (e.review) map[e.assetId] = e.review; });
      setReviewMap(map);
    } catch (e: any) {
      setError(e?.message || 'Failed to load assets');
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
        if (activeBrandId) {
          const d = await fetchDNA(activeBrandId);
          setDna(d);
        }
      } catch (e) {
        console.warn('Could not load campaigns', e);
      }
    };
    run();
    fetchAssets();
  }, [campaignId, activeBrandId]);

  const handleAdd = async () => {
    if (!campaignId) return;
    setSaving(true);
    setError(null);
    try {
      let fileUrl = form.file_url;
      if (file) {
        const supabase = getSupabaseClient();
        const path = `${campaignId}/${Date.now()}_${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage.from('campaigns').upload(path, file);
        if (uploadError) throw uploadError;
        const { data: publicUrl } = supabase.storage.from('campaigns').getPublicUrl(uploadData.path);
        fileUrl = publicUrl.publicUrl;
      }
      const created = await addAssets(campaignId, [{
        asset_type: form.asset_type,
        title: form.title,
        description: form.description,
        file_url: fileUrl,
        channel: form.channel || null
      }]);
      setAssets((prev) => [...prev, ...created]);
      setForm({ asset_type: 'image', title: '', description: '', file_url: '', channel: '' });
      setFile(null);
    } catch (e: any) {
      setError(e?.message || 'Failed to add asset');
    } finally {
      setSaving(false);
    }
  };

  const handleReviewAsset = async (assetId: string, title?: string) => {
    if (!activeBrandId) return;
    try {
      const review = await createConsistencyReview(activeBrandId, assetId, `Review for ${title || 'asset'}`, 'Improve tone and ensure palette.');
      setCritiqueResult(`Created review with score ${review.score?.total ?? '-'}`);
      setReviewMap((prev) => ({ ...prev, [assetId]: review }));
    } catch (e: any) {
      setError(e?.message || 'Review failed');
    }
  };

  const handleCritiqueText = async () => {
    if (!activeBrandId) return;
    const score = scoreTextAgainstDNA(critiqueText, dna);
    const rec = generateRecommendations(score.issues);
    setCritiqueResult(`Score ${score.total}/100. ${rec}`);
    await createConsistencyReview(activeBrandId, null, 'Text critique', rec);
  };

  const textMuted = 'opacity-60';

  if (!campaignId) {
    return (
      <div className="p-8 max-w-xl space-y-4">
        <h1 className="text-2xl font-bold">Assets</h1>
        <p className={textMuted}>Pick a campaign to manage assets.</p>
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
          <h1 className="text-3xl font-bold">Assets</h1>
          <p className={`text-sm ${textMuted}`}>Creative and copy mapped to this campaign.</p>
        </div>
        <button onClick={fetchAssets} className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-80">Refresh</button>
      </div>

      <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl shadow-sm border border-black/5 space-y-3">
        <h2 className="text-lg font-semibold">Upload/Add Asset</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select className="border rounded-lg px-3 py-2" value={form.asset_type} onChange={(e) => setForm({ ...form, asset_type: e.target.value })}>
            {assetTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input className="border rounded-lg px-3 py-2" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className="border rounded-lg px-3 py-2" placeholder="Channel (optional)" value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })} />
          <input className="border rounded-lg px-3 py-2 md:col-span-3" placeholder="File URL or storage path" value={form.file_url} onChange={(e) => setForm({ ...form, file_url: e.target.value })} />
          <input type="file" className="border rounded-lg px-3 py-2 md:col-span-3" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <textarea className="border rounded-lg px-3 py-2 md:col-span-3" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <button disabled={saving} onClick={handleAdd} className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-80 disabled:opacity-50">Add Asset</button>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </div>

      <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl shadow-sm border border-black/5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Campaign Assets</h2>
          {loading && <span className="text-sm">Loading...</span>}
        </div>
        {assets.length === 0 && !loading && <p className={`text-sm ${textMuted}`}>No assets yet.</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assets.map((a) => (
            <div key={a.id} className="p-4 border border-black/5 rounded-lg bg-white/70 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold">{a.title || a.asset_type}</p>
                  <p className={`text-sm ${textMuted}`}>{a.asset_type} • {a.channel || 'channel n/a'}</p>
                </div>
                {a.file_url && <a className="text-xs underline" href={a.file_url} target="_blank" rel="noreferrer">Open</a>}
              </div>
              {a.description && <p className={`text-sm ${textMuted}`}>{a.description}</p>}
              {a.file_url && (a.asset_type === 'image' || a.asset_type === 'video') && (
                <div className="bg-black/5 rounded-lg overflow-hidden">
                  {a.asset_type === 'image' ? <img src={a.file_url} alt={a.title} className="w-full h-40 object-cover" /> : <video controls className="w-full h-40"><source src={a.file_url} /></video>}
                </div>
              )}
              <div className="flex items-center gap-2">
                <button onClick={() => handleReviewAsset(a.id, a.title)} className="px-3 py-1 bg-black text-white rounded text-xs hover:opacity-80">Review</button>
                <span className={`text-xs ${textMuted}`}>
                  Consistency: {reviewMap[a.id]?.score?.total ?? 'pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl shadow-sm border border-black/5 space-y-3">
        <h2 className="text-lg font-semibold">Creative Director Critique (Text)</h2>
        <textarea className="w-full border rounded-lg px-3 py-2" rows={3} placeholder="Paste caption or script to critique" value={critiqueText} onChange={(e) => setCritiqueText(e.target.value)} />
        <div className="flex items-center gap-3">
          <button onClick={handleCritiqueText} className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-80">Run Critique</button>
          {critiqueResult && <p className="text-sm">{critiqueResult}</p>}
        </div>
      </div>
    </div>
  );
};
