'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Sparkles, 
  User, 
  PlusCircle, 
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string) => void;
  onOpenAiChat: () => void;
  onTriggerQuickAction: (action: string) => void;
  notificationsCount: number;
}

export default function Header({ 
  onSearch, 
  onOpenAiChat, 
  onTriggerQuickAction,
  notificationsCount 
}: HeaderProps) {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDate(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    onSearch(e.target.value);
  };

  const notificationList = [
    {
      id: 1,
      type: 'critical',
      message: 'CNT-103 Access Audit evidence submission is 17 days overdue',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'warning',
      message: 'GDPR Consent Logs obligation marked Non-Compliant',
      time: '4 hours ago'
    },
    {
      id: 3,
      type: 'info',
      message: 'New Audit Finding AUD-501 logged for Wealth Platform Access Gaps',
      time: '1 day ago'
    }
  ];

  return (
    <header className="h-20 bg-white border-b border-steel/20 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      {/* Search Bar */}
      <div className="flex-1 max-w-md relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-steel" />
        </div>
        <input
          type="text"
          value={searchVal}
          onChange={handleSearchChange}
          placeholder="Global search across risks, controls, audit findings..."
          className="w-full bg-background border border-steel/30 rounded-lg py-2 pl-10 pr-4 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold text-navy placeholder:text-slate/60 transition-all"
        />
        {searchVal && (
          <button 
            onClick={() => { setSearchVal(''); onSearch(''); }}
            className="absolute right-3 top-2.5 text-xs text-slate hover:text-navy cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Right Controls Area */}
      <div className="flex items-center space-x-6">
        
        {/* Date & Time Widget */}
        <div className="hidden lg:flex items-center space-x-4 border-r border-steel/20 pr-6 text-navy font-medium text-xs">
          <div className="flex items-center space-x-1.5">
            <Calendar className="h-3.5 w-3.5 text-steel" />
            <span>{date}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Clock className="h-3.5 w-3.5 text-gold" />
            <span className="font-mono tabular-nums">{time}</span>
          </div>
        </div>

        {/* AI Specialist Quick Trigger */}
        <button
          onClick={onOpenAiChat}
          className="flex items-center space-x-1.5 bg-navy hover:bg-navy/90 text-gold text-xs font-semibold px-3.5 py-2 rounded-lg border border-gold/30 shadow-md cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Sparkles className="h-4 w-4 text-gold animate-pulse" />
          <span>Consult AI Specialist</span>
        </button>

        {/* Quick Actions Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsActionsOpen(!isActionsOpen);
              setIsNotifOpen(false);
            }}
            className="flex items-center space-x-1 bg-white hover:bg-background text-navy border border-steel/30 text-xs font-bold px-3 py-2 rounded-lg cursor-pointer transition-all"
          >
            <PlusCircle className="h-4 w-4 text-steel" />
            <span>Actions</span>
          </button>

          {isActionsOpen && (
            <div className="absolute right-0 mt-2.5 w-56 bg-white border border-steel/20 rounded-lg shadow-xl py-1.5 z-30 animate-fade-in">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate border-b border-background">
                Governance Actions
              </div>
              <button
                onClick={() => {
                  onTriggerQuickAction('add-risk');
                  setIsActionsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs font-medium text-navy hover:bg-background hover:text-gold flex items-center space-x-2 cursor-pointer"
              >
                <AlertTriangle className="h-3.5 w-3.5 text-risk-high" />
                <span>Log Emerging Risk</span>
              </button>
              <button
                onClick={() => {
                  onTriggerQuickAction('request-evidence');
                  setIsActionsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs font-medium text-navy hover:bg-background hover:text-gold flex items-center space-x-2 cursor-pointer"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-steel" />
                <span>Request Control Evidence</span>
              </button>
              <button
                onClick={() => {
                  onTriggerQuickAction('close-finding');
                  setIsActionsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs font-medium text-navy hover:bg-background hover:text-gold flex items-center space-x-2 cursor-pointer"
              >
                <CheckCircle className="h-3.5 w-3.5 text-risk-low" />
                <span>Resolve Audit Finding</span>
              </button>
              <button
                onClick={() => {
                  onTriggerQuickAction('export-board');
                  setIsActionsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs font-medium text-navy hover:bg-background hover:text-gold flex items-center space-x-2 border-t border-background cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                <span>Export Board Summary Pack</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Icon & Center */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsActionsOpen(false);
            }}
            className="p-2 text-steel hover:text-navy hover:bg-background rounded-full relative cursor-pointer transition-all"
            aria-label="View notifications"
          >
            <Bell className="h-5 w-5" />
            {notificationsCount > 0 && (
              <span className="absolute top-1 right-1 bg-risk-critical text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white">
                {notificationsCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2.5 w-80 bg-white border border-steel/20 rounded-lg shadow-2xl z-30 animate-fade-in max-h-96 overflow-y-auto">
              <div className="px-4 py-3 border-b border-background flex items-center justify-between">
                <span className="text-xs font-bold text-navy uppercase tracking-wider">Executive Alerts</span>
                {notificationsCount > 0 && (
                  <span className="text-[10px] text-risk-low font-semibold hover:underline cursor-pointer">
                    Mark all read
                  </span>
                )}
              </div>
              <div className="divide-y divide-background">
                {notificationList.map((notif) => (
                  <div key={notif.id} className="p-3.5 hover:bg-background/40 transition-colors flex items-start space-x-2.5">
                    <span className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${
                      notif.type === 'critical' 
                        ? 'bg-risk-critical' 
                        : notif.type === 'warning' 
                        ? 'bg-risk-mod' 
                        : 'bg-steel'
                    }`} />
                    <div className="flex-1">
                      <p className="text-[11px] font-medium leading-relaxed text-navy">{notif.message}</p>
                      <span className="text-[9px] text-slate mt-1 block">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-background text-center">
                <span className="text-[10px] font-semibold text-steel hover:text-navy cursor-pointer">
                  View All Governance Alerts
                </span>
              </div>
            </div>
          )}
        </div>

        {/* User Card */}
        <div className="flex items-center space-x-3 border-l border-steel/20 pl-6">
          <div className="h-9 w-9 bg-steel/10 rounded-full flex items-center justify-center border border-steel/20 text-navy font-bold text-xs">
            <User size={16} className="text-navy" />
          </div>
          <div className="hidden xl:block">
            <p className="text-xs font-bold text-navy leading-none">Alexander Hamilton</p>
            <span className="text-[9px] text-slate font-bold uppercase tracking-wider mt-0.5 block">Chief Risk Officer</span>
          </div>
        </div>

      </div>
    </header>
  );
}
