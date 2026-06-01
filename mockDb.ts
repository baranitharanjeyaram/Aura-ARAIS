// BARANI AURA AIOS (ARAIS) - Mock Database Model
// Implements client-side state management with local storage persistence

export interface Risk {
  id: string;
  name: string;
  category: 'Strategic' | 'Financial' | 'Operational' | 'Cyber' | 'Compliance' | 'Reputational';
  businessUnit: 'Investment Banking' | 'Wealth Management' | 'Retail Banking' | 'Operations';
  likelihood: number; // 1-5
  impact: number; // 1-5
  inherentScore: number; // Likelihood * Impact
  residualScore: number; // Inherent * Mitigation factor
  owner: string;
  status: 'Active' | 'Mitigated' | 'Monitoring';
  reviewDate: string;
  description: string;
}

export interface Control {
  id: string;
  name: string;
  cosoComponent: 'Control Environment' | 'Risk Assessment' | 'Control Activities' | 'Information & Communication' | 'Monitoring';
  owner: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual';
  type: 'Preventive' | 'Detective';
  effectiveness: 'Effective' | 'Partially Effective' | 'Ineffective';
  evidenceStatus: 'Submitted' | 'Pending' | 'Overdue';
  dueDate: string;
  testedCount: number;
}

export interface ComplianceObligation {
  id: string;
  regulation: 'Basel III' | 'GDPR' | 'SOX' | 'MiFID II' | 'DORA' | 'AML/KYC';
  requirement: string;
  owner: string;
  status: 'Compliant' | 'Non-Compliant' | 'Under Review';
  dueDate: string;
  riskRating: 'Critical' | 'High' | 'Medium' | 'Low';
}

export interface AuditFinding {
  id: string;
  auditArea: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  rootCause: string;
  actionOwner: string;
  dueDate: string;
  status: 'Open' | 'In Progress' | 'Closed' | 'Under Review';
}

// Initial Data Population
const defaultRisks: Risk[] = [
  {
    id: "RSK-001",
    name: "Cybersecurity Breach & Ransomware Attack",
    category: "Cyber",
    businessUnit: "Operations",
    likelihood: 4,
    impact: 5,
    inherentScore: 20,
    residualScore: 12,
    owner: "Marcus Aurelius",
    status: "Active",
    reviewDate: "2026-07-15",
    description: "Failure to intercept phishing vectors leading to core operational lock and client PII exfiltration."
  },
  {
    id: "RSK-002",
    name: "AML Transaction Monitoring Gaps",
    category: "Compliance",
    businessUnit: "Retail Banking",
    likelihood: 4,
    impact: 5,
    inherentScore: 20,
    residualScore: 8,
    owner: "Amara Okafor",
    status: "Monitoring",
    reviewDate: "2026-06-30",
    description: "Inability of real-time monitoring software to flag high-velocity structured deposits from suspicious offshore accounts."
  },
  {
    id: "RSK-003",
    name: "Interest Rate Fluctuation Exposure",
    category: "Financial",
    businessUnit: "Investment Banking",
    likelihood: 5,
    impact: 4,
    inherentScore: 20,
    residualScore: 10,
    owner: "Julian Alvarez",
    status: "Active",
    reviewDate: "2026-08-01",
    description: "Unhedged maturity mismatches in long-term fixed assets vs short-term liability funding costs."
  },
  {
    id: "RSK-004",
    name: "GDPR Violations in High-Net-Worth Portals",
    category: "Compliance",
    businessUnit: "Wealth Management",
    likelihood: 3,
    impact: 5,
    inherentScore: 15,
    residualScore: 9,
    owner: "Sophia Loren",
    status: "Active",
    reviewDate: "2026-06-18",
    description: "Unencrypted storage of customer net-worth profiles and consent logs accessed by third-party vendor platforms."
  },
  {
    id: "RSK-005",
    name: "Third-Party Vendor Critical Insolvency",
    category: "Operational",
    businessUnit: "Operations",
    likelihood: 3,
    impact: 3,
    inherentScore: 9,
    residualScore: 3,
    owner: "Elena Rostova",
    status: "Mitigated",
    reviewDate: "2026-09-10",
    description: "Key SaaS provider for settlement processing files for bankruptcy, causing trade clearing delays."
  },
  {
    id: "RSK-006",
    name: "Geopolitical Supply Chain Disruptions",
    category: "Strategic",
    businessUnit: "Operations",
    likelihood: 4,
    impact: 3,
    inherentScore: 12,
    residualScore: 8,
    owner: "Kenji Sato",
    status: "Active",
    reviewDate: "2026-07-01",
    description: "Sanctions and microchip manufacturing delays disrupting the bank's core hardware lifecycle refresh."
  },
  {
    id: "RSK-007",
    name: "Privileged Access Over-Allocation",
    category: "Cyber",
    businessUnit: "Operations",
    likelihood: 3,
    impact: 4,
    inherentScore: 12,
    residualScore: 4,
    owner: "Marcus Aurelius",
    status: "Mitigated",
    reviewDate: "2026-06-25",
    description: "System administrators possessing excessive write privileges across clearing and ledger systems."
  },
  {
    id: "RSK-008",
    name: "Core Banking System Downtime",
    category: "Operational",
    businessUnit: "Retail Banking",
    likelihood: 2,
    impact: 5,
    inherentScore: 10,
    residualScore: 5,
    owner: "Elena Rostova",
    status: "Monitoring",
    reviewDate: "2026-08-15",
    description: "Legacy mainframe exhaustion causing transaction processing delay exceeding the SLA limit."
  },
  {
    id: "RSK-009",
    name: "ESG Disclosures Audit Failure",
    category: "Reputational",
    businessUnit: "Wealth Management",
    likelihood: 3,
    impact: 2,
    inherentScore: 6,
    residualScore: 4,
    owner: "Sarah Jenkins",
    status: "Monitoring",
    reviewDate: "2026-10-01",
    description: "Discrepancy in green bond asset tracking resulting in regulatory warning on greenwashing compliance."
  },
  {
    id: "RSK-010",
    name: "Insider Trading Regulatory Audit Gap",
    category: "Strategic",
    businessUnit: "Investment Banking",
    likelihood: 2,
    impact: 5,
    inherentScore: 10,
    residualScore: 6,
    owner: "Sophia Loren",
    status: "Active",
    reviewDate: "2026-07-20",
    description: "Failure to map real-time cross-asset trade patterns with executive black-out schedules."
  }
];

