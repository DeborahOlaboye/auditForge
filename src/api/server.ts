/**
 * Express API Server
 * Provides REST API for programmatic access
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { SmartContractAuditorAgent } from '../agents/SmartContractAuditorAgent';
import { ADKSmartContractAuditorAgent } from '../agents/ADKSmartContractAuditorAgent';
import { ReportAgent } from '../agents/report/ReportAgent';
import { logger } from '../utils/logger';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Rate limiting
const rateLimiter = new RateLimiterMemory({
  points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10'),
  duration: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000') / 1000
});

const rateLimitMiddleware = async (req: any, res: any, next: any) => {
  try {
    await rateLimiter.consume(req.ip || 'unknown');
    next();
  } catch (error) {
    res.status(429).json({
      error: 'Too many requests. Please try again later.'
    });
  }
};

// Initialize auditor agents
// Use ADK-TS agent by default (for hackathon requirement)
const useADK = process.env.USE_ADK_AGENT !== 'false';
const auditor = useADK ? new ADKSmartContractAuditorAgent() : new SmartContractAuditorAgent();
const reportAgent = new ReportAgent();

logger.info(`Using ${useADK ? 'ADK-TS' : 'Standard'} Auditor Agent`);

// Health check
app.get('/api/health', (req: any, res: any) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Audit endpoint
app.post('/api/audit', rateLimitMiddleware, async (req: any, res: any) => {
  try {
    const { code, contractName, options } = req.body;

    if (!code) {
      return res.status(400).json({
        error: 'Missing required field: code'
      });
    }

    logger.info('Received audit request', { contractName: contractName || 'unknown' });

    const report = await auditor.auditContract(
      code,
      contractName || 'contract',
      options || {}
    );

    res.json({
      success: true,
      report
    });
  } catch (error: any) {
    logger.error('Audit request failed', { error: error.message });
    res.status(500).json({
      error: 'Audit failed',
      message: error.message
    });
  }
});

// Get audit by ID (simplified - in production would use database)
app.get('/api/audit/:id', (req: any, res: any) => {
  res.status(404).json({
    error: 'Audit history not implemented in this version'
  });
});

// Export report formats
app.post('/api/audit/:id/export/:format', async (req: any, res: any) => {
  try {
    const { format } = req.params;
    const { report } = req.body;

    if (!report) {
      return res.status(400).json({
        error: 'Missing report data'
      });
    }

    if (format === 'markdown') {
      const markdown = await reportAgent.exportMarkdown(report);
      res.setHeader('Content-Type', 'text/markdown');
      res.send(markdown);
    } else if (format === 'json') {
      const json = await reportAgent.exportJSON(report);
      res.setHeader('Content-Type', 'application/json');
      res.send(json);
    } else {
      res.status(400).json({
        error: 'Unsupported format. Use "markdown" or "json"'
      });
    }
  } catch (error: any) {
    logger.error('Export failed', { error: error.message });
    res.status(500).json({
      error: 'Export failed',
      message: error.message
    });
  }
});

// GitHub webhook endpoint
app.post('/api/github-webhook', express.raw({ type: 'application/json' }), (req: any, res: any) => {
  // Simplified - full implementation in github module
  logger.info('Received GitHub webhook');
  res.status(200).json({ received: true });
});

// Start server
app.listen(port, () => {
  logger.info(`Smart Contract Auditor API running on port ${port}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
