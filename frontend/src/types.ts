export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export interface Vulnerability {
  id: string;
  name: string;
  severity: Severity;
  description: string;
  recommendation: string;
  location: {
    line: number;
  };
}

export interface ExecutiveSummary {
  overallRiskScore: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  infoCount: number;
  totalVulnerabilities: number;
}

export interface AuditReport {
  contractName: string;
  sourceCode: string;
  vulnerabilities: Vulnerability[];
  executiveSummary: ExecutiveSummary;
}
