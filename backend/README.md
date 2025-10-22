# AuditForge Backend

AI-powered smart contract security auditor API built with **ADK-TS (Agent Development Kit for TypeScript)**.

## Tech Stack

- **Framework**: ADK-TS v0.5.0 (Agent orchestration)
- **Runtime**: Node.js v18+
- **Language**: TypeScript
- **API**: Express.js
- **LLM Providers**: OpenAI GPT-4, Anthropic Claude 3.5 Sonnet
- **Parser**: @solidity-parser/parser

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env` file:

```bash
# LLM Provider Configuration
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
LLM_PROVIDER=openai
LLM_MODEL=gpt-4

# Server Configuration
PORT=3000
NODE_ENV=production
ALLOWED_ORIGINS=https://audit-forge.vercel.app

# ADK-TS Configuration
USE_ADK_AGENT=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10
```

### 3. Build & Run

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

Server will start on `http://localhost:3000`

## API Endpoints

### Health Check
```bash
GET /api/health
```

### Audit Contract
```bash
POST /api/audit
Content-Type: application/json

{
  "code": "pragma solidity ^0.8.0; contract MyContract { ... }",
  "contractName": "MyContract",
  "options": {
    "enableAIAnalysis": true
  }
}
```

### Export Report
```bash
POST /api/audit/:id/export/:format
Content-Type: application/json

{
  "report": { ... }
}

# Formats: markdown, json
```

## Deployment

### Option 1: Render

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create New → Web Service
4. Connect repository
5. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**: Add all from `.env`

### Option 2: Railway

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select repository → Select `backend` folder
4. Add environment variables
5. Deploy

### Option 3: Fly.io

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Launch app
flyctl launch

# Set environment variables
flyctl secrets set OPENAI_API_KEY=sk-...
flyctl secrets set ANTHROPIC_API_KEY=sk-ant-...

# Deploy
flyctl deploy
```

## Project Structure

```
backend/
├── src/
│   ├── agents/
│   │   ├── ADKSmartContractAuditorAgent.ts   # ADK-TS main agent
│   │   ├── parser/ParserAgent.ts
│   │   └── report/ReportAgent.ts
│   ├── analyzer/AIAnalyzer.ts
│   ├── detector/VulnerabilityDetector.ts
│   ├── api/server.ts                          # Express API
│   ├── types/index.ts
│   └── index.ts
├── tests/
├── dist/                                       # Compiled JS
├── package.json
├── tsconfig.json
└── .env
```

## ADK-TS Integration

The backend uses ADK-TS for AI agent orchestration:

```typescript
import { AgentBuilder } from '@iqai/adk';

// Build ADK-TS agent
const builtAgent = await AgentBuilder
  .withModel('gpt-4-turbo-preview')
  .build();

// Execute audit workflow
const result = await builtAgent.runner.ask(auditPrompt);
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes* | OpenAI API key |
| `ANTHROPIC_API_KEY` | Yes* | Anthropic API key |
| `LLM_PROVIDER` | Yes | `openai` or `anthropic` |
| `LLM_MODEL` | Yes | Model name (e.g., `gpt-4`) |
| `PORT` | No | Server port (default: 3000) |
| `NODE_ENV` | No | `development` or `production` |
| `ALLOWED_ORIGINS` | No | CORS origins |
| `RATE_LIMIT_MAX_REQUESTS` | No | Max requests per window (default: 10) |
| `RATE_LIMIT_WINDOW_MS` | No | Rate limit window (default: 60000) |

*At least one LLM provider API key is required

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Test API endpoint
curl http://localhost:3000/api/health
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code

## Logs

Server logs show ADK-TS agent initialization:

```
[INFO] Initializing ADK-TS Agent with model: gpt-4-turbo-preview
[INFO] Using ADK-TS Auditor Agent
[INFO] Smart Contract Auditor API running on port 3000
[INFO] Environment: production
```

## Support

- **Documentation**: See main README.md
- **Issues**: https://github.com/DeborahOlaboye/auditForge/issues
- **ADK-TS Docs**: https://adk.iqai.com

## License

MIT
