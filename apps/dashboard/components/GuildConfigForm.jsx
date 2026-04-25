'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Save, Settings, LayoutTemplate, Tag, ShieldBan, X, 
  TerminalSquare, Activity, Check, Cpu, Sparkles, 
  Shield, ShieldAlert, BarChart3, History, ChevronRight 
} from 'lucide-react';

import GeneralTab from './tabs/GeneralTab';
import PanelsTab from './tabs/PanelsTab';
import TypesTab from './tabs/TypesTab';
import ServerOverviewTab from './tabs/ServerOverviewTab';
import CustomCommandsTab from './tabs/CustomCommandsTab';
import AutomationTab from './tabs/AutomationTab';
import BotTab from './tabs/BotTab';
import PermissionsMatrixTab from './tabs/PermissionsMatrixTab';
import StatsTab from './tabs/StatsTab';
import ArchiveTab from './tabs/ArchiveTab';
import SecurityTab from './tabs/SecurityTab';
import SystemLockout from './SystemLockout';

export default function GuildConfigForm({ serverId, initialConfig, userPermissions = [] }) {
  const { data: session } = useSession();
  
  // States
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, saved, error

  const [config, setConfig] = useState(initialConfig);
  const [panels, setPanels] = useState(initialConfig.ticketPanels || []);
  const [types, setTypes] = useState(initialConfig.ticketTypes || []);
  const [commands, setCommands] = useState(initialConfig.customCommands || []);
  const [channels, setChannels] = useState([]);

  const markChanged = () => setHasChanges(true);

  // Handlers
  const updateConfig = (updates) => { setConfig({ ...config, ...updates }); markChanged(); };
  
  const addPanel = () => {
    setPanels([...panels, {
      id: 'NEW_' + Date.now(),
      title: 'Neues Panel',
      description: 'Hier klicken um ein Ticket zu erstellen',
      embedColor: '#f97316',
      buttonText: 'Helfen lassen',
      buttonStyle: 'PRIMARY',
      channelId: '',
      useSelectMenu: false,
    }]);
    markChanged();
  };
  const updatePanel = (id, updates) => { setPanels(panels.map(p => p.id === id ? { ...p, ...updates } : p)); markChanged(); };
  const removePanel = (id) => { setPanels(panels.filter(p => p.id !== id)); markChanged(); };

  const addType = () => {
    setTypes([...types, {
      id: 'NEW_' + Date.now(),
      name: 'Allgemeiner Support',
      emoji: '🎫',
      description: 'Standard Support für alle Anliegen',
      panelId: '',
      supportRoles: [],
      welcomeMessage: 'Willkommen! Ein Teammitglied wird sich gleich um dich kümmern.',
      channelNameFormat: 'ticket-{username}',
      isActive: true,
      categoryId: ''
    }]);
    markChanged();
  };
  const updateType = (id, updates) => { setTypes(types.map(t => t.id === id ? { ...t, ...updates } : t)); markChanged(); };
  const removeType = (id) => { setTypes(types.filter(t => t.id !== id)); markChanged(); };

  const addCommand = () => {
    setCommands([...commands, {
      id: 'NEW_' + Date.now(),
      name: 'help',
      response: 'Wie kann ich dir heute helfen?',
      isEmbed: false
    }]);
    markChanged();
  };
  const updateCommand = (id, updates) => { setCommands(commands.map(c => c.id === id ? { ...c, ...updates } : c)); markChanged(); };
  const removeCommand = (id) => { setCommands(commands.filter(c => c.id !== id)); markChanged(); };

  const saveToDatabase = async () => {
    if (isSaving || !hasChanges) return;
    setIsSaving(true);
    setSaveStatus('saving');
    try {
      const payload = { config, panels, types, commands };
      const res = await fetch(`/api/guilds/${serverId}/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('API Error');
      setHasChanges(false);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error(error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!hasChanges) return;
    const timeoutId = setTimeout(() => saveToDatabase(), 1500);
    return () => clearTimeout(timeoutId);
  }, [config, panels, types, commands, hasChanges]);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await fetch(`/api/guilds/${serverId}/channels`);
        if (res.ok) setChannels(await res.json());
      } catch (err) { console.error("Failed to fetch channels:", err); }
    };
    fetchChannels();
  }, [serverId]);

  const isOwner = session?.user?.id?.trim() === '1259849497345790002';

  const tabs = [
    { id: 'overview', label: 'Echtzeit-Status', icon: Activity },
    { id: 'general', label: 'Konfiguration', icon: Settings },
    { id: 'panels', label: 'Ticket Panels', icon: LayoutTemplate },
    { id: 'types', label: 'Kategorien', icon: Tag },
    { id: 'automation', label: 'KI & Automation', icon: Cpu },
    { id: 'security', label: 'Nexus Security Hub', icon: ShieldAlert },
    { id: 'commands', label: 'Custom Commands', icon: TerminalSquare },
    { id: 'permissions', label: 'Team', icon: Shield },
    { id: 'stats', label: 'System-Analysen', icon: BarChart3 },
    { id: 'archive', label: 'Ticket Transcript', icon: History },
  ];

  if (isOwner) tabs.push({ id: 'bot_profile', label: 'Admin Bereich', icon: Sparkles });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Navigation Sidebar */}
      <div className="lg:col-span-3 space-y-4 sticky top-28 print:hidden">
        <div className="bg-[#111214]/40 backdrop-blur-2xl border border-white/5 p-4 rounded-[2rem] shadow-2xl">
          <div className="px-5 py-3 mb-4 rounded-xl">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Nexus OS System</h3>
          </div>
          <nav className="flex flex-col gap-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-between group px-5 py-3.5 rounded-[1.2rem] transition-all duration-300 ${
                    isActive 
                      ? 'bg-orange-500/10 text-white font-bold border border-orange-500/20 shadow-lg' 
                      : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={`${isActive ? 'text-orange-400' : 'text-gray-500 group-hover:text-gray-300'} transition-colors`} />
                    <span className="text-sm">{tab.label}</span>
                  </div>
                  {isActive && <ChevronRight size={14} className="text-orange-400 animate-in slide-in-from-left-2 duration-300" />}
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* Support Card */}
        <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 p-6 rounded-[2rem] border border-white/5 shadow-xl hidden lg:block">
           <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2">Hilfe nötig?</h4>
           <p className="text-[11px] text-gray-500 leading-relaxed">Unser technischer Support steht dir rund um die Uhr im Discord zur Verfügung.</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-9 w-full min-h-[600px]">
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          {activeTab === 'overview' && <ServerOverviewTab serverId={serverId} />}
          {activeTab === 'general' && <GeneralTab config={config} updateConfig={updateConfig} />}
          {activeTab === 'panels' && <PanelsTab panels={panels} updatePanel={updatePanel} addPanel={addPanel} removePanel={removePanel} />}
          {activeTab === 'types' && <TypesTab types={types} panels={panels} channels={channels} updateType={updateType} addType={addType} removeType={removeType} />}
          {activeTab === 'automation' && <AutomationTab config={config} updateConfig={updateConfig} />}
          {activeTab === 'security' && <SecurityTab config={config} updateConfig={updateConfig} />}
          {activeTab === 'commands' && <CustomCommandsTab commands={commands} updateCommand={updateCommand} addCommand={addCommand} removeCommand={removeCommand} />}
          {activeTab === 'permissions' && <PermissionsMatrixTab guildId={serverId} />}
          {activeTab === 'stats' && <StatsTab guildId={serverId} setActiveTab={setActiveTab} />}
          {activeTab === 'archive' && (
            userPermissions.includes('TICKET_TRANSCRIPT') || userPermissions.includes('*') 
              ? <ArchiveTab guildId={serverId} /> 
              : <SystemLockout mini />
          )}
          {activeTab === 'bot_profile' && <BotTab />}
        </div>
      </div>

      {/* Modern Auto-Save Indicator */}
      {saveStatus !== 'idle' && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-4 duration-500">
          <div className={`px-6 py-4 rounded-3xl border backdrop-blur-3xl shadow-2xl flex items-center gap-4 transition-all ${
             saveStatus === 'saved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
             saveStatus === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
             'bg-orange-500/10 border-orange-500/20 text-orange-400'
          }`}>
             {saveStatus === 'saving' && <Loader2 className="animate-spin" size={20} />}
             {saveStatus === 'saved' && <Check size={20} />}
             {saveStatus === 'error' && <X size={20} />}
             
             <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-widest">
                   {saveStatus === 'saving' ? 'Synchronisierung...' : saveStatus === 'saved' ? 'Sicher archiviert' : 'Systemfehler'}
                </span>
                <span className="text-[10px] opacity-60">
                   {saveStatus === 'saving' ? 'Änderungen werden live übertragen' : saveStatus === 'saved' ? 'Alle Daten sind aktuell' : 'Bitte Verbindung prüfen'}
                </span>
             </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes loader-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .loader-spin {
          animation: loader-spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}

function Loader2({ className, size }) {
  return (
    <svg 
      className={`animate-spin ${className}`} 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
