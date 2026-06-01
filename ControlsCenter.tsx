'use client';

import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Send, 
  Search, 
  Filter, 
  Sparkles, 
  TrendingUp,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Cell
} from 'recharts';
import { DatabaseState, Control } from '../lib/mockDb';
import confetti from 'canvas-confetti';

interface ControlsCenterProps {
  db: DatabaseState;
  onUpdateControl: (controlId: string, updates: Partial<Control>) => void;
}

export default function ControlsCenter({ db, onUpdateControl }: ControlsCenterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [componentFilter, setComponentFilter] = useState('All');
  const [effectivenessFilter, setEffectivenessFilter] = useState('All');
  const [activeTab, setActiveTab] = useState<'all' | 'exceptions'>('all');

  // 1. Metrics calculations
  const totalControls = db.controls.length;
  const testedCount = db.controls.reduce((sum, c) => sum + c.testedCount, 0);
  const effectiveControls = db.controls.filter(c => c.effectiveness === 'Effective');
  const effectiveCount = effectiveControls.length;
  const ineffectiveCount = db.controls.filter(c => c.effectiveness === 'Ineffective').length;
  const overdueEvidenceCount = db.controls.filter(c => c.evidenceStatus === 'Overdue').length;
  const healthScore = totalControls > 0 ? Math.round((effectiveCount / totalControls) * 100) : 100;

  // 2. Interactive Handlers
  const handleRequestEvidence = (controlId: string) => {
    onUpdateControl(controlId, { 
      evidenceStatus: 'Submitted',
      testedCount: db.controls.find(c => c.id === controlId)!.testedCount + 1
    });
    
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#C9A227', '#0A2540', '#486581']
    });
  };

  const handleTestControl = (controlId: string, makeEffective: boolean) => {
    onUpdateControl(controlId, { 
      effectiveness: makeEffective ? 'Effective' : 'Ineffective',
      evidenceStatus: makeEffective ? 'Submitted' : 'Pending',
      testedCount: db.controls.find(c => c.id === controlId)!.testedCount + 1
    });

    if (makeEffective) {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.8 }
      });
    }
  };

  // 3. Filtering logic
  const filteredControls = db.controls.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesComponent = componentFilter === 'All' || c.cosoComponent === componentFilter;
    const matchesEffectiveness = effectivenessFilter === 'All' || c.effectiveness === effectivenessFilter;
    const matchesTab = activeTab === 'all' || (activeTab === 'exceptions' && (c.effectiveness === 'Ineffective' || c.evidenceStatus === 'Overdue'));
    
    return matchesSearch && matchesComponent && matchesEffectiveness && matchesTab;
  });

  // Calculate COSO Component effectiveness data for Recharts
  const cosoComponents = ['Control Environment', 'Risk Assessment', 'Control Activities', 'Information & Communication', 'Monitoring'];
  const cosoChartData = cosoComponents.map(comp => {
    const compControls = db.controls.filter(c => c.cosoComponent === comp);
    const total = compControls.length;
    const effective = compControls.filter(c => c.effectiveness === 'Effective').length;
    const pct = total > 0 ? Math.round((effective / total) * 100) : 100;
    
    // Shorten name for chart display
    let shortName = comp;
    if (comp === 'Information & Communication') shortName = 'Info & Comm';
    else if (comp === 'Control Environment') shortName = 'Environment';
    else if (comp === 'Control Activities') shortName = 'Activities';
    else if (comp === 'Risk Assessment') shortName = 'Risk Assess';
    else if (comp === 'Monitoring') shortName = 'Monitoring';

    return { name: shortName, pct, total, effective };
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-steel/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-navy tracking-tight">Continuous Control Monitoring</h2>
          <p className="text-sm text-steel font-medium mt-1">Real-time control mapping, COSO effectiveness testing, evidence workflows, and exception monitoring.</p>
        </div>
      </div>

      {/* Control Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        
        {/* Health Score */}
        <div className="premium-card p-6 rounded-xl border-t-2 border-t-navy">
          <p className="text-xs text-slate font-bold uppercase tracking-wider">Control Health Index</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <h3 className="text-3xl font-bold text-navy">{healthScore}%</h3>
            <span className="text-xs text-risk-low font-bold flex items-center">
              <TrendingUp size={12} className="mr-0.5" /> High Health
            </span>
          </div>
          <div className="w-full bg-background rounded-full h-1.5 mt-3">
            <div className="bg-navy h-full rounded-full" style={{ width: `${healthScore}%` }} />
          </div>
        </div>

        {/* Tested Count */}
        <div className="premium-card p-6 rounded-xl">
          <p className="text-xs text-slate font-bold uppercase tracking-wider">Control Audits Run</p>
          <h3 className="text-3xl font-bold text-navy mt-2">{testedCount}</h3>
          <p className="text-xs text-slate font-semibold mt-3">Continuous cycles</p>
        </div>

        {/* Effective */}
        <div className="premium-card p-6 rounded-xl border-l-4 border-l-risk-low">
          <p className="text-xs text-risk-low font-bold uppercase tracking-wider">Effective Controls</p>
          <h3 className="text-3xl font-bold text-navy mt-2">{effectiveCount}</h3>
          <p className="text-xs text-slate font-semibold mt-3">Passed activities</p>
        </div>

        {/* Ineffective */}
        <div className="premium-card p-6 rounded-xl border-l-4 border-l-risk-critical">
          <p className="text-xs text-risk-critical font-bold uppercase tracking-wider">Ineffective Controls</p>
          <h3 className="text-3xl font-bold text-navy mt-2">{ineffectiveCount}</h3>
          <p className="text-xs text-slate font-semibold mt-3">Attention required</p>
        </div>

        {/* Overdue Evidence Requests */}
        <div className="premium-card p-6 rounded-xl border-l-4 border-l-risk-high">
          <p className="text-xs text-risk-high font-bold uppercase tracking-wider">Evidence Overdue</p>
          <h3 className="text-3xl font-bold text-navy mt-2">{overdueEvidenceCount}</h3>
          <p className="text-xs text-slate font-semibold mt-3">Awaiting owner files</p>
        </div>

      </div>

      {/* COSO Chart & Exception Quick Summary Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COSO Component effectiveness bar chart */}
        <div className="lg:col-span-2 premium-card p-6 rounded-xl">
          <div className="border-b border-steel/10 pb-3 mb-5">
            <h3 className="font-bold text-base tracking-wide uppercase text-navy">COSO Component Control Effectiveness</h3>
          </div>
          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cosoChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(72,101,129,0.08)" />
                <XAxis dataKey="name" stroke="#52606D" fontSize={11} fontWeight={600} tickLine={false} />
                <YAxis stroke="#52606D" fontSize={11} fontWeight={600} domain={[0, 100]} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#FFFFFF', border: '1px solid rgba(72,101,129,0.15)', borderRadius: '6px', fontSize: 11 }}
                  labelClassName="font-bold text-navy"
                />
                <Bar dataKey="pct" fill="#486581" radius={[4, 4, 0, 0]} name="Effectiveness %">
                  {cosoChartData.map((entry, index) => {
                    const color = entry.pct >= 80 ? '#2E7D32' : entry.pct >= 55 ? '#C9A227' : '#C62828';
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Info Box */}
        <div className="premium-card p-6 rounded-xl flex flex-col justify-between">
          <div className="border-b border-steel/10 pb-3">
            <h3 className="font-bold text-base tracking-wide uppercase text-navy">Control Testing Protocol</h3>
          </div>
          <div className="space-y-4 text-xs font-semibold text-navy mt-4 leading-relaxed">
            <p>
              In accordance with COSO rules, all controls are subjected to daily, weekly, or monthly testing criteria.
            </p>
            <p>
              Exceptions are flagged automatically when control effectiveness fails ("Ineffective") or when evidence uploads fail to meet the schedule dates.
            </p>
            <div className="p-3.5 bg-background border border-steel/10 rounded-lg">
              <span className="text-gold font-bold block text-sm">💡 Dynamic Simulator:</span>
              <p className="mt-1 font-medium leading-normal text-slate">
                Clicking <span className="underline">Verify Effective</span> or <span className="underline">Fail Control</span> in the table below will trigger reactive updates in the parent risk register, adjusting residual risk levels dynamically.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-steel/20 text-sm font-bold">
        <button
          onClick={() => setActiveTab('all')}
          className={`py-3.5 px-6 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'all' 
              ? 'border-gold text-navy' 
              : 'border-transparent text-slate hover:text-navy'
          }`}
        >
          Control Library ({totalControls})
        </button>
        <button
          onClick={() => setActiveTab('exceptions')}
          className={`py-3.5 px-6 border-b-2 cursor-pointer transition-colors flex items-center space-x-1.5 ${
            activeTab === 'exceptions' 
              ? 'border-risk-critical text-risk-critical' 
              : 'border-transparent text-slate hover:text-risk-critical'
          }`}
        >
          <AlertCircle size={15} />
          <span>Exceptions Dashboard ({ineffectiveCount + overdueEvidenceCount})</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4.5 rounded-xl border border-steel/15 shadow-sm text-sm">
        
        {/* Search */}
        <div className="flex-1 max-w-sm relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-steel" />
          </div>
          <input
            type="text"
            placeholder="Search by ID, name or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background border border-steel/20 rounded-lg py-2.5 pl-9 pr-4 font-semibold focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </div>

        {/* Dynamic Select Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          
          <div className="flex items-center space-x-2">
            <span className="text-slate font-bold uppercase text-xs">COSO:</span>
            <select
              value={componentFilter}
              onChange={(e) => setComponentFilter(e.target.value)}
              className="bg-background border border-steel/20 rounded-lg py-2 px-3 text-navy font-semibold focus:outline-none"
            >
              <option value="All">All Components</option>
              <option value="Control Environment">Control Environment</option>
              <option value="Risk Assessment">Risk Assessment</option>
              <option value="Control Activities">Control Activities</option>
              <option value="Information & Communication">Information & Comm</option>
              <option value="Monitoring">Monitoring Activities</option>
            </select>
          </div>

          {activeTab === 'all' && (
            <div className="flex items-center space-x-2">
              <span className="text-slate font-bold uppercase text-xs">Status:</span>
              <select
                value={effectivenessFilter}
                onChange={(e) => setEffectivenessFilter(e.target.value)}
                className="bg-background border border-steel/20 rounded-lg py-2 px-3 text-navy font-semibold focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Effective">Effective</option>
                <option value="Partially Effective">Partially Effective</option>
                <option value="Ineffective">Ineffective</option>
              </select>
            </div>
          )}

        </div>

      </div>

      {/* Controls List Layout */}
      <div className="bg-white rounded-xl border border-steel/20 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-navy text-white uppercase tracking-wider text-xs font-bold border-b border-steel/20">
                <th className="py-4.5 px-6">Control ID</th>
                <th className="py-4.5 px-6">Control Name / COSO Element</th>
                <th className="py-4.5 px-6">Owner</th>
                <th className="py-4.5 px-6">Frequency</th>
                <th className="py-4.5 px-6 text-center">Audits Run</th>
                <th className="py-4.5 px-6">Evidence Status</th>
                <th className="py-4.5 px-6">Effectiveness</th>
                <th className="py-4.5 px-6 text-center">Governance Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background font-semibold text-navy">
              {filteredControls.length > 0 ? (
                filteredControls.map((control) => (
                  <tr key={control.id} className="hover:bg-background/40 transition-colors">
                    
                    {/* Control ID */}
                    <td className="py-5 px-6 font-mono font-bold text-steel">
                      {control.id}
                    </td>

                    {/* Name & COSO */}
                    <td className="py-5 px-6 max-w-xs">
                      <div className="font-bold text-navy leading-normal">{control.name}</div>
                      <span className="text-xs text-slate uppercase block mt-1.5 font-bold">{control.cosoComponent}</span>
                    </td>

                    {/* Owner */}
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-2">
                        <span className="h-7 w-7 bg-steel/10 rounded-full flex items-center justify-center text-xs font-bold text-navy">
                          {control.owner.charAt(0)}
                        </span>
                        <span>{control.owner}</span>
                      </div>
                    </td>

                    {/* Frequency */}
                    <td className="py-5 px-6">
                      <div className="text-navy">{control.frequency}</div>
                      <span className="text-xs text-slate font-semibold block mt-0.5">{control.type}</span>
                    </td>

                    {/* Audits Run */}
                    <td className="py-5 px-6 text-center font-mono font-bold">
                      {control.testedCount}
                    </td>

                    {/* Evidence Status */}
                    <td className="py-5 px-6 text-xs">
                      <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full font-bold uppercase border ${
                        control.evidenceStatus === 'Submitted'
                          ? 'bg-risk-low/5 text-risk-low border-risk-low/20'
                          : control.evidenceStatus === 'Pending'
                          ? 'bg-risk-mod/5 text-risk-mod border-risk-mod/20'
                          : 'bg-risk-crit/5 text-risk-critical border-risk-crit/20 animate-pulse'
                      }`}>
                        {control.evidenceStatus}
                      </span>
                      {control.evidenceStatus !== 'Submitted' && (
                        <span className="text-[10px] text-slate block mt-1.5">Due: {control.dueDate}</span>
                      )}
                    </td>

                    {/* Effectiveness */}
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-1.5">
                        {control.effectiveness === 'Effective' ? (
                          <CheckCircle className="h-5 w-5 text-risk-low" />
                        ) : control.effectiveness === 'Ineffective' ? (
                          <XCircle className="h-5 w-5 text-risk-critical" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-risk-mod" />
                        )}
                        <span className={`font-bold ${
                          control.effectiveness === 'Effective'
                            ? 'text-risk-low'
                            : control.effectiveness === 'Ineffective'
                            ? 'text-risk-critical'
                            : 'text-risk-mod'
                        }`}>{control.effectiveness}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-5 px-6 text-center space-x-2 whitespace-nowrap">
                      {control.evidenceStatus === 'Overdue' && (
                        <button
                          onClick={() => handleRequestEvidence(control.id)}
                          className="bg-navy hover:bg-navy/90 text-gold text-xs font-bold px-3 py-1.5 rounded border border-gold/30 flex items-center space-x-1 inline-flex cursor-pointer transition-all hover:scale-105"
                        >
                          <Send size={11} />
                          <span>Request Evidence</span>
                        </button>
                      )}

                      {control.effectiveness !== 'Effective' ? (
                        <button
                          onClick={() => handleTestControl(control.id, true)}
                          className="bg-risk-low/10 hover:bg-risk-low/20 text-risk-low text-xs font-bold px-3 py-1.5 rounded border border-risk-low/30 inline-flex cursor-pointer transition-all hover:scale-105"
                        >
                          Verify Effective
                        </button>
                      ) : (
                        <button
                          onClick={() => handleTestControl(control.id, false)}
                          className="bg-risk-crit/5 hover:bg-risk-crit/15 text-risk-critical text-xs font-bold px-3 py-1.5 rounded border border-risk-crit/20 inline-flex cursor-pointer transition-all hover:scale-105"
                        >
                          Fail Control
                        </button>
                      )}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-steel font-medium">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FolderOpen className="h-10 w-10 text-steel/40" />
                      <span>No control records found matching current criteria.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
