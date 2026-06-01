'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Overview from '@/components/Overview';
import RiskHeatmap from '@/components/RiskHeatmap';
import ControlsCenter from '@/components/ControlsCenter';
import ComplianceCenter from '@/components/ComplianceCenter';
import AuditIntelligence from '@/components/AuditIntelligence';
import AiSpecialist from '@/components/AiSpecialist';
import ReportsCenter from '@/components/ReportsCenter';
import { 
  getInitialDatabaseState, 
  saveDatabaseState, 
  DatabaseState, 
  Risk, 
  Control, 
  ComplianceObligation, 
  AuditFinding 
} from '@/lib/mockDb';
import { 
  Sparkles, 
  ShieldAlert, 
  Activity, 
  CheckSquare, 
  FileText, 
  User, 
  Clock, 
  CheckCircle2, 
  FileDown, 
  CheckCircle,
  Bell
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AppContainer() {
  const [db, setDb] = useState<DatabaseState | null>(null);
  const [currentView, setCurrentView] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [mobileClock, setMobileClock] = useState('');

  // Initialize DB and Clock client-side only
  useEffect(() => {
    setDb(getInitialDatabaseState());
    
    const updateTime = () => {
      const now = new Date();
      setMobileClock(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateDbState = (newDb: DatabaseState) => {
    setDb(newDb);
    saveDatabaseState(newDb);
  };

  // Relational Database Actions
  const handleAddRisk = (newRiskData: Omit<Risk, 'id' | 'inherentScore' | 'residualScore'>) => {
    if (!db) return;
    const newId = `RSK-0${db.risks.length + 1}`;
    const inherent = newRiskData.likelihood * newRiskData.impact;
    let mitigationFactor = 0.5;
    if (newRiskData.category === 'Compliance') mitigationFactor = 0.4;
    else if (newRiskData.category === 'Cyber') mitigationFactor = 0.6;
    const residual = Math.max(1, Math.round(inherent * mitigationFactor));

    const newRisk: Risk = {
      ...newRiskData,
      id: newId,
      inherentScore: inherent,
      residualScore: residual
    };

    const newDb: DatabaseState = {
      ...db,
      risks: [newRisk, ...db.risks]
    };
    updateDbState(newDb);
  };

  const handleUpdateControl = (controlId: string, updates: Partial<Control>) => {
    if (!db) return;
    let updatedRisks = [...db.risks];
    const targetControl = db.controls.find(c => c.id === controlId);

    if (targetControl && updates.effectiveness) {
      const isNowEffective = updates.effectiveness === 'Effective';
      updatedRisks = db.risks.map(r => {
        const riskCategoryMatch = (r.category === 'Cyber' && targetControl.name.toLowerCase().includes('mfa')) ||
                                  (r.category === 'Compliance' && targetControl.name.toLowerCase().includes('aml')) ||
                                  (r.category === 'Compliance' && targetControl.name.toLowerCase().includes('mifid'));
        if (riskCategoryMatch) {
          const newResidual = isNowEffective 
            ? Math.max(1, Math.round(r.inherentScore * 0.4))
            : Math.min(25, Math.round(r.inherentScore * 0.8));
          return { ...r, residualScore: newResidual };
        }
        return r;
      });
    }

    const updatedControls = db.controls.map(c => 
      c.id === controlId ? { ...c, ...updates } : c
    );

    const newDb: DatabaseState = {
      ...db,
      controls: updatedControls,
      risks: updatedRisks
    };

    if (targetControl?.evidenceStatus === 'Overdue' && updates.evidenceStatus === 'Submitted') {
      setNotificationsCount(prev => Math.max(0, prev - 1));
    }

    updateDbState(newDb);
  };

  const handleUpdateCompliance = (obligationId: string, updates: Partial<ComplianceObligation>) => {
    if (!db) return;
    const updatedCompliance = db.compliance.map(o => 
      o.id === obligationId ? { ...o, ...updates } : o
    );
    const newDb: DatabaseState = {
      ...db,
      compliance: updatedCompliance
    };

    const targetOb = db.compliance.find(o => o.id === obligationId);
    if (targetOb?.status !== 'Compliant' && updates.status === 'Compliant') {
      setNotificationsCount(prev => Math.max(0, prev - 1));
    }

    updateDbState(newDb);
  };

  const handleUpdateFinding = (findingId: string, updates: Partial<AuditFinding>) => {
    if (!db) return;
    const updatedFindings = db.auditFindings.map(f => 
      f.id === findingId ? { ...f, ...updates } : f
    );
    const newDb: DatabaseState = {
      ...db,
      auditFindings: updatedFindings
    };

    const targetFinding = db.auditFindings.find(f => f.id === findingId);
    if (targetFinding?.status !== 'Closed' && updates.status === 'Closed') {
      setNotificationsCount(prev => Math.max(0, prev - 1));
    }

    updateDbState(newDb);
  };

  const handleGlobalSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleTriggerQuickAction = (action: string) => {
    if (action === 'add-risk') {
      setCurrentView('risks');
    } else if (action === 'request-evidence') {
      setCurrentView('controls');
    } else if (action === 'close-finding') {
      setCurrentView('audit');
    } else if (action === 'export-board') {
      setCurrentView('reports');
    }
  };

  // Mobile Companion Actions Handlers (Simulates confetti + updates)
  const handleMobileApproveEvidence = (id: string) => {
    handleUpdateControl(id, { evidenceStatus: 'Submitted', effectiveness: 'Effective' });
    confetti({ particleCount: 60, spread: 50, origin: { y: 0.85 } });
  };

  const handleMobileResolveFinding = (id: string) => {
    handleUpdateFinding(id, { status: 'Closed' });
    confetti({ particleCount: 60, spread: 50, origin: { y: 0.85 } });
  };

  const handleMobileExport = () => {
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.85 } });
    alert("Board Executive Memorandum successfully exported to PDF.");
  };

  if (!db) {
    return (
      <div className="h-screen w-screen bg-background flex flex-col items-center justify-center font-sans text-navy">
        <span className="animate-spin rounded-full h-8 w-8 border-4 border-navy border-t-gold mb-4"></span>
        <span className="text-xs font-bold uppercase tracking-widest text-slate">Loading AURA AIOS (ARAIS) Registry...</span>
      </div>
    );
  }

  // Filtered DB passed down to desktop dashboard components
  const filteredDb: DatabaseState = {
    risks: searchQuery 
      ? db.risks.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.id.toLowerCase().includes(searchQuery.toLowerCase()))
      : db.risks,
    controls: searchQuery 
      ? db.controls.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase()))
      : db.controls,
    compliance: searchQuery
      ? db.compliance.filter(o => o.requirement.toLowerCase().includes(searchQuery.toLowerCase()) || o.id.toLowerCase().includes(searchQuery.toLowerCase()))
      : db.compliance,
    auditFindings: searchQuery
      ? db.auditFindings.filter(f => f.auditArea.toLowerCase().includes(searchQuery.toLowerCase()) || f.id.toLowerCase().includes(searchQuery.toLowerCase()))
      : db.auditFindings
  };

  // Calculate Metrics for Mobile View
  const mobileHighRisks = db.risks.filter(r => r.residualScore >= 10).length;
  const mobileComplianceScore = Math.round((db.compliance.filter(o => o.status === 'Compliant').length / db.compliance.length) * 100);
  const mobileControlsScore = Math.round((db.controls.filter(c => c.effectiveness === 'Effective').length / db.controls.length) * 100);
  const mobileOpenFindings = db.auditFindings.filter(f => f.status !== 'Closed').length;
  const mobileAiThreatIndex = Math.min(100, Math.round((mobileHighRisks * 12) + (mobileOpenFindings * 8) + (100 - mobileComplianceScore) * 0.4 + (100 - mobileControlsScore) * 0.4));

  // Urgent approvals for mobile screen feed
  const mobileAlerts = [
    ...db.controls.filter(c => c.evidenceStatus === 'Overdue').map(c => ({
      id: c.id,
      type: 'evidence',
      title: 'Control Evidence Past Due',
      desc: `${c.id}: ${c.name} (${c.owner})`,
      actionLabel: 'Approve & Mark Effective'
    })),
    ...db.auditFindings.filter(f => f.status === 'Open' && f.severity === 'Critical').map(f => ({
      id: f.id,
      type: 'finding',
      title: 'Critical Audit Finding Open',
      desc: `${f.id}: ${f.auditArea} (${f.actionOwner})`,
      actionLabel: 'Close Finding'
    }))
  ];

  return (
    <div className="min-h-screen bg-background font-sans select-none overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* 📱 MOBILE EXECUTIVE COMPANION EXPERIENCE (lg:hidden)                     */}
      {/* ========================================================================= */}
      <div className="block lg:hidden min-h-screen flex flex-col bg-background text-navy pb-10">
        
        {/* Mobile Header */}
        <header className="h-16 bg-navy text-white px-5 flex items-center justify-between sticky top-0 z-40 border-b border-gold/20 shadow-md">
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-gold/10 rounded border border-gold/40">
              <Sparkles className="h-5 w-5 text-gold animate-pulse" />
            </div>
            <div>
              <h1 className="font-extrabold text-xs tracking-wider text-gold uppercase">Aura Companion</h1>
              <p className="text-[9px] text-lightblue font-semibold uppercase tracking-wider">Board Command Center</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 font-mono text-xs font-bold text-lightblue">
              <Clock size={11} className="text-gold" />
              <span>{mobileClock}</span>
            </div>
            <div className="relative">
              <Bell className="h-4.5 w-4.5 text-lightblue" />
              {notificationsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-risk-critical text-white text-[8px] font-bold rounded-full h-3.5 w-3.5 flex items-center justify-center border border-navy">
                  {notificationsCount}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Companion Content Feed */}
        <main className="flex-1 p-5 space-y-6 max-w-md mx-auto w-full">
          
          {/* Executive Mobile KPIs */}
          <div className="grid grid-cols-2 gap-3.5">
            
            {/* AI Threat Score Card */}
            <div className="bg-white p-4 rounded-xl border border-steel/15 shadow-sm border-l-4 border-l-gold">
              <span className="text-[10px] text-gold font-bold uppercase tracking-wider block">Threat Index</span>
              <h3 className="text-xl font-bold text-navy mt-1">{mobileAiThreatIndex}/100</h3>
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-navy/5 rounded border mt-2 inline-block">
                {mobileAiThreatIndex > 50 ? 'ELEVATED' : 'STABLE'}
              </span>
            </div>

            {/* Compliance Index Card */}
            <div className="bg-white p-4 rounded-xl border border-steel/15 shadow-sm">
              <span className="text-[10px] text-slate font-bold uppercase tracking-wider block">Compliance</span>
              <h3 className="text-xl font-bold text-navy mt-1">{mobileComplianceScore}%</h3>
              <div className="w-full bg-background rounded-full h-1 mt-2.5">
                <div className="bg-gold h-full rounded-full" style={{ width: `${mobileComplianceScore}%` }} />
              </div>
            </div>

            {/* Control Health Card */}
            <div className="bg-white p-4 rounded-xl border border-steel/15 shadow-sm">
              <span className="text-[10px] text-slate font-bold uppercase tracking-wider block">Control Health</span>
              <h3 className="text-xl font-bold text-navy mt-1">{mobileControlsScore}%</h3>
              <div className="w-full bg-background rounded-full h-1 mt-2.5">
                <div className="bg-navy h-full rounded-full" style={{ width: `${mobileControlsScore}%` }} />
              </div>
            </div>

            {/* Open Findings Card */}
            <div className="bg-white p-4 rounded-xl border border-steel/15 shadow-sm">
              <span className="text-[10px] text-slate font-bold uppercase tracking-wider block">Open Findings</span>
              <h3 className="text-xl font-bold text-navy mt-1">{mobileOpenFindings}</h3>
              <span className="text-[9px] text-slate font-bold block mt-2">Audit issues open</span>
            </div>

          </div>

          {/* AI Posture Insights Card */}
          <div className="bg-white p-5 rounded-xl border border-steel/15 shadow-sm bg-gradient-to-br from-white to-background border-t-2 border-t-gold space-y-2">
            <div className="flex items-center space-x-1.5 border-b border-steel/10 pb-2">
              <Sparkles className="h-4 w-4 text-gold animate-pulse" />
              <h3 className="font-bold text-xs uppercase text-navy">AI Active Insights</h3>
            </div>
            <p className="text-xs font-semibold text-navy leading-relaxed">
              Cyber vulnerabilities remain at an <span className="text-risk-critical font-bold">Elevated</span> posture. GDPR Consent gaps (COM-302) and Wealth Platform Access Gaps (AUD-501) require prompt executive remediation.
            </p>
          </div>

          {/* Approvals & Actionable Alerts Feed */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase text-slate tracking-wider block">Urgent Action Board</h3>
            <div className="space-y-3">
              {mobileAlerts.length > 0 ? (
                mobileAlerts.map((alert) => (
                  <div key={alert.id} className="bg-white p-4 rounded-xl border border-steel/15 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-risk-critical font-bold uppercase block tracking-wider">{alert.title}</span>
                        <p className="text-xs font-bold text-navy mt-0.5 leading-normal">{alert.desc}</p>
                      </div>
                      <span className="text-[10px] font-bold font-mono text-steel uppercase flex-shrink-0">{alert.id}</span>
                    </div>
                    
                    <button
                      onClick={() => {
                        if (alert.type === 'evidence') handleMobileApproveEvidence(alert.id);
                        else handleMobileResolveFinding(alert.id);
                      }}
                      className="w-full bg-navy hover:bg-navy/90 text-gold text-xs font-bold py-2 rounded-lg border border-gold/30 flex items-center justify-center space-x-1 shadow cursor-pointer transition-all"
                    >
                      <CheckCircle2 size={13} />
                      <span>{alert.actionLabel}</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-6 bg-white border border-steel/15 rounded-xl text-center text-xs font-bold text-risk-low">
                  ✓ All urgent control approvals and audit findings resolved.
                </div>
              )}
            </div>
          </div>

          {/* Board Memorandums Summary */}
          <div className="bg-white p-5 rounded-xl border border-steel/15 shadow-sm space-y-4">
            <div className="border-b border-steel/10 pb-2">
              <span className="text-[10px] text-slate font-bold uppercase block tracking-wider">Board Memorandum Summary</span>
            </div>
            
            <div className="text-[11px] leading-relaxed font-semibold text-navy space-y-2">
              <p>
                <strong>ARAIS assessment:</strong> Corporate compliance stands at <strong>{mobileComplianceScore}% alignment</strong>. Key control effectiveness is rated at <strong>{mobileControlsScore}%</strong>. Gaps are under active correction cycles.
              </p>
            </div>

            <button
              onClick={handleMobileExport}
              className="w-full bg-white hover:bg-background text-navy border border-steel/30 text-xs font-bold py-2.5 rounded-lg flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <FileDown size={14} className="text-steel" />
              <span>Export PDF Board Pack</span>
            </button>
          </div>

        </main>
      </div>

      {/* ========================================================================= */}
      {/* 💻 FULL-ANALYTICS DESKTOP EXPERIENCE (hidden lg:flex)                     */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex min-h-screen bg-background text-navy font-sans select-none overflow-x-hidden">
        
        {/* Collapsible Left Navigation Sidebar */}
        <Sidebar 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />

        {/* Main Execution Canvas */}
        <div className={`flex-1 flex flex-col transition-all duration-300 min-h-screen ${
          isSidebarCollapsed ? 'ml-20' : 'ml-72'
        }`}>
          
          {/* Top Header Controls bar */}
          <Header 
            onSearch={handleGlobalSearch} 
            onOpenAiChat={() => setCurrentView('ai-specialist')}
            onTriggerQuickAction={handleTriggerQuickAction}
            notificationsCount={notificationsCount}
          />

          {/* View Switcher grid canvas */}
          <main className="flex-1 p-8 overflow-y-auto max-w-7xl w-full mx-auto pb-12">
            {currentView === 'overview' && (
              <Overview db={filteredDb} onNavigate={setCurrentView} />
            )}
            {currentView === 'risks' && (
              <RiskHeatmap db={filteredDb} onAddRisk={handleAddRisk} />
            )}
            {currentView === 'controls' && (
              <ControlsCenter db={filteredDb} onUpdateControl={handleUpdateControl} />
            )}
            {currentView === 'compliance' && (
              <ComplianceCenter db={filteredDb} onUpdateCompliance={handleUpdateCompliance} />
            )}
            {currentView === 'audit' && (
              <AuditIntelligence db={filteredDb} onUpdateFinding={handleUpdateFinding} />
            )}
            {currentView === 'ai-specialist' && (
              <AiSpecialist db={db} />
            )}
            {currentView === 'reports' && (
              <ReportsCenter db={filteredDb} />
            )}
          </main>

        </div>
      </div>
      
    </div>
  );
}
