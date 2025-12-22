import { getServiceClient } from './supabase';

export interface InsightInsert {
  campaign_id: string;
  summary?: string;
  recommendations?: string;
  raw_json?: Record<string, unknown>;
}

export const insertInsight = async (payload: InsightInsert) => {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from('campaign_insights')
    .insert({
      ...payload,
      raw_json: payload.raw_json ?? {}
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
