'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  AlertOctagon, 
  CheckCircle, 
  Clock, 
  User, 
  Search, 
  HelpCircle,
  TrendingUp,
  Percent,
  Compass
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
import { DatabaseState, AuditFinding } from '../lib/mockDb';
import confetti from 'canvas-confetti';

interface AuditIntelligenceProps {
  db: DatabaseState;
  onUpdateFinding: (findingId: string, updates: Partial<AuditFinding>) => void;
}

export default function AuditIntelligence({ db, onUpdateFinding }: AuditIntelligenceProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // 1. Dynamic Calculations
  const totalFindings = db.auditFindings.length;
  const openCount = db.auditFindings.filter(f => f.status !== 'Closed').length;
  const criticalCount = db.auditFindings.filter(f => f.status !== 'Closed' && f.severity === 'Critical').length;
  const inProgressCount = db.auditFindings.filter(f => f.status === 'In Progress').length;
  
  // Plan Completion Rate
  const auditPlanCompletionPct = 78;

  // Aging Analysis
  const aging30DaysCount = db.auditFindings.filter(f => f.status === 'Open' && f.id === 'AUD-501').length;
  const dueWithin30DaysCount = db.auditFindings.filter(f => f.status !== 'Closed' && f.id !== 'AUD-501').length;

  const handleResolveFinding = (findingId: string) => {
    onUpdateFinding(findingId, { status: 'Closed' });
    
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#C9A227', '#0A2540']
    });
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#C9A227', '#0A2540']
    });
  };

  const handleStartMitigation = (findingId: string) => {
    onUpdateFinding(findingId, { status: 'In Progress' });
  };

  // 2. Filters
  const filteredFindings = db.auditFindings.filter(f => {
    const matchesSearch = f.auditArea.toLowerCase().includes(searchTerm.toLowerCase()) || f.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'All' || f.severity === severityFilter;
    const matchesStatus = statusFilter === 'All' || f.status === statusFilter;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  // Calculate Findings Count by Severity for Recharts
  const severities = ['Critical', 'High', 'Medium', 'Low'];
  const severityChartData = severities.map(sev => {
    const count = db.auditFindings.filter(f => f.severity === sev && f.status !== 'Closed').length;
    return { name: sev, count };
  });

  // Assurance Matrix Setup
  const matrixCategories = ['Cyber', 'Compliance', 'Financial', 'Operational', 'Strategic'];
  const matrixBUs = ['Operations', 'Investment Banking', 'Wealth Management', 'Retail Banking'];
  
  const getAssuranceStatus = (category: string, bu: string) => {
    if (category === 'Cyber' && bu === 'Operations') return { label: 'Assure Gaps', style: 'bg-risk-crit/10 text-risk-critical border-risk-crit/30 font-bold' };
    if (category === 'Compliance' && bu === 'Wealth Management') return { label: 'Assure Gaps', style: 'bg-risk-crit/10 text-risk-critical border-risk-crit/30 font-bold' };
    if (category === 'Financial') return { label: 'Assured', style: 'bg-risk-low/10 text-risk-low border-risk-low/30 font-bold' };
    if (category === 'Operational' && bu === 'Investment Banking') return { label: 'Planned', style: 'bg-steel/10 text-steel border-steel/30 font-bold' };
    return { label: 'Assured', style: 'bg-risk-low/10 text-risk-low border-risk-low/30 font-bold' };
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-steel/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-navy tracking-tight">Internal Audit Intelligence</h2>
          <p className="text-sm text-steel font-medium mt-1">Audit universe tracking, dynamic audit progress dashboards, finding registers, and assurance mapping.</p>
        </div>
      </div>

      {/* Audit Progress Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Audit Completion Rate */}
        <div className="premium-card p-6 rounded-xl flex flex-col justify-between">
          <div>
            <p className="text-xs text-slate font-bold uppercase tracking-wider">Audit Plan Completion</p>
            <h3 className="text-3xl font-bold text-navy mt-2.5">{auditPlanCompletionPct}%</h3>
          </div>
          <div className="mt-4">
            <div className="w-full bg-background rounded-full h-2 overflow-hidden">
              <div className="bg-navy h-full rounded-full" style={{ width: `${auditPlanCompletionPct}%` }} />
            </div>
            <p className="text-xs text-slate font-semibold mt-2.5">18 of 23 Audits Finished</p>
          </div>
        </div>

        {/* Total Open Findings */}
        <div className="premium-card p-6 rounded-xl flex flex-col justify-between">
          <div>
            <p className="text-xs text-slate font-bold uppercase tracking-wider">Open Audit Findings</p>
            <h3 className="text-3xl font-bold text-navy mt-2.5">{openCount} <span className="text-xs text-slate font-normal font-semibold">Active</span></h3>
          </div>
          <div className="mt-4 flex items-center space-x-2 text-xs font-bold">
            <span className="text-risk-critical">{criticalCount} Critical</span>
            <span className="text-steel">•</span>
            <span className="text-risk-high">{inProgressCount} In Progress</span>
          </div>
        </div>

        {/* Overdue Findings (>30 days) */}
        <div className="premium-card p-6 rounded-xl border-l-4 border-l-risk-critical flex flex-col justify-between">
          <div>
            <p className="text-xs text-risk-critical font-bold uppercase tracking-wider">Overdue Findings (&gt;30d)</p>
            <h3 className="text-3xl font-bold text-navy mt-2.5">{aging30DaysCount} <span className="text-xs text-slate font-normal font-semibold">Items</span></h3>
          </div>
          <div className="mt-4 flex items-center text-xs font-semibold text-slate">
            <Clock size={13} className="mr-1 text-risk-critical animate-pulse" /> Requires Board Escalation
          </div>
        </div>

        {/* Due Within 30 Days */}
        <div className="premium-card p-6 rounded-xl border-l-4 border-l-risk-high flex flex-col justify-between">
          <div>
            <p className="text-xs text-risk-high font-bold uppercase tracking-wider">Due Within 30 Days</p>
            <h3 className="text-3xl font-bold text-navy mt-2.5">{dueWithin30DaysCount} <span className="text-xs text-slate font-normal font-semibold">Pending</span></h3>
          </div>
          <div className="mt-4 flex items-center text-xs font-semibold text-slate">
            <Clock size={13} className="mr-1 text-risk-high" /> Actions monitored
          </div>
        </div>

      </div>

      {/* Charts Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Severity Count Chart */}
        <div className="lg:col-span-2 premium-card p-6 rounded-xl">
          <div className="border-b border-steel/10 pb-3 mb-5">
            <h3 className="font-bold text-base tracking-wide uppercase text-navy">Open Audit Findings by Severity Tier</h3>
          </div>
          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(72,101,129,0.08)" />
                <XAxis dataKey="name" stroke="#52606D" fontSize={11} fontWeight={600} tickLine={false} />
                <YAxis stroke="#52606D" fontSize={11} fontWeight={600} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ background: '#FFFFFF', border: '1px solid rgba(72,101,129,0.15)', borderRadius: '6px', fontSize: 11 }}
                  labelClassName="font-bold text-navy"
                />
                <Bar dataKey="count" fill="#486581" radius={[4, 4, 0, 0]} name="Open Findings">
                  {severityChartData.map((entry, index) => {
                    const color = entry.name === 'Critical' ? '#C62828' : entry.name === 'High' ? '#EF6C00' : entry.name === 'Medium' ? '#F9A825' : '#2E7D32';
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Audit universe metadata box */}
        <div className="premium-card p-6 rounded-xl flex flex-col justify-between">
          <div className="border-b border-steel/10 pb-3">
            <h3 className="font-bold text-base tracking-wide uppercase text-navy">Internal Audit Mandate</h3>
          </div>
          <div className="space-y-4 text-xs font-semibold text-navy mt-4 leading-relaxed">
            <p>
              The Audit Committee evaluates system integrity metrics against independent internal testing targets.
            </p>
            <p>
              Findings are logged into the registry and action owners must resolve identified root causes within specified compliance windows.
            </p>
            <div className="p-3.5 bg-background border border-steel/10 rounded-lg">
              <span className="text-gold font-bold block text-sm">💡 Actions Simulation:</span>
              <p className="mt-1 font-medium leading-normal text-slate">
                Use the <span className="underline">Close Finding</span> action in the registry below to mark finding remediation, triggering score recalculations on the home dashboard.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Main Grid: Findings Register & Assurance Matrix */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Side: Findings Register */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white p-4.5 rounded-xl border border-steel/15 shadow-sm flex flex-col sm:flex-row gap-4 justify-between text-sm font-semibold">
            <div className="relative flex-1 max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-steel" />
              </div>
              <input
                type="text"
                placeholder="Search findings, areas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background border border-steel/20 rounded-lg py-2 pl-9 pr-4 font-semibold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-background border border-steel/20 rounded-lg py-2 px-3 text-navy font-semibold focus:outline-none"
              >
                <option value="All">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-background border border-steel/20 rounded-lg py-2 px-3 text-navy font-semibold focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-steel/20 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-navy text-white uppercase tracking-wider text-xs font-bold border-b border-steel/20">
                    <th className="py-4.5 px-5">Finding ID</th>
                    <th className="py-4.5 px-5">Audit Scope Area / Root Cause</th>
                    <th className="py-4.5 px-5">Severity</th>
                    <th className="py-4.5 px-5">Timeline</th>
                    <th className="py-4.5 px-5">Status</th>
                    <th className="py-4.5 px-5 text-center">Corrective Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-background font-semibold text-navy">
                  {filteredFindings.length > 0 ? (
                    filteredFindings.map((finding) => (
                      <tr key={finding.id} className="hover:bg-background/40 transition-colors">
                        
                        {/* ID */}
                        <td className="py-5 px-5 font-mono font-bold text-steel">
                          {finding.id}
                        </td>

                        {/* Scope Area & Root Cause */}
                        <td className="py-5 px-5 max-w-xs">
                          <div className="font-bold text-navy">{finding.auditArea}</div>
                          <p className="text-xs text-slate font-semibold mt-1.5 leading-relaxed">{finding.rootCause}</p>
                          <span className="text-xs text-steel font-bold mt-2 block uppercase">Owner: {finding.actionOwner}</span>
                        </td>

                        {/* Severity */}
                        <td className="py-5 px-5">
                          <span className={`inline-flex px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                            finding.severity === 'Critical'
                              ? 'bg-risk-crit/5 text-risk-critical border-risk-crit/20'
                              : finding.severity === 'High'
                              ? 'bg-risk-high/5 text-risk-high border-risk-high/20'
                              : 'bg-risk-mod/5 text-risk-mod border-risk-mod/20'
                          }`}>
                            {finding.severity}
                          </span>
                        </td>

                        {/* Timeline */}
                        <td className="py-5 px-5 font-mono text-xs text-slate font-bold">
                          Due: {finding.dueDate}
                        </td>

                        {/* Status */}
                        <td className="py-5 px-5">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                            finding.status === 'Closed'
                              ? 'bg-risk-low/5 text-risk-low border-risk-low/20'
                              : finding.status === 'Open'
                              ? 'bg-risk-crit/5 text-risk-critical border-risk-crit/20 animate-pulse'
                              : 'bg-risk-mod/5 text-risk-mod border-risk-mod/20'
                          }`}>
                            {finding.status}
                          </span>
                        </td>

                        {/* Interaction Button */}
                        <td className="py-5 px-5 text-center whitespace-nowrap space-x-2">
                          {finding.status === 'Open' && (
                            <button
                              onClick={() => handleStartMitigation(finding.id)}
                              className="bg-background text-navy text-xs font-bold px-3 py-1.5 rounded border border-steel/20 cursor-pointer hover:bg-background/80"
                            >
                              Mitigate
                            </button>
                          )}
                          {finding.status !== 'Closed' && (
                            <button
                              onClick={() => handleResolveFinding(finding.id)}
                              className="bg-navy text-gold text-xs font-bold px-3 py-1.5 rounded border border-gold/30 cursor-pointer transition-all hover:scale-105"
                            >
                              Close finding
                            </button>
                          )}
                          {finding.status === 'Closed' && (
                            <span className="text-xs text-risk-low font-bold flex items-center justify-center">
                              ✓ Resolved
                            </span>
                          )}
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-steel font-medium">
                        No audit findings match your selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Risk Coverage Matrix */}
        <div className="premium-card p-6 rounded-xl flex flex-col justify-between h-full">
          <div>
            <div className="border-b border-steel/10 pb-3 mb-5 flex justify-between items-center">
              <h3 className="font-bold text-base tracking-wide uppercase text-navy flex items-center">
                <Compass className="h-5 w-5 text-navy mr-2" />
                Assurance Mapping Matrix
              </h3>
              <span className="text-xs text-slate font-bold uppercase">Audit Coverage</span>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto text-[10px] font-bold text-navy">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-steel/10 bg-background text-slate text-left">
                    <th className="py-2.5 px-2">ERM Risk Category</th>
                    {matrixBUs.map(bu => (
                      <th key={bu} className="py-2.5 px-2 font-bold uppercase truncate max-w-[65px]">{bu.split(' ')[0]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-background">
                  {matrixCategories.map(cat => (
                    <tr key={cat} className="hover:bg-background/20">
                      <td className="py-3 px-2 font-bold text-navy">{cat}</td>
                      {matrixBUs.map(bu => {
                        const cell = getAssuranceStatus(cat, bu);
                        return (
                          <td key={bu} className="py-3 px-2">
                            <span className={`px-2 py-1 rounded border text-[9px] font-extrabold uppercase ${cell.style}`}>
                              {cell.label}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 border-t border-steel/10 pt-4 text-center">
            <span className="text-xs text-slate font-semibold block">
              💡 Assurance Mapping correlates audit universes directly to active risk exposure limits.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
