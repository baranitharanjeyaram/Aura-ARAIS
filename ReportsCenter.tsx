'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Sparkles, 
  CheckCircle,
  FileSpreadsheet,
  Tv,
  ArrowUpRight,
  Printer
} from 'lucide-react';
import { DatabaseState } from '../lib/mockDb';
import confetti from 'canvas-confetti';

interface ReportsCenterProps {
  db: DatabaseState;
}

export default function ReportsCenter({ db }: ReportsCenterProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('board');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'ppt'>('pdf');

  const templates = [
    { id: 'board', name: 'Board Executive Risk Memo', icon: FileText, desc: 'A high-level strategic overview of threat indices, risk exposure, and major controls.' },
    { id: 'audit', name: 'Audit Committee Package', icon: Printer, desc: 'Detailed tracking of open audit findings, root cause analyses, and correction actions.' },
    { id: 'compliance', name: 'Regulatory Readiness Dossier', icon: FileSpreadsheet, desc: 'Detailed checklist of Basel III, GDPR, and SOX status checks and deadlines.' }
  ];

  const handleExport = (format: 'pdf' | 'excel' | 'ppt') => {
    setExportFormat(format);
    setIsExporting(true);
    setExportSuccess(false);

    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C9A227', '#0A2540', '#486581']
      });

      setTimeout(() => {
        setExportSuccess(false);
      }, 4000);
    }, 2000);
  };

  const getTemplateName = () => {
    return templates.find(t => t.id === selectedTemplate)?.name || '';
  };

  return (
    <div className="space-y-8 animate-fade-in text-sm font-semibold">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-steel/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-navy tracking-tight">Executive MIS & Board Reporting</h2>
          <p className="text-sm text-steel font-medium mt-1">Generate board packs, audit committee decks, compliance matrices, and MIS intelligence reports.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Side: Template Selector & Actions */}
        <div className="space-y-6">
          <div className="premium-card p-6 rounded-xl space-y-5">
            <div className="border-b border-steel/10 pb-3">
              <h3 className="font-bold text-base tracking-wide uppercase text-navy">Select Board Template</h3>
            </div>

            <div className="space-y-3.5">
              {templates.map((tmpl) => {
                const Icon = tmpl.icon;
                const isSelected = selectedTemplate === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => { setSelectedTemplate(tmpl.id); setExportSuccess(false); }}
                    className={`w-full text-left p-4.5 rounded-xl border transition-all text-sm font-bold cursor-pointer ${
                      isSelected 
                        ? 'bg-navy text-gold border-gold shadow' 
                        : 'bg-background hover:bg-navy/5 text-navy border-steel/15'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`h-5 w-5 ${isSelected ? 'text-gold' : 'text-steel'}`} />
                      <span className="font-bold">{tmpl.name}</span>
                    </div>
                    <p className={`mt-2 font-semibold leading-relaxed text-xs ${isSelected ? 'text-lightblue' : 'text-slate'}`}>
                      {tmpl.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Export Action Card */}
          <div className="premium-card p-6 rounded-xl space-y-4">
            <div className="border-b border-steel/10 pb-3">
              <h3 className="font-bold text-base tracking-wide uppercase text-navy">Export Options</h3>
            </div>

            {isExporting ? (
              <div className="p-6 text-center text-sm font-bold text-navy space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-navy border-t-gold"></span>
                  <span>Assembling and encrypting {getTemplateName()}...</span>
                </div>
                <p className="text-xs text-slate">Connecting risk registry, control logs, and audit trails...</p>
              </div>
            ) : (
              <div className="space-y-3 text-sm font-bold">
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full bg-navy hover:bg-navy/90 text-gold py-3.5 px-4.5 rounded-lg border border-gold/30 flex items-center justify-between cursor-pointer transition-all hover:-translate-y-0.5 shadow-md"
                >
                  <span className="flex items-center space-x-2">
                    <FileText size={18} />
                    <span>Download Premium PDF Memo</span>
                  </span>
                  <Download size={15} />
                </button>

                <button
                  onClick={() => handleExport('excel')}
                  className="w-full bg-white hover:bg-background text-navy border border-steel/30 py-3.5 px-4.5 rounded-lg flex items-center justify-between cursor-pointer transition-all shadow-sm"
                >
                  <span className="flex items-center space-x-2">
                    <FileSpreadsheet size={18} className="text-steel" />
                    <span>Export Relational Audit Tables (Excel)</span>
                  </span>
                  <Download size={15} />
                </button>

                <button
                  onClick={() => handleExport('ppt')}
                  className="w-full bg-white hover:bg-background text-navy border border-steel/30 py-3.5 px-4.5 rounded-lg flex items-center justify-between cursor-pointer transition-all shadow-sm"
                >
                  <span className="flex items-center space-x-2">
                    <Tv size={18} className="text-steel" />
                    <span>Download Slide Deck Pack (PowerPoint)</span>
                  </span>
                  <Download size={15} />
                </button>
              </div>
            )}

            {exportSuccess && (
              <div className="p-4 bg-risk-low/10 border border-risk-low/30 text-risk-low rounded-lg text-xs font-bold flex items-start space-x-2 animate-fade-in">
                <CheckCircle size={18} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="uppercase text-[10px] tracking-wider text-risk-low">System Action Confirmed</p>
                  <p className="mt-1 leading-normal font-semibold">
                    {getTemplateName()} successfully compiled in {exportFormat.toUpperCase()} format. File transfer initiated.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: High Fidelity Report Mockup Preview */}
        <div className="xl:col-span-2 premium-card p-8 rounded-xl bg-gradient-to-b from-white to-background border-t-2 border-t-gold flex flex-col justify-between">
          <div className="space-y-6">
            <div className="border-b border-steel/15 pb-4 flex justify-between items-center text-sm font-bold">
              <span className="text-navy uppercase tracking-wider flex items-center">
                <Sparkles size={15} className="text-gold mr-2 animate-pulse" />
                Live Preview: {getTemplateName()}
              </span>
              <span className="bg-navy/5 border border-steel/15 px-2.5 py-1 text-[10px] font-bold text-slate rounded uppercase">Draft version</span>
            </div>

            {/* Document Draft Page */}
            {selectedTemplate === 'board' && (
              <div className="space-y-5 font-sans text-xs leading-relaxed text-navy select-none max-h-[500px] overflow-y-auto pr-2">
                <div className="text-center border-b-2 border-gold/40 pb-5">
                  <h1 className="text-xl font-black tracking-widest text-navy uppercase">Barani Aura AIOS (ARAIS)</h1>
                  <h2 className="text-xs font-bold text-slate uppercase tracking-widest mt-1.5">Autonomous Governance & Audit Intelligence System</h2>
                  <p className="text-xs text-slate mt-1">Corporate Governance Pack • CONFIDENTIAL</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-b border-steel/10 py-3.5 text-xs font-bold text-slate uppercase">
                  <div>
                    <span className="block">To: Board of Directors & Audit Committee</span>
                    <span className="block mt-1">From: Executive Intelligence Agent (ARAIS)</span>
                  </div>
                  <div className="text-right">
                    <span className="block">Date: June 1, 2026</span>
                    <span className="block mt-1">Classification: Strictly Private & Confidential</span>
                  </div>
                </div>

                <div className="space-y-4 text-xs font-semibold leading-relaxed">
                  <h3 className="font-bold text-sm uppercase tracking-wide border-l-2 border-gold pl-2">1. Executive Summary</h3>
                  <p className="text-justify font-semibold">
                    A comprehensive audit of internal systems has been executed in accordance with COSO Control activities and Basel III regulatory guidelines. The system records an overall <strong>Compliance Readiness Index of {Math.round((db.compliance.filter(o => o.status === 'Compliant').length / db.compliance.length) * 100)}%</strong>, with <strong>{db.controls.filter(c => c.effectiveness === 'Effective').length} of {db.controls.length} key control activities</strong> performing effectively.
                  </p>

                  <h3 className="font-bold text-sm uppercase tracking-wide border-l-2 border-gold pl-2">2. Elevated Threat Exposure</h3>
                  <p className="text-justify font-semibold">
                    We flag <strong>{db.risks.filter(r => r.residualScore >= 10).length} high-exposure risks</strong> requiring immediate board action. Gaps in privileged database mappings (AUD-501) and GDPR compliance logs (COM-302) represent our principal vulnerabilities. Control testing for CNT-103 is currently past its deadline.
                  </p>

                  <h3 className="font-bold text-sm uppercase tracking-wide border-l-2 border-gold pl-2">3. Recommended Actions</h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs font-semibold">
                    <li>Authorize budget allocation for directory management software to close internal audit gaps.</li>
                    <li>Enforce urgent verification tasks on GDPR user consent protocols prior to Q3 evaluations.</li>
                  </ul>
                </div>
              </div>
            )}

            {selectedTemplate === 'audit' && (
              <div className="space-y-5 font-sans text-xs leading-relaxed text-navy select-none max-h-[500px] overflow-y-auto pr-2">
                <div className="text-center border-b-2 border-steel/20 pb-5">
                  <h1 className="text-base font-black tracking-widest text-navy uppercase">INTERNAL AUDIT PROGRESS REPORT</h1>
                  <p className="text-xs text-slate mt-1">Audit Universe Coverage Tracker</p>
                </div>

                <div className="space-y-4 font-semibold text-xs leading-relaxed">
                  <p>Current plan shows <strong>78% audit completion</strong>. The following corrective actions remain logged:</p>
                  
                  <div className="space-y-3">
                    {db.auditFindings.map(f => (
                      <div key={f.id} className="p-3 bg-background border border-steel/10 rounded-lg">
                        <div className="flex justify-between font-bold text-xs">
                          <span>{f.id}: {f.auditArea}</span>
                          <span className="uppercase text-[10px]">{f.severity}</span>
                        </div>
                        <p className="text-xs text-slate font-semibold mt-1">{f.rootCause}</p>
                        <span className="text-xs block mt-1.5">Status: <strong>{f.status}</strong> | Owner: {f.actionOwner}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedTemplate === 'compliance' && (
              <div className="space-y-5 font-sans text-xs leading-relaxed text-navy select-none max-h-[500px] overflow-y-auto pr-2">
                <div className="text-center border-b-2 border-steel/20 pb-5">
                  <h1 className="text-base font-black tracking-widest text-navy uppercase">REGULATORY OBLIGATION ALIGNMENT STATUS</h1>
                  <p className="text-xs text-slate mt-1">Basel III, GDPR, SOX, and DORA tracking check sheets</p>
                </div>

                <div className="space-y-4 font-semibold text-xs leading-relaxed">
                  <p>Overall policies checklist compliance status:</p>
                  
                  <div className="space-y-3">
                    {db.compliance.map(c => (
                      <div key={c.id} className="flex justify-between items-center p-3 bg-background border border-steel/10 rounded-lg">
                        <div>
                          <span className="font-bold text-xs">{c.regulation} ({c.id})</span>
                          <p className="text-xs text-slate font-medium mt-0.5 line-clamp-1">{c.requirement}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                          c.status === 'Compliant' ? 'bg-risk-low/10 text-risk-low border-risk-low/30' : 'bg-risk-crit/10 text-risk-critical border-risk-crit/30'
                        }`}>{c.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 border-t border-steel/10 pt-4 flex justify-between items-center text-xs font-semibold text-slate">
            <span>Barani Aura ARAIS • Secured with Banking Grade Cryptography</span>
            <span className="flex items-center hover:underline cursor-pointer">
              Open Board Pack Hub <ArrowUpRight size={13} className="ml-0.5" />
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
