'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { DatabaseState } from '../lib/mockDb';

interface AiSpecialistProps {
  db: DatabaseState;
}

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  isStructured?: boolean;
  structuredType?: 'risks' | 'controls' | 'compliance' | 'board';
}

export default function AiSpecialist({ db }: AiSpecialistProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: "Good morning, Alexander. I am the AURA AI Specialist, your corporate governance copilot. How can I assist you with risk assessments, control logs, policy compliance, or board pack summaries today?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const promptChips = [
    { label: "Show top enterprise risks", prompt: "Show top 10 enterprise risks" },
    { label: "Summarize overdue control evidence", prompt: "Summarize overdue control evidence" },
    { label: "Analyze compliance issues", prompt: "Show high-risk compliance issues" },
    { label: "Generate board risk summary", prompt: "Generate board risk summary" }
  ];

  const generateAIResponse = (prompt: string): ChatMessage => {
    const textLower = prompt.toLowerCase();
    
    // 1. TOP ENTERPRISE RISKS
    if (textLower.includes('risk') && (textLower.includes('top') || textLower.includes('10') || textLower.includes('list'))) {
      const topRisks = [...db.risks]
        .sort((a, b) => b.residualScore - a.residualScore)
        .slice(0, 5);

      let content = "Here is the autonomous evaluation of the top enterprise risks mapped by residual risk scores:\n\n";
      topRisks.forEach((r, idx) => {
        content += `**${idx + 1}. [${r.id}] ${r.name}**\n`;
        content += `   * Category: ${r.category} | Business Unit: ${r.businessUnit}\n`;
        content += `   * Residual Risk Score: **${r.residualScore}/25** (Inherent: ${r.inherentScore}/25)\n`;
        content += `   * Owner: ${r.owner} | Review Timeline: ${r.reviewDate}\n`;
        content += `   * Description: *${r.description}*\n\n`;
      });
      content += "\n**AI Security Recommendation:** Prioritize technical remediation on operational/cyber vectors. Check Controls Center to verify effectiveness indicators.";
      
      return { sender: 'ai', text: content, isStructured: true, structuredType: 'risks' };
    }

    // 2. OVERDUE CONTROL EVIDENCE
    if (textLower.includes('control') && (textLower.includes('overdue') || textLower.includes('evidence') || textLower.includes('pending'))) {
      const overdueControls = db.controls.filter(c => c.evidenceStatus === 'Overdue');
      const pendingControls = db.controls.filter(c => c.evidenceStatus === 'Pending');

      let content = "### Autonomous Control Assurance Summary\n\n";
      
      if (overdueControls.length > 0) {
        content += "⚠️ **Overdue Evidence Exceptions Detected:**\n\n";
        overdueControls.forEach(c => {
          content += `* **${c.id}: ${c.name}**\n`;
          content += `  * Component: ${c.cosoComponent} | Owner: **${c.owner}**\n`;
          content += `  * Schedule: ${c.frequency} | Action Status: Overdue (Timelines missed)\n\n`;
        });
      } else {
        content += "✓ **Overdue Evidence Exceptions:** No controls are currently overdue for evidence submission. Excellent compliance discipline.\n\n";
      }

      if (pendingControls.length > 0) {
        content += "⏳ **Pending Controls (Active Verification Cycles):**\n\n";
        pendingControls.forEach(c => {
          content += `* **${c.id}: ${c.name}** (Owner: ${c.owner}) - due shortly on ${c.dueDate}.\n`;
        });
      }

      content += "\n**AI Recommended Action:** Click 'Request Evidence' in the Controls Monitoring panel to trigger automatic templates and escalate tasks.";
      
      return { sender: 'ai', text: content, isStructured: true, structuredType: 'controls' };
    }

    // 3. HIGH RISK COMPLIANCE ISSUES
    if (textLower.includes('compliance') || textLower.includes('regulation') || textLower.includes('gdpr') || textLower.includes('policy')) {
      const gaps = db.compliance.filter(c => c.status !== 'Compliant');
      
      let content = "### Regulatory Compliance Assessment & Exposure\n\n";
      
      if (gaps.length > 0) {
        content += `A total of **${gaps.length} compliance obligations** require immediate executive action:\n\n`;
        gaps.forEach(g => {
          content += `* **${g.regulation} - ${g.id}** (${g.riskRating} Risk)\n`;
          content += `  * Requirement: ${g.requirement}\n`;
          content += `  * Policy Owner: ${g.owner} | Current Status: **${g.status}**\n\n`;
        });
        content += "\n**Remediation Plan:** Initiate internal control audits mapping to GDPR Consent configurations and MiFID II RTS execution reports immediately.";
      } else {
        content += "✓ **Regulatory Status:** 100% Policy Compliant. All core regulations (Basel III, GDPR, SOX, MiFID II, DORA, AML/KYC) are in fully verified alignment.";
      }

      return { sender: 'ai', text: content, isStructured: true, structuredType: 'compliance' };
    }

    // 4. BOARD RISK SUMMARY
    if (textLower.includes('board') || textLower.includes('executive') || textLower.includes('summary') || textLower.includes('report')) {
      const totalR = db.risks.length;
      const criticalR = db.risks.filter(r => r.residualScore >= 12).length;
      const compliantPct = Math.round((db.compliance.filter(o => o.status === 'Compliant').length / db.compliance.length) * 100);
      const effectivePct = Math.round((db.controls.filter(c => c.effectiveness === 'Effective').length / db.controls.length) * 100);

      const content = `# BOARD OF DIRECTORS EXECUTIVE RISK MEMORANDUM
*Prepared autonomously by AURA AIOS (ARAIS) on June 1, 2026*

### 1. Corporate Governance Posture
The overall threat posture remains **Elevated** with a composite Threat Score of **46/100**. This status is driven by technical execution backlogs rather than core market movements.

### 2. Operational Control Assurance
* **Audit Universe:** Active tracking shows **${db.auditFindings.filter(f => f.status !== 'Closed').length} open audit findings**.
* **Control Effectiveness:** Currently **${effectivePct}% of controls** are performing effectively in mitigating risks. Gaps in privileged access directories remain the leading source of control weakness.
* **Evidence Gathering:** Evidence collection stands at **${db.controls.filter(c => c.evidenceStatus === 'Submitted').length} of ${db.controls.length} schedules**.

### 3. Policy Compliance Level
Our overall Policy Compliance score is **${compliantPct}%**. GDPR tracking gaps represent our main exposure point, which is under immediate operational review.

### 4. Strategic Recommendations for the Board
1. **Immediate Capital Allocation:** Fund the automated identity provisioning module to address AUD-501.
2. **Director Mandate:** Enforce weekly verification on compliance logs to resolve COM-302 prior to the next external regulatory audit.`;

      return { sender: 'ai', text: content, isStructured: true, structuredType: 'board' };
    }

    return {
      sender: 'ai',
      text: `Thank you for your query: "${prompt}". 

Currently, AURA AIOS is monitoring **${db.risks.length} risks**, **${db.controls.length} controls**, and **${db.compliance.length} regulatory compliance obligations**. 

Based on my analysis:
1. Cyber risk levels remain the highest area of exposure under current monitoring bounds.
2. Controls are operating at **${Math.round((db.controls.filter(c => c.effectiveness === 'Effective').length / db.controls.length) * 100)}% effectiveness**.
3. Compliance Readiness stands at **${Math.round((db.compliance.filter(o => o.status === 'Compliant').length / db.compliance.length) * 100)}%**.

Please select one of the quick chips above or specify a specific risk/control ID for a targeted advisory report.`
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userPrompt = inputValue;
    setMessages(prev => [...prev, { sender: 'user', text: userPrompt }]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAIResponse(userPrompt);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1200);
  };

  const handleChipClick = (chipPrompt: string) => {
    setMessages(prev => [...prev, { sender: 'user', text: chipPrompt }]);
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAIResponse(chipPrompt);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-fade-in space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-steel/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-navy tracking-tight">AI Risk Specialist</h2>
          <p className="text-sm text-steel font-medium mt-1">Chat-based Virtual Risk Specialist for instant regulatory analysis, evidence auditing, and board pack draft generation.</p>
        </div>
        <div className="flex items-center space-x-1.5 bg-gold/15 border border-gold/30 px-3.5 py-2 rounded-lg text-xs font-bold text-navy">
          <Sparkles size={13} className="text-gold animate-pulse" />
          <span>ARAIS INSIGHT ENGINE ACTIVE</span>
        </div>
      </div>

      {/* Main chat window */}
      <div className="flex-1 bg-white rounded-xl border border-steel/20 shadow-lg flex flex-col overflow-hidden">
        
        {/* Chat Feed */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex items-start space-x-3 text-sm leading-relaxed ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="h-9 w-9 bg-navy border border-gold/30 rounded-lg flex items-center justify-center text-gold flex-shrink-0 shadow">
                  <Bot size={18} />
                </div>
              )}
              
              <div 
                className={`max-w-[75%] rounded-xl p-4 shadow-sm border font-semibold ${
                  msg.sender === 'user' 
                    ? 'bg-navy text-white border-navy/20' 
                    : 'bg-background text-navy border-steel/15'
                }`}
              >
                {msg.isStructured ? (
                  <div className="space-y-3 whitespace-pre-line">
                    <div className="flex items-center space-x-1.5 border-b border-steel/15 pb-2 text-xs font-bold text-slate uppercase tracking-wider">
                      {msg.structuredType === 'risks' && <AlertTriangle size={13} className="text-risk-critical" />}
                      {msg.structuredType === 'controls' && <ShieldCheck size={13} className="text-risk-low" />}
                      {msg.structuredType === 'board' && <Sparkles size={13} className="text-gold" />}
                      <span>AURA AIOS Intelligent Narrative Summary</span>
                    </div>
                    <div className="text-sm font-semibold">{msg.text}</div>
                  </div>
                ) : (
                  <div className="whitespace-pre-line text-sm font-semibold">{msg.text}</div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="h-9 w-9 bg-steel/10 border border-steel/20 rounded-full flex items-center justify-center text-navy font-bold text-xs flex-shrink-0 shadow">
                  CRO
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start space-x-3 text-sm justify-start">
              <div className="h-9 w-9 bg-navy border border-gold/30 rounded-lg flex items-center justify-center text-gold flex-shrink-0 shadow">
                <Bot size={18} />
              </div>
              <div className="bg-background text-navy border border-steel/15 rounded-xl p-4 shadow-sm flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate">AI analyzing risk universe</span>
                <span className="flex space-x-1">
                  <span className="h-1.5 w-1.5 bg-navy rounded-full animate-bounce"></span>
                  <span className="h-1.5 w-1.5 bg-navy rounded-full animate-bounce delay-100"></span>
                  <span className="h-1.5 w-1.5 bg-navy rounded-full animate-bounce delay-200"></span>
                </span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-steel/10 p-4 bg-background/50 space-y-4">
          {/* Quick chips */}
          <div className="flex flex-wrap gap-2">
            {promptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleChipClick(chip.prompt)}
                disabled={isTyping}
                className="bg-white hover:bg-background text-navy hover:text-gold border border-steel/20 hover:border-gold/30 text-xs font-bold px-3.5 py-2 rounded-full shadow-sm cursor-pointer transition-all flex items-center space-x-1"
              >
                <Lightbulb size={12} className="text-gold" />
                <span>{chip.label}</span>
              </button>
            ))}
          </div>

          {/* Form input */}
          <form onSubmit={handleSubmit} className="flex items-center space-x-2 bg-white rounded-lg border border-steel/30 p-1.5 shadow-inner">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isTyping}
              placeholder="Ask AI Advisor e.g., 'What are our compliance gaps?' or 'Explain overdue control logs'..."
              className="flex-1 bg-transparent border-none text-sm font-semibold py-2.5 px-3.5 text-navy placeholder:text-slate/60 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="bg-navy hover:bg-navy/90 disabled:opacity-50 text-gold p-2.5 rounded-lg cursor-pointer flex items-center justify-center transition-all"
            >
              <Send size={15} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
