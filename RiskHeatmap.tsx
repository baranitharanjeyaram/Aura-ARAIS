'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Plus, 
  Filter, 
  RefreshCw, 
  AlertTriangle,
  User, 
  ChevronRight,
  ShieldAlert,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { DatabaseState, Risk } from '../lib/mockDb';

interface RiskHeatmapProps {
  db: DatabaseState;
  onAddRisk: (risk: Omit<Risk, 'id' | 'inherentScore' | 'residualScore'>) => void;
}

// Historical KRI Data for Recharts
const KRI_TREND_DATA = [
  { name: 'Q3 2025', Cyber: 54, Financial: 42, Operational: 45, Compliance: 60, ThirdParty: 30 },
  { name: 'Q4 2025', Cyber: 68, Financial: 40, Operational: 50, Compliance: 72, ThirdParty: 35 },
  { name: 'Q1 2026', Cyber: 75, Financial: 45, Operational: 48, Compliance: 65, ThirdParty: 42 },
  { name: 'Q2 2026 (Current)', Cyber: 82, Financial: 48, Operational: 52, Compliance: 58, ThirdParty: 40 },
  { name: 'Q3 2026 (Forecast)', Cyber: 88, Financial: 50, Operational: 55, Compliance: 54, ThirdParty: 38 }
];

