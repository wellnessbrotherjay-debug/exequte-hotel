import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { fetchDNA, upsertDNA, listDnaSources, uploadDnaSourceFile, insertDnaSource, listConsistencyReviews, createConsistencyReview, ingestSourceIntoDNA, fetchPalette, upsertDNAForBrand } from '../services/dnaService';
import { scoreTextAgainstDNA, generateRecommendations } from '../services/dnaService';

export const BrandDNA: React.FC = () => {
  const { activeBrandId, brands } = useAppStore();
  const [dna, setDna] = useState<any>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [sampleText, setSampleText] = useState('');
  const [ingestStatus, setIngestStatus] = useState<string | null>(null);
  const [palette, setPalette] = useState<any[]>([]);
  const [personalityText, setPersonalityText] = useState('');
  const [toneText, setToneText] = useState('');
  const [requiredText, setRequiredText] = useState('');
  const [forbiddenText, setForbiddenText] = useState('');
  const [code, setCode] = useState('');

  const load = async () => {
    if (!activeBrandId) return;
    setLoading(true);
    setError(null);
    try {
      const [d, s, r, pal] = await Promise.all([
        fetchDNA(activeBrandId),
        listDnaSources(activeBrandId),
        listConsistencyReviews(activeBrandId),
        fetchPalette(activeBrandId)
      ]);
      setDna(d);
      setPersonalityText(d?.personality ? JSON.stringify(d.personality, null, 2) : '');
      setToneText(d?.tone ? JSON.stringify(d.tone, null, 2) : '');
      setRequiredText((d?.required_elements || []).join(', '));
      setForbiddenText((d?.forbidden_phrases || []).join(', '));
      setCode((d as any)?.code || '');
      setSources(s);
      setReviews(r);
      setPalette(pal);
    } catch (e: any) {
      setError(e?.message || 'Failed to load brand DNA');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [activeBrandId]);

  const handleSaveTone = async () => {
    if (!activeBrandId) return;
    try {
      const payload = { tone: { keywords: dna?.tone?.keywords || ['luxury', 'calm', 'feminine'] } };
      const saved = await upsertDNA(activeBrandId, payload);
      setDna(saved);
    } catch (e: any) {
      setError(e?.message || 'Save failed');
    }
  };

  const handleUpload = async () => {
    if (!activeBrandId || !file) return;
    try {
      const url = await uploadDnaSourceFile(activeBrandId, file);
      const inserted = await insertDnaSource(activeBrandId, url, '');
      setSources((prev) => [inserted, ...prev]);
      setFile(null);
      setIngestStatus('Uploaded. Click "Ingest Source" to auto-fill DNA.');
    } catch (e: any) {
      setError(e?.message || 'Upload failed');
    }
  };

  const handleReview = async () => {
    if (!activeBrandId) return;
    try {
      const review = await createConsistencyReview(activeBrandId, null, 'Automated review', 'Keep logo clear space and maintain beige palette.');
      setReviews((prev) => [review, ...prev]);
    } catch (e: any) {
      setError(e?.message || 'Review failed');
    }
  };

  const handleAnalyzeText = async () => {
    if (!dna || !sampleText) return;
    const score = scoreTextAgainstDNA(sampleText, dna);
    const rec = generateRecommendations(score.issues);
    setAnalysisResult(`Score ${score.total}/100. ${rec}`);
  };

  const handleIngest = async () => {
    if (!activeBrandId || sources.length === 0) { setIngestStatus('Upload a source first'); return; }
    setIngestStatus('Ingesting source into DNA...');
    try {
      const updated = await ingestSourceIntoDNA(activeBrandId, sources[0].file_url);
      setDna(updated);
      setIngestStatus('DNA updated with sample palette/fonts (stub).');
    } catch (e: any) {
      setIngestStatus(e?.message || 'Ingest failed');
    }
  };

  const handleSaveStructuredDNA = async () => {
    if (!activeBrandId) return;
    try {
      const parsedPersonality = personalityText ? JSON.parse(personalityText) : null;
      const parsedTone = toneText ? JSON.parse(toneText) : null;
      const required_elements = requiredText ? requiredText.split(',').map((s) => s.trim()).filter(Boolean) : [];
      const forbidden_phrases = forbiddenText ? forbiddenText.split(',').map((s) => s.trim()).filter(Boolean) : [];
      const payload: any = {
        personality: parsedPersonality,
        tone: parsedTone,
        required_elements,
        forbidden_phrases
      };
      if (code) payload.code = code;
      const saved = await upsertDNAForBrand(activeBrandId, payload);
      setDna(saved);
      setIngestStatus('DNA updated.');
    } catch (e: any) {
      setError(e?.message || 'Save failed. Check JSON formatting.');
    }
  };

  if (!activeBrandId) return <div className="p-8">Select a brand first.</div>;
  const brand = brands.find((b) => b.id === activeBrandId);
  const textMuted = 'opacity-60';

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Brand DNA</h1>
          <p className={`text-sm ${textMuted}`}>Behavioral profile and consistency checks for {brand?.name}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="bg-black text-white px-3 py-2 rounded-lg text-sm hover:opacity-80">Refresh</button>
          <button onClick={handleReview} className="bg-black text-white px-3 py-2 rounded-lg text-sm hover:opacity-80">Run Consistency Review</button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="bg-white/80 p-6 rounded-xl border border-black/5 space-y-3">
        <h2 className="text-lg font-semibold">Tone & Personality</h2>
        <p className={textMuted}>Keywords: {(dna?.tone?.keywords || ['luxury', 'calm', 'feminine']).join(', ')}</p>
        <button onClick={handleSaveTone} className="bg-black text-white px-3 py-2 rounded-lg text-sm hover:opacity-80">Save Tone</button>
      </div>

      <div className="bg-white/80 p-6 rounded-xl border border-black/5 space-y-3">
        <h2 className="text-lg font-semibold">Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(palette && palette.length ? palette : [{ name: 'Cream Satin', hex: '#F4EDE5', role: 'primary' }]).map((c) => (
            <div key={`${c.name}-${c.hex}`} className="border rounded-lg overflow-hidden">
              <div className="h-12" style={{ backgroundColor: c.hex || '#eee' }}></div>
              <div className="p-2 text-xs">
                <p className="font-semibold">{c.name || 'Color'}</p>
                <p className={textMuted}>{c.hex || ''} {c.role ? `• ${c.role}` : ''}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/80 p-6 rounded-xl border border-black/5 space-y-3">
        <h2 className="text-lg font-semibold">Analyze Sample Text</h2>
        <textarea className="w-full border rounded-lg px-3 py-2" rows={3} placeholder="Paste copy to score" value={sampleText} onChange={(e) => setSampleText(e.target.value)} />
        <button onClick={handleAnalyzeText} className="bg-black text-white px-3 py-2 rounded-lg text-sm hover:opacity-80">Analyze</button>
        {analysisResult && <p className="text-sm">{analysisResult}</p>}
      </div>

      <div className="bg-white/80 p-6 rounded-xl border border-black/5 space-y-3">
        <h2 className="text-lg font-semibold">Brand Builder (structured DNA)</h2>
        <p className={textMuted}>Edit personality/tone JSON and required/forbidden lists, then save to brand_dna.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-gray-500">Personality JSON</label>
            <textarea className="w-full border rounded-lg px-3 py-2 text-xs" rows={6} value={personalityText} onChange={(e) => setPersonalityText(e.target.value)} />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-gray-500">Tone JSON</label>
            <textarea className="w-full border rounded-lg px-3 py-2 text-xs" rows={6} value={toneText} onChange={(e) => setToneText(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-gray-500">Required elements (comma-separated)</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" value={requiredText} onChange={(e) => setRequiredText(e.target.value)} />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-gray-500">Forbidden phrases (comma-separated)</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" value={forbiddenText} onChange={(e) => setForbiddenText(e.target.value)} />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-gray-500">Code/version</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
        </div>
        <button onClick={handleSaveStructuredDNA} className="bg-black text-white px-3 py-2 rounded-lg text-sm hover:opacity-80">Save Brand DNA</button>
        {ingestStatus && <p className="text-xs">{ingestStatus}</p>}
      </div>

      <div className="bg-white/80 p-6 rounded-xl border border-black/5 space-y-3">
        <h2 className="text-lg font-semibold">DNA Sources</h2>
        <div className="flex items-center gap-3">
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm" />
          <button onClick={handleUpload} className="bg-black text-white px-3 py-2 rounded-lg text-sm hover:opacity-80">Upload Source</button>
          <button onClick={handleIngest} className="bg-black text-white px-3 py-2 rounded-lg text-sm hover:opacity-80">Ingest Source</button>
          {ingestStatus && <p className="text-xs">{ingestStatus}</p>}
        </div>
        <div className="space-y-2">
          {sources.map((s) => (
            <div key={s.id} className="p-3 border border-black/5 rounded-lg bg-white/60">
              <p className="text-sm font-medium">{s.file_url}</p>
              <p className={`text-xs ${textMuted}`}>{s.created_at}</p>
            </div>
          ))}
          {sources.length === 0 && <p className={`text-sm ${textMuted}`}>No sources yet.</p>}
        </div>
      </div>

      <div className="bg-white/80 p-6 rounded-xl border border-black/5 space-y-3">
        <h2 className="text-lg font-semibold">Consistency Reviews</h2>
        <div className="space-y-2">
          {reviews.map((r) => (
            <div key={r.id} className="p-3 border border-black/5 rounded-lg bg-white/60">
              <p className="text-sm font-medium">Score: {r.score?.total ?? '—'}</p>
              <p className={`text-xs ${textMuted}`}>{r.summary}</p>
              <p className={`text-xs ${textMuted}`}>{r.recommendations}</p>
            </div>
          ))}
          {reviews.length === 0 && <p className={`text-sm ${textMuted}`}>No reviews yet.</p>}
        </div>
      </div>
    </div>
  );
};
