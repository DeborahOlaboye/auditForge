/**
 * AI-Powered Deep Analysis Module
 * Uses LLM for semantic analysis and business logic review
 */

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { AIAnalysis, Vulnerability, ParsedContract, AuditOptions } from '../types';
import { logger } from '../utils/logger';

export class AIAnalyzer {
  private openai?: OpenAI;
  private anthropic?: Anthropic;
  private provider: 'openai' | 'anthropic';
  private model: string;

  constructor(options: AuditOptions = {}) {
    this.provider = options.llmProvider || (process.env.LLM_PROVIDER as any) || 'openai';
    this.model = options.model || process.env.LLM_MODEL || 'gpt-4';

    if (this.provider === 'openai' && process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    } else if (this.provider === 'anthropic' && process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
      });
    }
  }

  /**
   * Perform AI-powered deep analysis
   */
  async analyze(
    parsedContract: ParsedContract,
    detectedVulnerabilities: Vulnerability[]
  ): Promise<AIAnalysis> {
    logger.info('Starting AI-powered analysis');

    if (!this.openai && !this.anthropic) {
      logger.warn('No LLM API key configured, skipping AI analysis');
      return this.getEmptyAnalysis();
    }

    try {
      const prompt = this.buildAnalysisPrompt(parsedContract, detectedVulnerabilities);
      const response = await this.callLLM(prompt);
      const analysis = this.parseAnalysisResponse(response);

      logger.info('AI analysis completed successfully');
      return analysis;
    } catch (error: any) {
      logger.error('AI analysis failed', { error: error.message });
      return this.getEmptyAnalysis();
    }
  }

  /**
   * Build analysis prompt
   */
  private buildAnalysisPrompt(
    parsedContract: ParsedContract,
    vulnerabilities: Vulnerability[]
  ): string {
    return `You are an expert smart contract security auditor. Analyze the following Solidity contract for security vulnerabilities, business logic flaws, and best practice violations.

CONTRACT SOURCE CODE:
\`\`\`solidity
${parsedContract.sourceCode}
\`\`\`

ALREADY DETECTED ISSUES:
${vulnerabilities.map(v => `- ${v.id}: ${v.name} (${v.severity}) at line ${v.location.line}`).join('\n') || 'None'}

ANALYSIS INSTRUCTIONS:
1. Validate the detected issues above - are any false positives?
2. Identify any additional security vulnerabilities not caught by pattern matching
3. Analyze business logic for potential flaws
4. Identify gas optimization opportunities
5. Note best practice violations
6. Provide an overall risk score (1-10) where 10 is most risky
7. Write an executive summary in plain language

RESPONSE FORMAT (JSON):
{
  "overallRiskScore": <number 1-10>,
  "executiveSummary": "<plain language summary>",
  "additionalVulnerabilities": [
    {
      "description": "...",
      "severity": "CRITICAL|HIGH|MEDIUM|LOW|INFO",
      "location": {"line": <number>},
      "recommendation": "..."
    }
  ],
  "validatedFindings": ["<list of issue IDs that are confirmed true positives>"],
  "falsePositives": ["<list of issue IDs that are false positives>"],
  "gasOptimizations": [
    {
      "description": "...",
      "location": {"line": <number>},
      "estimatedSavings": "...",
      "difficulty": "LOW|MEDIUM|HIGH"
    }
  ],
  "bestPracticeViolations": [
    {
      "description": "...",
      "location": {"line": <number>},
      "category": "..."
    }
  ]
}

Respond ONLY with valid JSON, no additional text.`;
  }

  /**
   * Call LLM API
   */
  private async callLLM(prompt: string): Promise<string> {
    if (this.provider === 'openai' && this.openai) {
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert smart contract security auditor. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });

      return completion.choices[0]?.message?.content || '{}';
    } else if (this.provider === 'anthropic' && this.anthropic) {
      const message: any = await (this.anthropic as any).messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const content = message.content[0];
      return content.type === 'text' ? content.text : '{}';
    }

    throw new Error('No LLM provider configured');
  }

  /**
   * Parse LLM response
   */
  private parseAnalysisResponse(response: string): AIAnalysis {
    try {
      // Extract JSON from response (handle markdown code blocks)
      let jsonStr = response.trim();
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.slice(7);
      }
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.slice(3);
      }
      if (jsonStr.endsWith('```')) {
        jsonStr = jsonStr.slice(0, -3);
      }

      const parsed = JSON.parse(jsonStr.trim());

      return {
        overallRiskScore: parsed.overallRiskScore || 5,
        executiveSummary: parsed.executiveSummary || 'No summary available',
        additionalVulnerabilities: (parsed.additionalVulnerabilities || []).map((v: any) => ({
          id: 'AI-' + Math.random().toString(36).substr(2, 9),
          name: v.description,
          severity: v.severity,
          description: v.description,
          location: {
            file: 'contract.sol',
            line: v.location?.line || 0,
            column: 0
          },
          technicalExplanation: v.description,
          exploitScenario: v.recommendation,
          recommendation: v.recommendation,
          codeSnippet: '',
          references: ['AI Analysis'],
          confidence: 0.70
        })),
        validatedFindings: parsed.validatedFindings || [],
        falsePositives: parsed.falsePositives || [],
        gasOptimizations: parsed.gasOptimizations || [],
        bestPracticeViolations: parsed.bestPracticeViolations || []
      };
    } catch (error: any) {
      logger.error('Failed to parse AI response', { error: error.message, response });
      return this.getEmptyAnalysis();
    }
  }

  /**
   * Get empty analysis when AI is not available
   */
  private getEmptyAnalysis(): AIAnalysis {
    return {
      overallRiskScore: 5,
      executiveSummary: 'AI analysis not available',
      additionalVulnerabilities: [],
      validatedFindings: [],
      falsePositives: [],
      gasOptimizations: [],
      bestPracticeViolations: []
    };
  }
}
