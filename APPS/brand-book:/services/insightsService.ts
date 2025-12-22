import { getSupabaseClient, getServiceSupabaseClient } from '../lib/supabaseClient';

export const listInsightsByCampaign = async (campaignId: string) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('campaign_insights')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('generated_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const insertInsight = async (payload: { campaign_id: string; summary?: string; recommendations?: string; raw_json?: Record<string, unknown> }) => {
  const supabase = getServiceSupabaseClient();
  const { data, error } = await supabase
    .from('campaign_insights')
    .insert({ raw_json: payload.raw_json ?? {}, ...payload })
    .select()
    .single();
  if (error) throw error;
  return data;
};
