import { getServiceClient } from './supabase';

export interface MetricRecord {
  campaign_id: string;
  channel: string;
  external_campaign_id?: string;
  external_ad_set_id?: string;
  external_post_id?: string;
  metric_date: string;
  impressions?: number;
  clicks?: number;
  leads?: number;
  purchases?: number;
  spend?: number;
  revenue?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  video_plays?: number;
  custom_events?: Record<string, unknown>;
}

export const bulkInsertMetrics = async (records: MetricRecord[]) => {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from('ad_metrics_daily')
    .insert(records.map((record) => ({
      impressions: 0,
      clicks: 0,
      leads: 0,
      purchases: 0,
      spend: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      video_plays: 0,
      ...record
    })))
    .select();

  if (error) throw error;
  return data;
};
