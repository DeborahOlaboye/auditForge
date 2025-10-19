# API Documentation

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

Currently, the API is open (no authentication required). Rate limiting is enforced.

**Rate Limits:**
- 10 requests per minute per IP address
- Returns `429 Too Many Requests` when exceeded

## Endpoints

### Health Check

Check if the API is running and healthy.

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

**Status Codes:**
- `200 OK`: Service is healthy

---

### Audit Contract

Perform security audit on a Solidity smart contract.

**Endpoint:** `POST /api/audit`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "code": "pragma solidity ^0.8.0;\n\ncontract Example { ... }",
  "contractName": "Example",
  "options": {
    "enableAIAnalysis": true,
    "llmProvider": "openai",
    "model": "gpt-4",
    "skipRules": ["FP-01"],
    "customRules": []
  }
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `code` | string | Yes | Solidity source code |
| `contractName` | string | No | Contract name (default: "contract") |
| `options` | object | No | Audit configuration |
| `options.enableAIAnalysis` | boolean | No | Use AI analysis (default: true) |
| `options.llmProvider` | string | No | "openai" or "anthropic" |
| `options.model` | string | No | LLM model name |
| `options.skipRules` | string[] | No | Rule IDs to skip |
| `options.customRules` | object[] | No | Additional custom rules |

**Response:**
```json
{
  "success": true,
  "report": {
    "id": "audit-1705315800000-abc123",
    "timestamp": "2025-01-15T10:30:00.000Z",
    "contractName": "Example",
    "sourceCode": "pragma solidity...",
    "executiveSummary": {
      "totalVulnerabilities": 3,
      "criticalCount": 1,
      "highCount": 1,
      "mediumCount": 1,
      "lowCount": 0,
      "infoCount": 0,
      "overallRiskScore": 7.5,
      "deploymentRecommendation": "REVIEW",
      "topConcerns": [
        "Reentrancy Vulnerability",
        "Missing Access Control"
      ]
    },
    "vulnerabilities": [
      {
        "id": "RE-01",
        "name": "Reentrancy Vulnerability",
        "severity": "CRITICAL",
        "description": "Function makes external calls without reentrancy protection",
        "location": {
          "file": "contract.sol",
          "line": 15,
          "column": 4,
          "functionName": "withdraw",
          "contractName": "Example"
        },
        "technicalExplanation": "External calls using .call{value:}()...",
        "exploitScenario": "An attacker creates a malicious contract...",
        "recommendation": "Use the checks-effects-interactions pattern...",
        "codeSnippet": "function withdraw() public { ... }",
        "references": [
          "CWE-841",
          "SWC-107",
          "The DAO Hack (2016)"
        ],
        "confidence": 0.85
      }
    ],
    "gasOptimizations": [
      {
        "description": "Function could be external instead of public",
        "location": { "line": 20 },
        "estimatedSavings": "~200 gas per call",
        "difficulty": "LOW"
      }
    ],
    "bestPractices": [
      {
        "description": "Missing event emission on state change",
        "location": { "line": 15 },
        "category": "Events"
      }
    ],
    "riskAssessment": {
      "overallScore": 7.5,
      "categoryBreakdown": {
        "RE": 1,
        "AC": 1,
        "FP": 1
      },
      "historicalContext": "AI analysis summary..."
    },
    "metadata": {
      "analysisVersion": "1.0.0",
      "rulesVersion": "1.0.0",
      "aiModel": "gpt-4",
      "analysisTime": 4523
    }
  }
}
```

**Status Codes:**
- `200 OK`: Audit completed successfully
- `400 Bad Request`: Invalid request (missing code, invalid options)
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Audit failed

**Error Response:**
```json
{
  "error": "Audit failed",
  "message": "Parsing failed: Unexpected token at line 5"
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:3000/api/audit \
  -H "Content-Type: application/json" \
  -d '{
    "code": "pragma solidity ^0.8.0;\ncontract Test {\n  function test() public { }\n}",
    "contractName": "Test"
  }'
```

---

### Export Report

Export audit report in specific format.

**Endpoint:** `POST /api/audit/:id/export/:format`

**Path Parameters:**
- `id`: Report ID (can be any value for now)
- `format`: Export format (`markdown`, `json`)

**Request Body:**
```json
{
  "report": { /* AuditReport object */ }
}
```

**Response (Markdown):**
```markdown
# Smart Contract Security Audit Report

**Contract:** Example
**Date:** 2025-01-15T10:30:00.000Z
...
```

