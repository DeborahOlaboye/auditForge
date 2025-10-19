# Architecture Documentation

## System Architecture

### High-Level Overview

The Smart Contract Security Auditor is built using a multi-agent architecture powered by the ADK-TS framework. The system follows a modular design with clear separation of concerns.

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer                              │
│  (Web UI / API / GitHub Integration / CLI)                  │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│         SmartContractAuditorAgent (Main Orchestrator)       │
│                                                               │
│  Responsibilities:                                            │
│  - Coordinates audit workflow                                │
│  - Manages sub-agent communication                           │
│  - Handles error recovery                                    │
│  - Aggregates results                                        │
└───┬───────────┬───────────┬─────────────┬──────────────────┘
    │           │           │             │
┌───▼───┐   ┌───▼────┐  ┌──▼──────┐  ┌───▼──────┐
│Parser │   │Detector│  │AI       │  │Report    │
│Agent  │   │Engine  │  │Analyzer │  │Agent     │
└───────┘   └────────┘  └─────────┘  └──────────┘
```

## Component Details

### 1. ParserAgent

**Purpose**: Transform Solidity source code into structured data

**Input**: Raw Solidity source code (string)

**Output**: ParsedContract with AST and metadata

**Key Features**:
- Uses `@solidity-parser/parser` for AST generation
- Extracts contract structure (functions, variables, events)
- Identifies external calls and modifiers
- Handles syntax errors gracefully
- Supports multiple Solidity versions

**Implementation**:
```typescript
class ParserAgent {
  async parse(sourceCode: string): Promise<ParsedContract>
  private extractMetadata(ast: any): ContractMetadata[]
  private extractFunction(node: any): FunctionInfo
  private extractExternalCalls(node: any): ExternalCall[]
}
```

### 2. VulnerabilityDetector

**Purpose**: Apply pattern-based security rules

**Input**: ParsedContract

**Output**: Array of Vulnerability findings

**Detection Methods**:
1. **AST Pattern Matching**: Analyzes code structure
2. **Regex Matching**: Detects keyword usage
3. **Control Flow Analysis**: Tracks execution paths

**Rule Categories**:
- Critical: Reentrancy, unchecked calls, delegatecall
- High: Integer overflow, access control, selfdestruct
- Medium: Timestamp dependence, tx.origin
- Low: Zero address checks, unused variables
- Info: Gas optimizations, code quality

**Extensibility**:
```typescript
interface VulnerabilityRule {
  id: string;
  severity: Severity;
  pattern: RegExp | ((ast, metadata) => Vulnerability[]);
  recommendation: string;
}
```

### 3. AIAnalyzer

**Purpose**: Deep semantic analysis using LLMs

**Supported Providers**:
- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude Sonnet)

**Analysis Capabilities**:
1. Validates pattern-detected vulnerabilities
2. Identifies business logic flaws
3. Detects false positives
4. Suggests gas optimizations
5. Provides natural language explanations

**Prompt Engineering**:
```
System: Expert smart contract auditor
User: Contract source + detected issues
Output: Structured JSON analysis
```

**Error Handling**:
- API timeout recovery
- Rate limit backoff
- Fallback to pattern-only analysis
- Response validation

### 4. ReportAgent

**Purpose**: Synthesize findings into professional reports

**Report Structure**:
```
AuditReport
├── Executive Summary
│   ├── Risk score (1-10)
│   ├── Deployment recommendation
│   └── Vulnerability counts by severity
├── Detailed Findings
│   ├── Per vulnerability
│   ├── Code snippets
│   └── Fix recommendations
├── Gas Optimizations
├── Best Practices
└── Metadata
```

**Export Formats**:
- Markdown (GitHub-compatible)
- JSON (machine-readable)
- PDF (coming soon)
- HTML (coming soon)

## Data Flow

### Audit Workflow

```
1. Client Request
   ↓
2. SmartContractAuditorAgent.auditContract()
   ↓
3. ParserAgent.parse(sourceCode)
   → AST + Metadata
   ↓
4. VulnerabilityDetector.detect(parsedContract)
   → Pattern-based vulnerabilities
   ↓
5. AIAnalyzer.analyze(contract, vulnerabilities)
   → AI-enhanced analysis
   ↓
6. Merge & Filter Results
   ↓
7. ReportAgent.generateReport()
   → Final AuditReport
   ↓
8. Return to Client
```

### Parallel Processing (Future)

```
ParserAgent
     ↓
     ├─→ VulnerabilityDetector ─┐
     │                          ├─→ Merge → ReportAgent
     └─→ AIAnalyzer ───────────┘
