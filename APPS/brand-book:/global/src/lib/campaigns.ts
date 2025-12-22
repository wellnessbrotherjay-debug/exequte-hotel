import { getServiceClient } from './supabase';

export interface CampaignCreatePayload {
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
  channels?: {
    channel: string;
    status?: string;
    daily_budget?: number;
    currency?: string;
    targeting?: Record<string, unknown>;
    placements?: Record<string, unknown>;
    extra_config?: Record<string, unknown>;
  }[];
  assets?: {
    channel?: string;
    asset_type: string;
    title?: string;
    description?: string;
    storage_provider?: string;
    file_url?: string;
    thumbnail_url?: string;
    copy_text?: string;
    language?: string;
    meta?: Record<string, unknown>;
  }[];
}

export const createCampaign = async (payload: CampaignCreatePayload) => {
  const supabase = getServiceClient();
  const { channels = [], assets = [], ...campaignData } = payload;

  const { data: campaign, error } = await supabase
    .from('campaigns')
    .insert({
      ...campaignData,
      brief: campaignData.brief ?? {},
    })
    .select()
    .single();
  if (error) throw error;

  const channelsToInsert = channels.length ? channels : [
    { channel: 'facebook_ads', status: 'planned' },
    { channel: 'instagram_ads', status: 'planned' }
  ];

  if (channelsToInsert.length) {
    const { error: channelError } = await supabase
      .from('campaign_channels')
      .insert(channelsToInsert.map((channel) => ({ ...channel, campaign_id: campaign.id })));
    if (channelError) throw channelError;
  }

  if (assets.length) {
    const { error: assetError } = await supabase
      .from('campaign_assets')
      .insert(assets.map((asset) => ({ ...asset, campaign_id: campaign.id })));
    if (assetError) throw assetError;
  }

  return campaign;
};

export const getCampaignAssets = async (campaignId: string) => {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from('campaign_assets')
    .select('*')
    .eq('campaign_id', campaignId);

  if (error) throw error;
  return data;
};

export const getCampaignById = async (campaignId: string) => {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', campaignId)
    .single();

  if (error) throw error;
  return data;
};

export const listCampaigns = async () => {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};
