
import React, { useState } from 'react';
import { StoreProvider } from './store';
import { Layout } from './components/Layout';
import { Dashboard } from './views/Dashboard';
import { BrandSetup } from './views/BrandSetup';
import { Strategy } from './views/Strategy';
import { Identity } from './views/Identity';
import { ContentEngine } from './views/ContentEngine';
import { CalendarView } from './views/Calendar';
import { Assets } from './views/Assets';
import { BrandBookGLVT } from './views/BrandBookGLVT';
import { SocialKit } from './views/SocialKit';
import { BrandDNA } from './views/BrandDNA';
import { AdGenerator } from './views/AdGenerator';
import { GridBuilder } from './views/GridBuilder';
import { ViewName } from './types';
import { CampaignsView } from './views/Campaigns';
import { CampaignDetailView } from './views/CampaignDetail';
import { CampaignChannelsView } from './views/CampaignChannels';
import { CampaignAssetsView } from './views/CampaignAssets';
import { CampaignCalendarView } from './views/CampaignCalendar';
import { CampaignInsightsView } from './views/CampaignInsights';

const AppContent: React.FC = () => {
  const [currentView, setView] = useState<ViewName>('dashboard');
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard setView={setView} />;
      case 'setup': return <BrandSetup setView={setView} />;
      case 'strategy': return <Strategy />;
      case 'identity': return <Identity />;
      case 'ideas': return <ContentEngine />;
      case 'calendar': return <CalendarView />;
      case 'assets': return <Assets />;
      case 'brandbook': return <BrandBookGLVT />;
      case 'adgen': return <AdGenerator />;
      case 'gridbuilder': return <GridBuilder />;
      case 'socialkit': return <SocialKit />;
      case 'dna': return <BrandDNA />;
      case 'campaigns': return <CampaignsView setView={setView} setActiveCampaignId={setActiveCampaignId} />;
      case 'campaignDetail': return <CampaignDetailView campaignId={activeCampaignId} setView={setView} />;
      case 'campaignChannels': return <CampaignChannelsView campaignId={activeCampaignId} setActiveCampaignId={setActiveCampaignId} />;
      case 'campaignAssets': return <CampaignAssetsView campaignId={activeCampaignId} setActiveCampaignId={setActiveCampaignId} />;
      case 'campaignCalendar': return <CampaignCalendarView campaignId={activeCampaignId} setActiveCampaignId={setActiveCampaignId} />;
      case 'campaignInsights': return <CampaignInsightsView campaignId={activeCampaignId} setActiveCampaignId={setActiveCampaignId} />;
      default: return <Dashboard setView={setView} />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setView}>
      {renderView()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;