export default function RiskHeatmap({ db, onAddRisk }: RiskHeatmapProps) {
  // Filter States
  const [selectedBU, setSelectedBU] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCell, setSelectedCell] = useState<{ l: number; i: number } | null>(null);
  
  // New Risk Log Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRiskName, setNewRiskName] = useState('');
  const [newRiskCategory, setNewRiskCategory] = useState<Risk['category']>('Cyber');
  const [newRiskBU, setNewRiskBU] = useState<Risk['businessUnit']>('Operations');
  const [newRiskLikelihood, setNewRiskLikelihood] = useState(3);
  const [newRiskImpact, setNewRiskImpact] = useState(3);
  const [newRiskOwner, setNewRiskOwner] = useState('');
  const [newRiskDesc, setNewRiskDesc] = useState('');

  // 1. Filter Logic
  const filteredRisks = db.risks.filter(risk => {
    const matchBU = selectedBU === 'All' || risk.businessUnit === selectedBU;
    const matchCat = selectedCategory === 'All' || risk.category === selectedCategory;
    const matchCell = selectedCell === null || (risk.likelihood === selectedCell.l && risk.impact === selectedCell.i);
    return matchBU && matchCat && matchCell;
  });

  // Calculate cell risk count
  const getCellRiskCount = (l: number, i: number) => {
    return db.risks.filter(risk => {
      const matchBU = selectedBU === 'All' || risk.businessUnit === selectedBU;
      const matchCat = selectedCategory === 'All' || risk.category === selectedCategory;
      return risk.likelihood === l && risk.impact === i && matchBU && matchCat;
    }).length;
  };

  // High-Vibrancy cell styling for active cells
  const getCellColor = (l: number, i: number) => {
    const score = l * i;
    const hasRisks = getCellRiskCount(l, i) > 0;
    const isSelected = selectedCell && selectedCell.l === l && selectedCell.i === i;
    
    if (!hasRisks) {
      // Dimmer grid background for empty cells to provide high contrast with risk cells
      return `bg-white/40 border-dashed border-steel/20 text-slate/20 hover:bg-background/80 ${
        isSelected ? 'ring-2 ring-gold border-gold scale-95 shadow-inner' : ''
      }`;
    }

    // Bold solid vibrant colors for cells containing risks
    let baseColor = '';
    if (score >= 15) {
      baseColor = 'bg-risk-critical text-white border-risk-critical shadow-lg shadow-risk-crit/30 hover:scale-105 animate-pulse';
    } else if (score >= 10) {
      baseColor = 'bg-risk-high text-white border-risk-high shadow-lg shadow-risk-high/20 hover:scale-105';
    } else if (score >= 5) {
      baseColor = 'bg-risk-mod text-navy font-bold border-risk-mod shadow-md shadow-risk-mod/10 hover:scale-102';
    } else {
      baseColor = 'bg-risk-low text-white border-risk-low shadow-md hover:scale-102';
    }

    return `${baseColor} ${isSelected ? 'ring-3 ring-gold border-white scale-98 shadow-2xl' : ''} cursor-pointer`;
  };

  const handleCellClick = (l: number, i: number) => {
    if (getCellRiskCount(l, i) === 0) return;
    if (selectedCell && selectedCell.l === l && selectedCell.i === i) {
      setSelectedCell(null);
    } else {
      setSelectedCell({ l, i });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRiskName.trim() || !newRiskOwner.trim()) return;

    onAddRisk({
      name: newRiskName,
      category: newRiskCategory,
      businessUnit: newRiskBU,
      likelihood: newRiskLikelihood,
      impact: newRiskImpact,
      owner: newRiskOwner,
      status: 'Active',
      reviewDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: newRiskDesc
    });

    setNewRiskName('');
    setNewRiskOwner('');
    setNewRiskDesc('');
    setShowAddForm(false);
  };

  const kris = [
    { name: 'Cybersecurity Threat Level', val: 82, trend: 'up', status: 'Breached', desc: 'MFA gaps, pending infrastructure patch checks.' },
    { name: 'Financial Liquidity Risk', val: 48, trend: 'flat', status: 'Within Appetite', desc: 'Maturity gaps currently balanced via short swaps.' },
    { name: 'Third Party Vendor Exposure', val: 52, trend: 'up', status: 'Approaching Threshold', desc: 'Concentration risk in data servers.' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-steel/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-navy tracking-tight">Enterprise Risk Intelligence</h2>
          <p className="text-sm text-steel font-medium mt-1">Enterprise ERM register assessment, interactive heatmap modeling, and key indicator tracking.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="mt-4 md:mt-0 flex items-center space-x-1.5 bg-navy hover:bg-navy/90 text-gold text-xs font-semibold px-4.5 py-2.5 rounded-lg border border-gold/30 shadow-md cursor-pointer transition-all hover:-translate-y-0.5"
        >
          <Plus size={15} />
          <span>Log New Risk</span>
        </button>
      </div>

      {/* Log New Risk Modal Panel */}
      {showAddForm && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-steel/20 w-full max-w-lg overflow-hidden animate-fade-in">
            <div className="bg-navy px-6 py-4 flex items-center justify-between border-b border-gold/20">
              <span className="text-sm font-bold text-gold uppercase tracking-wider flex items-center">
                <ShieldAlert className="h-5 w-5 mr-2" />
                Log Emerging Risk
              </span>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-white hover:text-gold text-xs font-bold"
              >
                Close
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="block text-slate font-bold uppercase text-[10px]">Risk Name</label>
                <input 
                  type="text" 
                  required
                  value={newRiskName}
                  onChange={(e) => setNewRiskName(e.target.value)}
                  placeholder="e.g., Privileged User Access Governance Gaps"
                  className="w-full bg-background border border-steel/20 rounded-lg p-2.5 text-navy font-semibold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-slate font-bold uppercase text-[10px]">Category</label>
                  <select 
                    value={newRiskCategory} 
                    onChange={(e) => setNewRiskCategory(e.target.value as Risk['category'])}
                    className="w-full bg-background border border-steel/20 rounded-lg p-2.5 text-navy font-semibold focus:outline-none"
                  >
                    <option value="Cyber">Cyber</option>
                    <option value="Compliance">Compliance</option>
                    <option value="Financial">Financial</option>
                    <option value="Operational">Operational</option>
                    <option value="Strategic">Strategic</option>
                    <option value="Reputational">Reputational</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-slate font-bold uppercase text-[10px]">Business Unit</label>
                  <select 
                    value={newRiskBU} 
                    onChange={(e) => setNewRiskBU(e.target.value as Risk['businessUnit'])}
                    className="w-full bg-background border border-steel/20 rounded-lg p-2.5 text-navy font-semibold focus:outline-none"
                  >
                    <option value="Operations">Operations</option>
                    <option value="Investment Banking">Investment Banking</option>
                    <option value="Wealth Management">Wealth Management</option>
                    <option value="Retail Banking">Retail Banking</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-slate font-bold uppercase text-[10px]">Likelihood (1 - 5)</label>
                  <input 
                    type="number" 
                    min={1} 
                    max={5} 
                    required
                    value={newRiskLikelihood} 
                    onChange={(e) => setNewRiskLikelihood(parseInt(e.target.value))}
                    className="w-full bg-background border border-steel/20 rounded-lg p-2.5 text-navy font-semibold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate font-bold uppercase text-[10px]">Impact (1 - 5)</label>
                  <input 
                    type="number" 
                    min={1} 
                    max={5} 
                    required
                    value={newRiskImpact} 
                    onChange={(e) => setNewRiskImpact(parseInt(e.target.value))}
                    className="w-full bg-background border border-steel/20 rounded-lg p-2.5 text-navy font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-slate font-bold uppercase text-[10px]">Assigned Risk Owner</label>
                <input 
                  type="text" 
                  required
                  value={newRiskOwner}
                  onChange={(e) => setNewRiskOwner(e.target.value)}
                  placeholder="e.g., Marcus Aurelius"
                  className="w-full bg-background border border-steel/20 rounded-lg p-2.5 text-navy font-semibold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate font-bold uppercase text-[10px]">Risk Narrative Description</label>
                <textarea 
                  value={newRiskDesc}
                  onChange={(e) => setNewRiskDesc(e.target.value)}
                  rows={3}
                  placeholder="Summarize the threat, vulnerability vector, and potential corporate impact..."
                  className="w-full bg-background border border-steel/20 rounded-lg p-2.5 text-navy font-semibold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="bg-background text-navy border border-steel/30 px-4 py-2 rounded-lg font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-navy text-gold px-4 py-2 rounded-lg font-bold border border-gold/30 shadow-md cursor-pointer"
                >
                  Record to Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Risk Heatmap & Filter Board */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Heatmap Grid Visual */}
        <div className="xl:col-span-2 premium-card p-6 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-steel/10 pb-3 mb-6">
              <h3 className="font-bold text-base tracking-wide uppercase text-navy">Interactive COSO ERM Heatmap</h3>
              <span className="text-xs text-slate font-bold uppercase">Click cells to filter</span>
            </div>

            {/* Heatmap Grid */}
            <div className="grid grid-cols-6 gap-3.5 w-full aspect-square md:aspect-video xl:aspect-square max-w-xl mx-auto border border-steel/20 p-5 rounded-xl bg-background shadow-inner">
              
              {/* Vertical Header - Impact */}
              <div className="col-span-1 flex flex-col justify-between items-center py-4 text-xs font-bold text-slate uppercase pr-2">
                <span className="h-0 w-0"></span>
                <span>5 - Critical</span>
                <span>4 - High</span>
                <span>3 - Moderate</span>
                <span>2 - Minor</span>
                <span>1 - Low</span>
                <span className="text-navy font-black text-center -rotate-90 origin-center translate-y-4">Impact</span>
              </div>

              {/* Grid Cells (5x5) */}
              <div className="col-span-5 grid grid-rows-5 gap-2 h-full">
                {[5, 4, 3, 2, 1].map((impactVal) => (
                  <div key={impactVal} className="grid grid-cols-5 gap-2 h-full">
                    {[1, 2, 3, 4, 5].map((likelihoodVal) => {
                      const count = getCellRiskCount(likelihoodVal, impactVal);
                      return (
                        <div
                          key={likelihoodVal}
                          onClick={() => handleCellClick(likelihoodVal, impactVal)}
                          className={`rounded border flex flex-col items-center justify-center transition-all ${getCellColor(likelihoodVal, impactVal)}`}
                        >
                          {count > 0 ? (
                            <span className="text-sm md:text-base font-extrabold">{count}</span>
                          ) : (
                            <span className="text-[10px] text-slate/40 font-mono">{likelihoodVal}x{impactVal}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Horizontal Footer - Likelihood */}
              <div className="col-span-1"></div>
              <div className="col-span-5 grid grid-cols-5 text-center text-xs font-bold text-slate uppercase pt-1">
                <span>1 - Remote</span>
                <span>2 - Unlikely</span>
                <span>3 - Possible</span>
                <span>4 - Likely</span>
                <span>5 - Freq</span>
              </div>
              <div className="col-span-1"></div>
              <div className="col-span-5 text-center text-xs font-black text-navy uppercase pt-1">
                Likelihood
              </div>

            </div>
          </div>

          {/* Legend and Resets */}
          <div className="mt-6 flex flex-wrap items-center justify-between border-t border-steel/10 pt-4 gap-4 text-sm font-semibold">
            <div className="flex space-x-4 items-center">
              <span className="text-slate uppercase text-xs font-bold">Severity Matrix:</span>
              <span className="flex items-center text-xs"><span className="h-3 w-3 rounded bg-risk-low border border-risk-low/40 mr-1.5"></span> Low</span>
              <span className="flex items-center text-xs"><span className="h-3 w-3 rounded bg-risk-mod border border-risk-mod/40 mr-1.5 text-navy"></span> Mod</span>
              <span className="flex items-center text-xs"><span className="h-3 w-3 rounded bg-risk-high border border-risk-high/40 mr-1.5"></span> High</span>
              <span className="flex items-center text-xs"><span className="h-3 w-3 rounded bg-risk-critical border border-risk-crit/40 mr-1.5"></span> Critical</span>
            </div>
            {selectedCell && (
              <button 
                onClick={() => setSelectedCell(null)}
                className="bg-navy text-gold text-xs font-bold px-3 py-2 rounded flex items-center space-x-1.5 cursor-pointer shadow-md"
              >
                <RefreshCw size={13} />
                <span>Reset Cell Filter ({selectedCell.l}x{selectedCell.i})</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters and Risk List */}
        <div className="premium-card p-6 rounded-xl flex flex-col justify-between">
          <div className="space-y-6">
            <div className="border-b border-steel/10 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-base tracking-wide uppercase text-navy flex items-center">
                <Filter className="h-5 w-5 text-steel mr-2" />
                Register Controls
              </h3>
            </div>

            {/* Business Unit Selector */}
            <div className="space-y-1.5 text-sm">
              <label className="block text-slate font-bold uppercase text-xs">Business Unit Filter</label>
              <select 
                value={selectedBU} 
                onChange={(e) => { setSelectedBU(e.target.value); setSelectedCell(null); }}
                className="w-full bg-background border border-steel/20 rounded-lg p-2.5 text-navy font-semibold focus:outline-none"
              >
                <option value="All">All Business Units</option>
                <option value="Operations">Operations</option>
                <option value="Investment Banking">Investment Banking</option>
                <option value="Wealth Management">Wealth Management</option>
                <option value="Retail Banking">Retail Banking</option>
              </select>
            </div>

            {/* Category Selector */}
            <div className="space-y-1.5 text-sm">
              <label className="block text-slate font-bold uppercase text-xs">Risk Category Filter</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => { setSelectedCategory(e.target.value); setSelectedCell(null); }}
                className="w-full bg-background border border-steel/20 rounded-lg p-2.5 text-navy font-semibold focus:outline-none"
              >
                <option value="All">All Risk Categories</option>
                <option value="Cyber">Cyber</option>
                <option value="Compliance">Compliance</option>
                <option value="Financial">Financial</option>
                <option value="Operational">Operational</option>
                <option value="Strategic">Strategic</option>
                <option value="Reputational">Reputational</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex-1 max-h-60 overflow-y-auto space-y-3">
            <span className="text-xs text-slate font-bold uppercase block border-b border-background pb-1.5">Filtered Risks ({filteredRisks.length})</span>
            {filteredRisks.length > 0 ? (
              filteredRisks.map(risk => (
                <div key={risk.id} className="p-4 bg-background border border-steel/15 rounded-lg text-xs font-semibold space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-mono font-bold text-slate">{risk.id}</span>
                    <span className={`font-black ${
                      risk.residualScore >= 12 
                        ? 'text-risk-critical' 
                        : risk.residualScore >= 8 
                        ? 'text-risk-high' 
                        : 'text-risk-mod'
                    }`}>
                      Residual: {risk.residualScore}
                    </span>
                  </div>
                  <h4 className="font-bold text-navy truncate text-sm">{risk.name}</h4>
                  <p className="text-xs text-slate font-medium line-clamp-1">{risk.description}</p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-sm text-steel font-medium">
                No risks matched the active filter parameters.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Section 2: Key Risk Indicators (KRIs) Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Line Chart of Risk Trends */}
        <div className="lg:col-span-2 premium-card p-6 rounded-xl">
          <div className="border-b border-steel/10 pb-3 mb-6 flex justify-between items-center">
            <h3 className="font-bold text-base tracking-wide uppercase text-navy">Key Risk Indicators (KRI) Historical Index</h3>
            <span className="text-xs text-slate font-bold uppercase">Trending & 3-Month Forecast</span>
          </div>

          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={KRI_TREND_DATA} 
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(72,101,129,0.08)" />
                <XAxis dataKey="name" stroke="#52606D" fontSize={11} fontWeight={600} tickLine={false} />
                <YAxis stroke="#52606D" fontSize={11} fontWeight={600} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#FFFFFF', border: '1px solid rgba(72,101,129,0.15)', borderRadius: '6px', fontSize: 11 }}
                  labelClassName="font-bold text-navy"
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Line type="monotone" dataKey="Cyber" stroke="#C62828" strokeWidth={2.5} name="Cyber Threat" activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Compliance" stroke="#EF6C00" strokeWidth={2.5} name="Compliance Burden" />
                <Line type="monotone" dataKey="Operational" stroke="#486581" strokeWidth={2} name="Operational Vulnerability" />
                <Line type="monotone" dataKey="Financial" stroke="#C9A227" strokeWidth={2} name="Financial Volatility" strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KRI Appetite Status List */}
        <div className="premium-card p-6 rounded-xl flex flex-col justify-between">
          <div className="border-b border-steel/10 pb-3 flex justify-between items-center">
            <h3 className="font-bold text-base tracking-wide uppercase text-navy">KRI Appetite Status</h3>
            <span className="text-xs text-slate font-bold uppercase">Live Thresholds</span>
          </div>

          <div className="mt-4 flex-1 space-y-4">
            {kris.map((kri, idx) => (
              <div key={idx} className="p-4 bg-background border border-steel/15 rounded-lg space-y-3 font-semibold">
                <div className="flex justify-between items-start text-xs">
                  <div>
                    <h4 className="font-bold text-navy text-sm">{kri.name}</h4>
                    <p className="text-xs text-slate font-medium leading-normal mt-1">{kri.desc}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase flex-shrink-0 ${
                    kri.status === 'Breached' 
                      ? 'bg-risk-crit/10 text-risk-critical border-risk-crit/30 animate-pulse' 
                      : kri.status === 'Approaching Threshold' 
                      ? 'bg-risk-high/10 text-risk-high border-risk-high/30' 
                      : 'bg-risk-low/10 text-risk-low border-risk-low/30'
                  }`}>
                    {kri.status}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <div className="flex-1 bg-white border border-steel/10 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        kri.val > 80 ? 'bg-risk-critical' : kri.val > 50 ? 'bg-risk-high' : 'bg-risk-low'
                      }`}
                      style={{ width: `${kri.val}%` }}
                    />
                  </div>
                  <span className="font-bold font-mono text-xs text-navy">{kri.val}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 border-t border-steel/10 pt-4 text-center">
            <span className="text-xs text-slate font-semibold block">
              💡 Active appetite triggers send automatic alerts to control owners.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
