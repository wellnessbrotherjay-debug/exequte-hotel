
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowRight, CheckCircle2, Circle, Clock } from 'lucide-react';
import { createCampaign, requestBrandPack, sendCalendar } from '../services/globalApi';

export const Dashboard: React.FC<{ setView: (v: any) => void }> = ({ setView }) => {
  const { brands, activeBrandId, strategySections, identities, contentPosts } = useAppStore();
  
  const activeBrand = brands.find(b => b.id === activeBrandId);
  const currentIdentity = identities.find(i => i.brand_id === activeBrandId);
  const brandStrategy = strategySections.filter(s => s.brand_id === activeBrandId);
  const [objective, setObjective] = useState('Awareness Launch');
  const [budget, setBudget] = useState('5000');
  const [calendarCampaignId, setCalendarCampaignId] = useState('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  if (!activeBrand) return <div className="p-10">Please select a brand.</div>;

  // Strategy Progress
  const totalStrategySections = 12; // Number of enum values
  const filledSections = brandStrategy.length;
  const strategyProgress = Math.round((filledSections / totalStrategySections) * 100);

  // Identity Progress (simple check)
  const identityFields = [currentIdentity?.logo_primary_url, currentIdentity?.color_primary_hex, currentIdentity?.font_heading, currentIdentity?.image_style];
  const filledIdentity = identityFields.filter(Boolean).length;
  const identityProgress = Math.round((filledIdentity / 4) * 100);

  // Content Stats
  const upcomingPosts = contentPosts.length;

  const mockData = [
    { name: 'Mon', posts: 1 },
    { name: 'Tue', posts: 3 },
    { name: 'Wed', posts: 2 },
    { name: 'Thu', posts: 4 },
    { name: 'Fri', posts: 2 },
    { name: 'Sat', posts: 1 },
    { name: 'Sun', posts: 0 },
  ];

  // Dynamic Card Style
  const cardClass = "bg-white/60 backdrop-blur-md p-6 rounded-xl shadow-sm border border-black/5 flex flex-col justify-between transition-all hover:bg-white/80";
  const textMuted = "opacity-60";
  const textHeading = "font-bold";

  const handleGenerateBrandPack = async () => {
    if (!activeBrandId) return;
    setStatusMsg('Requesting brand pack...');
    try {
      await requestBrandPack(activeBrandId);
      setStatusMsg('Brand pack request sent to backend.');
    } catch (error: any) {
      setStatusMsg(`Brand pack error: ${error?.message || 'failed'}`);
    }
  };

  const handleGenerateCampaign = async () => {
    if (!activeBrandId) return;
    setStatusMsg('Creating campaign...');
    try {
      const payload = {
        brand_id: activeBrandId,
        name: `${activeBrand.name} ${objective}`,
        objective,
        budget_total: Number(budget) || 0,
        stage: 'idea',
        channels: [
          { channel: 'facebook_ads', status: 'planned', daily_budget: Number(budget) / 30 || 0 }
        ],
        assets: [
          { asset_type: 'copy', title: 'Hook', copy_text: 'Sample hook for your launch' },
          { asset_type: 'video', title: 'UGC Script', description: '30s vertical video script' }
        ]
      };
      await createCampaign(payload);
      setStatusMsg('Campaign created in Supabase (via API).');
    } catch (error: any) {
      setStatusMsg(`Campaign error: ${error?.message || 'failed'}`);
    }
  };

  const handleSendToAutomation = async () => {
    if (!calendarCampaignId) {
      setStatusMsg('Add a campaign ID to push calendar entries.');
      return;
    }
    setStatusMsg('Sending calendar entries...');
    try {
      const entries = [
        {
          campaign_id: calendarCampaignId,
          channel: 'instagram_organic',
          run_type: 'organic',
          scheduled_at: new Date().toISOString(),
          status: 'pending',
          notes: 'Sample calendar item'
        }
      ];
      await sendCalendar(entries);
      setStatusMsg('Calendar entries sent to backend.');
    } catch (error: any) {
      setStatusMsg(`Calendar error: ${error?.message || 'failed'}`);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8 flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold">Welcome back, {activeBrand.name}</h1>
            <p className={`mt-2 text-lg ${textMuted}`}>{activeBrand.tagline || "Let's build your brand."}</p>
        </div>
        {currentIdentity?.logo_primary_url && (
             <img src={currentIdentity.logo_primary_url} alt="Logo" className="h-12 w-auto opacity-80" />
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Key Stats Cards */}
        <div className={cardClass}>
          <div>
            <h3 className={`text-sm font-medium uppercase tracking-wide ${textMuted}`}>Strategy Health</h3>
            <div className="flex items-end gap-2 mt-2">
              <span className="text-4xl font-bold">{strategyProgress}%</span>
              <span className={`mb-1 text-sm ${textMuted}`}>completed</span>
            </div>
          </div>
          <div className="w-full bg-black/5 rounded-full h-2 mt-4">
            <div className="bg-current h-2 rounded-full transition-all duration-500 opacity-80" style={{ width: `${strategyProgress}%` }}></div>
          </div>
        </div>

        <div className={cardClass}>
          <div>
            <h3 className={`text-sm font-medium uppercase tracking-wide ${textMuted}`}>Visual Identity</h3>
            <div className="flex items-end gap-2 mt-2">
              <span className="text-4xl font-bold">{identityProgress}%</span>
              <span className={`mb-1 text-sm ${textMuted}`}>ready</span>
            </div>
          </div>
          <div className="w-full bg-black/5 rounded-full h-2 mt-4">
            <div className="bg-current h-2 rounded-full transition-all duration-500 opacity-60" style={{ width: `${identityProgress}%` }}></div>
          </div>
        </div>

        <div className={cardClass}>
           <div>
            <h3 className={`text-sm font-medium uppercase tracking-wide ${textMuted}`}>Content Pipeline</h3>
            <div className="flex items-end gap-2 mt-2">
              <span className="text-4xl font-bold">{upcomingPosts}</span>
              <span className={`mb-1 text-sm ${textMuted}`}>posts scheduled</span>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
              <button onClick={() => setView('ideas')} className="text-xs bg-black text-white px-3 py-1 rounded-full font-medium hover:opacity-80 transition-opacity">
                  Generate Ideas
              </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Setup Checklist */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Action Plan</h2>
            <button onClick={() => setView('setup')} className="text-sm font-medium hover:underline opacity-70">Go to Setup</button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-black/5">
              <CheckCircle2 className="text-green-600 w-5 h-5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Brand Basics</p>
                <p className={`text-xs ${textMuted}`}>Core profile setup complete.</p>
              </div>
            </div>
            <div className={`flex items-center gap-3 p-3 rounded-lg border border-black/5 ${strategyProgress < 100 ? 'bg-white/50' : 'bg-black/5'}`}>
              {strategyProgress === 100 ? <CheckCircle2 className="text-green-600 w-5 h-5"/> : <Circle className="opacity-40 w-5 h-5" />}
              <div className="flex-1">
                <p className="text-sm font-medium">Strategic Foundation</p>
                <p className={`text-xs ${textMuted}`}>Define your UVP, Mission, and Vision.</p>
              </div>
              {strategyProgress < 100 && (
                 <button onClick={() => setView('strategy')} className="bg-black text-white px-3 py-1 rounded text-xs hover:opacity-80">
                   Complete
                 </button>
              )}
            </div>
             <div className={`flex items-center gap-3 p-3 rounded-lg border border-black/5 ${identityProgress < 100 ? 'bg-white/50' : 'bg-black/5'}`}>
              {identityProgress === 100 ? <CheckCircle2 className="text-green-600 w-5 h-5"/> : <Circle className="opacity-40 w-5 h-5" />}
              <div className="flex-1">
                <p className="text-sm font-medium">Visual Guidelines</p>
                <p className={`text-xs ${textMuted}`}>Set colors, fonts, and style.</p>
              </div>
               {identityProgress < 100 && (
                 <button onClick={() => setView('identity')} className="bg-black text-white px-3 py-1 rounded text-xs hover:opacity-80">
                   Upload
                 </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Chart */}
        <div className={cardClass}>
           <h2 className="text-lg font-bold mb-6">Activity This Week</h2>
           <div className="h-48">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={mockData}>
                 <XAxis dataKey="name" tick={{fontSize: 12, fill: 'currentColor', opacity: 0.5}} axisLine={false} tickLine={false} />
                 <YAxis hide />
                 <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff', color: '#000'}}
                 />
                 <Bar dataKey="posts" radius={[4, 4, 0, 0]}>
                    {mockData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="currentColor" fillOpacity={index % 2 === 0 ? 0.8 : 0.4} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={cardClass}>
          <h2 className="text-lg font-bold mb-4">Global Automation Bridge</h2>
          <p className={`text-sm ${textMuted} mb-4`}>Push data to the Global backend APIs. Uses your active brand as context.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Campaign Objective</label>
              <input className="w-full border rounded-lg px-3 py-2" value={objective} onChange={(e) => setObjective(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Budget (total)</label>
              <input className="w-full border rounded-lg px-3 py-2" value={budget} onChange={(e) => setBudget(e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={handleGenerateBrandPack} className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-80">Generate Brand Pack</button>
              <button onClick={handleGenerateCampaign} className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-80">Generate Campaign</button>
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <h2 className="text-lg font-bold mb-4">Content Calendar → Automation</h2>
          <p className={`text-sm ${textMuted} mb-4`}>Send scheduled posts to Global backend to be picked up by n8n.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Campaign ID</label>
              <input className="w-full border rounded-lg px-3 py-2" placeholder="campaign UUID" value={calendarCampaignId} onChange={(e) => setCalendarCampaignId(e.target.value)} />
            </div>
            <button onClick={handleSendToAutomation} className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-80">Send to Automation (Global)</button>
            {statusMsg && <p className="text-sm mt-2">{statusMsg}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
