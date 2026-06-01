'use client';

import React from 'react';
import { 
  ShieldAlert, 
  CheckSquare, 
  Activity, 
  FileText, 
  TrendingUp, 
  AlertOctagon, 
  Sparkles,
  ArrowUpRight,
  TrendingDown
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
import { DatabaseState } from '../lib/mockDb';

interface OverviewProps {
  db: DatabaseState;
  onNavigate: (view: string) => void;
}

export default function Overview({ db, onNavigate }: OverviewProps) {
  // 1. Dynamic Metric Calculations
  const totalRisks = db.risks.length;
  const highRisks = db.risks.filter(r => r.residualScore >= 10).length;
  const openFindings = db.auditFindings.filter(f => f.status !== 'Closed').length;
  
  // Compliance Score = (Compliant Obligations / Total Obligations) * 100
  const totalObligations = db.compliance.length;
  const compliantObligations = db.compliance.filter(o => o.status === 'Compliant').length;
  const complianceScore = totalObligations > 0 ? Math.round((compliantObligations / totalObligations) * 100) : 100;

  // Controls Effective = (Effective Controls / Total Controls) * 15
  const totalControls = db.controls.length;
  const effectiveControls = db.controls.filter(c => c.effectiveness === 'Effective');
  const effectiveCount = effectiveControls.length;
  const controlsEffectivePct = totalControls > 0 ? Math.round((effectiveCount / totalControls) * 100) : 100;

  const auditCoveragePct = 85; 

  // Risk Appetite Utilization = (Average Residual Score / Max Residual Score 20) * 100
  const avgResidual = db.risks.reduce((sum, r) => sum + r.residualScore, 0) / (totalRisks || 1);
  const appetitePct = Math.round((avgResidual / 20) * 100);

  // AI Risk Score = Index representing total exposure (Critical Risks, Overdue evidence, Open Audit items)
  const aiRiskScore = Math.min(100, Math.round((highRisks * 12) + (openFindings * 8) + (100 - complianceScore) * 0.4 + (100 - controlsEffectivePct) * 0.4));

  // Get Top 3 Highest Residual Risks
  const topRisks = [...db.risks]
    .sort((a, b) => b.residualScore - a.residualScore)
    .slice(0, 3);

  // Get Critical Actions
  const criticalActions = [
    ...db.controls.filter(c => c.evidenceStatus === 'Overdue').map(c => ({
      id: c.id,
      module: 'Controls',
      desc: `Evidence overdue for control ${c.id}: ${c.name} (${c.owner})`,
      severity: 'High'
    })),
    ...db.compliance.filter(c => c.status === 'Non-Compliant').map(c => ({
      id: c.id,
      module: 'Compliance',
      desc: `Regulation ${c.regulation} is Non-Compliant: ${c.requirement}`,
      severity: 'Critical'
    })),
    ...db.auditFindings.filter(f => f.status === 'Open' && f.severity === 'Critical').map(f => ({
      id: f.id,
      module: 'Audit',
      desc: `Open Critical Finding ${f.id} in ${f.auditArea} under action owner ${f.actionOwner}`,
      severity: 'Critical'
    }))
  ].slice(0, 3);

  // Calculate Exposure (Avg Residual Score) by BU for Recharts
  const buExposureData = ['Operations', 'Investment Banking', 'Wealth Management', 'Retail Banking'].map(bu => {
    const buRisks = db.risks.filter(r => r.businessUnit === bu);
    const avgScore = buRisks.length > 0 
      ? parseFloat((buRisks.reduce((sum, r) => sum + r.residualScore, 0) / buRisks.length).toFixed(1))
      : 0;
    return { name: bu.split(' ')[0], score: avgScore };
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-steel/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-navy tracking-tight">Executive Command Center</h2>
          <p className="text-sm text-steel font-medium mt-1">Autonomous intelligence overview of enterprise threat posture and governance controls.</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <div className="bg-navy/5 border border-navy/20 px-4 py-2 rounded-lg flex items-center space-x-2 text-xs font-semibold text-navy">
            <span className="h-2 w-2 rounded-full bg-risk-low animate-pulse"></span>
            <span>Real-Time Ingestion: Connected</span>
          </div>
        </div>
      </div>

      {/* Dynamic KPI Scorecards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Risks Card */}
        <div 
          onClick={() => onNavigate('risks')} 
          className="premium-card p-6 rounded-xl cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate font-bold uppercase tracking-wider">Enterprise Risks</p>
              <h3 className="text-3xl font-bold text-navy mt-2.5">{totalRisks}</h3>
            </div>
            <div className="p-2.5 bg-navy/5 group-hover:bg-navy/10 rounded-lg transition-colors border border-steel/15">
              <ShieldAlert className="h-5.5 w-5.5 text-navy" />
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1">
              <span className="text-risk-crit font-bold flex items-center">
                <TrendingUp size={14} className="mr-0.5" />
                {highRisks} Critical/High
              </span>
            </div>
            <span className="text-steel font-semibold group-hover:underline flex items-center">
              View Register <ArrowUpRight size={13} className="ml-0.5" />
            </span>
          </div>
        </div>

        {/* Controls Effective Card */}
        <div 
          onClick={() => onNavigate('controls')} 
          className="premium-card p-6 rounded-xl cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate font-bold uppercase tracking-wider">Controls Effective</p>
              <h3 className="text-3xl font-bold text-navy mt-2.5">{controlsEffectivePct}%</h3>
            </div>
            <div className="p-2.5 bg-navy/5 group-hover:bg-navy/10 rounded-lg transition-colors border border-steel/15">
              <Activity className="h-5.5 w-5.5 text-navy" />
            </div>
          </div>
          <div className="mt-5 text-xs">
            <div className="w-full bg-background rounded-full h-2 overflow-hidden">
              <div 
                className="bg-navy h-full rounded-full transition-all duration-500" 
                style={{ width: `${controlsEffectivePct}%` }}
              />
            </div>
            <p className="text-slate font-semibold mt-2.5">{effectiveCount} of {totalControls} controls effective</p>
          </div>
        </div>

        {/* Compliance Score Card */}
        <div 
          onClick={() => onNavigate('compliance')} 
          className="premium-card p-6 rounded-xl cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate font-bold uppercase tracking-wider">Compliance Index</p>
              <h3 className="text-3xl font-bold text-navy mt-2.5">{complianceScore}%</h3>
            </div>
            <div className="p-2.5 bg-navy/5 group-hover:bg-navy/10 rounded-lg transition-colors border border-steel/15">
              <CheckSquare className="h-5.5 w-5.5 text-navy" />
            </div>
          </div>
          <div className="mt-5 text-xs">
            <div className="w-full bg-background rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gold h-full rounded-full transition-all duration-500" 
                style={{ width: `${complianceScore}%` }}
              />
            </div>
            <p className="text-slate font-semibold mt-2.5">{compliantObligations} of {totalObligations} policies compliant</p>
          </div>
        </div>

        {/* Audit Open Findings Card */}
        <div 
          onClick={() => onNavigate('audit')} 
          className="premium-card p-6 rounded-xl cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate font-bold uppercase tracking-wider">Audit Universe</p>
              <h3 className="text-3xl font-bold text-navy mt-2.5">{openFindings} <span className="text-sm text-slate font-normal">Findings Open</span></h3>
            </div>
            <div className="p-2.5 bg-navy/5 group-hover:bg-navy/10 rounded-lg transition-colors border border-steel/15">
              <FileText className="h-5.5 w-5.5 text-navy" />
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1">
              <span className="text-steel font-bold">
                Coverage: {auditCoveragePct}%
              </span>
            </div>
            <span className="text-steel font-semibold group-hover:underline flex items-center">
              Audit Board <ArrowUpRight size={13} className="ml-0.5" />
            </span>
          </div>
        </div>

        {/* Risk Appetite Utilization Card */}
        <div className="premium-card p-6 rounded-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate font-bold uppercase tracking-wider">Appetite Utilization</p>
              <h3 className="text-3xl font-bold text-navy mt-2.5">{appetitePct}%</h3>
            </div>
            <div className="p-2.5 bg-navy/5 rounded-lg border border-steel/15">
              <TrendingUp className="h-5.5 w-5.5 text-navy" />
            </div>
          </div>
          <div className="mt-5 text-xs">
            <div className="w-full bg-background rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  appetitePct > 80 ? 'bg-risk-critical' : appetitePct > 60 ? 'bg-risk-high' : 'bg-risk-low'
                }`}
                style={{ width: `${appetitePct}%` }}
              />
            </div>
            <p className="text-slate font-semibold mt-2.5">Threshold: 80% Soft Cap</p>
          </div>
        </div>

        {/* AI Threat Index Card (Premium Gold Accent) */}
        <div className="premium-card p-6 rounded-xl border-l-4 border-l-gold">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gold font-bold uppercase tracking-wider">AI Threat Index</p>
              <h3 className="text-3xl font-bold text-navy mt-2.5">{aiRiskScore}/100</h3>
            </div>
            <div className="p-2.5 bg-gold/10 rounded-lg border border-gold/45">
              <Sparkles className="h-5.5 w-5.5 text-gold animate-pulse" />
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between text-navy text-xs">
            <span className="font-bold uppercase px-2.5 py-1 bg-navy/5 rounded border border-navy/15">
              {aiRiskScore > 50 ? 'ELEVATED RISK' : 'MODERATE RISK'}
            </span>
            <span className="text-slate font-semibold flex items-center">
              <TrendingDown size={13} className="mr-0.5 text-risk-low" /> Active mitigation
            </span>
          </div>
        </div>

      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: AI Insights Summary & Critical Action Board */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Executive Intelligence Commentary */}
          <div className="premium-card p-6 rounded-xl bg-gradient-to-br from-white to-background border-t-2 border-t-gold">
            <div className="flex items-center space-x-2 border-b border-steel/10 pb-3">
              <Sparkles className="h-5.5 w-5.5 text-gold animate-pulse" />
              <h3 className="font-bold text-base tracking-wide uppercase text-navy">AI Governance Posture Commentary</h3>
            </div>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-navy font-semibold">
              <p>
                ARAIS has conducted an autonomous evaluation across the risk universe, control test logs, policy adherence sheets, and internal audit logs.
              </p>
              <p>
                <strong className="text-risk-critical">Cybersecurity posture:</strong> The Threat Index is currently at <span className="font-bold">{aiRiskScore}/100</span>. Cyber risks are elevated due to an overdue evidence submission for <span className="underline">CNT-103 (Privileged Identity Audit)</span> which is <span className="text-risk-critical font-bold">17 days past due</span>, coupled with an open Critical Audit Finding <span className="underline">AUD-501 (Wealth Platform Privileged Identity Gaps)</span>. Immediate technical remediation is advised to lower operational risk exposure.
              </p>
              <p>
                <strong className="text-gold">Regulatory Compliance:</strong> We observe <span className="font-bold text-risk-high">Non-Compliance with GDPR Consent Logs (COM-302)</span> which is past its remediation timeline. While Basel III Leverage and SOX compliance remains fully validated (100% compliant), the GDPR and MiFID II RTS execution reports represent a critical exposure gap.
              </p>
            </div>
            <div className="mt-5 flex justify-end">
              <button 
                onClick={() => onNavigate('ai-specialist')}
                className="text-sm text-gold font-bold hover:underline flex items-center cursor-pointer"
              >
                Consult AI Specialist <ArrowUpRight size={14} className="ml-0.5" />
              </button>
            </div>
          </div>

          {/* Interactive Chart: Risk Exposure by BU */}
          <div className="premium-card p-6 rounded-xl">
            <div className="border-b border-steel/10 pb-3 mb-5">
              <h3 className="font-bold text-base tracking-wide uppercase text-navy">Average Risk Exposure by Business Unit</h3>
            </div>
            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={buExposureData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(72,101,129,0.08)" />
                  <XAxis dataKey="name" stroke="#52606D" fontSize={11} fontWeight={600} tickLine={false} />
                  <YAxis stroke="#52606D" fontSize={11} fontWeight={600} domain={[0, 15]} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#FFFFFF', border: '1px solid rgba(72,101,129,0.15)', borderRadius: '6px', fontSize: 11 }}
                    labelClassName="font-bold text-navy"
                  />
                  <Bar dataKey="score" fill="#486581" radius={[4, 4, 0, 0]} name="Avg Residual Score">
                    {buExposureData.map((entry, index) => {
                      const color = entry.score >= 10 ? '#EF6C00' : entry.score >= 5 ? '#C9A227' : '#2E7D32';
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Critical Governance Actions Pending */}
          <div className="premium-card p-6 rounded-xl">
            <div className="flex justify-between items-center border-b border-steel/10 pb-3">
              <h3 className="font-bold text-base tracking-wide uppercase text-navy flex items-center">
                <AlertOctagon className="h-5 w-5 text-risk-critical mr-2" />
                Critical Actions Awaiting Owner Action
              </h3>
              <span className="text-xs text-slate font-bold uppercase">Attention Required</span>
            </div>
            <div className="mt-4 space-y-3.5">
              {criticalActions.length > 0 ? (
                criticalActions.map((action, i) => (
                  <div key={i} className="p-4 bg-background hover:bg-navy/5 rounded-lg border border-steel/15 flex items-start space-x-3 transition-colors">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded border ${
                      action.severity === 'Critical' 
                        ? 'bg-risk-crit/10 text-risk-critical border-risk-crit/30' 
                        : 'bg-risk-high/10 text-risk-high border-risk-high/30'
                    }`}>
                      {action.severity}
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-xs font-bold text-slate uppercase">{action.module}</span>
                        <span className="text-xs text-navy font-mono font-semibold">{action.id}</span>
                      </div>
                      <p className="text-sm font-semibold text-navy mt-1.5">{action.desc}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-sm text-steel font-medium">
                  ✓ No critical overdue governance actions found. The risk registry is in compliance bounds.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Side: Top Enterprise Risks */}
        <div className="space-y-6">
          <div className="premium-card p-6 rounded-xl h-full flex flex-col">
            <div className="border-b border-steel/10 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-base tracking-wide uppercase text-navy flex items-center">
                <ShieldAlert className="h-5 w-5 text-navy mr-2" />
                Top Enterprise Risks
              </h3>
              <span className="text-xs text-slate font-bold uppercase">Exposure Rank</span>
            </div>
            
            <div className="mt-4 flex-1 space-y-4">
              {topRisks.map((risk) => (
                <div key={risk.id} className="p-4.5 bg-background rounded-lg border border-steel/15 space-y-3.5">
                  <div className="flex justify-between items-start">
                    <div className="max-w-[70%]">
                      <span className="text-xs font-bold text-slate uppercase tracking-wider">{risk.category} • {risk.businessUnit}</span>
                      <h4 className="text-sm font-bold text-navy mt-1 truncate">{risk.name}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-semibold text-slate block uppercase">Residual Score</span>
                      <span className={`text-base font-black ${
                        risk.residualScore >= 12 
                          ? 'text-risk-critical' 
                          : risk.residualScore >= 8 
                          ? 'text-risk-high' 
                          : 'text-risk-mod'
                      }`}>
                        {risk.residualScore} <span className="text-xs text-slate font-medium">/25</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-2 border-t border-steel/10">
                    <span className="text-slate font-medium">Owner: <span className="font-semibold text-navy">{risk.owner}</span></span>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold border text-[10px] uppercase ${
                      risk.status === 'Active' 
                        ? 'bg-risk-crit/5 text-risk-critical border-risk-crit/20' 
                        : risk.status === 'Mitigated' 
                        ? 'bg-risk-low/5 text-risk-low border-risk-low/20' 
                        : 'bg-risk-mod/5 text-risk-mod border-risk-mod/20'
                    }`}>
                      {risk.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t border-steel/10 pt-4 text-center">
              <button 
                onClick={() => onNavigate('risks')}
                className="text-sm text-navy font-bold hover:underline cursor-pointer"
              >
                Open Enterprise Risk Register →
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
