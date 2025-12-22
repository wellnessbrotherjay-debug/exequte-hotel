import { getSupabaseClient, getServiceSupabaseClient } from '../lib/supabaseClient';

export const listMetricsByCampaign = async (campaignId: string) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('ad_metrics_daily')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('metric_date', { ascending: true });
  if (error) throw error;
  return data;
};

export const bulkInsertMetrics = async (records: any[]) => {
  const supabase = getServiceSupabaseClient();
  const { data, error } = await supabase
    .from('ad_metrics_daily')
    .insert(records.map((r) => ({
      impressions: 0,
      clicks: 0,
      leads: 0,
      purchases: 0,
      spend: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      video_plays: 0,
      ...r
    })))
    .select();
  if (error) throw error;
  return data;
};