const defaultControls: Control[] = [
  {
    id: "CNT-101",
    name: "Multi-Factor Authentication (MFA) Enforcement",
    cosoComponent: "Control Activities",
    owner: "Marcus Aurelius",
    frequency: "Daily",
    type: "Preventive",
    effectiveness: "Effective",
    evidenceStatus: "Submitted",
    dueDate: "2026-06-15",
    testedCount: 154
  },
  {
    id: "CNT-102",
    name: "AML Transaction Screening Reconciliation",
    cosoComponent: "Monitoring",
    owner: "Amara Okafor",
    frequency: "Daily",
    type: "Detective",
    effectiveness: "Effective",
    evidenceStatus: "Submitted",
    dueDate: "2026-06-02",
    testedCount: 220
  },
  {
    id: "CNT-103",
    name: "Privileged Identity Quarterly Access Audit",
    cosoComponent: "Control Activities",
    owner: "Marcus Aurelius",
    frequency: "Quarterly",
    type: "Detective",
    effectiveness: "Ineffective",
    evidenceStatus: "Overdue",
    dueDate: "2026-05-15",
    testedCount: 4
  },
  {
    id: "CNT-104",
    name: "Disaster Recovery Tabletop Drill Verification",
    cosoComponent: "Control Activities",
    owner: "Elena Rostova",
    frequency: "Annual",
    type: "Preventive",
    effectiveness: "Effective",
    evidenceStatus: "Submitted",
    dueDate: "2026-10-30",
    testedCount: 1
  },
  {
    id: "CNT-105",
    name: "Third-Party Vendor Cyber Assessment Security Rating",
    cosoComponent: "Control Activities",
    owner: "Elena Rostova",
    frequency: "Annual",
    type: "Preventive",
    effectiveness: "Partially Effective",
    evidenceStatus: "Pending",
    dueDate: "2026-06-20",
    testedCount: 12
  },
  {
    id: "CNT-106",
    name: "MiFID II Execution Report Automated Check",
    cosoComponent: "Monitoring",
    owner: "Sophia Loren",
    frequency: "Monthly",
    type: "Detective",
    effectiveness: "Effective",
    evidenceStatus: "Submitted",
    dueDate: "2026-06-10",
    testedCount: 18
  },
  {
    id: "CNT-107",
    name: "Insider Trading Watchlist Cross-Matching",
    cosoComponent: "Control Environment",
    owner: "Sophia Loren",
    frequency: "Weekly",
    type: "Detective",
    effectiveness: "Effective",
    evidenceStatus: "Submitted",
    dueDate: "2026-06-05",
    testedCount: 78
  },
  {
    id: "CNT-108",
    name: "Ethical Standards and Compliance Code Training",
    cosoComponent: "Control Environment",
    owner: "Sarah Jenkins",
    frequency: "Annual",
    type: "Preventive",
    effectiveness: "Effective",
    evidenceStatus: "Submitted",
    dueDate: "2026-12-31",
    testedCount: 1
  }
];

