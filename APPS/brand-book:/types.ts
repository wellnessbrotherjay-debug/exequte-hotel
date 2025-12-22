
export interface Brand {
  id: string;
  name: string;
  tagline: string;
  niche: string;
  what_you_sell: string;
  who_you_help: string;
  transformation: string;
  difference: string;
  emotions: string;
  values: string;
  personality: string;
}

export enum StrategySectionType {
  Purpose = 'Purpose',
  Mission = 'Mission',
  Vision = 'Vision',
  Positioning = 'Positioning',
  UVP = 'UVP',
  BrandPromise = 'Brand Promise',
  Archetype = 'Archetype',
  ToneOfVoice = 'Tone of Voice',
  BrandStory = 'Brand Story',
  Manifesto = 'Manifesto',
  CampaignFramework = 'Campaign Framework',
  MessagingPillars = 'Messaging Pillars',
  ContentPillars = 'Content Pillars',
  CreativeDirection = 'Creative Direction',
  Ethics = 'Ethics',
}

export interface BrandStrategySection {
  id: string;
  brand_id: string;
  section_type: StrategySectionType;
  content: string;
  source: 'manual' | 'ai';
  updated_at: string; // ISO date string
}

export interface BrandBookConfig {
  cover_image_url?: string;
  about_image_url?: string;
  moodboard_images?: string[]; // Array of 4-6 image URLs
  back_cover_image_url?: string;
}

export interface BrandIdentity {
  id: string;
  brand_id: string;
  logo_primary_url?: string;
  logo_secondary_url?: string;
  
  // Colors
  color_primary_hex: string;
  color_secondary_hex: string;
  color_accent_hex: string;
  color_palette_description?: string; // Full palette details

  // Typography
  font_heading: string;
  font_body: string;
  typography_rules?: string; // Hierarchy & proportions

  // Visuals
  image_style: string;
  video_style: string;
  logo_rules?: string; // Spacing, backgrounds, do nots
  layout_style?: string; // Composition, white space
  do_nots: string;

  // Book Config
  brand_book_config?: BrandBookConfig;
}

export interface BrandAsset {
  id: string;
  brand_id: string;
  asset_type: 'logo' | 'font' | 'template' | 'pdf' | 'moodboard' | 'video' | 'image' | 'other';
  title: string;
  description: string;
  file_url: string;
  tags: string[];
}

export interface ContentPillar {
  id: string;
  brand_id: string;
  name: string;
  description: string;
}

export interface ContentIdea {
  id: string;
  brand_id: string;
  pillar_id?: string;
  platform: string;
  format: string;
  hook: string;
  outline: string;
  ai_prompt_used?: string;
  status: 'idea' | 'drafted' | 'approved' | 'posted';
  due_date?: string;
}

export interface ContentPost {
  id: string;
  brand_id: string;
  content_idea_id?: string;
  platform: string;
  caption: string;
  media_urls: string[];
  scheduled_for: string; // ISO Date
  posted_at?: string;
  metrics_views: number;
  metrics_likes: number;
  metrics_comments: number;
  metrics_saves: number;
  metrics_shares: number;
}

export interface AppState {
  brands: Brand[];
  strategySections: BrandStrategySection[];
  identities: BrandIdentity[];
  assets: BrandAsset[];
  contentPillars: ContentPillar[];
  contentIdeas: ContentIdea[];
  contentPosts: ContentPost[];
  activeBrandId: string | null;
}

export interface Campaign {
  id: string;
  brand_id: string;
  name: string;
  objective?: string;
  stage?: 'idea' | 'brief' | 'production' | 'ready_to_schedule' | 'scheduled' | 'live' | 'completed' | 'paused';
  primary_kpi?: string;
  budget_total?: number;
  start_date?: string;
  end_date?: string;
  brief?: Record<string, unknown>;
  created_at?: string;
}

export interface CampaignChannel {
  id: string;
  campaign_id: string;
  channel: string;
  status?: string;
  daily_budget?: number;
  currency?: string;
  targeting?: Record<string, unknown>;
  placements?: Record<string, unknown>;
  extra_config?: Record<string, unknown>;
  created_at?: string;
}

export interface CampaignAsset {
  id: string;
  campaign_id: string;
  channel?: string;
  asset_type: string;
  title?: string;
  description?: string;
  file_url?: string;
  thumbnail_url?: string;
  copy_text?: string;
  language?: string;
  meta?: Record<string, unknown>;
  created_at?: string;
}

export interface ContentCalendarEntry {
  id: string;
  campaign_id: string;
  channel: string;
  asset_id?: string;
  run_type: 'ad' | 'organic';
  scheduled_at: string;
  published_at?: string;
  status?: string;
  external_post_id?: string;
  notes?: string;
  created_at?: string;
}

export interface MetricRecord {
  id: number;
  campaign_id: string;
  channel: string;
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
}

export interface CampaignInsight {
  id: string;
  campaign_id: string;
  generated_at?: string;
  summary?: string;
  recommendations?: string;
  raw_json?: Record<string, unknown>;
}

export type ViewName =
  | 'dashboard'
  | 'setup'
  | 'strategy'
  | 'identity'
  | 'assets'
  | 'ideas'
  | 'calendar'
  | 'brandbook'
  | 'dna'
  | 'socialkit'
  | 'adgen'
  | 'gridbuilder'
  | 'campaigns'
  | 'campaignDetail'
  | 'campaignChannels'
  | 'campaignAssets'
  | 'campaignCalendar'
  | 'campaignInsights';

export interface BrandBookData {
  assets: any[];
  moodboard: any[];
  logos: any[];
  typography: any;
  colors: any[];
  imagery: any;
}
