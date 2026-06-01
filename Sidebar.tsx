'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Activity, 
  CheckSquare, 
  FileText, 
  Bot, 
  BarChart3, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert as ShieldIcon
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ 
  currentView, 
  setCurrentView, 
  isCollapsed, 
  setIsCollapsed 
}: SidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'risks', label: 'Risk Intelligence', icon: ShieldAlert },
    { id: 'controls', label: 'Controls Monitoring', icon: Activity },
    { id: 'compliance', label: 'Compliance Center', icon: CheckSquare },
    { id: 'audit', label: 'Internal Audit', icon: FileText },
    { id: 'ai-specialist', label: 'AI Risk Specialist', icon: Bot, isAi: true },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 }
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 h-screen bg-navy text-white flex flex-col transition-all duration-300 z-30 shadow-2xl border-r border-slate/30 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-5 border-b border-slate/20">
        {!isCollapsed && (
          <div className="flex items-center space-x-2 animate-fade-in">
            <div className="p-1.5 bg-gold/10 rounded border border-gold/40">
              <ShieldIcon className="h-6 w-6 text-gold" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-widest text-gold uppercase">Barani Aura</h1>
              <p className="text-[10px] text-lightblue font-medium uppercase tracking-wider">A I O S • A R A I S</p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="mx-auto p-1.5 bg-gold/10 rounded border border-gold/40">
            <ShieldIcon className="h-6 w-6 text-gold" />
          </div>
        )}
        
        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="absolute -right-3 top-24 bg-gold hover:bg-gold/90 text-navy p-1 rounded-full border border-navy shadow-md cursor-pointer transition-transform duration-200 hover:scale-115"
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center py-3.5 px-4 rounded-lg text-sm font-medium tracking-wide transition-all duration-200 group relative cursor-pointer ${
                isActive 
                  ? 'bg-midnight text-gold border-l-4 border-gold shadow-inner' 
                  : 'text-lightblue hover:bg-midnight/50 hover:text-white'
              }`}
            >
              <div className="flex items-center w-full">
                <Icon className={`h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-gold' : 'text-lightblue group-hover:text-white'
                }`} />
                
                {!isCollapsed && (
                  <span className="ml-4 transition-opacity duration-300 font-sans">
                    {item.label}
                  </span>
                )}
                
                {/* AI Pulse indicator */}
                {item.isAi && !isCollapsed && (
                  <span className="ml-auto flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
                  </span>
                )}
              </div>

              {/* Tooltip for collapsed mode */}
              {isCollapsed && (
                <div className="absolute left-24 bg-navy text-white text-xs px-3 py-2 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-xl border border-slate/30 whitespace-nowrap">
                  {item.label}
                  {item.isAi && <span className="ml-2 text-gold font-semibold">• Active</span>}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate/20 bg-midnight/40 text-center">
        {!isCollapsed ? (
          <div className="animate-fade-in">
            <p className="text-[10px] text-slate font-semibold uppercase tracking-wider">Continuous Assurance</p>
            <p className="text-[9px] text-lightblue mt-0.5 opacity-80">v1.12.0 • Corporate Governance</p>
          </div>
        ) : (
          <span className="text-[10px] text-gold font-bold">AIOS</span>
        )}
      </div>
    </aside>
  );
}
