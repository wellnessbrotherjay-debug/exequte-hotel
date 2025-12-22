
import React from 'react';
import { useAppStore } from '../store';
import { ViewName } from '../types';
import { LayoutDashboard, Wand2, PenTool, Palette, FolderOpen, Lightbulb, Calendar, BookOpen, Image } from 'lucide-react';

interface LayoutProps {
  currentView: ViewName;
  setView: (view: ViewName) => void;
  children: React.ReactNode;
}

const NavItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  isActive: boolean; 
  onClick: () => void;
  accentColor?: string;
  textColor?: string;
}> = ({ icon, label, isActive, onClick, accentColor, textColor }) => (
  <button
    onClick={onClick}
    style={{ 
        backgroundColor: isActive ? (accentColor || '#e0e7ff') : 'transparent',
        color: isActive ? (textColor || '#4338ca') : 'inherit'
    }}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors opacity-90 hover:opacity-100 hover:bg-black/5`}
  >
    <span className="mr-3">{icon}</span>
    {label}
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ currentView, setView, children }) => {
  const { brands, activeBrandId, setActiveBrand, identities } = useAppStore();
  
  const currentIdentity = identities.find(i => i.brand_id === activeBrandId);
  
  // Dynamic Theme Vars
  // Default to slate/indigo if no brand loaded
  const bgPrimary = currentIdentity?.color_primary_hex || '#f8fafc';
  const bgSidebar = currentIdentity?.color_primary_hex ? `${currentIdentity.color_primary_hex}dd` : '#ffffff'; // slight transparency or shift
  const textPrimary = '#4F4A46'; // Deep Earth / Dark Grey default
  const accentColor = currentIdentity?.color_accent_hex || '#4f46e5'; // Spirit Light or Indigo

  return (
    <div 
        className="flex h-screen overflow-hidden transition-colors duration-500"
        style={{ backgroundColor: bgPrimary, color: textPrimary }}
    >
      {/* Sidebar */}
      <aside 
        className="w-64 border-r flex flex-col shadow-sm z-10 backdrop-blur-sm transition-colors duration-500"
        style={{ 
            backgroundColor: bgSidebar, 
            borderColor: `${textPrimary}20` // 20% opacity border
        }}
      >
        <div className="p-6 border-b" style={{ borderColor: `${textPrimary}10` }}>
          <div className="flex items-center gap-2 mb-6">
             {currentIdentity?.logo_primary_url ? (
                 <img src={currentIdentity.logo_primary_url} className="h-8 w-auto max-w-[40px]" alt="Logo" />
             ) : (
                <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: accentColor }}
                >
                  <span className="text-white font-bold text-xl font-serif-brand">B</span>
                </div>
             )}
            <span className="text-xl font-bold tracking-tight font-serif-brand" style={{ color: textPrimary }}>BrandOS</span>
          </div>

          {/* Brand Selector */}
          <div className="relative">
            <select
              value={activeBrandId || ''}
              onChange={(e) => {
                  if (e.target.value === 'new') {
                      setView('setup');
                  } else {
                      setActiveBrand(e.target.value);
                  }
              }}
              style={{ 
                  backgroundColor: 'rgba(255,255,255,0.5)', 
                  color: textPrimary,
                  borderColor: `${textPrimary}30`
              }}
              className="w-full appearance-none border text-sm rounded-md py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-opacity-50"
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
              <option value="new">+ Add New Brand</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 opacity-50">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            isActive={currentView === 'dashboard'} 
            onClick={() => setView('dashboard')} 
            accentColor={`${textPrimary}15`}
            textColor={textPrimary}
          />
          <NavItem 
            icon={<Wand2 size={20} />} 
            label="Brand Setup" 
            isActive={currentView === 'setup'} 
            onClick={() => setView('setup')} 
            accentColor={`${textPrimary}15`}
            textColor={textPrimary}
          />
          <NavItem 
            icon={<PenTool size={20} />} 
            label="Strategy Builder" 
            isActive={currentView === 'strategy'} 
            onClick={() => setView('strategy')} 
            accentColor={`${textPrimary}15`}
            textColor={textPrimary}
          />
          <NavItem 
            icon={<Palette size={20} />} 
            label="Identity Hub" 
            isActive={currentView === 'identity'} 
            onClick={() => setView('identity')} 
            accentColor={`${textPrimary}15`}
            textColor={textPrimary}
          />
          <NavItem 
            icon={<FolderOpen size={20} />} 
            label="Assets Library" 
            isActive={currentView === 'assets'} 
            onClick={() => setView('assets')} 
            accentColor={`${textPrimary}15`}
            textColor={textPrimary}
          />
          
          <div className="pt-4 mt-4 border-t" style={{ borderColor: `${textPrimary}10` }}>
            <h3 className="px-4 text-xs font-semibold uppercase tracking-wider mb-2 opacity-50">Output</h3>
          <NavItem 
            icon={<BookOpen size={20} />} 
            label="Brand Book" 
            isActive={currentView === 'brandbook'} 
            onClick={() => setView('brandbook')} 
            accentColor={`${textPrimary}15`}
            textColor={textPrimary}
          />
          <NavItem 
            icon={<BookOpen size={20} />} 
            label="Brand DNA" 
            isActive={currentView === 'dna'} 
            onClick={() => setView('dna')} 
            accentColor={`${textPrimary}15`}
            textColor={textPrimary}
          />
          <NavItem 
            icon={<Lightbulb size={20} />} 
            label="Ad Generator" 
            isActive={currentView === 'adgen'} 
            onClick={() => setView('adgen')} 
            accentColor={`${textPrimary}15`}
            textColor={textPrimary}
          />
          <NavItem 
            icon={<Calendar size={20} />} 
            label="Grid Builder" 
            isActive={currentView === 'gridbuilder'} 
            onClick={() => setView('gridbuilder')} 
            accentColor={`${textPrimary}15`}
            textColor={textPrimary}
          />
             <NavItem 
              icon={<Image size={20} />} 
              label="Social Kit" 
              isActive={currentView === 'socialkit'} 
              onClick={() => setView('socialkit')} 
              accentColor={`${textPrimary}15`}
              textColor={textPrimary}
            />
          </div>

          <div className="pt-4 mt-4 border-t" style={{ borderColor: `${textPrimary}10` }}>
            <h3 className="px-4 text-xs font-semibold uppercase tracking-wider mb-2 opacity-50">Content Engine</h3>
            <NavItem 
              icon={<LayoutDashboard size={20} />} 
              label="Campaigns" 
              isActive={currentView === 'campaigns'} 
              onClick={() => setView('campaigns')} 
              accentColor={`${textPrimary}15`}
              textColor={textPrimary}
            />
            <NavItem 
              icon={<Lightbulb size={20} />} 
              label="Idea Generator" 
              isActive={currentView === 'ideas'} 
              onClick={() => setView('ideas')} 
              accentColor={`${textPrimary}15`}
              textColor={textPrimary}
            />
            <NavItem 
              icon={<Calendar size={20} />} 
              label="Calendar" 
              isActive={currentView === 'campaignCalendar'} 
              onClick={() => setView('campaignCalendar')} 
              accentColor={`${textPrimary}15`}
              textColor={textPrimary}
            />
            <NavItem 
              icon={<FolderOpen size={20} />} 
              label="Assets" 
              isActive={currentView === 'campaignAssets'} 
              onClick={() => setView('campaignAssets')} 
              accentColor={`${textPrimary}15`}
              textColor={textPrimary}
            />
            <NavItem 
              icon={<BookOpen size={20} />} 
              label="Insights" 
              isActive={currentView === 'campaignInsights'} 
              onClick={() => setView('campaignInsights')} 
              accentColor={`${textPrimary}15`}
              textColor={textPrimary}
            />
          </div>
        </nav>
        
        <div className="p-4 border-t" style={{ borderColor: `${textPrimary}10` }}>
            <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 border border-white/50"></div>
                 <div className="flex flex-col">
                     <span className="text-sm font-medium opacity-90">Senior Engineer</span>
                     <span className="text-xs opacity-50">Admin Workspace</span>
                 </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
