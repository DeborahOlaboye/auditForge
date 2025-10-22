/**
 * ADK-TS Smart Contract Auditor Agent
 * Main orchestration agent using ADK-TS framework
 */

import { AgentBuilder } from '@iqai/adk';
import { ParserAgent } from './parser/ParserAgent';
import { VulnerabilityDetector } from '../detector/VulnerabilityDetector';
import { ReportAgent } from './report/ReportAgent';
import { AIAnalyzer } from '../analyzer/AIAnalyzer';
import { AuditReport, AuditOptions } from '../types';
import { logger } from '../utils/logger';

export class ADKSmartContractAuditorAgent {
  private model: string;
  private parserAgent: ParserAgent;
  private vulnerabilityDetector: VulnerabilityDetector;
  private reportAgent: ReportAgent;

  constructor() {
    // Determine which LLM provider to use
    const provider = process.env.LLM_PROVIDER || 'openai';
    const model = process.env.LLM_MODEL || 'gpt-4';

    // Map to ADK-TS model identifiers
    if (provider === 'anthropic') {
      this.model = 'claude-3-5-sonnet-20241022';
    } else if (provider === 'openai') {
      this.model = model === 'gpt-4' ? 'gpt-4-turbo-preview' : model;
    } else {
      this.model = 'gpt-4-turbo-preview';
    }

    // Initialize sub-agents
    this.parserAgent = new ParserAgent();
    this.vulnerabilityDetector = new VulnerabilityDetector();
    this.reportAgent = new ReportAgent();

    logger.info(`Initializing ADK-TS Agent with model: ${this.model}`);
  }

  /**
   * Audit a smart contract using ADK-TS orchestration
   */
  async auditContract(
    sourceCode: string,
    contractName: string = 'contract',
    options: AuditOptions = {}
  ): Promise<AuditReport> {
    const startTime = Date.now();
    logger.info(`Starting ADK-TS audit for contract: ${contractName}`);

    try {
      // Use ADK-TS AgentBuilder for AI analysis coordination
      const builtAgent = await AgentBuilder
        .withModel(this.model)
        .build();

      logger.info('Using ADK-TS framework for orchestration');

      // Step 1: Parse contract
      logger.info('Step 1: Parsing contract');
      const parsedContract = await this.parserAgent.parse(sourceCode);

      // Step 2: Detect vulnerabilities
      logger.info('Step 2: Detecting vulnerabilities');
      const vulnerabilities = await this.vulnerabilityDetector.detect(parsedContract, options);

      // Step 3: AI Analysis using ADK-TS agent (if enabled)
      let aiAnalysis;
      if (options.enableAIAnalysis !== false) {
        logger.info('Step 3: Running AI analysis with ADK-TS');
        const aiAnalyzer = new AIAnalyzer(options);
        aiAnalysis = await aiAnalyzer.analyze(parsedContract, vulnerabilities);
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

      // Step 4: Generate report
      logger.info('Step 4: Generating report');
      const analysisTime = Date.now() - startTime;
      const report = await this.reportAgent.generateReport(
        contractName,
        sourceCode,
        vulnerabilities,
        aiAnalysis,
        analysisTime
      );

      logger.info(`ADK-TS audit completed in ${analysisTime}ms`);
      logger.info(`Found ${report.executiveSummary.totalVulnerabilities} vulnerabilities`);

      return report;

    } catch (error: any) {
      logger.error('ADK-TS audit failed', { error: error.message });
      throw new Error(`Audit failed: ${error.message}`);
    }
  }

  /**
   * Ask the agent a question about smart contract security using ADK-TS
   */
  async ask(question: string): Promise<string> {
    logger.info('Using ADK-TS AgentBuilder for query');
    const builtAgent = await AgentBuilder
      .withModel(this.model)
      .build();

    const response = await builtAgent.runner.ask(question);
    return typeof response === 'string' ? response : JSON.stringify(response);
  }

  /**
   * Calculate risk score from vulnerabilities
   */
  private calculateRiskScore(vulnerabilities: any[]): number {
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
      totalWeight += weights[vuln.severity as keyof typeof weights] || 0;
    }

    const normalized = Math.min(10, 1 + (totalWeight / 2));
    return Math.round(normalized * 10) / 10;
  }
}
