/**
 * Main Smart Contract Auditor Agent
 * Orchestrates the entire audit workflow using ADK-TS multi-agent architecture
 */

import { ParserAgent } from './parser/ParserAgent';
import { ReportAgent } from './report/ReportAgent';
import { VulnerabilityDetector } from '../detector/VulnerabilityDetector';
import { AIAnalyzer } from '../analyzer/AIAnalyzer';
import {
  AuditReport,
  AuditOptions,
  AuditContext,
  Vulnerability
} from '../types';
import { logger } from '../utils/logger';

export class SmartContractAuditorAgent {
  private parserAgent: ParserAgent;
  private vulnerabilityDetector: VulnerabilityDetector;
  private reportAgent: ReportAgent;

  constructor() {
    this.parserAgent = new ParserAgent();
    this.vulnerabilityDetector = new VulnerabilityDetector();
    this.reportAgent = new ReportAgent();
  }

  /**
   * Main audit entry point
   * Coordinates sub-agents to perform complete security audit
   */
  async auditContract(
    sourceCode: string,
    contractName: string = 'contract',
    options: AuditOptions = {}
  ): Promise<AuditReport> {
    const startTime = Date.now();
    logger.info(`Starting audit for contract: ${contractName}`);

    try {
      // Step 1: Build audit context
      const context = await this.buildContext(sourceCode, options, startTime);

      // Step 2: Parse Solidity code (Parser Sub-Agent)
      logger.info('Delegating to Parser Sub-Agent');
      const parsedContract = await this.parserAgent.parse(sourceCode);
      context.parsedContract = parsedContract;

      // Step 3: Detect vulnerabilities (Vulnerability Detection System)
      logger.info('Running vulnerability detection');
      let vulnerabilities = await this.vulnerabilityDetector.detect(parsedContract, options);

      // Step 4: AI-powered deep analysis (AI Analysis Module)
      let aiAnalysis;
      if (options.enableAIAnalysis !== false) {
        logger.info('Delegating to AI Analyzer');
        const aiAnalyzer = new AIAnalyzer(options);
        aiAnalysis = await aiAnalyzer.analyze(parsedContract, vulnerabilities);

        // Merge AI-discovered vulnerabilities
        vulnerabilities = this.mergeVulnerabilities(
          vulnerabilities,
          aiAnalysis.additionalVulnerabilities
        );

        // Filter false positives identified by AI
        vulnerabilities = this.filterFalsePositives(
          vulnerabilities,
          aiAnalysis.falsePositives
        );
      } else {
        aiAnalysis = {
          overallRiskScore: this.calculateRiskScore(vulnerabilities),
          executiveSummary: 'AI analysis disabled',
          additionalVulnerabilities: [],
          validatedFindings: [],
          falsePositives: [],
          gasOptimizations: [],
          bestPracticeViolations: []
        };
      }

      // Step 5: Generate comprehensive report (Report Sub-Agent)
      logger.info('Delegating to Report Generation Sub-Agent');
      const analysisTime = Date.now() - startTime;
      const report = await this.reportAgent.generateReport(
        contractName,
        sourceCode,
        vulnerabilities,
        aiAnalysis,
        analysisTime
      );

      logger.info(`Audit completed in ${analysisTime}ms`);
      logger.info(`Found ${report.executiveSummary.totalVulnerabilities} vulnerabilities`);

      return report;
    } catch (error: any) {
      logger.error('Audit failed', { error: error.message });
      throw new Error(`Audit failed: ${error.message}`);
    }
  }

  /**
   * Build audit context
   */
  private async buildContext(
    sourceCode: string,
    options: AuditOptions,
    startTime: number
  ): Promise<Partial<AuditContext>> {
    return {
      sourceCode,
      options,
      startTime
    };
  }

  /**
   * Calculate overall risk score from vulnerabilities
   */
  private calculateRiskScore(vulnerabilities: Vulnerability[]): number {
    if (vulnerabilities.length === 0) return 1;

    const weights = {
      CRITICAL: 4,
      HIGH: 3,
      MEDIUM: 2,
      LOW: 1,
      INFO: 0.5
    };

    let totalWeight = 0;
    for (const vuln of vulnerabilities) {
      totalWeight += weights[vuln.severity] || 0;
    }

    // Normalize to 1-10 scale
    const normalized = Math.min(10, 1 + (totalWeight / 2));
    return Math.round(normalized * 10) / 10;
  }

  /**
   * Merge vulnerabilities from different sources
   */
  private mergeVulnerabilities(
    patternBased: Vulnerability[],
    aiDiscovered: Vulnerability[]
  ): Vulnerability[] {
    return [...patternBased, ...aiDiscovered];
  }

  /**
   * Filter out false positives
   */
  private filterFalsePositives(
    vulnerabilities: Vulnerability[],
    falsePositiveIds: string[]
  ): Vulnerability[] {
    return vulnerabilities.filter(v => !falsePositiveIds.includes(v.id));
  }

  /**
   * Export report to Markdown
   */
  async exportMarkdown(report: AuditReport): Promise<string> {
    return this.reportAgent.exportMarkdown(report);
  }

  /**
   * Export report to JSON
   */
  async exportJSON(report: AuditReport): Promise<string> {
    return this.reportAgent.exportJSON(report);
  }
}
