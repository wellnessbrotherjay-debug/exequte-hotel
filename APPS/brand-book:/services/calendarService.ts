import { getSupabaseClient, getServiceSupabaseClient } from '../lib/supabaseClient';

export const listCalendarByCampaign = async (campaignId: string) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('content_calendar')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('scheduled_at', { ascending: true });
  if (error) throw error;
  return data;
};

export const bulkInsertCalendar = async (entries: any[]) => {
  const supabase = getServiceSupabaseClient();
  const { data, error } = await supabase
    .from('content_calendar')
    .insert(entries.map((e) => ({ status: 'pending', run_type: 'ad', ...e })))
    .select();
  if (error) throw error;
  return data;
};