```

## Technology Stack

### Core Dependencies

| Package | Purpose | Version |
|---------|---------|---------|
| `@solidity-parser/parser` | AST generation | ^0.16.2 |
| `openai` | GPT integration | ^4.20.1 |
| `@anthropic-ai/sdk` | Claude integration | ^0.9.1 |
| `express` | API server | ^4.18.2 |
| `typescript` | Type safety | ^5.3.3 |

### Development Tools

- Jest: Testing framework
- ESLint: Code linting
- Prettier: Code formatting
- TSX: Development server

## Security Considerations

### Input Validation

- Solidity code size limits (1MB max)
- AST depth limits to prevent DoS
- Rate limiting on API endpoints
- Input sanitization for untrusted code

### API Key Protection

- Environment variables for secrets
- No logging of API keys
- Separate development/production configs

### Error Handling

- All async operations wrapped in try-catch
- Graceful degradation (e.g., AI analysis failure)
- Detailed error logging
- User-friendly error messages

## Performance Optimizations

### Caching Strategy (Future)

```typescript
interface CacheStrategy {
  // Cache parsed AST by source code hash
  astCache: Map<string, ParsedContract>;

  // Cache AI analysis responses
  aiCache: Map<string, AIAnalysis>;

  // TTL: 15 minutes
}
```

### Batch Processing

- Multiple contracts in single API call
- Parallel vulnerability detection for multiple files
- Shared AST parsing for similar contracts

## Scalability

### Horizontal Scaling

```
Load Balancer
    ↓
┌────────┬────────┬────────┐
│ API 1  │ API 2  │ API 3  │
└────────┴────────┴────────┘
    ↓
Shared Cache (Redis)
    ↓
Database (PostgreSQL)
```

### Resource Limits

- Max concurrent audits: 10 per instance
- Max contract size: 1MB
- AI timeout: 30 seconds
- Total audit timeout: 60 seconds

## Monitoring & Observability

### Metrics to Track

- Total audits performed
- Average analysis time
- Vulnerabilities found by type
- AI analysis success rate
- API error rates

### Logging Strategy

```typescript
logger.info('Audit started', { contractName, size });
logger.debug('Parser completed', { numContracts, time });
logger.warn('AI analysis failed, using fallback');
logger.error('Audit failed', { error, stack });
```

## Testing Strategy

### Unit Tests

- Each vulnerability rule tested independently
- Parser tested with valid/invalid Solidity
- Report generator output validation

### Integration Tests

- Full audit workflow
- API endpoint testing
- Error scenario handling

### Test Contracts

- `vulnerable-reentrancy.sol`: Should detect RE-01
- `vulnerable-access-control.sol`: Should detect AC-01
- `safe-contract.sol`: Should pass with zero critical issues

## Future Architecture Improvements

### Planned Enhancements

1. **Database Layer**: Store audit history
2. **Message Queue**: Async processing with Bull/Redis
3. **WebSocket**: Real-time progress updates
4. **Microservices**: Separate parser, detector, analyzer services
5. **Container Orchestration**: Kubernetes deployment
6. **GraphQL API**: More flexible querying

### ATP Integration Architecture

```
Smart Contract Auditor Agent
         ↓
ATP Tokenization Layer
         ↓
┌────────┴────────┐
│  Token Holders  │
│  - Audit credits│
│  - Revenue share│
│  - Governance   │
└─────────────────┘
```

## Code Organization

```
src/
├── agents/              # Agent implementations
│   ├── SmartContractAuditorAgent.ts
│   ├── parser/
│   │   └── ParserAgent.ts
│   └── report/
│       └── ReportAgent.ts
├── detector/            # Vulnerability detection
│   ├── VulnerabilityDetector.ts
│   └── rules/
│       ├── index.ts
│       ├── reentrancy.ts
│       ├── accessControl.ts
│       └── ...
├── analyzer/            # AI analysis
│   └── AIAnalyzer.ts
├── api/                 # REST API
│   └── server.ts
├── types/               # TypeScript types
│   └── index.ts
└── utils/               # Utilities
    └── logger.ts
```

## Deployment Architecture

### Development

```
Local Machine
└── npm run dev (tsx watch)
    └── http://localhost:3000
```

### Production (Recommended)

```
Frontend: Vercel
Backend: Railway / Render
Database: PostgreSQL (optional)
Cache: Redis (optional)
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY dist ./dist
CMD ["node", "dist/index.js"]
```

---

For API specifications, see [API.md](API.md)

For ATP integration details, see [ATP_INTEGRATION.md](ATP_INTEGRATION.md)