**Response (JSON):**
```json
{
  "id": "audit-...",
  "timestamp": "...",
  ...
}
```

**Status Codes:**
- `200 OK`: Export successful
- `400 Bad Request`: Missing report or invalid format
- `500 Internal Server Error`: Export failed

---

### GitHub Webhook

Receive GitHub webhook events (for future PR integration).

**Endpoint:** `POST /api/github-webhook`

**Headers:**
```
Content-Type: application/json
X-GitHub-Event: pull_request
X-Hub-Signature-256: sha256=...
```

**Request Body:**
```json
{
  "action": "opened",
  "pull_request": { ... },
  "repository": { ... }
}
```

**Response:**
```json
{
  "received": true
}
```

**Status Codes:**
- `200 OK`: Webhook received
- `401 Unauthorized`: Invalid signature

---

## TypeScript SDK Usage

```typescript
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

// Audit a contract
async function auditContract(code: string) {
  const response = await axios.post(`${API_BASE}/audit`, {
    code,
    contractName: 'MyContract',
    options: {
      enableAIAnalysis: true
    }
  });

  return response.data.report;
}

// Export to Markdown
async function exportMarkdown(report: any) {
  const response = await axios.post(
    `${API_BASE}/audit/${report.id}/export/markdown`,
    { report }
  );

  return response.data;
}

// Usage
const report = await auditContract(solidityCode);
console.log(`Risk Score: ${report.executiveSummary.overallRiskScore}/10`);

const markdown = await exportMarkdown(report);
console.log(markdown);
```

## Python SDK Usage

```python
import requests

API_BASE = 'http://localhost:3000/api'

def audit_contract(code, contract_name='Contract'):
    response = requests.post(
        f'{API_BASE}/audit',
        json={
            'code': code,
            'contractName': contract_name,
            'options': {
                'enableAIAnalysis': True
            }
        }
    )
    return response.json()['report']

# Usage
solidity_code = '''
pragma solidity ^0.8.0;
contract Example { }
'''

report = audit_contract(solidity_code)
print(f"Risk Score: {report['executiveSummary']['overallRiskScore']}/10")
```

## Response Types

### Severity Levels

```typescript
enum Severity {
  CRITICAL = 'CRITICAL',  // Immediate security threat
  HIGH = 'HIGH',          // Significant security risk
  MEDIUM = 'MEDIUM',      // Moderate security concern
  LOW = 'LOW',            // Minor issue or best practice
  INFO = 'INFO'           // Informational / optimization
}
```

### Deployment Recommendations

```typescript
enum DeploymentRecommendation {
  SAFE = 'SAFE',                  // No critical issues found
  REVIEW = 'REVIEW',              // Review issues before deployment
  DO_NOT_DEPLOY = 'DO_NOT_DEPLOY' // Critical vulnerabilities present
}
```

## Rate Limiting

**Current Limits:**
- 10 requests per minute per IP
- Sliding window algorithm
- Returns 429 with Retry-After header

**Response Headers:**
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1705316400
```

## Error Handling

### Error Response Format

```json
{
  "error": "Error category",
  "message": "Detailed error message",
  "details": { /* optional additional info */ }
}
```

### Common Error Codes

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Bad Request | Invalid input parameters |
| 401 | Unauthorized | Missing or invalid API key |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |
| 503 | Service Unavailable | AI service temporarily unavailable |

## Best Practices

### Optimal Usage

1. **Validate Solidity syntax** before sending to API
2. **Cache results** for identical contracts
3. **Handle rate limits** gracefully with exponential backoff
4. **Parse JSON responses** with proper error handling
5. **Set reasonable timeouts** (30-60 seconds for large contracts)

### Example with Error Handling

```typescript
async function auditWithRetry(code: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios.post('/api/audit', { code });
      return response.data.report;
    } catch (error) {
      if (error.response?.status === 429) {
        // Rate limited - wait and retry
        const retryAfter = error.response.headers['retry-after'] || 60;
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      } else {
        throw error; // Don't retry other errors
      }
    }
  }
  throw new Error('Max retries exceeded');
}
```

## Changelog

### Version 1.0.0 (2025-01)

- Initial API release
- Audit endpoint with AI analysis
- Markdown/JSON export
- Health check endpoint
- Rate limiting

### Planned Features

- Authentication with API keys
- Webhook support for GitHub integration
- Batch audit endpoint
- Historical audit retrieval
- WebSocket for real-time progress

---

For architecture details, see [ARCHITECTURE.md](ARCHITECTURE.md)
