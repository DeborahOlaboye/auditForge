/**
 * Core type definitions for Smart Contract Security Auditor
 */

export enum Severity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  INFO = 'INFO'
}

export enum DeploymentRecommendation {
  SAFE = 'SAFE',
  REVIEW = 'REVIEW',
  DO_NOT_DEPLOY = 'DO_NOT_DEPLOY'
}

export interface Vulnerability {
  id: string;
  name: string;
  severity: Severity;
  description: string;
  location: CodeLocation;
  technicalExplanation: string;
  exploitScenario: string;
  recommendation: string;
  codeSnippet: string;
  references: string[];
  confidence: number;
}

export interface CodeLocation {
  file: string;
  line: number;
  column: number;
  functionName?: string;
  contractName?: string;
}

export interface ContractMetadata {
  name: string;
  inheritance: string[];
  functions: FunctionInfo[];
  stateVariables: StateVariable[];
  events: EventInfo[];
  modifiers: ModifierInfo[];
  externalCalls: ExternalCall[];
}

export interface FunctionInfo {
  name: string;
  visibility: string;
  modifiers: string[];
  parameters: Parameter[];
  returnTypes: string[];
  stateMutability: string;
  location: CodeLocation;
}

export interface StateVariable {
  name: string;
  type: string;
  visibility: string;
  location: CodeLocation;
  initialized: boolean;
}

export interface EventInfo {
  name: string;
  parameters: Parameter[];
  location: CodeLocation;
}

export interface ModifierInfo {
  name: string;
  parameters: Parameter[];
  location: CodeLocation;
}

export interface Parameter {
  name: string;
  type: string;
}

export interface ExternalCall {
  type: 'call' | 'delegatecall' | 'send' | 'transfer';
  location: CodeLocation;
  checked: boolean;
}

export interface ParsedContract {
  ast: any;
  sourceCode: string;
  metadata: ContractMetadata[];
}

export interface AIAnalysis {
  overallRiskScore: number;
  executiveSummary: string;
  additionalVulnerabilities: Vulnerability[];
  validatedFindings: string[];
  falsePositives: string[];
  gasOptimizations: GasOptimization[];
  bestPracticeViolations: BestPractice[];
}

export interface GasOptimization {
  description: string;
  location: CodeLocation;
  estimatedSavings: string;
  difficulty: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface BestPractice {
  description: string;
  location: CodeLocation;
  category: string;
}

export interface AuditReport {
  id: string;
  timestamp: Date;
  contractName: string;
  sourceCode: string;
  executiveSummary: ExecutiveSummary;
  vulnerabilities: Vulnerability[];
  gasOptimizations: GasOptimization[];
  bestPractices: BestPractice[];
  riskAssessment: RiskAssessment;
  metadata: ReportMetadata;
}

export interface ExecutiveSummary {
  totalVulnerabilities: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  infoCount: number;
  overallRiskScore: number;
  deploymentRecommendation: DeploymentRecommendation;
  topConcerns: string[];
}

export interface RiskAssessment {
  overallScore: number;
  categoryBreakdown: CategoryBreakdown;
  historicalContext: string;
}

export interface CategoryBreakdown {
  [category: string]: number;
}

export interface ReportMetadata {
  analysisVersion: string;
  rulesVersion: string;
  aiModel: string;
  analysisTime: number;
}

export interface VulnerabilityRule {
  id: string;
  name: string;
  severity: Severity;
  description: string;
  pattern: RegExp | ((ast: any, metadata: ContractMetadata) => Vulnerability[]);
  recommendation: string;
  references: string[];
}

export interface AuditOptions {
  enableAIAnalysis?: boolean;
  llmProvider?: 'openai' | 'anthropic';
  model?: string;
  skipRules?: string[];
  customRules?: VulnerabilityRule[];
}

export interface AuditContext {
  sourceCode: string;
  parsedContract: ParsedContract;
  options: AuditOptions;
  startTime: number;
}
