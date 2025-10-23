/**
 * Main entry point for Smart Contract Security Auditor
 * Built with ADK-TS (Agent Development Kit for TypeScript)
 */

// ADK-TS Powered Main Agent
export { ADKSmartContractAuditorAgent } from './agents/ADKSmartContractAuditorAgent';

// Sub-Agents
export { ParserAgent } from './agents/parser/ParserAgent';
export { ReportAgent } from './agents/report/ReportAgent';
export { VulnerabilityDetector } from './detector/VulnerabilityDetector';
export { AIAnalyzer } from './analyzer/AIAnalyzer';

// Types
export * from './types';

// Start API Server
import './api/server';