const defaultCompliance: ComplianceObligation[] = [
  {
    id: "COM-301",
    regulation: "Basel III",
    requirement: "Maintain common equity tier 1 (CET1) ratio at or above 4.5% of risk-weighted assets.",
    owner: "Julian Alvarez",
    status: "Compliant",
    dueDate: "2026-06-30",
    riskRating: "High"
  },
  {
    id: "COM-302",
    regulation: "GDPR",
    requirement: "Enable real-time tracking, retrieval, and deletion of EU customer consent parameters.",
    owner: "Sophia Loren",
    status: "Non-Compliant",
    dueDate: "2026-05-10",
    riskRating: "Critical"
  },
  {
    id: "COM-303",
    regulation: "SOX",
    requirement: "Certify effectiveness of internal control over financial reporting (Section 404).",
    owner: "Sarah Jenkins",
    status: "Compliant",
    dueDate: "2026-11-15",
    riskRating: "Critical"
  },
  {
    id: "COM-304",
    regulation: "MiFID II",
    requirement: "Publish RTS 27/28 best execution reports quarterly detailing top execution venues.",
    owner: "Sophia Loren",
    status: "Under Review",
    dueDate: "2026-06-15",
    riskRating: "High"
  },
  {
    id: "COM-305",
    regulation: "DORA",
    requirement: "Establish comprehensive operational resilience framework matching EU cross-border ICT standards.",
    owner: "Elena Rostova",
    status: "Compliant",
    dueDate: "2026-09-01",
    riskRating: "High"
  },
  {
    id: "COM-306",
    regulation: "AML/KYC",
    requirement: "Execute enhanced due diligence and verification on accounts transferring over $1M USD.",
    owner: "Amara Okafor",
    status: "Compliant",
    dueDate: "2026-07-15",
    riskRating: "Critical"
  }
];

const defaultAuditFindings: AuditFinding[] = [
  {
    id: "AUD-501",
    auditArea: "Wealth Platform Privileged Identity Gaps",
    severity: "Critical",
    rootCause: "Absence of automated Joiner-Mover-Leaver (JML) de-provisioning processes in AD.",
    actionOwner: "Marcus Aurelius",
    dueDate: "2026-05-20",
    status: "Open"
  },
  {
    id: "AUD-502",
    auditArea: "Delayed KYC Refresh for High-Net-Worth Entities",
    severity: "High",
    rootCause: "Manual risk rating queues creating a backlog of 30+ business days.",
    actionOwner: "Amara Okafor",
    dueDate: "2026-06-25",
    status: "In Progress"
  },
  {
    id: "AUD-503",
    auditArea: "Disaster Recovery Mirror Database Mirroring Sync Failures",
    severity: "Medium",
    rootCause: "Intermittent networking bandwidth caps during overnight backups.",
    actionOwner: "Elena Rostova",
    dueDate: "2026-07-15",
    status: "Open"
  },
  {
    id: "AUD-504",
    auditArea: "Incomplete ESG Disclosures Collection Gaps",
    severity: "Low",
    rootCause: "Green bond registry tracking done on static spreadsheets.",
    actionOwner: "Sarah Jenkins",
    dueDate: "2026-04-30",
    status: "Closed"
  }
];

// Helper functions for localStorage and initial setup
const STORAGE_KEY = 'arais_intelligence_db';

export interface DatabaseState {
  risks: Risk[];
  controls: Control[];
  compliance: ComplianceObligation[];
  auditFindings: AuditFinding[];
}

export function getInitialDatabaseState(): DatabaseState {
  if (typeof window === 'undefined') {
    return {
      risks: defaultRisks,
      controls: defaultControls,
      compliance: defaultCompliance,
      auditFindings: defaultAuditFindings
    };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse database state from local storage", e);
    }
  }

  // Save defaults if not already stored
  const defaultState = {
    risks: defaultRisks,
    controls: defaultControls,
    compliance: defaultCompliance,
    auditFindings: defaultAuditFindings
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
  return defaultState;
}

export function saveDatabaseState(state: DatabaseState): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}
