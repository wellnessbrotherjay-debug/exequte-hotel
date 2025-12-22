
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppState, Brand, BrandStrategySection, BrandIdentity, BrandAsset, ContentIdea, ContentPost, ContentPillar, StrategySectionType, BrandBookConfig } from './types';
import { listBrands } from './services/brandService';

// --- Mock Data: Eleguria Sanctuary ---
const MOCK_BRAND_ID = 'eleguria-1';

const initialBrand: Brand = {
  id: MOCK_BRAND_ID,
  name: 'Eleguria Sanctuary',
  tagline: 'A return to yourself.',
  niche: 'Spiritual Retreat & Healing Sanctuary',
  what_you_sell: 'Core soul experiences (meditation, healing, breathwork) and space for transformation.',
  who_you_help: 'Souls in transition, seeking truth and silence. People who are spiritually tired.',
  transformation: 'From overwhelmed, disconnected, and numb to deep inner peace, clarity, and remembrance.',
  difference: 'Truth, Nature, Spirit, Love. We do not perform; we remember.',
  emotions: 'Peace, Clarity, Presence, Love, Spiritual Truth',
  values: 'Truth, Nature, Spirit, Love, Compassion',
  personality: 'Soft, Sacred, Minimal, Poetic, Compassionate, Grounded',
};

const initialIdentity: BrandIdentity = {
  id: 'id-1',
  brand_id: MOCK_BRAND_ID,
  // Primary: Soul Sand, Earth Whisper, Spirit Light
  color_primary_hex: '#EFE9E4', 
  color_secondary_hex: '#C5B6A2', 
  color_accent_hex: '#D6C69B', 
  color_palette_description: 'Primary: Soul Sand (#EFE9E4), Earth Whisper (#C5B6A2), Spirit Light (#D6C69B). Secondary: Forest Breath (#8FA58A), Smoke Grey (#A8A9A7), River Stillness (#93A4AB), Deep Earth (#4F4A46).',
  
  font_heading: 'Cormorant Garamond',
  font_body: 'Inter',
  typography_rules: 'H1 Sacred Titles: Cormorant Light (48-64px). H2 Ritual Titles: Cormorant Regular (32-40px). Body: Inter Regular (140% line spacing). Accents in Cormorant Italic like a whisper.',

  image_style: 'Cinematic, soft, elemental, slow. Focus on hands, breath, incense smoke, water movement, fog, earth textures, silhouettes. No bright colors, no staged poses, no perfect models.',
  video_style: 'Slow, flowing movement. Water ripples, morning fog, wind in fabric, incense smoke. No fast cuts.',
  
  logo_rules: 'Leave 1 full "E-height" of empty space around. Allowed backgrounds: Soul Sand, White, Natural photography. Never use shadows, glows, outlines, or heavy gradients.',
  layout_style: 'Breath + Space. 60-70% white space, centered titles, generous margins, visual quietness.',
  
  do_nots: 'Do not use neon colors. Do not use stocky corporate imagery. Do not use aggressive sales copy. Do not use complex icons.',
  
  brand_book_config: {
      cover_image_url: '',
      about_image_url: '',
      moodboard_images: ['', '', '', '', '', ''],
      back_cover_image_url: ''
  }
};

