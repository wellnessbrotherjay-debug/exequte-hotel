import { getSupabaseClient, getServiceSupabaseClient } from '../lib/supabaseClient';

export const fetchDNA = async (brandId: string) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('brand_dna').select('*').eq('brand_id', brandId).single();
  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
};

export const fetchDNAByName = async (brandName: string) => {
  const supabase = getSupabaseClient();
  const { data: brand, error: brandError } = await supabase.from('brand_accounts').select('id').ilike('name', brandName).single();
  if (brandError) throw brandError;
  const { data, error } = await supabase.from('brand_dna').select('*').eq('brand_id', brand.id).single();
  if (error && error.code !== 'PGRST116') throw error;
  return { dna: data || null, brand };
};

export const upsertDNAForBrand = async (brandId: string, payload: any) => {
  const supabase = getServiceSupabaseClient();
  const { data, error } = await supabase
    .from('brand_dna')
    .upsert({
      brand_id: brandId,
      ...payload,
      last_trained_at: new Date().toISOString()
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const upsertDNA = async (brandId: string, payload: any) => {
  const supabase = getServiceSupabaseClient();
  const { data, error } = await supabase.from('brand_dna').upsert({ brand_id: brandId, ...payload }).select().single();
  if (error) throw error;
  return data;
};

export const listDnaSources = async (brandId: string) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('brand_dna_sources').select('*').eq('brand_id', brandId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const insertDnaSource = async (brandId: string, fileUrl: string, textExtracted?: string) => {
  const supabase = getServiceSupabaseClient();
  const { data, error } = await supabase.from('brand_dna_sources').insert({
    brand_id: brandId,
    file_url: fileUrl,
    text_extracted: textExtracted || ''
  }).select().single();
  if (error) throw error;
  return data;
};

export const listConsistencyReviews = async (brandId: string) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('brand_consistency_reviews').select('*').eq('brand_id', brandId).order('created_at', { ascending: false }).limit(20);
  if (error) throw error;
  return data;
};

export const listConsistencyReviewsByAsset = async (assetId: string) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('brand_consistency_reviews').select('*').eq('asset_id', assetId).order('created_at', { ascending: false }).limit(1);
  if (error) throw error;
  return data;
};

// Stub ingestion: pretend to extract palette/fonts from a source and merge into brand_dna
export const ingestSourceIntoDNA = async (brandId: string, fileUrl: string) => {
  const supabase = getServiceSupabaseClient();
  const samplePalette = {
    primary: [{ name: 'Cream Satin', hex: '#F4EDE5' }],
    secondary: [{ name: 'Soft Beige', hex: '#D9C3B8' }],
  };
  const sampleFonts = { display: 'Cormorant Garamond', body: 'Inter' };
  const { data, error } = await supabase.from('brand_dna').upsert({
    brand_id: brandId,
    colors: samplePalette,
    typography: sampleFonts,
    last_trained_at: new Date().toISOString()
  }).select().single();
  if (error) throw error;
  return data;
};

export const fetchPalette = async (brandId: string) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('brand_color_usage').select('*').eq('brand_id', brandId);
  if (error) throw error;
  return data || [];
};

export const createConsistencyReview = async (brandId: string, assetId: string | null, summary: string, recommendations: string, scoreOverride?: Record<string, number>) => {
  // Stub scoring: simple balanced score; replace with AI later.
  const score = scoreOverride || { color: 80, font: 75, logo: 70, tone: 78, layout: 72 };
  const total = Math.round(Object.values(score).reduce((a, b) => a + b, 0) / Object.keys(score).length);
  const supabase = getServiceSupabaseClient();
  const { data, error } = await supabase.from('brand_consistency_reviews').insert({
    brand_id: brandId,
    asset_id: assetId,
    score: { ...score, total },
    summary,
    recommendations,
    details: {}
  }).select().single();
  if (error) throw error;
  return data;
};

export const uploadDnaSourceFile = async (brandId: string, file: File) => {
  const supabase = getSupabaseClient();
  const path = `${brandId}/${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage.from('dna_sources').upload(path, file);
  if (error) throw error;
  const { data: urlData } = supabase.storage.from('dna_sources').getPublicUrl(data.path);
  return urlData.publicUrl;
};

// Helpers for rule-based critique
export const scoreTextAgainstDNA = (text: string, dna: any, colors: any[] = []) => {
  const lowered = text.toLowerCase();
  let toneScore = 85;
  let compliance = 100;
  const issues: string[] = [];

  (dna?.forbidden_phrases || []).forEach((p: string) => {
    if (lowered.includes(p.toLowerCase())) {
      compliance -= 15;
      issues.push(`Forbidden phrase: "${p}"`);
    }
  });

  if (text.length < 40) {
    toneScore -= 10;
    issues.push('Copy is short; may miss brand depth');
  }

  const required = dna?.required_elements || [];
  required.forEach((r: string) => {
    if (!lowered.includes(r.toLowerCase())) {
      toneScore -= 5;
      issues.push(`Missing required element: "${r}"`);
    }
  });

  const colorHint = colors.length ? `Palette count: ${colors.length}` : 'Palette unknown';
  const total = Math.max(0, Math.round((toneScore + compliance) / 2));
  return { total, toneScore, compliance, issues, colorHint };
};

export const generateRecommendations = (issues: string[]) => {
  if (!issues.length) return 'Looks on-brand. Keep logo clear space and maintain palette.';
  return issues.join(' · ');
};
