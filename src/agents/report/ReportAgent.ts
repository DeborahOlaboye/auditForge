/**
 * Report Generation Sub-Agent
 * Synthesizes findings into comprehensive audit reports
 */

import { marked } from 'marked';
import {
  AuditReport,
  Vulnerability,
  AIAnalysis,
  ExecutiveSummary,
  RiskAssessment,
  Severity,
  DeploymentRecommendation
} from '../../types';
import { logger } from '../../utils/logger';

export class ReportAgent {
  /**
   * Generate comprehensive audit report
   */
  async generateReport(
    contractName: string,
    sourceCode: string,
    vulnerabilities: Vulnerability[],
    aiAnalysis: AIAnalysis,
    analysisTime: number
  ): Promise<AuditReport> {
    logger.info('Generating audit report');

    const executiveSummary = this.buildExecutiveSummary(vulnerabilities, aiAnalysis);
    const riskAssessment = this.buildRiskAssessment(vulnerabilities, aiAnalysis);

    const report: AuditReport = {
      id: this.generateReportId(),
      timestamp: new Date(),
      contractName,
      sourceCode,
      executiveSummary,
      vulnerabilities: this.sortVulnerabilities(vulnerabilities),
      gasOptimizations: aiAnalysis.gasOptimizations,
      bestPractices: aiAnalysis.bestPracticeViolations,
      riskAssessment,
      metadata: {
        analysisVersion: '1.0.0',
        rulesVersion: '1.0.0',
        aiModel: 'gpt-4',
        analysisTime
      }
    };

    logger.info('Report generation completed');
    return report;
  }

  /**
   * Export report to Markdown format
   */
  async exportMarkdown(report: AuditReport): Promise<string> {
    const sections: string[] = [];

    // Header
    sections.push(`# Smart Contract Security Audit Report`);
    sections.push(`\n**Contract:** ${report.contractName}`);
    sections.push(`**Date:** ${report.timestamp.toISOString()}`);
    sections.push(`**Report ID:** ${report.id}\n`);

    // Executive Summary
    sections.push(`## Executive Summary\n`);
    sections.push(`**Overall Risk Score:** ${report.executiveSummary.overallRiskScore}/10`);
    sections.push(`**Deployment Recommendation:** ${this.getRecommendationEmoji(report.executiveSummary.deploymentRecommendation)} ${report.executiveSummary.deploymentRecommendation}\n`);
    sections.push(`**Vulnerabilities Found:**`);
    sections.push(`- 🔴 Critical: ${report.executiveSummary.criticalCount}`);
    sections.push(`- 🟠 High: ${report.executiveSummary.highCount}`);
    sections.push(`- 🟡 Medium: ${report.executiveSummary.mediumCount}`);
    sections.push(`- 🔵 Low: ${report.executiveSummary.lowCount}`);
    sections.push(`- ⚪ Info: ${report.executiveSummary.infoCount}\n`);

    if (report.executiveSummary.topConcerns.length > 0) {
      sections.push(`**Top Concerns:**`);
      report.executiveSummary.topConcerns.forEach((concern, i) => {
        sections.push(`${i + 1}. ${concern}`);
      });
      sections.push('');
    }

    // Detailed Findings
    sections.push(`## Detailed Findings\n`);

    for (const vuln of report.vulnerabilities) {
      sections.push(`### ${this.getSeverityEmoji(vuln.severity)} ${vuln.name} [${vuln.id}]`);
      sections.push(`**Severity:** ${vuln.severity}`);
      sections.push(`**Location:** Line ${vuln.location.line}${vuln.location.functionName ? ` in function \`${vuln.location.functionName}\`` : ''}`);
      sections.push(`**Confidence:** ${(vuln.confidence * 100).toFixed(0)}%\n`);
      sections.push(`**Description:**`);
      sections.push(`${vuln.description}\n`);
      sections.push(`**Technical Explanation:**`);
      sections.push(`${vuln.technicalExplanation}\n`);
      sections.push(`**Exploit Scenario:**`);
      sections.push(`${vuln.exploitScenario}\n`);
      sections.push(`**Recommendation:**`);
      sections.push(`${vuln.recommendation}\n`);

      if (vuln.codeSnippet) {
        sections.push(`**Code:**`);
        sections.push(`\`\`\`solidity\n${vuln.codeSnippet}\n\`\`\``);
        sections.push('');
      }

      if (vuln.references.length > 0) {
        sections.push(`**References:** ${vuln.references.join(', ')}\n`);
      }