const initialStrategySections: BrandStrategySection[] = [
    {
        id: 's-1',
        brand_id: MOCK_BRAND_ID,
        section_type: StrategySectionType.Purpose,
        content: "Eleguria Sanctuary exists to give the human spirit a place to return home — to stillness, truth, and inner remembrance.",
        source: 'manual',
        updated_at: new Date().toISOString()
    },
    {
        id: 's-2',
        brand_id: MOCK_BRAND_ID,
        section_type: StrategySectionType.Mission,
        content: "To create sacred, nature-guided experiences that awaken the soul, release emotional weight, and reconnect people with their light.",
        source: 'manual',
        updated_at: new Date().toISOString()
    },
    {
        id: 's-3',
        brand_id: MOCK_BRAND_ID,
        section_type: StrategySectionType.Vision,
        content: "A world where humans live connected to themselves — grounded, peaceful, spiritually alive.",
        source: 'manual',
        updated_at: new Date().toISOString()
    },
    {
        id: 's-4',
        brand_id: MOCK_BRAND_ID,
        section_type: StrategySectionType.Positioning,
        content: "Eleguria is a spiritual sanctuary brand — an elemental, nature-rooted healing space for inner remembrance.",
        source: 'manual',
        updated_at: new Date().toISOString()
    },
    {
        id: 's-5',
        brand_id: MOCK_BRAND_ID,
        section_type: StrategySectionType.UVP,
        content: "We don’t transform you. We create the space where you remember yourself.",
        source: 'manual',
        updated_at: new Date().toISOString()
    },
    {
        id: 's-6',
        brand_id: MOCK_BRAND_ID,
        section_type: StrategySectionType.BrandPromise,
        content: "A safe, sacred return to your inner truth.",
        source: 'manual',
        updated_at: new Date().toISOString()
    },
    {
        id: 's-7',
        brand_id: MOCK_BRAND_ID,
        section_type: StrategySectionType.Archetype,
        content: "Sage (wisdom, truth, clarity) & Healer (softness, compassion, energy).",
        source: 'manual',
        updated_at: new Date().toISOString()
    },
    {
        id: 's-8',
        brand_id: MOCK_BRAND_ID,
        section_type: StrategySectionType.ToneOfVoice,
        content: "Soft • Sacred • Minimal • Poetic • Grounded • Human • Energetic • Nature-led.",
        source: 'manual',
        updated_at: new Date().toISOString()
    },
    {
        id: 's-9',
        brand_id: MOCK_BRAND_ID,
        section_type: StrategySectionType.BrandStory,
        content: "Eleguria was born from one truth: The soul needs a home. A place where time slows, where noise dissolves, where the heart unclenches. Eleguria is woven from nature and light: the river that teaches flow, the earth that holds your weight. Here, you don’t become someone else. You return to who you’ve always been. You release. You awaken. You remember.",
        source: 'manual',
        updated_at: new Date().toISOString()
    },
    {
        id: 's-10',
        brand_id: MOCK_BRAND_ID,
        section_type: StrategySectionType.Manifesto,
        content: "Eleguria feels like walking barefoot on wet earth. An exhale held for years. The hug you didn’t know you needed. It is the whisper: 'You’re here. You’re alive. You’re with yourself.' Eleguria is not a place. It is a return.",
        source: 'manual',
        updated_at: new Date().toISOString()
    },
    {
        id: 's-11',
        brand_id: MOCK_BRAND_ID,
        section_type: StrategySectionType.CampaignFramework,
        content: "Whisper (Intro) → Reveal (Truth) → Teach (Wisdom) → Ritual (Practice) → Integration → Community. Core Themes: 'The Remembering', 'Season of Awakening', 'Return to the Light'.",
        source: 'manual',
        updated_at: new Date().toISOString()
    },
    {
        id: 's-12',
        brand_id: MOCK_BRAND_ID,
        section_type: StrategySectionType.MessagingPillars,
        content: "Healing • Connection • Remembering • Ritual • Wisdom",
        source: 'manual',
        updated_at: new Date().toISOString()
    },
    {
        id: 's-13',
        brand_id: MOCK_BRAND_ID,
        section_type: StrategySectionType.ContentPillars,
        content: "Nature • Teachings • Rituals • Stories • Identity • Ceremony",
        source: 'manual',
        updated_at: new Date().toISOString()
    },
    {
        id: 's-14',
        brand_id: MOCK_BRAND_ID,
        section_type: StrategySectionType.CreativeDirection,
        content: "Aman + ancestral ritual. Soft light, natural textures, elemental movement, poetic silence.",
        source: 'manual',
        updated_at: new Date().toISOString()
    },
    {
        id: 's-15',
        brand_id: MOCK_BRAND_ID,
        section_type: StrategySectionType.Ethics,
        content: "Sacred safety, spiritual integrity, no manipulation, no forced transformation, emotional respect, truth, compassion.",
        source: 'manual',
        updated_at: new Date().toISOString()
    }
];

const initialPillars: ContentPillar[] = [
  { id: 'p1', brand_id: MOCK_BRAND_ID, name: 'Nature', description: 'Elements, grounding, earth guidance.' },
  { id: 'p2', brand_id: MOCK_BRAND_ID, name: 'Teachings', description: 'Reflections, wisdom, truths.' },
  { id: 'p3', brand_id: MOCK_BRAND_ID, name: 'Rituals', description: 'Ceremonies, guided practices.' },
  { id: 'p4', brand_id: MOCK_BRAND_ID, name: 'Stories', description: 'Human experiences, transformations.' },
];

