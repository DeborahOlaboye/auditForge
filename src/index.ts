/**
 * Main entry point for Smart Contract Security Auditor
 * Built with ADK-TS (Agent Development Kit for TypeScript)
 */

// ADK-TS Agent (Primary - for hackathon)
export { ADKSmartContractAuditorAgent } from './agents/ADKSmartContractAuditorAgent';

// Legacy agents (kept for compatibility)
export { SmartContractAuditorAgent } from './agents/SmartContractAuditorAgent';
export { ParserAgent } from './agents/parser/ParserAgent';
export { ReportAgent } from './agents/report/ReportAgent';
export { VulnerabilityDetector } from './detector/VulnerabilityDetector';
export { AIAnalyzer } from './analyzer/AIAnalyzer';

export * from './types';

import './api/server';
