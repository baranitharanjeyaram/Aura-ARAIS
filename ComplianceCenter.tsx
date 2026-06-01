'use client';

import React, { useState } from 'react';
import { 
  CheckSquare, 
  AlertOctagon, 
  HelpCircle, 
  Calendar, 
  User, 
  Search, 
  Sparkles,
  TrendingUp,
  Award,
  BookOpen
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend
} from 'recharts';
import { DatabaseState, ComplianceObligation } from '../lib/mockDb';
import confetti from 'canvas-confetti';

interface ComplianceCenterProps {
  db: DatabaseState;
  onUpdateCompliance: (obligationId: string, updates: Partial<ComplianceObligation>) => void;
}

export default function ComplianceCenter({ db, onUpdateCompliance }: ComplianceCenterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [regulationFilter, setRegulationFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // 1. Dynamic Calculations
  const totalObligations = db.compliance.length;
  const compliantCount = db.compliance.filter(o => o.status === 'Compliant').length;
  const nonCompliantCount = db.compliance.filter(o => o.status === 'Non-Compliant').length;
  const underReviewCount = db.compliance.filter(o => o.status === 'Under Review').length;
  const complianceScore = totalObligations > 0 ? Math.round((compliantCount / totalObligations) * 100) : 100;

  // 2. Interactive Handlers
  const handleMarkCompliant = (obligationId: string) => {
    onUpdateCompliance(obligationId, { status: 'Compliant' });
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.75 },
      colors: ['#C9A227', '#0A2540', '#486581']
    });
  };

  const handleMarkUnderReview = (obligationId: string) => {
    onUpdateCompliance(obligationId, { status: 'Under Review' });
  };

  // 3. Filtering
  const filteredObligations = db.compliance.filter(o => {
    const matchesSearch = o.requirement.toLowerCase().includes(searchTerm.toLowerCase()) || o.regulation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegulation = regulationFilter === 'All' || o.regulation === regulationFilter;
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    
    return matchesSearch && matchesRegulation && matchesStatus;
  });

  // Calculate Regulation compliance data for Recharts
  const regulations = ['Basel III', 'GDPR', 'SOX', 'MiFID II', 'DORA', 'AML/KYC'];
  const chartData = regulations.map(reg => {
    const regItems = db.compliance.filter(c => c.regulation === reg);
    const compliant = regItems.filter(c => c.status === 'Compliant').length;
    const action = regItems.filter(c => c.status !== 'Compliant').length;
    return { name: reg, Compliant: compliant, 'Action Required': action };
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-steel/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-navy tracking-tight">Compliance Monitoring Center</h2>
          <p className="text-sm text-steel font-medium mt-1">Regulatory tracking portal, compliance assessments, action plans, and audit readiness index.</p>
        </div>
      </div>

      {/* Compliance Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Compliance Score Gauge Card */}
        <div className="premium-card p-6 rounded-xl border-t-2 border-t-gold">
          <p className="text-xs text-slate font-bold uppercase tracking-wider">Compliance Readiness Index</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <h3 className="text-3xl font-bold text-navy">{complianceScore}%</h3>
            <span className="text-xs text-gold font-bold flex items-center">
              <Award size={13} className="mr-0.5" /> High Standards
            </span>
          </div>
          <div className="w-full bg-background rounded-full h-1.5 mt-3">
            <div className="bg-gold h-full rounded-full" style={{ width: `${complianceScore}%` }} />
          </div>
        </div>

        {/* Compliant Count */}
        <div className="premium-card p-6 rounded-xl border-l-4 border-l-risk-low">
          <p className="text-xs text-risk-low font-bold uppercase tracking-wider">Compliant Policies</p>
          <h3 className="text-3xl font-bold text-navy mt-2">{compliantCount} <span className="text-xs text-slate font-normal font-semibold">Obligations</span></h3>
          <p className="text-xs text-slate font-semibold mt-3">Verified and validated</p>
        </div>

        {/* Non-Compliant Count */}
        <div className="premium-card p-6 rounded-xl border-l-4 border-l-risk-critical">
          <p className="text-xs text-risk-critical font-bold uppercase tracking-wider">Non-Compliant Items</p>
          <h3 className="text-3xl font-bold text-navy mt-2">{nonCompliantCount} <span className="text-xs text-slate font-normal font-semibold">Active Gaps</span></h3>
          <p className="text-xs text-slate font-semibold mt-3">Critical regulatory exposure</p>
        </div>

        {/* Under Review Count */}
        <div className="premium-card p-6 rounded-xl border-l-4 border-l-risk-mod">
          <p className="text-xs text-risk-mod font-bold uppercase tracking-wider">Under Evaluation</p>
          <h3 className="text-3xl font-bold text-navy mt-2">{underReviewCount} <span className="text-xs text-slate font-normal font-semibold">Pending</span></h3>
          <p className="text-xs text-slate font-semibold mt-3">Evidence being verified</p>
        </div>

      </div>

      {/* Compliance Data Visualization Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Compliance Regulation breakdown chart */}
        <div className="lg:col-span-2 premium-card p-6 rounded-xl">
          <div className="border-b border-steel/10 pb-3 mb-5">
            <h3 className="font-bold text-base tracking-wide uppercase text-navy">Obligations Status by Regulatory Framework</h3>
          </div>
          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(72,101,129,0.08)" />
                <XAxis dataKey="name" stroke="#52606D" fontSize={11} fontWeight={600} tickLine={false} />
                <YAxis stroke="#52606D" fontSize={11} fontWeight={600} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#FFFFFF', border: '1px solid rgba(72,101,129,0.15)', borderRadius: '6px', fontSize: 11 }}
                  labelClassName="font-bold text-navy"
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar dataKey="Compliant" fill="#2E7D32" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Action Required" fill="#C62828" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regulatory Details Box */}
        <div className="premium-card p-6 rounded-xl flex flex-col justify-between">
          <div className="border-b border-steel/10 pb-3">
            <h3 className="font-bold text-base tracking-wide uppercase text-navy">Continuous Evaluation</h3>
          </div>
          <div className="space-y-4 text-xs font-semibold text-navy mt-4 leading-relaxed">
            <p>
              Corporate policy standards require automated monitoring scripts to test system attributes against local legal limits.
            </p>
            <p>
              Gaps are flagged inside GDPR, SOX, and DORA standards in real time. Marking obligations as compliant recalculates the threat indexes across the board.
            </p>
            <div className="p-3.5 bg-background border border-steel/10 rounded-lg">
              <span className="text-gold font-bold block text-sm">💡 Quick Remediation:</span>
              <p className="mt-1 font-medium leading-normal text-slate">
                Use the <span className="underline">Mark Compliant</span> action in the registry below to instantly submit verified audit documents and close out compliance alerts.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4.5 rounded-xl border border-steel/15 shadow-sm text-sm">
        
        {/* Search */}
        <div className="flex-1 max-w-sm relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-steel" />
          </div>
          <input
            type="text"
            placeholder="Search regulations or requirements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background border border-steel/20 rounded-lg py-2.5 pl-9 pr-4 font-semibold focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </div>

        {/* Dynamic Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          
          <div className="flex items-center space-x-2">
            <span className="text-slate font-bold uppercase text-xs">Regulation:</span>
            <select
              value={regulationFilter}
              onChange={(e) => setRegulationFilter(e.target.value)}
              className="bg-background border border-steel/20 rounded-lg py-2 px-3 text-navy font-semibold focus:outline-none"
            >
              <option value="All">All Regulations</option>
              <option value="Basel III">Basel III</option>
              <option value="GDPR">GDPR</option>
              <option value="SOX">SOX</option>
              <option value="MiFID II">MiFID II</option>
              <option value="DORA">DORA</option>
              <option value="AML/KYC">AML/KYC</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate font-bold uppercase text-xs">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-background border border-steel/20 rounded-lg py-2 px-3 text-navy font-semibold focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Compliant">Compliant</option>
              <option value="Non-Compliant">Non-Compliant</option>
              <option value="Under Review">Under Review</option>
            </select>
          </div>

        </div>

      </div>

      {/* Obligations Registry Table */}
      <div className="bg-white rounded-xl border border-steel/20 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-navy text-white uppercase tracking-wider text-xs font-bold border-b border-steel/20">
                <th className="py-4.5 px-6">Obligation ID</th>
                <th className="py-4.5 px-6">Regulation</th>
                <th className="py-4.5 px-6">Compliance Requirement</th>
                <th className="py-4.5 px-6">Accountable Owner</th>
                <th className="py-4.5 px-6">Risk Rating</th>
                <th className="py-4.5 px-6">Timeline</th>
                <th className="py-4.5 px-6">Compliance Status</th>
                <th className="py-4.5 px-6 text-center">Remediation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background font-semibold text-navy">
              {filteredObligations.length > 0 ? (
                filteredObligations.map((ob) => (
                  <tr key={ob.id} className="hover:bg-background/40 transition-colors">
                    
                    {/* ID */}
                    <td className="py-5 px-6 font-mono font-bold text-steel">
                      {ob.id}
                    </td>

                    {/* Regulation */}
                    <td className="py-5 px-6 font-bold text-navy">
                      <span className="px-3 py-1.5 bg-navy/5 border border-steel/15 text-navy text-xs font-bold rounded-lg">
                        {ob.regulation}
                      </span>
                    </td>

                    {/* Requirement */}
                    <td className="py-5 px-6 max-w-sm">
                      <div className="font-semibold text-navy leading-normal">{ob.requirement}</div>
                    </td>

                    {/* Accountable Owner */}
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-2">
                        <span className="h-7 w-7 bg-steel/10 rounded-full flex items-center justify-center text-xs font-bold text-navy">
                          {ob.owner.charAt(0)}
                        </span>
                        <span>{ob.owner}</span>
                      </div>
                    </td>

                    {/* Risk Rating */}
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        ob.riskRating === 'Critical'
                          ? 'bg-risk-crit/5 text-risk-critical border-risk-crit/20'
                          : ob.riskRating === 'High'
                          ? 'bg-risk-high/5 text-risk-high border-risk-high/20'
                          : 'bg-risk-mod/5 text-risk-mod border-risk-mod/20'
                      }`}>
                        {ob.riskRating}
                      </span>
                    </td>

                    {/* Due Date */}
                    <td className="py-5 px-6 font-mono text-slate">
                      <div className="flex items-center space-x-1 text-[11px] font-semibold">
                        <Calendar size={13} className="text-steel" />
                        <span>{ob.dueDate}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-1.5 font-bold">
                        {ob.status === 'Compliant' ? (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold uppercase bg-risk-low/5 text-risk-low border border-risk-low/20">
                            Compliant
                          </span>
                        ) : ob.status === 'Non-Compliant' ? (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold uppercase bg-risk-crit/5 text-risk-critical border border-risk-crit/20 animate-pulse">
                            Non-Compliant
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold uppercase bg-risk-mod/5 text-risk-mod border border-risk-mod/20">
                            Under Review
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-5 px-6 text-center whitespace-nowrap">
                      {ob.status !== 'Compliant' ? (
                        <button
                          onClick={() => handleMarkCompliant(ob.id)}
                          className="bg-navy hover:bg-navy/90 text-gold text-xs font-bold px-3 py-1.5 rounded border border-gold/30 cursor-pointer transition-all hover:scale-105"
                        >
                          Mark Compliant
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMarkUnderReview(ob.id)}
                          className="bg-background hover:bg-background/80 text-navy text-xs font-bold px-3 py-1.5 rounded border border-steel/20 cursor-pointer transition-all"
                        >
                          Trigger Evaluation
                        </button>
                      )}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-steel font-medium">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <BookOpen className="h-10 w-10 text-steel/40" />
                      <span>No policy compliance obligations found.</span>
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
