import { getSupabaseClient, getServiceSupabaseClient } from '../lib/supabaseClient';

export interface CampaignPayload {
  brand_id: string;
  name: string;
  objective?: string;
  stage?: 'idea' | 'brief' | 'production' | 'ready_to_schedule' | 'scheduled' | 'live' | 'completed' | 'paused';
  primary_kpi?: string;
  budget_total?: number;
  start_date?: string;
  end_date?: string;
  brief?: Record<string, unknown>;
  created_by?: string;
}

export const listCampaigns = async () => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('campaigns').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getCampaign = async (id: string) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('campaigns').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const createCampaign = async (payload: CampaignPayload) => {
  const supabase = getServiceSupabaseClient();
  const { data, error } = await supabase.from('campaigns').insert({ ...payload, brief: payload.brief ?? {} }).select().single();
  if (error) throw error;
  return data;
};

export const listChannels = async (campaignId: string) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('campaign_channels').select('*').eq('campaign_id', campaignId);
  if (error) throw error;
  return data;
};

export const addChannels = async (campaignId: string, channels: any[]) => {
  const supabase = getServiceSupabaseClient();
  const { data, error } = await supabase.from('campaign_channels').insert(
    channels.map((c) => ({ ...c, campaign_id: campaignId }))
  ).select();
  if (error) throw error;
  return data;
};

export const updateChannel = async (channelId: string, updates: any) => {
  const supabase = getServiceSupabaseClient();
  const { data, error } = await supabase.from('campaign_channels').update(updates).eq('id', channelId).select().single();
  if (error) throw error;
  return data;
};

export const listAssets = async (campaignId: string) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('campaign_assets').select('*').eq('campaign_id', campaignId);
  if (error) throw error;
  return data;
};

export const addAssets = async (campaignId: string, assets: any[]) => {
  const supabase = getServiceSupabaseClient();
  const { data, error } = await supabase.from('campaign_assets').insert(
    assets.map((a) => ({ ...a, campaign_id: campaignId }))
  ).select();
  if (error) throw error;
  return data;
};