interface StoreContextType extends AppState {
  addBrand: (brand: Brand) => void;
  updateBrand: (id: string, updates: Partial<Brand>) => void;
  setActiveBrand: (id: string) => void;
  addStrategySections: (sections: BrandStrategySection[]) => void;
  updateStrategySection: (id: string, content: string) => void;
  updateIdentity: (identity: BrandIdentity) => void;
  addContentIdeas: (ideas: ContentIdea[]) => void;
  updateContentIdeaStatus: (id: string, status: ContentIdea['status']) => void;
  addContentPost: (post: ContentPost) => void;
  addAsset: (asset: BrandAsset) => void;
  getBrandStrategy: (brandId: string) => BrandStrategySection[];
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [brands, setBrands] = useState<Brand[]>([initialBrand]);
  const [activeBrandId, setActiveBrandId] = useState<string | null>(MOCK_BRAND_ID);
  const [strategySections, setStrategySections] = useState<BrandStrategySection[]>(initialStrategySections);
  const [identities, setIdentities] = useState<BrandIdentity[]>([initialIdentity]);
  const [assets, setAssets] = useState<BrandAsset[]>([]);
  const [contentPillars, setContentPillars] = useState<ContentPillar[]>(initialPillars);
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [contentPosts, setContentPosts] = useState<ContentPost[]>([]);

  const addBrand = (brand: Brand) => {
    setBrands([...brands, brand]);
    setActiveBrandId(brand.id);
    // Init empty identity
    setIdentities([...identities, {
        id: crypto.randomUUID(),
        brand_id: brand.id,
        color_primary_hex: '#000000',
        color_secondary_hex: '#ffffff',
        color_accent_hex: '#cccccc',
        font_heading: 'Sans Serif',
        font_body: 'Sans Serif',
        image_style: '',
        video_style: '',
        do_nots: '',
        brand_book_config: {}
    }]);
  };

  const updateBrand = (id: string, updates: Partial<Brand>) => {
    setBrands(brands.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const addStrategySections = (newSections: BrandStrategySection[]) => {
    setStrategySections(prev => {
        // Remove existing sections of same type for this brand to avoid dupes
        const filtered = prev.filter(p => 
            !(p.brand_id === newSections[0].brand_id && newSections.some(n => n.section_type === p.section_type))
        );
        return [...filtered, ...newSections];
    });
  };

  const updateStrategySection = (id: string, content: string) => {
    setStrategySections(prev => prev.map(s => s.id === id ? { ...s, content, updated_at: new Date().toISOString() } : s));
  };

  const updateIdentity = (updatedId: BrandIdentity) => {
    setIdentities(prev => prev.map(i => i.brand_id === updatedId.brand_id ? updatedId : i));
  };

  const addContentIdeas = (ideas: ContentIdea[]) => {
    setContentIdeas(prev => [...prev, ...ideas]);
  };

  const updateContentIdeaStatus = (id: string, status: ContentIdea['status']) => {
    setContentIdeas(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };
  
  const addContentPost = (post: ContentPost) => {
      setContentPosts(prev => [...prev, post]);
  };

  const addAsset = (asset: BrandAsset) => {
      setAssets(prev => [...prev, asset]);
  };

  const getBrandStrategy = (brandId: string) => strategySections.filter(s => s.brand_id === brandId);

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const remote = await listBrands();
        if (remote && remote.length) {
          setBrands(remote as any);
          setActiveBrandId(remote[0].id);
        }
      } catch (error) {
        console.warn('Failed to load brands from Supabase', error);
      }
    };
    loadBrands();
  }, []);

  return (
    <StoreContext.Provider value={{
      brands,
      activeBrandId,
      setActiveBrand: setActiveBrandId,
      strategySections,
      identities,
      assets,
      contentPillars,
      contentIdeas,
      contentPosts,
      addBrand,
      updateBrand,
      addStrategySections,
      updateStrategySection,
      updateIdentity,
      addContentIdeas,
      updateContentIdeaStatus,
      addContentPost,
      addAsset,
      getBrandStrategy
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useAppStore must be used within StoreProvider');
  return context;
};