      sections.push(`---\n`);
    }

    // Gas Optimizations
    if (report.gasOptimizations.length > 0) {
      sections.push(`## Gas Optimization Opportunities\n`);
      report.gasOptimizations.forEach((opt, i) => {
        sections.push(`${i + 1}. **${opt.description}** (Line ${opt.location.line})`);
        sections.push(`   - Estimated Savings: ${opt.estimatedSavings}`);
        sections.push(`   - Difficulty: ${opt.difficulty}\n`);
      });
    }

    // Best Practices
    if (report.bestPractices.length > 0) {
      sections.push(`## Best Practice Violations\n`);
      report.bestPractices.forEach((bp, i) => {
        sections.push(`${i + 1}. **${bp.category}:** ${bp.description} (Line ${bp.location.line})`);
      });
      sections.push('');
    }

    // Risk Assessment
    sections.push(`## Risk Assessment\n`);
    sections.push(`**Overall Risk Score:** ${report.riskAssessment.overallScore}/10\n`);
    sections.push(`**Category Breakdown:**`);
    for (const [category, score] of Object.entries(report.riskAssessment.categoryBreakdown)) {
      sections.push(`- ${category}: ${score}/10`);
    }
    sections.push('');

    // Metadata
    sections.push(`## Audit Metadata\n`);
    sections.push(`- **Analysis Version:** ${report.metadata.analysisVersion}`);
    sections.push(`- **Rules Version:** ${report.metadata.rulesVersion}`);
    sections.push(`- **AI Model:** ${report.metadata.aiModel}`);
    sections.push(`- **Analysis Time:** ${report.metadata.analysisTime}ms\n`);

    sections.push(`---`);
    sections.push(`\n*Generated by Smart Contract Security Auditor Agent*`);
    sections.push(`*🤖 Powered by ADK-TS Framework*`);

    return sections.join('\n');
  }

  /**
   * Export report to JSON format
   */
  async exportJSON(report: AuditReport): Promise<string> {
    return JSON.stringify(report, null, 2);
  }

  /**
   * Build executive summary
   */
  private buildExecutiveSummary(
    vulnerabilities: Vulnerability[],
    aiAnalysis: AIAnalysis
  ): ExecutiveSummary {
    const counts = this.countBySeverity(vulnerabilities);

    return {
      totalVulnerabilities: vulnerabilities.length,
      criticalCount: counts.CRITICAL,
      highCount: counts.HIGH,
      mediumCount: counts.MEDIUM,
      lowCount: counts.LOW,
      infoCount: counts.INFO,
      overallRiskScore: aiAnalysis.overallRiskScore,
      deploymentRecommendation: this.getDeploymentRecommendation(counts, aiAnalysis.overallRiskScore),
      topConcerns: this.getTopConcerns(vulnerabilities)
    };
  }

  /**
   * Build risk assessment
   */
  private buildRiskAssessment(
    vulnerabilities: Vulnerability[],
    aiAnalysis: AIAnalysis
  ): RiskAssessment {
    return {
      overallScore: aiAnalysis.overallRiskScore,
      categoryBreakdown: this.buildCategoryBreakdown(vulnerabilities),
      historicalContext: aiAnalysis.executiveSummary
    };
  }

  /**
   * Count vulnerabilities by severity
   */
  private countBySeverity(vulnerabilities: Vulnerability[]): Record<Severity, number> {
    const counts = {
      [Severity.CRITICAL]: 0,
      [Severity.HIGH]: 0,
      [Severity.MEDIUM]: 0,
      [Severity.LOW]: 0,
      [Severity.INFO]: 0
    };

    for (const vuln of vulnerabilities) {
      counts[vuln.severity]++;
    }

    return counts;
  }

  /**
   * Get deployment recommendation
   */
  private getDeploymentRecommendation(
    counts: Record<Severity, number>,
    riskScore: number
  ): DeploymentRecommendation {
    if (counts.CRITICAL > 0 || riskScore >= 8) {
      return DeploymentRecommendation.DO_NOT_DEPLOY;
    } else if (counts.HIGH > 0 || riskScore >= 5) {
      return DeploymentRecommendation.REVIEW;
    } else {
      return DeploymentRecommendation.SAFE;
    }
  }

  /**
   * Get top concerns
   */
  private getTopConcerns(vulnerabilities: Vulnerability[]): string[] {
    return vulnerabilities
      .filter(v => v.severity === Severity.CRITICAL || v.severity === Severity.HIGH)
      .slice(0, 3)
      .map(v => v.name);
  }

  /**
   * Build category breakdown
   */
  private buildCategoryBreakdown(vulnerabilities: Vulnerability[]): Record<string, number> {
    const breakdown: Record<string, number> = {};

    for (const vuln of vulnerabilities) {
      const category = vuln.id.split('-')[0];
      breakdown[category] = (breakdown[category] || 0) + 1;
    }

    return breakdown;
  }

  /**
   * Sort vulnerabilities by severity
   */
  private sortVulnerabilities(vulnerabilities: Vulnerability[]): Vulnerability[] {
    const severityOrder = {
      [Severity.CRITICAL]: 0,
      [Severity.HIGH]: 1,
      [Severity.MEDIUM]: 2,
      [Severity.LOW]: 3,
      [Severity.INFO]: 4
    };

    return [...vulnerabilities].sort((a, b) => {
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  /**
   * Generate unique report ID
   */
  private generateReportId(): string {
    return `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get severity emoji
   */
  private getSeverityEmoji(severity: Severity): string {
    const emojis = {
      [Severity.CRITICAL]: '🔴',
      [Severity.HIGH]: '🟠',
      [Severity.MEDIUM]: '🟡',
      [Severity.LOW]: '🔵',
      [Severity.INFO]: '⚪'
    };
    return emojis[severity];
  }

  /**
   * Get recommendation emoji
   */
  private getRecommendationEmoji(recommendation: DeploymentRecommendation): string {
    const emojis = {
      [DeploymentRecommendation.SAFE]: '✅',
      [DeploymentRecommendation.REVIEW]: '⚠️',
      [DeploymentRecommendation.DO_NOT_DEPLOY]: '🚫'
    };
    return emojis[recommendation];
  }
}
