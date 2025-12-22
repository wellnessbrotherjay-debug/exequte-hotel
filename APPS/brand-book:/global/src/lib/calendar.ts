import { getServiceClient } from './supabase';

export interface CalendarEntry {
  campaign_id: string;
  channel: string;
  asset_id?: string;
  run_type?: 'ad' | 'organic';
  scheduled_at: string;
  published_at?: string;
  status?: string;
  external_post_id?: string;
  external_ad_set_id?: string;
  external_campaign_id?: string;
  tracking_url?: string;
  notes?: string;
}

export const bulkInsertCalendar = async (entries: CalendarEntry[]) => {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from('content_calendar')
    .insert(entries.map((entry) => ({
      ...entry,
      run_type: entry.run_type ?? 'ad',
      status: entry.status ?? 'pending'
    })))
    .select();

  if (error) throw error;
  return data;
};

export const getCalendarByCampaign = async (campaignId: string) => {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from('content_calendar')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('scheduled_at', { ascending: true });

  if (error) throw error;
  return data;
};
